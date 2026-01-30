import { useEffect, useState } from "react";

const API_MISSIONS = "http://localhost:5000/api/missions";
const API_RESPONDERS = "http://localhost:5000/api/responders";
const API_TASKS = "http://localhost:5000/api/tasks";
const API_AAR = "http://localhost:5000/api/aar";

function Tasks() {
  const [missions, setMissions] = useState([]);
  const [responders, setResponders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [missionId, setMissionId] = useState("");
  const [responderId, setResponderId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aarTaskId, setAarTaskId] = useState(null);
  const [aarReports, setAarReports] = useState([]);

  // MVP: task lifecycle synced via REST — fetch on load and poll for status updates
  const fetchTasks = () => {
    fetch(API_TASKS)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(API_MISSIONS).then((res) => (res.ok ? res.json() : [])),
      fetch(API_RESPONDERS).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([missionsData, respondersData]) => {
        setMissions(Array.isArray(missionsData) ? missionsData : []);
        setResponders(Array.isArray(respondersData) ? respondersData : []);
      })
      .catch(() => {
        setMissions([]);
        setResponders([]);
      })
      .finally(() => setLoading(false));
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!aarTaskId) {
      setAarReports([]);
      return;
    }
    fetch(`${API_AAR}?taskId=${encodeURIComponent(aarTaskId)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setAarReports(Array.isArray(data) ? data : []))
      .catch(() => setAarReports([]));
  }, [aarTaskId]);

  const handleAssign = (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const mission = missionId?.trim();
    const responder = responderId?.trim();
    const desc = description?.trim();
    if (!mission) {
      setError("Please select a mission.");
      return;
    }
    if (!responder) {
      setError("Please select a responder.");
      return;
    }
    if (!desc) {
      setError("Please enter a task description.");
      return;
    }
    setSubmitting(true);
    fetch(API_TASKS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ missionId: mission, responderId: responder, description: desc }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Assign failed");
        setDescription("");
        setMessage("Task assigned successfully.");
        fetchTasks();
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to assign task.");
      })
      .finally(() => setSubmitting(false));
  };

  const getMissionName = (id) => {
    const m = missions.find((x) => x.id === id);
    return m ? m.name : id;
  };

  const getResponderName = (id) => {
    const r = responders.find((x) => x.id === id);
    return r ? r.name : id;
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px 0", fontSize: "1.5rem", color: "#1a1a1a" }}>
        Task assignment
      </h1>

      <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "14px" }}>
        Task status reflects field progress reported by responders.
      </p>

      <form
        onSubmit={handleAssign}
        style={{
          marginBottom: "24px",
          padding: "20px",
          background: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <h2 style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "#475569" }}>
          Assign task
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>Mission</label>
            <select
              value={missionId}
              onChange={(e) => setMissionId(e.target.value)}
              disabled={loading || submitting}
              style={{ padding: "8px 12px", minWidth: "180px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
            >
              <option value="">Select mission</option>
              {missions.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>Responder</label>
            <select
              value={responderId}
              onChange={(e) => setResponderId(e.target.value)}
              disabled={loading || submitting}
              style={{ padding: "8px 12px", minWidth: "180px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
            >
              <option value="">Select responder</option>
              {responders.map((r) => (
                <option key={r.id} value={r.id}>{r.name} ({r.role || r.id})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              disabled={submitting}
              style={{ padding: "8px 12px", width: "220px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || submitting}
            style={{
              padding: "8px 16px",
              background: loading || submitting ? "#94a3b8" : "#2e7d32",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading || submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Assigning…" : "Assign task"}
          </button>
        </div>
      </form>

      {error && <p style={{ color: "#c62828", marginBottom: "12px", fontSize: "14px" }}>⚠️ {error}</p>}
      {message && <p style={{ color: "#2e7d32", marginBottom: "12px", fontSize: "14px" }}>✓ {message}</p>}

      {!loading && responders.length === 0 && (
        <p style={{ color: "#64748b", fontSize: "14px" }}>No responders yet. Add responders via the API to assign tasks.</p>
      )}

      <h2 style={{ margin: "24px 0 12px 0", fontSize: "1.1rem", color: "#475569" }}>Task list</h2>
      {tasks.length === 0 ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>No tasks yet.</p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
          {tasks.map((t) => {
            const s = (t.status || "").toUpperCase();
            const isCompleted = s === "COMPLETED";
            return (
              <li
                key={t.id}
                style={{
                  padding: "16px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>
                    Responder {getResponderName(t.responderId)} ({t.responderId}) – Task {s || "ASSIGNED"}
                  </span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      background: isCompleted ? "#dcfce7" : s === "IN_PROGRESS" ? "#dbeafe" : "#fef3c7",
                      color: isCompleted ? "#166534" : s === "IN_PROGRESS" ? "#1e40af" : "#92400e",
                    }}
                  >
                    {s || "ASSIGNED"}
                  </span>
                </div>
                <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>
                  Mission: {getMissionName(t.missionId)} ({t.missionId})
                </div>
                <div style={{ fontSize: "14px", color: "#334155", marginBottom: "8px" }}>{t.description || "—"}</div>
                {isCompleted && (
                  <button
                    type="button"
                    onClick={() => setAarTaskId(aarTaskId === t.id ? null : t.id)}
                    style={{
                      padding: "6px 12px",
                      background: "#0ea5e9",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    {aarTaskId === t.id ? "Hide AAR" : "View AAR"}
                  </button>
                )}
                {aarTaskId === t.id && (
                  <div style={{ marginTop: "12px", padding: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px" }}>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#166534" }}>After-Action Report</h4>
                    {aarReports.length === 0 ? (
                      <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>No AAR submitted yet.</p>
                    ) : (
                      aarReports.map((r) => (
                        <div key={r.id} style={{ marginBottom: "12px", fontSize: "13px", color: "#334155" }}>
                          {r.outcomeSummary && <div><strong>Outcome:</strong> {r.outcomeSummary}</div>}
                          {r.issuesFaced && <div><strong>Issues:</strong> {r.issuesFaced}</div>}
                          {r.resourcesUsed && <div><strong>Resources:</strong> {r.resourcesUsed}</div>}
                          {r.timeTaken && <div><strong>Time taken:</strong> {r.timeTaken}</div>}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Tasks;
