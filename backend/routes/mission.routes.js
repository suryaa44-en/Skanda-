const express = require("express");
const router = express.Router();

const {
  createMission,
  getAllMissions
} = require("../controllers/mission.controller");

// Create mission (Commander)
router.post("/", createMission);

// Get missions (Commander)
router.get("/", getAllMissions);

module.exports = router;
