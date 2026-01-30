/**
 * Drishti-NE Backend Server
 * Entry point for the application
 */

const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/auth.routes");
const missionRoutes = require("./routes/mission.routes");
const responderRoutes = require("./routes/responder.routes");
const taskRoutes = require("./routes/task.routes");
const sosRoutes = require("./routes/sos.routes");
const aiRoutes = require("./routes/ai.routes");
const aarRoutes = require("./routes/aar.routes");

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Health Check =====
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Drishti-NE Backend",
    message: "Server is running successfully",
    timestamp: new Date().toISOString()
  });
});
app.use("/api/login", authRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/responders", responderRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/aar", aarRoutes);

// ===== Server Boot =====
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚨 Drishti-NE backend running on http://localhost:${PORT}`);
});
