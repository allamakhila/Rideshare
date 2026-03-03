import React from "react";
import { useNavigate } from "react-router-dom";
import carBg from "../assets/car-bg.png";

function Home() {
  const navigate = useNavigate();

  const styles = {
    container: {
      height: "100vh",
      width: "100%",
      backgroundImage: `url(${carBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      fontFamily: "Arial, sans-serif",
    },

    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      textAlign: "center",
      padding: "20px",
    },

    topButtons: {
      position: "absolute",
      top: "20px",
      right: "40px",
      display: "flex",
      gap: "15px",
    },

    button: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      transition: "0.3s",
    },

    loginBtn: {
      backgroundColor: "transparent",
      border: "2px solid white",
      color: "white",
    },

    registerBtn: {
      backgroundColor: "#ff9800",
      color: "white",
    },

    title: {
      fontSize: "56px",
      fontWeight: "bold",
      marginBottom: "20px",
    },

    subtitle: {
      fontSize: "20px",
      margin: "5px 0",
      maxWidth: "600px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        
        {/* Top Buttons */}
        <div style={styles.topButtons}>
          <button
            style={{ ...styles.button, ...styles.loginBtn }}
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            style={{ ...styles.button, ...styles.registerBtn }}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

        {/* Main Content */}
        <h1 style={styles.title}>Ride Sharing</h1>

        <p style={styles.subtitle}>
          Travel smarter with shared mobility solutions.
        </p>

        <p style={styles.subtitle}>
          Safe, efficient, and sustainable journeys — connecting people and destinations effortlessly.
        </p>
      </div>
    </div>
  );
}

export default Home;