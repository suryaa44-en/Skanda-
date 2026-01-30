const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/missions.json");

// Read all missions
function getAllMissions() {
  const fileData = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(fileData);
}

// Save a new mission
function createMission(mission) {
  const missions = getAllMissions();
  missions.push(mission);
  fs.writeFileSync(dataFilePath, JSON.stringify(missions, null, 2));
}

module.exports = {
  getAllMissions,
  createMission
};
