import { useEffect, useState } from "react";

function AiInsights() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/ai/mission-risk")
      .then(res => {
        if (!res.ok) throw new Error("AI service failed");
        return res.json();
      })
      .then(d => setData(Array.isArray(d) ? d : []))
      .catch(err => {
        console.error(err);
        setError("AI insights unavailable");
      });
  }, []);

  if (error) {
    return <p style={{ color: "orange" }}>⚠️ {error}</p>;
  }

  return (
    <div>
      <h2>🧠 AI Risk Insights</h2>
      {data.length === 0 && <p>No AI insights yet</p>}
      <ul>
        {data.map(item => (
          <li key={item.missionId}>
            {item.missionName} — Risk: {item.analysis.level}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AiInsights;
