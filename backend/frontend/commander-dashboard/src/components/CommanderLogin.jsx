import { useState } from "react";

function CommanderLogin({ onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const user = { role: "commander", name: name.trim() };
    localStorage.setItem("drishti_user", JSON.stringify(user));
    onLogin(user);
  };

  return (
    <div style={{ maxWidth: "360px", margin: "40px auto", padding: "24px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h1 style={{ marginBottom: "16px" }}>Commander Login</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={{ width: "100%", padding: "10px 12px", marginBottom: "16px", border: "1px solid #ccc", borderRadius: "6px", boxSizing: "border-box" }}
        />
        <button
          type="submit"
          style={{ width: "100%", padding: "12px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}
        >
          Login as Commander
        </button>
      </form>
    </div>
  );
}

export default CommanderLogin;
