const Joi = require("joi");
const { errorHandler } = require("../helpers/error_handler");
const Category = require("../schemas/Category");
const { categoryValidation } = require("../validations/category.validation");

const addCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { category_name, parent_category_id } = value;
    const category = await Category.findOne({
      category_name: { $regex: category_name, $options: "i" },
    });
    if (category) {
      return res.status(400).send({ message: "Bunday category_name mavjud" });
    }
    const newcategory = await Category.create({
      category_name,
      parent_category_id,
    });
    res
      .status(201)
      .send({ message: "Yangi category_name qo'shildi", newcategory });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;
    const updatedcategory = await Category.findByIdAndUpdate(
      id,
      { category_name },
      { new: true }
    );
    res
      .status(200)
      .send({ message: "category_name updated succesfuly", updatedcategory });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedcategory = await Category.findByIdAndDelete(id);
    res
      .status(200)
      .send({ message: "category_name deleted succesfuly", deletedcategory });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ message: "category_name mavjud emas" });
    }
    res.send(category);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
