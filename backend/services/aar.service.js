const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const dataFilePath = path.join(__dirname, "../data/aar.json");

function getAll() {
  const raw = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(raw);
}

function getByTaskId(taskId) {
  const all = getAll();
  return all.filter((r) => r.taskId === taskId);
}

function create(report) {
  const all = getAll();
  const doc = {
    id: uuidv4(),
    taskId: report.taskId,
    outcomeSummary: report.outcomeSummary || "",
    issuesFaced: report.issuesFaced || "",
    resourcesUsed: report.resourcesUsed || "",
    timeTaken: report.timeTaken || "",
    createdAt: new Date().toISOString(),
  };
  all.push(doc);
  fs.writeFileSync(dataFilePath, JSON.stringify(all, null, 2));
  return doc;
}

module.exports = {
  getAll,
  getByTaskId,
  create,
};
