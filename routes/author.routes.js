const express = require("express");
const {
  addAuthor,
  authorActivate,
  getAuthors,
  updateAuthor,
  deleteAuthor,
  getAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshToken,
} = require("../controllers/author.controller");
const router = express.Router();
const authorPolice = require("../middleware/author_police");
const authorRolesPolice = require("../middleware/author_roles_police");

router.post("/create", addAuthor);
router.post("/login", loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshToken);
router.get("/get", authorPolice, getAuthors);
router.get("/activate/:link", authorActivate);
router.put("/update/:id", updateAuthor);
router.delete("/delete/:id", deleteAuthor);
router.get("/:id", authorRolesPolice(["READ"]), getAuthorById);

module.exports = router;
