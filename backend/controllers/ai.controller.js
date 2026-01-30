const aiService = require("../services/ai.service");
const missionService = require("../services/mission.service");
const taskService = require("../services/task.service");

// AI: Mission risk analysis
exports.analyzeMissionRisk = (req, res) => {
  const missions = missionService.getAllMissions();
  const analysis = missions.map(mission => ({
    missionId: mission.id,
    missionName: mission.name,
    analysis: aiService.calculateMissionRisk(mission)
  }));

  res.json(analysis);
};

// AI: Task priority suggestion
exports.suggestTaskPriority = (req, res) => {
  const tasks = taskService.getAllTasks();
  const missions = missionService.getAllMissions();

  const suggestions = tasks.map(task => {
    const mission = missions.find(m => m.id === task.missionId);
    const risk = mission
      ? aiService.calculateMissionRisk(mission).level
      : "LOW";

    return {
      taskId: task.id,
      taskDescription: task.description,
      suggestion: aiService.suggestTaskPriority(task, risk)
    };
  });

  res.json(suggestions);
};
