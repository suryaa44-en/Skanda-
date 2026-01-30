const { v4: uuidv4 } = require("uuid");
const taskService = require("../services/task.service");

// Assign task
exports.createTask = (req, res) => {
  const { missionId, responderId, description } = req.body;

  if (!missionId || !responderId || !description) {
    return res.status(400).json({
      error: "missionId, responderId, description required"
    });
  }

  const task = {
    id: uuidv4(),
    missionId,
    responderId,
    description,
    status: "ASSIGNED",
    createdAt: new Date().toISOString()
  };

  taskService.createTask(task);

  res.status(201).json({
    message: "Task assigned",
    task
  });
};

const ALLOWED_STATUSES = ["ASSIGNED", "IN_PROGRESS", "COMPLETED"];

// Update task status (lifecycle: ASSIGNED → IN_PROGRESS → COMPLETED)
exports.updateTaskStatus = (req, res) => {
  const { status } = req.body;

  if (!status || !ALLOWED_STATUSES.includes(String(status).toUpperCase())) {
    return res.status(400).json({
      error: "status must be one of: ASSIGNED, IN_PROGRESS, COMPLETED"
    });
  }

  const task = taskService.updateTaskStatus(req.params.id, String(status).toUpperCase());

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json({
    message: "Task updated",
    task
  });
};

// Get all tasks (commander)
exports.getAllTasks = (req, res) => {
  res.json(taskService.getAllTasks());
};

// Get tasks by responder (responder app)
exports.getByResponderId = (req, res) => {
  const { responderId } = req.params;
  if (!responderId) {
    return res.status(400).json({ error: "responderId is required" });
  }
  const tasks = taskService.getByResponderId(responderId);
  res.json(tasks);
};
