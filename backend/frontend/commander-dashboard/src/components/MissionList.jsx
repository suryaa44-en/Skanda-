import { useEffect, useState } from "react";

function MissionList() {
  const [missions, setMissions] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [disasterType, setDisasterType] = useState("");

  const fetchMissions = () => {
    fetch("http://localhost:5000/api/missions")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch missions");
        return res.json();
      })
      .then(data => setMissions(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        setError("Backend not reachable");
      });
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim() || !region.trim() || !disasterType.trim()) return;
    fetch("http://localhost:5000/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), region: region.trim(), disasterType: disasterType.trim() })
    })
      .then(res => {
        if (!res.ok) throw new Error("Create failed");
        setName("");
        setRegion("");
        setDisasterType("");
        fetchMissions();
      })
      .catch(err => {
        console.error(err);
        setError("Create failed");
      });
  };

  if (error) {
    return <p style={{ color: "red" }}>⚠️ {error}</p>;
  }

  return (
    <div>
      <h2>📌 Active Missions</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mission name" style={{ padding: "8px", width: "140px" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>Region</label>
          <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Region" style={{ padding: "8px", width: "120px" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>Disaster type</label>
          <input type="text" value={disasterType} onChange={(e) => setDisasterType(e.target.value)} placeholder="e.g. Flood" style={{ padding: "8px", width: "120px" }} />
        </div>
        <button type="submit" style={{ padding: "8px 16px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Create Mission</button>
      </form>
      {missions.length === 0 && <p>No missions available</p>}
      <ul>
        {missions.map(m => (
          <li key={m.id}>
            <strong>{m.name}</strong> — {m.region} ({m.disasterType})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MissionList;
