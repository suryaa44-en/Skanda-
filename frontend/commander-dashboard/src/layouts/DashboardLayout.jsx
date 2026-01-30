function DashboardLayout({ children, activeItem = "", onNav, onLogout }) {
  const navItems = [
    { key: "missions", label: "Missions", icon: "📌" },
    { key: "tasks", label: "Tasks", icon: "📋" },
    { key: "sos", label: "SOS Alerts", icon: "🚨" },
    { key: "insights", label: "AI Insights", icon: "🧠" },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          background: "#1e293b",
          color: "#e2e8f0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid #334155",
            fontSize: "1.125rem",
            fontWeight: 700,
          }}
        >
          Drishti-NE
        </div>
        <nav style={{ flex: 1, padding: "16px 0" }}>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {navItems.map((item) => {
              const isActive = activeItem === item.key;
              return (
                <li key={item.key} style={{ marginBottom: "4px" }}>
                  <button
                    type="button"
                    onClick={() => onNav && onNav(item.key)}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      border: "none",
                      background: isActive ? "#334155" : "transparent",
                      color: isActive ? "#fff" : "#94a3b8",
                      cursor: onNav ? "pointer" : "default",
                      textAlign: "left",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxSizing: "border-box",
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #334155" }}>
          <button
            type="button"
            onClick={() => onLogout && onLogout()}
            style={{
              width: "100%",
              padding: "12px 20px",
              border: "none",
              background: "transparent",
              color: "#94a3b8",
              cursor: onLogout ? "pointer" : "default",
              textAlign: "left",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxSizing: "border-box",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>⎋</span>
            Logout
          </button>
        </div>
      </aside>
      <main
        style={{
          flex: 1,
          overflow: "auto",
          padding: "24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: 0,
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            flex: 1,
          }}
        >
          {children}
        </div>
        <footer
          style={{
            maxWidth: "1000px",
            marginTop: "16px",
            padding: "16px 24px",
            background: "#f1f5f9",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#475569",
          }}
        >
          <strong style={{ display: "block", marginBottom: "8px", color: "#334155" }}>
            Ethics &amp; Governance
          </strong>
          <p style={{ margin: "0 0 6px 0" }}>
            DPDP Act aligned. No surveillance. No profiling. Minimal data collection. AI provides recommendations only; final decisions are made by human commanders.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default DashboardLayout;
