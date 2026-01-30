const { v4: uuidv4 } = require("uuid");
const missionService = require("../services/mission.service");

// Create mission
exports.createMission = (req, res) => {
  const { name, region, disasterType } = req.body;

  // Basic validation
  if (!name || !region || !disasterType) {
    return res.status(400).json({
      error: "name, region, and disasterType are required"
    });
  }

  const mission = {
    id: uuidv4(),
    name,
    region,
    disasterType,
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  };

  missionService.createMission(mission);

  res.status(201).json({
    message: "Mission created successfully",
    mission
  });
};

// Get all missions
exports.getAllMissions = (req, res) => {
  const missions = missionService.getAllMissions();
  res.status(200).json(missions);
};
