import { useState, useEffect, useCallback } from "react";

const API_TASKS = "http://localhost:5000/api/tasks";
const API_MISSIONS = "http://localhost:5000/api/missions";
const API_SOS = "http://localhost:5000/api/sos";
const API_AAR = "http://localhost:5000/api/aar";

function getResponderId() {
  return localStorage.getItem("responderId") || "";
}

function getResponderName() {
  return localStorage.getItem("responderName") || "";
}

function App() {
  const [status, setStatus] = useState("READY");
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [missions, setMissions] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [aarTaskId, setAarTaskId] = useState(null);
  const [aarForm, setAarForm] = useState({
    outcomeSummary: "",
    issuesFaced: "",
    resourcesUsed: "",
    timeTaken: "",
  });
  const [aarSubmitting, setAarSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("drishti_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.role === "responder" && u.responderId) {
          setUser(u);
          localStorage.setItem("responderId", u.responderId);
          if (u.name) localStorage.setItem("responderName", u.name);
        }
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("pendingSOS")) setStatus("OFFLINE – SAVED");
  }, []);

  useEffect(() => {
    const onSosSynced = () => setStatus("SENT – ACKNOWLEDGED");
    window.addEventListener("sosSynced", onSosSynced);
    return () => window.removeEventListener("sosSynced", onSosSynced);
  }, []);

  const fetchMissions = useCallback(() => {
    fetch(API_MISSIONS)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setMissions(Array.isArray(data) ? data : []))
      .catch(() => setMissions([]));
  }, []);

  const fetchTasks = useCallback(() => {
    // Read responderId from localStorage; must match Commander assignment (e.g. resp-002)
    const responderId = getResponderId();
    fetch(API_TASKS)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const all = Array.isArray(data) ? data : [];
        // MVP: tasks filtered by responderId — responder never sees another responder's tasks
        const list = responderId ? all.filter((t) => t.responderId === responderId) : [];
        setTasks(list);
        if (list.length > 0 && list[0].missionId) {
          localStorage.setItem("drishti_mission_id", list[0].missionId);
        }
      })
      .catch(() => setTasks([]));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchMissions();
    fetchTasks();
    const t = setInterval(fetchTasks, 5000);
    return () => clearInterval(t);
  }, [user, fetchMissions, fetchTasks]);

  const getMissionName = (missionId) => {
    const m = missions.find((x) => x.id === missionId);
    return m ? m.name : missionId || "—";
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const name = e.target.name.value?.trim();
    // Must match Commander assignment exactly (e.g. resp-002)
    const responderId = e.target.responderId.value?.trim();
    if (!name || !responderId) return;
    const u = { role: "responder", name, responderId, responderName: name };
    localStorage.setItem("drishti_user", JSON.stringify(u));
    localStorage.setItem("responderId", responderId);
    localStorage.setItem("responderName", name);
    setUser(u);
  };

  const handleLogout = () => {
    localStorage.removeItem("drishti_user");
    localStorage.removeItem("responderId");
    localStorage.removeItem("responderName");
    setUser(null);
    setTasks([]);
  };

  // MVP: task lifecycle synced via REST
  const updateTaskStatus = (taskId, newStatus) => {
    setUpdatingId(taskId);
    // Optimistic update so UI reflects immediately
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    fetch(`${API_TASKS}/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        if (newStatus === "COMPLETED") setAarTaskId(taskId);
        fetchTasks();
      })
      .catch(() => {
        fetchTasks();
      })
      .finally(() => setUpdatingId(null));
  };

  const handleAarSubmit = (e) => {
    e.preventDefault();
    if (!aarTaskId) return;
    setAarSubmitting(true);
    fetch(API_AAR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: aarTaskId,
        outcomeSummary: aarForm.outcomeSummary.trim(),
        issuesFaced: aarForm.issuesFaced.trim(),
        resourcesUsed: aarForm.resourcesUsed.trim(),
        timeTaken: aarForm.timeTaken.trim(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("AAR submit failed");
        setAarTaskId(null);
        setAarForm({ outcomeSummary: "", issuesFaced: "", resourcesUsed: "", timeTaken: "" });
        fetchTasks();
      })
      .catch(() => {})
      .finally(() => setAarSubmitting(false));
  };

  const sendSOS = async () => {
    const responderId = getResponderId();
    const missionId =
      tasks[0]?.missionId ?? localStorage.getItem("drishti_mission_id") ?? "unassigned";
    const offline = !navigator.onLine;
    const sosData = {
      responderId,
      missionId,
      location: "Field location (offline capable)",
      timestamp: new Date().toISOString(),
      offline,
    };

    try {
      const res = await fetch(API_SOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sosData),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.acknowledged === true) {
        setStatus("SENT – ACKNOWLEDGED");
        return;
      }
      setStatus("OFFLINE – SAVED");
      localStorage.setItem("pendingSOS", JSON.stringify(sosData));
    } catch (err) {
      console.error("Offline - saving locally");
      setStatus("OFFLINE – SAVED");
      localStorage.setItem("pendingSOS", JSON.stringify(sosData));
    }
  };

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "24px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "360px",
            background: "#fff",
            padding: "28px 24px",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <h1 style={{ margin: "0 0 8px 0", fontSize: "1.35rem", fontWeight: 700, color: "#1e293b" }}>
            Responder Login
          </h1>
          <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: "#64748b", lineHeight: 1.4 }}>
            Use your assigned responder credentials. Responder ID must match Commander assignment exactly (e.g. resp-002).
          </p>
          <form onSubmit={handleLogin}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "14px", color: "#334155" }}>
              Responder Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Your full name"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                marginBottom: "16px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                boxSizing: "border-box",
                fontSize: "16px",
                color: "#1e293b",
                backgroundColor: "#fff",
              }}
            />
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "14px", color: "#334155" }}>
              Responder ID
            </label>
            <input
              name="responderId"
              type="text"
              placeholder="e.g. resp-002"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                marginBottom: "24px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                boxSizing: "border-box",
                fontSize: "16px",
                color: "#1e293b",
                backgroundColor: "#fff",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                background: "#0284c7",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              Login as Responder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f8fafc",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px",
          padding: "16px 20px",
          background: "#1e293b",
          borderRadius: "10px",
          color: "#f1f5f9",
        }}
      >
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "2px" }}>Drishti-NE Responder</div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>{getResponderName() || user.name}</div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 18px",
            background: "#475569",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </header>

      <section
        style={{
          marginBottom: "24px",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>
          My Tasks
        </h2>
        {tasks.length === 0 ? (
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b", lineHeight: 1.5 }}>
            No active tasks assigned
          </p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {tasks.map((t) => {
              const s = (t.status || "").toUpperCase();
              const isAssigned = s === "ASSIGNED";
              const isInProgress = s === "IN_PROGRESS";
              const isCompleted = s === "COMPLETED";
              const busy = updatingId === t.id;

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
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      marginBottom: "10px",
                      background:
                        isCompleted ? "#dcfce7" : isInProgress ? "#dbeafe" : "#fef3c7",
                      color: isCompleted ? "#166534" : isInProgress ? "#1e40af" : "#92400e",
                    }}
                  >
                    {s || "ASSIGNED"}
                  </div>
                  <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>
                    Mission: {getMissionName(t.missionId)}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b", marginBottom: "12px" }}>
                    {t.description || "—"}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {isAssigned && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateTaskStatus(t.id, "IN_PROGRESS")}
                        style={{
                          padding: "8px 16px",
                          background: busy ? "#94a3b8" : "#0284c7",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: busy ? "not-allowed" : "pointer",
                        }}
                      >
                        {busy ? "Updating…" : "Start Task"}
                      </button>
                    )}
                    {isInProgress && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateTaskStatus(t.id, "COMPLETED")}
                        style={{
                          padding: "8px 16px",
                          background: busy ? "#94a3b8" : "#16a34a",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: busy ? "not-allowed" : "pointer",
                        }}
                      >
                        {busy ? "Updating…" : "Complete Task"}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {aarTaskId && (
          <form
            onSubmit={handleAarSubmit}
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#166534" }}>After-Action Report</h3>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>Outcome summary</label>
            <textarea
              value={aarForm.outcomeSummary}
              onChange={(e) => setAarForm((f) => ({ ...f, outcomeSummary: e.target.value }))}
              placeholder="Brief summary of outcome"
              rows={2}
              style={{ width: "100%", padding: "8px", marginBottom: "12px", boxSizing: "border-box", fontSize: "14px" }}
            />
            <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>Issues faced</label>
            <textarea
              value={aarForm.issuesFaced}
              onChange={(e) => setAarForm((f) => ({ ...f, issuesFaced: e.target.value }))}
              placeholder="Issues encountered"
              rows={2}
              style={{ width: "100%", padding: "8px", marginBottom: "12px", boxSizing: "border-box", fontSize: "14px" }}
            />
            <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>Resources used</label>
            <input
              type="text"
              value={aarForm.resourcesUsed}
              onChange={(e) => setAarForm((f) => ({ ...f, resourcesUsed: e.target.value }))}
              placeholder="e.g. vehicles, equipment"
              style={{ width: "100%", padding: "8px", marginBottom: "12px", boxSizing: "border-box", fontSize: "14px" }}
            />
            <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>Time taken</label>
            <input
              type="text"
              value={aarForm.timeTaken}
              onChange={(e) => setAarForm((f) => ({ ...f, timeTaken: e.target.value }))}
              placeholder="e.g. 2 hours"
              style={{ width: "100%", padding: "8px", marginBottom: "12px", boxSizing: "border-box", fontSize: "14px" }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="submit"
                disabled={aarSubmitting}
                style={{
                  padding: "8px 16px",
                  background: aarSubmitting ? "#94a3b8" : "#16a34a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: aarSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {aarSubmitting ? "Submitting…" : "Submit AAR"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAarTaskId(null);
                  setAarForm({ outcomeSummary: "", issuesFaced: "", resourcesUsed: "", timeTaken: "" });
                }}
                style={{
                  padding: "8px 16px",
                  background: "#64748b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      <section
        style={{
          marginBottom: "16px",
          padding: "20px",
          background: "#fef2f2",
          border: "2px solid #fecaca",
          borderRadius: "10px",
        }}
      >
        <div style={{ fontSize: "13px", color: "#991b1b", marginBottom: "8px", fontWeight: 600 }}>
          Emergency
        </div>
        <p style={{ fontSize: "14px", color: "#b91c1c", marginBottom: "12px" }}>
          Use only in case of immediate danger. Command center will be notified.
        </p>
        <div style={{ marginBottom: "12px", fontSize: "14px", color: "#7f1d1d" }}>
          Status: <strong>{status}</strong>
        </div>
        <button
          onClick={sendSOS}
          style={{
            width: "100%",
            padding: "20px 24px",
            fontSize: "18px",
            fontWeight: 700,
            backgroundColor: "#dc2626",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)",
          }}
        >
          SEND SOS
        </button>
      </section>
    </div>
  );
}

export default App;

window.addEventListener("online", async () => {
  const saved = localStorage.getItem("pendingSOS");
  if (!saved) return;
  try {
    const res = await fetch("http://localhost:5000/api/sos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: saved,
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.acknowledged === true) {
      localStorage.removeItem("pendingSOS");
      window.dispatchEvent(new CustomEvent("sosSynced"));
    }
  } catch (_) {}
});
