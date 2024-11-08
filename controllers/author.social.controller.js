const { errorHandler } = require("../helpers/error_handler");

const Author_Social = require("../schemas/Author_Social");

const addAs = async (req, res) => {
  try {
    const { author_id, social_id, social_link } = req.body;

    const newAs = await Author_Social.create({
      author_id,
      social_id,
      social_link,
    });

    res
      .status(201)
      .send({ message: "Author social created successfully...", newAs });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAs = async (req, res) => {
  try {
    res.send(await Author_Social.find());
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAsById = async (req, res) => {
  try {
    const { id } = req.params;
    const author_social = await Author_Social.findById(id);
    if (!author_social) {
      return res.status(404).send({ message: "author_social mavjud emas" });
    }
    res.send(author_social);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAs = async (req, res) => {
  try {
    const { id } = req.params;

    const { author_id, social_id, social_link } = req.body;

    const updatedAs = await Author_Social.findByIdAndUpdate(
      id,
      { author_id, social_id, social_link },
      { new: true }
    );

    res
      .status(200)
      .send({ message: "Author social updated succesfuly...", updatedAs });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAs = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAs = await Author_Social.findByIdAndDelete(id);

    res
      .status(200)
      .send({ message: "Author deleted succesfuly....", deletedAs });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addAs,
  getAs,
  updateAs,
  deleteAs,
  getAsById,
};
