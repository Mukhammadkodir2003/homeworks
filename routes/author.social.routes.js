const express = require("express");

const {
  getAs,
  addAs,
  updateAs,
  deleteAs,
  getAsById,
} = require("../controllers/author_social.controller");

const router = express.Router();

router.get("/get", getAs);

router.post("/create", addAs);

router.put("/update/:id", updateAs);

router.delete("/delete/:id", deleteAs);

router.get("/:id", getAsById);

module.exports = router;
