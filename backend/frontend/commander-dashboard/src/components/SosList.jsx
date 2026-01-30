import { useEffect, useState } from "react";

function SosList() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/sos")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch SOS");
        return res.json();
      })
      .then(data => setAlerts(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        setError("SOS service unavailable");
      });
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>⚠️ {error}</p>;
  }

  return (
    <div>
      <h2>🚨 SOS Alerts</h2>
      {alerts.length === 0 && <p>No SOS alerts</p>}
      <ul>
        {alerts.map(sos => (
          <li key={sos.id} style={{ color: "red" }}>
            Responder: {sos.responderId} | Location: {sos.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SosList;
