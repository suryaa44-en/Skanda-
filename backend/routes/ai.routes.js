const express = require("express");
const router = express.Router();

const {
  analyzeMissionRisk,
  suggestTaskPriority
} = require("../controllers/ai.controller");

// Commander-only AI insights
router.get("/mission-risk", analyzeMissionRisk);
router.get("/task-priority", suggestTaskPriority);

module.exports = router;
