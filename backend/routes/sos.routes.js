const express = require("express");
const router = express.Router();

const {
  createSOS,
  getAllSOS
} = require("../controllers/sos.controller");

// Responder SOS
router.post("/", createSOS);

// Commander view
router.get("/", getAllSOS);

module.exports = router;
