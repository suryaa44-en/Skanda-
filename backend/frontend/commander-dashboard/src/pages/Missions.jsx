import { useEffect, useState } from "react";

function Missions() {
  const [missions, setMissions] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [disasterType, setDisasterType] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchMissions = () => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:5000/api/missions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch missions");
        return res.json();
      })
      .then((data) => setMissions(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setError("Unable to load missions.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim() || !region.trim() || !disasterType.trim()) return;
    setSubmitting(true);
    setError(null);
    fetch("http://localhost:5000/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        region: region.trim(),
        disasterType: disasterType.trim(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Create failed");
        setName("");
        setRegion("");
        setDisasterType("");
        fetchMissions();
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to create mission.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px 0", fontSize: "1.5rem", color: "#1a1a1a" }}>
        Missions
      </h1>

      <form
        onSubmit={handleCreate}
        style={{
          marginBottom: "24px",
          padding: "20px",
          background: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <h2 style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "#475569" }}>
          Create mission
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "flex-end",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mission name"
              disabled={submitting}
              style={{
                padding: "8px 12px",
                width: "160px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Region
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Region"
              disabled={submitting}
              style={{
                padding: "8px 12px",
                width: "140px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Disaster type
            </label>
            <input
              type="text"
              value={disasterType}
              onChange={(e) => setDisasterType(e.target.value)}
              placeholder="e.g. Flood, Earthquake"
              disabled={submitting}
              style={{
                padding: "8px 12px",
                width: "160px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "8px 16px",
              background: submitting ? "#94a3b8" : "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Creating…" : "Create mission"}
          </button>
        </div>
      </form>

      {error && (
        <p style={{ color: "#c62828", marginBottom: "16px", fontSize: "14px" }}>
          ⚠️ {error}
        </p>
      )}

      <h2 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#475569" }}>
        Mission list
      </h2>
      {loading ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>Loading…</p>
      ) : missions.length === 0 ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>No missions yet.</p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {missions.map((m) => (
            <li
              key={m.id}
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #e2e8f0",
                background: "#fff",
              }}
            >
              <strong>{m.name}</strong> — {m.region} ({m.disasterType})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Missions;
