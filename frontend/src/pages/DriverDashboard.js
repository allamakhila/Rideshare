import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BookingsReceived from "./BookingsReceived";

function DriverDashboard() {

  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("bookings");

  const styles = {
    container: {
      padding: "30px",
      fontFamily: "Segoe UI, sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg,#c7d2fe,#a5b4fc,#c4b5fd)"
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px"
    },

    title: {
      fontSize: "28px",
      fontWeight: "600"
    },

    logoutBtn: {
      padding: "10px 18px",
      background: "linear-gradient(90deg,#6366f1,#4f46e5)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      boxShadow: "0 3px 8px rgba(0,0,0,0.15)"
    },

    navButtons: {
      marginBottom: "25px"
    },

    button: {
      padding: "10px 18px",
      background: "linear-gradient(90deg,#6366f1,#4f46e5)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginRight: "10px",
      fontWeight: "500",
      boxShadow: "0 3px 8px rgba(0,0,0,0.15)"
    },

    card: {
      background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
    }
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>Driver Dashboard</div>
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      {/* Navigation */}
      <div style={styles.navButtons}>
        <button
          style={styles.button}
          onClick={() => navigate("/post-ride")}
        >
          Post a Ride
        </button>

        <button
          style={styles.button}
          onClick={() => setActiveSection("bookings")}
        >
          Bookings Received
        </button>

        <Link to="/transactions">
          <button style={styles.button}>
            Transaction History
          </button>
        </Link>
      </div>

      {/* Main Card */}
      <div style={styles.card}>

        {activeSection === "bookings" ? (
          <BookingsReceived />
        ) : (
          <p>Click "Post a Ride" to add a new ride.</p>
        )}

      </div>

    </div>
  );
}

export default DriverDashboard;