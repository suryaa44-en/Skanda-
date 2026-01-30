const aarService = require("../services/aar.service");

// Submit After-Action Report (responder)
exports.create = (req, res) => {
  const { taskId, outcomeSummary, issuesFaced, resourcesUsed, timeTaken } = req.body;

  if (!taskId) {
    return res.status(400).json({ error: "taskId is required" });
  }

  const report = aarService.create({
    taskId,
    outcomeSummary,
    issuesFaced,
    resourcesUsed,
    timeTaken,
  });

  res.status(201).json({ message: "AAR submitted", report });
};

// Get AAR by taskId (commander)
exports.getByTaskId = (req, res) => {
  const { taskId } = req.query;
  if (!taskId) {
    return res.status(400).json({ error: "taskId query is required" });
  }
  const reports = aarService.getByTaskId(taskId);
  res.json(reports);
};

// Get all AARs (commander)
exports.getAll = (req, res) => {
  res.json(aarService.getAll());
};
