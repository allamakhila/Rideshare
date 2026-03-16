import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("PASSENGER");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    contact: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
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
      padding: "40px 35px",
      borderRadius: "18px",
      width: "400px",
      boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },

    title: {
      fontSize: "28px",
      fontWeight: "600",
      textAlign: "center",
      color: "white",
      marginBottom: "10px",
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
  boxSizing: "border-box",
},

    eye: {
      position: "absolute",
      right: "15px",
      cursor: "pointer",
      color: "#444",
      fontSize: "16px",
    },

    roleContainer: {
      display: "flex",
      gap: "10px",
      marginTop: "5px",
    },

    roleBtn: {
      flex: 1,
      padding: "10px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      background: "rgba(255,255,255,0.8)",
      fontWeight: "500",
    },

    activeRole: {
      background: "linear-gradient(90deg,#00c6ff,#0072ff)",
      color: "white",
    },

    button: {
      width: "100%",
      padding: "13px",
      marginTop: "8px",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(90deg,#00c6ff,#0072ff)",
      color: "white",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.placeholder]: e.target.value });
  };

  const handleSendOtp = async () => {
    try {
      await axios.post("http://localhost:8081/api/auth/send-otp", {
        email: formData.email,
      });

      alert("OTP sent to your email!");
      setOtpSent(true);
    } catch (error) {
      console.log("Full error:", error);

      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Server not reachable");
      }
    }
  };

  const handleVerifyAndRegister = async () => {
    try {
      await axios.post("http://localhost:8081/api/auth/verify-otp", {
        email: formData.email,
        otp: otp,
      });

      await axios.post("http://localhost:8081/api/auth/register", {
        ...formData,
        role: role,
      });

      alert("Registered Successfully!");
      navigate("/login");

    } catch (error) {
      alert("Invalid OTP or Registration Failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>Create Account</div>

        <input
          style={styles.input}
          placeholder="fullName"
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="email"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <div style={styles.inputWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            style={styles.input}
            placeholder="password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <span
            style={styles.eye}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <input
          style={styles.input}
          placeholder="contact"
          onChange={(e) =>
            setFormData({ ...formData, contact: e.target.value })
          }
        />

        <div style={styles.roleContainer}>
          <button
            type="button"
            style={{
              ...styles.roleBtn,
              ...(role === "PASSENGER" ? styles.activeRole : {}),
            }}
            onClick={() => setRole("PASSENGER")}
          >
            Passenger
          </button>

          <button
            type="button"
            style={{
              ...styles.roleBtn,
              ...(role === "DRIVER" ? styles.activeRole : {}),
            }}
            onClick={() => setRole("DRIVER")}
          >
            Driver
          </button>
        </div>

        {!otpSent ? (
          <button style={styles.button} onClick={handleSendOtp}>
            Send OTP
          </button>
        ) : (
          <>
            <input
              style={styles.input}
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />

            <button style={styles.button} onClick={handleVerifyAndRegister}>
              Verify & Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;