import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PostRide() {
  const navigate = useNavigate();

  // ✅ Get logged in driver from localStorage
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8081/api/rides/post",
        {
          ...ride,
          availableSeats: Number(ride.availableSeats),
          driverEmail: loggedInUser?.email   // ✅ ADDED HERE
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
      backgroundColor: "#b3d9ff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial"
    },
    card: {
  backgroundColor: "#e6f2ff",
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
          <input name="source" placeholder="Source" style={styles.input} onChange={handleChange} required />
          <input name="destination" placeholder="Destination" style={styles.input} onChange={handleChange} required />
          <input type="date" name="date" style={styles.input} onChange={handleChange} required />
          <input type="number" name="availableSeats" placeholder="Number of Seats" style={styles.input} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price per Person" style={styles.input} onChange={handleChange} required />
          <input name="vehicleType" placeholder="Vehicle Type" style={styles.input} onChange={handleChange} required />
          <input name="licensePlate" placeholder="License Plate" style={styles.input} onChange={handleChange} required />

          <button type="submit" style={styles.button}>
            Post Ride
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostRide;