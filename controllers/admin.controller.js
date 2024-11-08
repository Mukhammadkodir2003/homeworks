const { errorHandler } = require("../helpers/error_handler");
const Admin = require("../schemas/Admin");
const { adminValidation } = require("../validations/admin.validation");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const config = require("config");

const myJwt = require("../services/jwt_service");

const uuid = require("uuid");

const mail_service = require("../services/mail_service");

const addAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const {
      name,
      email,
      phone,
      password,
      is_active,
      is_creator,
      created_date,
      updated_date,
    } = value;
    const admin = await Admin.findOne({
      email: { $regex: email, $options: "i" },
    });
    if (admin) {
      return res.status(400).send({ message: "Bunday Admin email mavjud" });
    }
    const hashedPassword = bcrypt.hashSync(password, 7);

    const activation_link = uuid.v4();

    const newAdmin = await Admin.create({
      name,
      email,
      phone,
      password: hashedPassword,
      is_active,
      is_creator,
      created_date,
      updated_date,
      activation_link,
    });

    await mail_service.sendActivationMail(
      email,
      `${config.get("api_url")}:${config.get(
        "port"
      )}/api/admin/activate/${activation_link}`
    );

    const payload = {
      _id: newAdmin._id,
      email: newAdmin.email,
      is_creator: newAdmin.is_creator,
    };

    const tokens = myJwt.generateTokens(payload);
    newAdmin.token = tokens.refreshToken;
    await newAdmin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.status(201).send({
      message: "Yangi Admin qo'shildi",
      id: newAdmin._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).send({ message: "Email yoki password noto'g'ri" });
    }
    const validPassword = bcrypt.compareSync(password, admin.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Email yoki password noto'g'ri" });
    }
    const payload = {
      _id: admin._id,
      email: admin.email,
      is_creator: admin.is_creator,
      admin_roles: ["READ", "WRITE", "UPDATE", "DELETE"],
    };

    const tokens = myJwt.generateTokens(payload);
    admin.token = tokens.refreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "Logged in,Welcome",
      id: admin._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).send({ message: "Token noto'g'ri" });
    }
    const admin = await Admin.findOneAndUpdate(
      { token: refreshToken },
      { token: "" },
      { new: true }
    );
    if (!admin) {
      return res.status(400).send({ message: "Refresh token noto'g'ri" });
    }

    res.clearCookie("refreshToken");
    res.send({ message: "Logged out", refreshToken: admin.token });
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
    const adminFromDB = await Admin.findOne({ token: refreshToken });
    if (!adminFromDB) {
      return res.status(403).send({
        message: "Ruxsat etilmagan foydalanuvchi(refresh token mos emas)",
      });
    }
    const payload = {
      _id: adminFromDB._id,
      email: adminFromDB.email,
      is_expert: adminFromDB.is_expert,
    };

    const tokens = myJwt.generateTokens(payload);
    adminFromDB.token = tokens.refreshToken;
    await adminFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "Refresh token updated successfully",
      id: adminFromDB._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.send(admins);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      password,
      is_active,
      is_creator,
      created_date,
      updated_date,
    } = req.body;
    const admin = await Admin.find({
      email: { $regex: email, $options: "i" },
    });
    console.log(admin, typeof admin);

    if (admin.length > 1) {
      return res.status(400).send({ message: "Bunday Admin email mavjud" });
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        password,
        is_active,
        is_creator,
        created_date,
        updated_date,
      },
      { new: true }
    );
    res.status(200).send({ message: "Admin updated succesfuly", updatedAdmin });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    res.status(200).send({ message: "Admin deleted succesfuly", deletedAdmin });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (id !== req.admin._id) {
      return res.status(403).send({ message: "Access denied admin" });
    }
    res.send(admin);
  } catch (error) {
    errorHandler(res, error);
  }
};

const adminActivate = async (req, res) => {
  try {
    const link = req.params.link;
    const admin = await Admin.findOne({ activation_link: link });
    if (!admin) {
      return res.status(404).send({ message: "Admin mavjud emas" });
    }
    if (admin.is_active) {
      return res.status(400).send({ message: "Admin already activated" });
    }
    admin.is_active = true;
    await admin.save();
    res.send({
      message: "Admin activated successfully",
      is_active: admin.is_active,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
  getAdminById,
  loginAdmin,
  logoutAdmin,
  refreshToken,
  adminActivate,
};
