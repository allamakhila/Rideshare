import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg,#1e293b,#0f172a)", // Darker gradient for admin
      fontFamily: "Segoe UI, sans-serif",
    },

    card: {
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(12px)",
      padding: "45px 35px",
      borderRadius: "18px",
      width: "380px",
      boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },

    title: {
      fontSize: "30px",
      fontWeight: "600",
      textAlign: "center",
      color: "white",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px"
    },

    field: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      width: "100%",
    },

    label: {
      fontSize: "14px",
      color: "white",
      fontWeight: "500",
    },

    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    input: {
      width: "100%",
      padding: "14px 45px 14px 16px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.4)",
      outline: "none",
      fontSize: "14px",
      background: "rgba(255,255,255,0.95)",
      boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
      transition: "0.3s",
    },

    eye: {
      position: "absolute",
      right: "15px",
      cursor: "pointer",
      color: "#444",
      fontSize: "16px",
    },

    button: {
      marginTop: "10px",
      padding: "13px",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(90deg,#f59e0b,#d97706)", // Orange gradient for admin
      color: "white",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      letterSpacing: "0.5px",
    },

    link: {
      textAlign: "center",
      marginTop: "10px",
      color: "white",
      fontSize: "14px",
      cursor: "pointer",
      textDecoration: "underline",
    },

    error: {
      color: "#fee2e2",
      backgroundColor: "rgba(239, 68, 68, 0.3)",
      padding: "10px",
      borderRadius: "8px",
      textAlign: "center",
      fontSize: "14px",
    },

    backLink: {
      textAlign: "center",
      marginTop: "15px",
      color: "#94a3b8",
      fontSize: "13px",
      cursor: "pointer",
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login", // Same endpoint but will check role
        { email, password }
      );

      const { token, role, name, id } = response.data;

      // ✅ IMPORTANT: Check if user is ADMIN
      if (role !== "ADMIN") {
        setError("Access denied. Admin privileges required.");
        return;
      }

      // Store admin session separately
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify({ 
        id, 
        name, 
        email, 
        role 
      }));

      alert("Admin Login Successful!");
      navigate("/admin/dashboard");

    } catch (error) {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleAdminLogin}>
        <div style={styles.title}>
          <span>🔐</span> Admin Login
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Admin Email</label>
          <div style={styles.inputWrapper}>
            <input
              type="email"
              placeholder="Enter admin email"
              required
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <div style={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              required
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="submit" style={styles.button}>
          Login as Admin
        </button>

        <div style={styles.link} onClick={() => navigate("/register")}>
          Create Admin Account
        </div>

        <div style={styles.backLink} onClick={() => navigate("/")}>
          ← Back to User Login
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;