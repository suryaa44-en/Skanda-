/**
 * Explainable AI Service
 * Rule-based decision support (IndiaAI aligned)
 */

// Mission risk scoring
function calculateMissionRisk(mission) {
  let score = 0;
  const reasons = [];

  // Disaster type risk
  if (mission.disasterType === "Flood") {
    score += 3;
    reasons.push("Floods cause rapid escalation");
  }

  if (mission.disasterType === "Earthquake") {
    score += 4;
    reasons.push("Earthquakes cause infrastructure collapse");
  }

  // Region sensitivity (example)
  if (mission.region.toLowerCase().includes("assam")) {
    score += 2;
    reasons.push("High flood-prone region");
  }

  return {
    riskScore: score,
    level:
      score >= 6 ? "HIGH" :
      score >= 3 ? "MEDIUM" :
      "LOW",
    reasons
  };
}

// Task priority suggestion
function suggestTaskPriority(task, missionRiskLevel) {
  let priority = "NORMAL";
  const explanation = [];

  if (missionRiskLevel === "HIGH") {
    priority = "URGENT";
    explanation.push("Mission has high risk level");
  }

  if (task.description.toLowerCase().includes("rescue")) {
    priority = "CRITICAL";
    explanation.push("Life-saving task detected");
  }

  return {
    suggestedPriority: priority,
    explanation
  };
}

module.exports = {
  calculateMissionRisk,
  suggestTaskPriority
};
