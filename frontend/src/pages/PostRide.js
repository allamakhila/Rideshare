import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCar, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaRupeeSign, FaTachometerAlt, FaIdCard, FaArrowLeft, FaPlusCircle } from "react-icons/fa";

function PostRide() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const [loading, setLoading] = useState(false);

  const [ride, setRide] = useState({
    source: "",
    destination: "",
    date: "",
    availableSeats: "",
    price: "",
    vehicleType: "",
    licensePlate: ""
  });

  const handleChange = (e) => {
    setRide({ ...ride, [e.target.name]: e.target.value });
  };

  const getCoordinates = async (place) => {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
    );
    if (res.data.length > 0) {
      return {
        lat: parseFloat(res.data[0].lat),
        lon: parseFloat(res.data[0].lon)
      };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sourceCoords = await getCoordinates(ride.source);
      const destCoords = await getCoordinates(ride.destination);

      if (!sourceCoords || !destCoords) {
        alert("Could not find location coordinates. Please enter valid city names.");
        setLoading(false);
        return;
      }

      await axios.post(
        "http://localhost:8081/api/rides",
        {
          ...ride,
          availableSeats: Number(ride.availableSeats),
          driverEmail: loggedInUser?.email,
          sourceLat: sourceCoords.lat,
          sourceLng: sourceCoords.lon,
          destinationLat: destCoords.lat,
          destinationLng: destCoords.lon
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      alert("Ride Posted Successfully!");
      navigate("/driver");

    } catch (error) {
      console.error("Error posting ride:", error);
      alert("Failed to post ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      padding: "40px 20px",
    },
    mainContent: {
      maxWidth: "600px",
      margin: "0 auto",
    },
    card: {
      background: "white",
      borderRadius: "28px",
      padding: "32px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    },
    header: {
      textAlign: "center",
      marginBottom: "28px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
    subtitle: {
      fontSize: "14px",
      color: "#64748b",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },
    inputGroup: {
      position: "relative",
    },
    inputIcon: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#3b82f6",
      fontSize: "16px",
    },
    input: {
      width: "100%",
      padding: "14px 16px 14px 48px",
      borderRadius: "14px",
      border: "2px solid #e2e8f0",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.3s",
      color: "#1e293b",
      fontWeight: "500",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "14px 16px 14px 48px",
      borderRadius: "14px",
      border: "2px solid #e2e8f0",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.3s",
      color: "#1e293b",
      fontWeight: "500",
      fontFamily: "inherit",
      resize: "vertical",
      boxSizing: "border-box",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    button: {
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      color: "white",
      border: "none",
      borderRadius: "14px",
      padding: "14px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.3s ease",
      marginTop: "8px",
    },
    backButton: {
      background: "#64748b",
      color: "white",
      border: "none",
      borderRadius: "14px",
      padding: "12px 20px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
      marginTop: "16px",
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "#94a3b8",
      fontSize: "12px",
      margin: "8px 0",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      background: "#e2e8f0",
    },
  };

  const formFields = [
    { name: "source", placeholder: "From where?", icon: FaMapMarkerAlt, type: "text" },
    { name: "destination", placeholder: "Going to?", icon: FaMapMarkerAlt, type: "text" },
    { name: "date", placeholder: "Travel Date", icon: FaCalendarAlt, type: "date" },
    { name: "availableSeats", placeholder: "Number of Seats", icon: FaUsers, type: "number" },
    { name: "price", placeholder: "Price per Seat (₹)", icon: FaRupeeSign, type: "number" },
    { name: "vehicleType", placeholder: "Vehicle Type (e.g., Sedan, SUV)", icon: FaTachometerAlt, type: "text" },
    { name: "licensePlate", placeholder: "License Plate Number", icon: FaIdCard, type: "text" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.title}>
              <FaCar style={{ color: "#3b82f6" }} /> Post a Ride
            </div>
            <div style={styles.subtitle}>
              Share your journey and earn while traveling
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {formFields.map((field) => (
              <div key={field.name} style={styles.inputGroup}>
                <field.icon style={styles.inputIcon} />
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  style={styles.input}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Posting..." : <><FaPlusCircle /> Post Ride</>}
            </button>

            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span>Need help?</span>
              <div style={styles.dividerLine} />
            </div>

            <button
              type="button"
              style={styles.backButton}
              onClick={() => navigate("/driver")}
            >
              <FaArrowLeft /> Back to Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostRide;