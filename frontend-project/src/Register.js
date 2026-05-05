import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, UserPlus, Eye, EyeOff, AlertCircle, Package } from "lucide-react";

function Register() {
  const [data, setData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    if (!data.username || !data.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/register", data);

      if (res.data.success) {
        // Immediate redirect to login route
        navigate("/");
      } else {
        // Only show message if registration actually fails (e.g. user exists)
        setError(res.data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleRegister(); };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "0.75rem 1rem 0.75rem 2.75rem",
    color: "#f1f5f9",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f4c75 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: "420px" }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "64px", height: "64px", borderRadius: "18px",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            marginBottom: "1rem",
            boxShadow: "0 8px 32px rgba(59,130,246,0.4)",
          }}>
            <Package size={32} color="white" />
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.75rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.25rem" }}>
            SIMS System
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
            Create your account to get started
          </p>
        </div>

        {/* Register Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "2rem" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: "600", color: "#f1f5f9", margin: "0 0 0.375rem" }}>
            Create Account
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 1.75rem" }}>
            Fill in your details below to register
          </p>

          {/* Error Message Display */}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", padding: "0.75rem 1rem", marginBottom: "1.25rem" }}>
              <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0 }} />
              <span style={{ color: "#f87171", fontSize: "0.875rem" }}>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "500", color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase" }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <User size={16} color="#475569" />
              </div>
              <input
                type="text"
                placeholder="Choose a username"
                value={data.username}
                style={inputStyle}
                autoFocus
                onKeyDown={handleKeyDown}
                onChange={(e) => setData({ ...data, username: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "500", color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <Lock size={16} color="#475569" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={data.password}
                style={{ ...inputStyle, paddingRight: "3rem" }}
                onKeyDown={handleKeyDown}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 0 }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              background: loading ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #3b82f6, #06b6d4)",
              border: "none", borderRadius: "12px", padding: "0.85rem", color: "white", fontSize: "0.95rem", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Processing..." : <><UserPlus size={17} />Create Account</>}
          </button>

          <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.875rem", color: "#64748b" }}>
            Already have an account? <Link to="/" style={{ color: "#38bdf8", fontWeight: "500", textDecoration: "none" }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
