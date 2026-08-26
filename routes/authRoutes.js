const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerPatient,
  registerDoctor,
  Login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");

const { Router } = express;

const router = Router();

router.post("/patient/register", registerPatient);
router.post("/doctor/register", registerDoctor);
router.post("/login", Login);
router.get("/me", authMiddleware, getMe);
router.patch("/update-profile", authMiddleware, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.patch("/change-password", authMiddleware, changePassword);

module.exports = router;
