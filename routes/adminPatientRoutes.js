const express = require("express");
const router = express.Router();

const {
  getAllPatients,
  getPatientById,
} = require("../controllers/adminPatientController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", adminMiddleware, getAllPatients);
router.get("/:id", adminMiddleware, getPatientById);

module.exports = router;
