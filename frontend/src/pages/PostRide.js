import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PostRide() {
  const navigate = useNavigate();

  // Get logged-in driver
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

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

  // Convert city name to latitude & longitude using OpenStreetMap
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

    try {
      // Get coordinates for source and destination
      const sourceCoords = await getCoordinates(ride.source);
      const destCoords = await getCoordinates(ride.destination);

      if (!sourceCoords || !destCoords) {
        alert("Could not find location coordinates.");
        return;
      }

      await axios.post(
        "http://localhost:8081/api/rides",
        {
          ...ride,
          availableSeats: Number(ride.availableSeats),
          driverEmail: loggedInUser?.email,

          // Send coordinates to backend
          sourceLat: sourceCoords.lat,
          sourceLng: sourceCoords.lon,
          destinationLat: destCoords.lat,
          destinationLng: destCoords.lon
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      alert("Ride Posted Successfully!");
      navigate("/driver-dashboard");

    } catch (error) {
      console.error("Error posting ride:", error);
      alert("Failed to post ride.");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg,#c7d2fe,#a5b4fc,#c4b5fd)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial"
    },
    card: {
      background: "linear-gradient(135deg,#eef2ff,#ffffff)",
      padding: "40px",
      borderRadius: "12px",
      width: "400px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
    },
    title: {
      fontSize: "24px",
      marginBottom: "20px",
      fontWeight: "600"
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "8px 0",
      borderRadius: "6px",
      border: "1px solid #ccc"
    },
    button: {
      width: "100%",
      padding: "12px",
      marginTop: "15px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>Post a Ride</div>

        <form onSubmit={handleSubmit}>
          <input
            name="source"
            placeholder="Source"
            style={styles.input}
            onChange={handleChange}
            required
          />

          <input
            name="destination"
            placeholder="Destination"
            style={styles.input}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date"
            style={styles.input}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="availableSeats"
            placeholder="Number of Seats"
            style={styles.input}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price per Person"
            style={styles.input}
            onChange={handleChange}
            required
          />

          <input
            name="vehicleType"
            placeholder="Vehicle Type"
            style={styles.input}
            onChange={handleChange}
            required
          />

          <input
            name="licensePlate"
            placeholder="License Plate"
            style={styles.input}
            onChange={handleChange}
            required
          />

          <button type="submit" style={styles.button}>
            Post Ride
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostRide;