const express = require("express");
const router = express.Router();

const { getAllSpecialties } = require("../controllers/specialtyController");

router.get("/", getAllSpecialties);

module.exports = router;
