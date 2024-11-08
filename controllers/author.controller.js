const { errorHandler } = require("../helpers/error_handler");
const Author = require("../schemas/Author");
const { authorValidation } = require("../validations/author.validation");

const bcrypt = require("bcrypt");

const myJwt = require("../services/jwt_service");

const config = require("config");

const { to } = require("../helpers/to_promise");

const uuid = require("uuid");

const mail_service = require("../services/mail_service");

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const {
      first_name,
      last_name,
      full_name,
      nick_name,
      email,
      phone,
      password,
      info,
      position,
      photo,
      is_expert,
      is_active,
    } = value;
    const author = await Author.findOne({
      email: { $regex: email, $options: "i" },
    });
    if (author) {
      return res.status(400).send({ message: "Bunday Author email mavjud" });
    }

    const hashedPassword = bcrypt.hashSync(password, 7);

    const activation_link = uuid.v4();

    const newAuthor = await Author.create({
      first_name,
      last_name,
      full_name,
      nick_name,
      email,
      phone,
      password: hashedPassword,
      info,
      position,
      photo,
      is_expert,
      activation_link,
    });

    await mail_service.sendActivationMail(
      email,
      `${config.get("api_url")}:${config.get(
        "port"
      )}/api/author/activate/${activation_link}`
    );

    const payload = {
      _id: newAuthor._id,
      email: newAuthor.email,
      is_expert: newAuthor.is_expert,
    };

    const tokens = myJwt.generateTokens(payload);
    newAuthor.token = tokens.refreshToken;
    await newAuthor.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.status(201).send({
      message: "Yangi Author qo'shildi",
      id: newAuthor._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(400).send({ message: "Email yoki password noto'g'ri" });
    }
    const validPassword = bcrypt.compareSync(password, author.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Email yoki password noto'g'ri" });
    }
    const payload = {
      _id: author._id,
      email: author.email,
      is_expert: author.is_expert,
      author_roles: ["READ", "WRITE"],
    };

    const tokens = myJwt.generateTokens(payload);
    author.token = tokens.refreshToken;
    await author.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    // try {
    //   setTimeout(function () {
    //     throw new Error("uncaughtException example");
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    // new Promise((_, reject) => {
    //   reject(new Error("Promise rejected-unhandledRejection example"));
    // });

    res.send({
      message: "Logged in,Welcome",
      id: author._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutAuthor = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).send({ message: "Token noto'g'ri" });
    }
    const author = await Author.findOneAndUpdate(
      { token: refreshToken },
      { token: "" },
      { new: true }
    );
    if (!author) {
      return res.status(400).send({ message: "Refresh token noto'g'ri" });
    }

    res.clearCookie("refreshToken");
    res.send({ message: "Logged out", refreshToken: author.token });
  } catch (error) {
    errorHandler(res, error);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res
        .status(403)
        .send({ message: "Cookieda Refresh token topilmadi" });
    }
    const [error, decodedRefreshToken] = await to(
      myJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(403).send({ message: error.message });
    }
    const authorFromDB = await Author.findOne({ token: refreshToken });
    if (!authorFromDB) {
      return res.status(403).send({
        message: "Ruxsat etilmagan foydalanuvchi(refresh token mos emas)",
      });
    }
    const payload = {
      _id: authorFromDB._id,
      email: authorFromDB.email,
      is_expert: authorFromDB.is_expert,
    };

    const tokens = myJwt.generateTokens(payload);
    authorFromDB.token = tokens.refreshToken;
    await authorFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "Refresh token updated successfully",
      id: authorFromDB._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    if (!authors) {
      return res.status(400).send({ message: "Birorta Author topilmadi" });
    }
    res.send(authors);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      nick_name,
      email,
      phone,
      password,
      info,
      position,
      photo_url,
      is_expert,
      is_active,
    } = req.body;
    const author = await Author.find({
      email: { $regex: email, $options: "i" },
    });
    console.log(author, typeof author);

    if (author.length > 1) {
      return res.status(400).send({ message: "Bunday Author email mavjud" });
    }
    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        nick_name,
        email,
        phone,
        password,
        info,
        position,
        photo: photo_url,
        is_expert,
        is_active,
      },
      { new: true }
    );
    res
      .status(200)
      .send({ message: "Author updated succesfuly", updatedAuthor });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAuthor = await Author.findByIdAndDelete(id);
    res
      .status(200)
      .send({ message: "Author deleted succesfuly", deletedAuthor });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    if (id !== req.author._id) {
      return res.status(403).send({ message: "Access denied author" });
    }
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).send({ message: "Author mavjud emas" });
    }
    res.send(author);
  } catch (error) {
    errorHandler(res, error);
  }
};

const authorActivate = async (req, res) => {
  try {
    const link = req.params.link;
    const author = await Author.findOne({ activation_link: link });
    if (!author) {
      return res.status(404).send({ message: "Author mavjud emas" });
    }
    if (author.is_active) {
      return res.status(400).send({ message: "Author already activated" });
    }
    author.is_active = true;
    await author.save();
    res.send({
      message: "Author activated successfully",
      is_active: author.is_active,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
  getAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshToken,
  authorActivate,
};
