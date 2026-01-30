const express = require("express");
const router = express.Router();

const {
  createTask,
  updateTaskStatus,
  getAllTasks,
  getByResponderId
} = require("../controllers/task.controller");

router.post("/", createTask);
router.patch("/:id", updateTaskStatus);
router.get("/", getAllTasks);
router.get("/:responderId", getByResponderId);

module.exports = router;
