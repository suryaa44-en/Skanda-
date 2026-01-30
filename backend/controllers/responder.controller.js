const { v4: uuidv4 } = require("uuid");
const responderService = require("../services/responder.service");

// Create responder
exports.createResponder = (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({
      error: "name and role are required"
    });
  }

  const responder = {
    id: uuidv4(),
    name,
    role,
    status: "AVAILABLE",
    createdAt: new Date().toISOString()
  };

  responderService.createResponder(responder);

  res.status(201).json({
    message: "Responder created",
    responder
  });
};

// Get responders
exports.getAllResponders = (req, res) => {
  const responders = responderService.getAllResponders();
  res.json(responders);
};
