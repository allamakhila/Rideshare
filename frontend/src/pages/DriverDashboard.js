import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DriverDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("bookings");

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#b3d9ff",
      padding: "40px",
      fontFamily: "Arial, sans-serif"
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
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    },
    navButtons: {
      marginBottom: "25px"
    },
    button: {
      padding: "10px 18px",
      marginRight: "10px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      backgroundColor: "#2196F3",
      color: "white"
    },
    card: {
      backgroundColor: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
    }
  };

  const logout = () => {
  localStorage.removeItem("loggedInUser");
  navigate("/");
};

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Driver Dashboard</div>
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      <div style={styles.navButtons}>
        <button
          style={styles.button}
          onClick={() => navigate("/post-ride")}
        >
          Post a Ride
        </button>

        <button
          style={styles.button}
          onClick={() => navigate("/bookings-received")}
        >
          Bookings Received
        </button>
      </div>

      <div style={styles.card}>
        {activeSection === "post" ? (
          <p>Click "Post a Ride" to add a new ride.</p>
        ) : (
          <>
            <h3>Bookings Received</h3>
            <p>Passengers who booked your rides will appear here.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default DriverDashboard;