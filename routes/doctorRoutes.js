const express = require("express");
const router = express.Router();

const {
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpecialty,
  getApprovedDoctorById,
  updateDoctorActivity,
} = require("../controllers/doctorController");
const {
  submitVerification,
  getVerificationStatus,
} = require("../controllers/doctorVerificationController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/", getAllDoctors);
router.get("/verification", authMiddleware, getVerificationStatus);
router.post(
  "/verification",
  authMiddleware,
  upload.fields([
    { name: "idDocument", maxCount: 1 },
    { name: "medicalLicense", maxCount: 1 },
    { name: "proofOfAddress", maxCount: 1 },
  ]),
  submitVerification,
);
router.get("/specialty/:specialtyId", getDoctorsBySpecialty);
router.get("/profile/:id", getApprovedDoctorById);
router.patch("/activity", authMiddleware, updateDoctorActivity);

router.get("/:id", getDoctorById);

module.exports = router;
