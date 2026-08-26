const express = require("express");
const router = express.Router();

const {
  getAllDoctors,
  getDoctorById,
} = require("../controllers/adminDoctorController");
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, adminMiddleware, getAllDoctors);
router.get("/:userId", authMiddleware, adminMiddleware, getDoctorById);

module.exports = router;
