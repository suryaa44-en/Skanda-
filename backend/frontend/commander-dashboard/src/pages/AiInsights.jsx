import { useEffect, useState } from "react";

const API_MISSION_RISK = "http://localhost:5000/api/ai/mission-risk";
const API_TASK_PRIORITY = "http://localhost:5000/api/ai/task-priority";

function getRiskStyle(level) {
  const l = (level || "").toUpperCase();
  if (l === "HIGH")
    return { background: "#fef2f2", color: "#b91c1c", borderColor: "#dc2626" };
  if (l === "MEDIUM")
    return { background: "#fffbeb", color: "#b45309", borderColor: "#f59e0b" };
  return { background: "#f0fdf4", color: "#15803d", borderColor: "#22c55e" };
}

function AiInsights() {
  const [missionData, setMissionData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(API_MISSION_RISK).then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("Mission risk failed"))
      ),
      fetch(API_TASK_PRIORITY).then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("Task priority failed"))
      ),
    ])
      .then(([missionRisk, taskPriority]) => {
        setMissionData(Array.isArray(missionRisk) ? missionRisk : []);
        setTaskData(Array.isArray(taskPriority) ? taskPriority : []);
      })
      .catch((err) => {
        console.error(err);
        setError("AI insights unavailable");
        setMissionData([]);
        setTaskData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ margin: "0 0 24px 0", fontSize: "1.5rem", color: "#1a1a1a" }}>
        AI Insights
      </h1>

      <div
        style={{
          marginBottom: "24px",
          padding: "16px",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "8px",
          fontSize: "14px",
          color: "#1e40af",
        }}
      >
        <strong>Governance notice:</strong> AI provides recommendations only.
        Final decisions are made by human commanders.
      </div>

      {error && (
        <p style={{ color: "#c62828", marginBottom: "16px", fontSize: "14px" }}>
          ⚠️ {error}
        </p>
      )}

      {loading ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>Loading…</p>
      ) : (
        <>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "1.1rem", color: "#475569" }}>
            Mission risk level & reasons
          </h2>
          {missionData.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
              No mission risk data yet. Create missions to see AI insights.
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                margin: "0 0 24px 0",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {missionData.map((item) => {
                const level = item.analysis?.level ?? "—";
                const reasons = item.analysis?.reasons ?? [];
                const riskStyle = getRiskStyle(level);
                return (
                  <li
                    key={item.missionId}
                    style={{
                      padding: "16px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px",
                        marginBottom: reasons.length ? "12px" : 0,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>
                          Mission
                        </div>
                        <div style={{ fontWeight: 600, fontSize: "1rem", color: "#1e293b" }}>
                          {item.missionName || "—"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>
                          Risk level
                        </div>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid",
                            fontWeight: 600,
                            fontSize: "14px",
                            ...riskStyle,
                          }}
                        >
                          {level}
                        </span>
                      </div>
                    </div>
                    {reasons.length > 0 && (
                      <div>
                        <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "6px" }}>
                          Reasons for risk score
                        </div>
                        <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "#334155" }}>
                          {reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <h2 style={{ margin: "0 0 12px 0", fontSize: "1.1rem", color: "#475569" }}>
            Suggested task priority
          </h2>
          {taskData.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "14px" }}>
              No task priority suggestions yet. Assign tasks to see AI suggestions.
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {taskData.map((item) => {
                const sug = item.suggestion || {};
                const priority = sug.suggestedPriority ?? "—";
                const explanation = sug.explanation ?? [];
                return (
                  <li
                    key={item.taskId}
                    style={{
                      padding: "16px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b", marginBottom: "6px" }}>
                      {item.taskDescription || "—"}
                    </div>
                    <div style={{ fontSize: "14px", color: "#64748b", marginBottom: explanation.length ? "8px" : 0 }}>
                      Suggested priority: <strong>{priority}</strong>
                    </div>
                    {explanation.length > 0 && (
                      <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#475569" }}>
                        {explanation.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default AiInsights;
