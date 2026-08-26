const express = require("express");
const { getDashboardStats } = require("../controllers/adminDashboardConroller");

const router = express.Router();

router.get("/", getDashboardStats);

module.exports = router;
