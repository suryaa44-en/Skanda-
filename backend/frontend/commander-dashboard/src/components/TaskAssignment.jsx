import { useEffect, useState } from "react";

function TaskAssignment() {
  const [missions, setMissions] = useState([]);
  const [responders, setResponders] = useState([]);
  const [missionId, setMissionId] = useState("");
  const [responderId, setResponderId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/missions")
      .then(res => res.ok ? res.json() : [])
      .then(data => setMissions(Array.isArray(data) ? data : []))
      .catch(() => setMissions([]));
    fetch("http://localhost:5000/api/responders")
      .then(res => res.ok ? res.json() : [])
      .then(data => setResponders(Array.isArray(data) ? data : []))
      .catch(() => setResponders([]));
  }, []);

  const handleAssign = (e) => {
    e.preventDefault();
    if (!missionId || !responderId || !description.trim()) return;
    setError(null);
    setMessage("");
    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ missionId, responderId, description: description.trim() })
    })
      .then(res => {
        if (!res.ok) throw new Error("Assign failed");
        setDescription("");
        setMessage("Task assigned.");
      })
      .catch(err => {
        console.error(err);
        setError("Assign failed");
      });
  };

  return (
    <div>
      <h2>📋 Task Assignment</h2>
      <form onSubmit={handleAssign} style={{ marginBottom: "12px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>Mission</label>
          <select value={missionId} onChange={(e) => setMissionId(e.target.value)} style={{ padding: "8px", minWidth: "160px" }} required>
            <option value="">Select mission</option>
            {missions.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>Responder</label>
          <select value={responderId} onChange={(e) => setResponderId(e.target.value)} style={{ padding: "8px", minWidth: "160px" }} required>
            <option value="">Select responder</option>
            {responders.map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task description" style={{ padding: "8px", width: "200px" }} required />
        </div>
        <button type="submit" style={{ padding: "8px 16px", background: "#2e7d32", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Assign Task</button>
      </form>
      {error && <p style={{ color: "red", margin: "0 0 8px 0" }}>⚠️ {error}</p>}
      {message && <p style={{ color: "green", margin: "0 0 8px 0" }}>{message}</p>}
      {responders.length === 0 && <p style={{ color: "#666", fontSize: "14px" }}>No responders yet. Add responders via API to assign tasks.</p>}
    </div>
  );
}

export default TaskAssignment;
