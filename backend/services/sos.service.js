const fs = require("fs");
const path = require("path");

const SOS_FILE = path.join(__dirname, "../data/sos.json");

// Read all SOS events
function getAllSOS() {
  return JSON.parse(fs.readFileSync(SOS_FILE, "utf-8"));
}

// Save SOS event
function saveSOS(sosEvent) {
  const events = getAllSOS();
  events.push(sosEvent);
  fs.writeFileSync(SOS_FILE, JSON.stringify(events, null, 2));
}

module.exports = {
  getAllSOS,
  saveSOS
};
