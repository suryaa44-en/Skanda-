import { useEffect, useState } from "react";

const API_SOS = "http://localhost:5000/api/sos";
const REFRESH_MS = 5000;

function SosAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    fetch(API_SOS)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch SOS");
        return res.json();
      })
      .then((data) => {
        setAlerts(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("SOS service unavailable");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (str) => {
    if (!str) return "—";
    try {
      const d = new Date(str);
      return d.toLocaleString();
    } catch {
      return str;
    }
  };

  const isOffline = (sos) =>
    sos.deliveryMode === "SMS_FALLBACK" || sos.offline === true;
  const deliveryLabel = (sos) =>
    isOffline(sos) ? "SMS fallback (offline)" : "Direct (online)";

  // Group by responderId + missionId for visual grouping (no state merging)
  const groupKey = (sos) => `${sos.responderId || ""}|${sos.missionId || ""}`;
  const groups = alerts.reduce((acc, sos) => {
    const key = groupKey(sos);
    if (!acc[key]) acc[key] = [];
    acc[key].push(sos);
    return acc;
  }, {});
  const groupEntries = Object.entries(groups);

  return (
    <div>
      <h1 style={{ margin: "0 0 24px 0", fontSize: "1.5rem", color: "#1a1a1a" }}>
        SOS Alerts
      </h1>
      <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "14px" }}>
        Auto-refreshes every 5 seconds.
      </p>

      <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#64748b", fontStyle: "italic" }}>
        Live reconciliation pending – MVP limitation.
      </p>

      {error && (
        <p style={{ color: "#c62828", marginBottom: "16px", fontSize: "14px" }}>
          ⚠️ {error}
        </p>
      )}

      {loading && alerts.length === 0 ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>Loading…</p>
      ) : alerts.length === 0 ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>No SOS alerts.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {groupEntries.map(([key, groupAlerts]) => (
            <div
              key={key}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                overflow: "hidden",
                background: "#fafafa",
              }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  background: "#f1f5f9",
                  borderBottom: "1px solid #e2e8f0",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                Responder {groupAlerts[0]?.responderId || "—"} · Mission {groupAlerts[0]?.missionId || "—"}
                {groupAlerts.length > 1 && (
                  <span style={{ marginLeft: "8px", fontWeight: 500, color: "#64748b" }}>
                    ({groupAlerts.length} alert{groupAlerts.length !== 1 ? "s" : ""})
                  </span>
                )}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {groupAlerts.map((sos) => (
                  <li
                    key={sos.id}
                    style={{
                      padding: "20px",
                      background: "#fef2f2",
                      border: "2px solid #dc2626",
                      borderRadius: "8px",
                      color: "#991b1b",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "16px",
                        fontWeight: 700,
                        fontSize: "1rem",
                      }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>🚨</span>
                      SOS Alert (static snapshot)
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gap: "10px",
                        fontSize: "14px",
                        color: "#b91c1c",
                      }}
                    >
                      <div>
                        <strong>Responder ID:</strong>{" "}
                        <span style={{ fontFamily: "monospace" }}>{sos.responderId || "—"}</span>
                      </div>
                      <div>
                        <strong>Mission ID:</strong>{" "}
                        <span style={{ fontFamily: "monospace" }}>{sos.missionId || "—"}</span>
                      </div>
                      <div>
                        <strong>Location:</strong> {sos.location || "—"}
                      </div>
                      <div>
                        <strong>Sent status:</strong>{" "}
                        {isOffline(sos) ? (
                          <span style={{ color: "#dc2626", fontWeight: 600 }}>OFFLINE</span>
                        ) : (
                          <span style={{ color: "#15803d", fontWeight: 600 }}>ONLINE</span>
                        )}
                      </div>
                      <div>
                        <strong>Delivery method:</strong> {deliveryLabel(sos)}
                      </div>
                      <div>
                        <strong>Acknowledged:</strong>{" "}
                        {sos.acknowledged === true ? (
                          <span style={{ color: "#15803d", fontWeight: 600 }}>YES</span>
                        ) : (
                          <span style={{ color: "#64748b" }}>—</span>
                        )}
                      </div>
                      <div>
                        <strong>Time:</strong> {formatDate(sos.createdAt)}
                      </div>
                      <div>
                        <strong>Status:</strong> {sos.status || "—"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SosAlerts;
