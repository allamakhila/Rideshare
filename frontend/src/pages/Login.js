import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg,#667eea,#764ba2)",
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
      background: "linear-gradient(90deg,#00c6ff,#0072ff)",
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
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        { email, password }
      );

      const { token, role, name } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ name: name, email: email, role: role })
      );

      alert("Login Successful!");

      if (role === "DRIVER") {
        navigate("/driver");
      } else {
        navigate("/passenger");
      }

    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleLogin}>
        <div style={styles.title}>Login</div>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <div style={styles.inputWrapper}>
            <input
              type="email"
              placeholder="Enter your email"
              required
              style={styles.input}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>

          <div style={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              style={styles.input}
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
          Login
        </button>

        <div style={styles.link} onClick={() => navigate("/register")}>
          Create an Account
        </div>
      </form>
    </div>
  );
}

export default Login;