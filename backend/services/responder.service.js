const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/responders.json");

function getAllResponders() {
  return JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
}

function createResponder(responder) {
  const responders = getAllResponders();
  responders.push(responder);
  fs.writeFileSync(dataFilePath, JSON.stringify(responders, null, 2));
}

module.exports = {
  getAllResponders,
  createResponder
};
