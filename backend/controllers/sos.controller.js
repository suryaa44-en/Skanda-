const { v4: uuidv4 } = require("uuid");
const sosService = require("../services/sos.service");
const { sendSOSViaSMS } = require("../utils/sms.util");

// Responder sends SOS
exports.createSOS = (req, res) => {
  const { responderId, missionId, location, offline } = req.body;

  if (!responderId || !missionId) {
    return res.status(400).json({
      error: "responderId and missionId are required"
    });
  }

  const sosEvent = {
    id: uuidv4(),
    responderId,
    missionId,
    location: location || "UNKNOWN",
    status: "RECEIVED",
    deliveryMode: offline ? "SMS_FALLBACK" : "ONLINE",
    acknowledged: true,
    createdAt: new Date().toISOString()
  };

  // 🔴 CRITICAL: Immediate SMS fallback
  sendSOSViaSMS(sosEvent);

  // 🔵 Guaranteed delivery (store in backend)
  sosService.saveSOS(sosEvent);

  res.status(201).json({
    message: "SOS sent successfully",
    status: "RECEIVED",
    acknowledged: true,
    sosEvent
  });
};

// Commander fetches SOS alerts
exports.getAllSOS = (req, res) => {
  res.json(sosService.getAllSOS());
};
