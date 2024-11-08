const express = require("express");
const {
  addAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
  getAdminById,
  loginAdmin,
  logoutAdmin,
  refreshToken,
  adminActivate,
} = require("../controllers/admin.controller");
const router = express.Router();
const adminPolice = require("../middleware/admin_police");

router.post("/create", addAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshToken);
router.get("/get", adminPolice, getAdmins);
router.get("/activate/:link", adminActivate);
router.put("/update/:id", updateAdmin);
router.delete("/delete/:id", deleteAdmin);
router.get("/:id", adminPolice, getAdminById);

module.exports = router;
