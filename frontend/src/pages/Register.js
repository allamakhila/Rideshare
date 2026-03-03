import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#b3d9ff",
      fontFamily: "Arial, sans-serif",
    },
    card: {
      backgroundColor: "#e6f2ff",
      padding: "35px",
      borderRadius: "12px",
      width: "400px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
      textAlign: "center",
    },
    title: {
      fontSize: "26px",
      fontWeight: "600",
      marginBottom: "15px",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "8px 0",
      borderRadius: "6px",
      border: "1px solid #ddd",
    },
    roleContainer: {
      display: "flex",
      margin: "10px 0",
    },
    roleBtn: {
      flex: 1,
      padding: "8px",
      cursor: "pointer",
      border: "1px solid #ccc",
      backgroundColor: "#f0f0f0",
    },
    activeRole: {
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
    },
    button: {
      width: "100%",
      padding: "10px",
      marginTop: "10px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.placeholder]: e.target.value });
  };

  // Step 1: Send OTP
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

  // Step 2: Verify OTP + Register
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

        <input
          type="password"
          style={styles.input}
          placeholder="password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="contact"
          onChange={(e) =>
            setFormData({ ...formData, contact: e.target.value })
          }
        />

        {/* Role Selection */}
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