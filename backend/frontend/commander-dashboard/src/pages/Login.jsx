import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      localStorage.setItem("drishti_token", data.token);
      localStorage.setItem("drishti_role", data.role);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f8",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          background: "#fff",
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ margin: "0 0 24px 0", fontSize: "1.5rem", color: "#1a1a1a" }}>
          Commander Login
        </h1>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "14px", color: "#333" }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              marginBottom: "16px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "14px", color: "#333" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />
          {error && (
            <p style={{ color: "#c62828", fontSize: "14px", margin: "0 0 16px 0" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#90a4ae" : "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
