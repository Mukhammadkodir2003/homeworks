const express = require("express");
const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} = require("../controllers/category.controller");
const router = express.Router();

router.post("/create", addCategory);
router.get("/get", getCategories);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);
router.get("/:id", getCategoryById);

module.exports = router;
