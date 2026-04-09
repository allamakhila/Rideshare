import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaCar, FaEnvelope, FaLock } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
    },
    
    // Animated background elements
    bgCircle1: {
      position: "absolute",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      top: "-100px",
      right: "-100px",
      opacity: 0.3,
      animation: "float 6s ease-in-out infinite",
    },
    
    bgCircle2: {
      position: "absolute",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      bottom: "-150px",
      left: "-150px",
      opacity: 0.3,
      animation: "float 8s ease-in-out infinite reverse",
    },
    
    card: {
      background: "rgba(255,255,255,0.98)",
      backdropFilter: "blur(0px)",
      padding: "48px 40px",
      borderRadius: "32px",
      width: "420px",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      zIndex: 10,
      transition: "transform 0.3s ease",
    },
    
    logoSection: {
      textAlign: "center",
      marginBottom: "8px",
    },
    
    logoIcon: {
      fontSize: "48px",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      width: "70px",
      height: "70px",
      borderRadius: "20px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px",
      boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.3)",
    },
    
    title: {
      fontSize: "32px",
      fontWeight: "700",
      textAlign: "center",
      color: "#0f172a",
      marginBottom: "8px",
      letterSpacing: "-0.5px",
    },
    
    subtitle: {
      fontSize: "14px",
      textAlign: "center",
      color: "#64748b",
      marginBottom: "8px",
    },
    
    field: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "100%",
    },
    
    label: {
      fontSize: "14px",
      color: "#334155",
      fontWeight: "600",
      letterSpacing: "0.3px",
    },
    
    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    
    inputIcon: {
      position: "absolute",
      left: "16px",
      color: "#94a3b8",
      fontSize: "18px",
    },
    
    input: {
      width: "100%",
      padding: "14px 45px 14px 48px",
      borderRadius: "14px",
      border: "2px solid #e2e8f0",
      outline: "none",
      fontSize: "15px",
      background: "#ffffff",
      transition: "all 0.3s ease",
      fontWeight: "500",
      color: "#0f172a",
    },
    
    inputFocus: {
      border: "2px solid #6366f1",
      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
    },
    
    eye: {
      position: "absolute",
      right: "16px",
      cursor: "pointer",
      color: "#94a3b8",
      fontSize: "18px",
      transition: "color 0.2s",
    },
    
    button: {
      marginTop: "8px",
      padding: "14px",
      borderRadius: "14px",
      border: "none",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      color: "white",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      letterSpacing: "0.5px",
      transition: "all 0.3s ease",
      boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.4)",
    },
    
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.5)",
    },
    
    buttonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
    },
    
    link: {
      textAlign: "center",
      marginTop: "8px",
      color: "#6366f1",
      fontSize: "14px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "color 0.2s",
      textDecoration: "none",
    },
    
    adminLink: {
      textAlign: "center",
      marginTop: "16px",
      fontSize: "12px",
      color: "#94a3b8",
      cursor: "pointer",
      transition: "color 0.2s",
      textDecoration: "none",
      borderTop: "1px solid #e2e8f0",
      paddingTop: "16px",
    },
    
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "#94a3b8",
      fontSize: "12px",
      marginTop: "8px",
    },
    
    dividerLine: {
      flex: 1,
      height: "1px",
      background: "#e2e8f0",
    },
  };

  const [inputFocus, setInputFocus] = useState({
    email: false,
    password: false,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        { email, password }
      );

      const { token, role, name, id } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ id: id, name: name, email: email, role: role })
      );

      // Show success message
      alert("Login Successful! Welcome back!");

      if (role === "DRIVER") {
        navigate("/driver");
      } else {
        navigate("/passenger");
      }
    } catch (error) {
      alert("Invalid Credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />
      
      <form style={styles.card} onSubmit={handleLogin}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            <FaCar style={{ fontSize: "32px", color: "white" }} />
          </div>
          <div style={styles.title}>Welcome Back</div>
          <div style={styles.subtitle}>Sign in to continue your journey</div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email Address</label>
          <div style={styles.inputWrapper}>
            <FaEnvelope style={styles.inputIcon} />
            <input
              type="email"
              placeholder="Enter your email"
              required
              style={{
                ...styles.input,
                ...(inputFocus.email ? styles.inputFocus : {}),
              }}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setInputFocus({ ...inputFocus, email: true })}
              onBlur={() => setInputFocus({ ...inputFocus, email: false })}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <div style={styles.inputWrapper}>
            <FaLock style={styles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              style={{
                ...styles.input,
                ...(inputFocus.password ? styles.inputFocus : {}),
              }}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setInputFocus({ ...inputFocus, password: true })}
              onBlur={() => setInputFocus({ ...inputFocus, password: false })}
            />
            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(isLoading ? styles.buttonDisabled : {}),
          }}
          disabled={isLoading}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(99, 102, 241, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 20px -5px rgba(99, 102, 241, 0.4)";
          }}
        >
          {isLoading ? "Logging in..." : "Sign In"}
        </button>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span>New here?</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.link} onClick={() => navigate("/register")}>
          Create an Account →
        </div>

        <div style={styles.adminLink}>
          <a href="/admin/login" style={{ color: "#94a3b8", textDecoration: "none" }}>
            🔐 Admin Access
          </a>
        </div>
      </form>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        form {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;