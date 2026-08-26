const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllVerificationRequests,
  updateVerificationStatus,
  getVerificationById,
} = require("../controllers/adminVerificationController");

router.get(
  "/verifications",
  authMiddleware,
  adminMiddleware,
  getAllVerificationRequests,
);
router.get(
  "/verifications/:id",
  authMiddleware,
  adminMiddleware,
  getVerificationById,
);
router.patch(
  "/verifications/:id/status",
  authMiddleware,
  adminMiddleware,
  updateVerificationStatus,
);

module.exports = router;
