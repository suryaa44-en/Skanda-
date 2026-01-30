import { useEffect, useState } from "react";

const API_TASKS = "http://localhost:5000/api/tasks";

function getResponderId() {
  const id = localStorage.getItem("drishti_responder_id");
  if (id) return id;
  try {
    const user = localStorage.getItem("drishti_user");
    if (user) {
      const u = JSON.parse(user);
      if (u.responderId) return u.responderId;
    }
  } catch (_) {}
  return null;
}

function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const responderId = getResponderId();

  const fetchTasks = () => {
    if (!responderId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(API_TASKS)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setTasks(list.filter((t) => t.responderId === responderId));
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load tasks.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, [responderId]);

  const handleMarkComplete = (taskId) => {
    if (!taskId) return;
    setUpdatingId(taskId);
    fetch(`${API_TASKS}/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED" }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        fetchTasks();
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to update task.");
      })
      .finally(() => setUpdatingId(null));
  };

  if (!responderId) {
    return (
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        <p>No responder session. Please log in again.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "480px", margin: "0 auto" }}>
      <h1
        style={{
          margin: "0 0 24px 0",
          fontSize: "1.5rem",
          color: "#1a1a1a",
        }}
      >
        My tasks
      </h1>

      {error && (
        <p
          style={{
            color: "#c62828",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          ⚠️ {error}
        </p>
      )}

      {loading ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>Loading…</p>
      ) : tasks.length === 0 ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>
          No tasks assigned yet.
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
          {tasks.map((task) => {
            const isComplete = (task.status || "").toUpperCase() === "COMPLETED";
            const isUpdating = updatingId === task.id;
            return (
              <li
                key={task.id}
                style={{
                  padding: "16px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Status: <strong>{task.status || "—"}</strong>
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#1e293b",
                    marginBottom: "12px",
                  }}
                >
                  {task.description || "—"}
                </div>
                {!isComplete && (
                  <button
                    type="button"
                    onClick={() => handleMarkComplete(task.id)}
                    disabled={isUpdating}
                    style={{
                      padding: "8px 16px",
                      background: isUpdating ? "#94a3b8" : "#0284c7",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: isUpdating ? "not-allowed" : "pointer",
                    }}
                  >
                    {isUpdating ? "Updating…" : "Mark complete"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Home;
