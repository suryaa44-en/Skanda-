const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/tasks.json");

function getAllTasks() {
  return JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
}

function getByResponderId(responderId) {
  const tasks = getAllTasks();
  return tasks.filter((t) => t.responderId === responderId);
}

function createTask(task) {
  const tasks = getAllTasks();
  tasks.push(task);
  fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));
}

function updateTaskStatus(taskId, status) {
  const tasks = getAllTasks();
  const task = tasks.find(t => t.id === taskId);

  if (task) {
    task.status = status;
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));
  }

  return task;
}

module.exports = {
  getAllTasks,
  getByResponderId,
  createTask,
  updateTaskStatus
};
