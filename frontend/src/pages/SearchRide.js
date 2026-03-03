import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchRide() {
  const navigate = useNavigate();

  const [search, setSearch] = useState({
    source: "",
    destination: "",
    date: ""
  });

  const [rides, setRides] = useState([]);

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/rides/all"
      );

      setRides(response.data);

    } catch (error) {
      console.error("Error fetching rides:", error);
      alert("Failed to fetch rides");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Search for a Ride</h2>

      <input
        name="source"
        placeholder="Source"
        onChange={handleChange}
      /><br />

      <input
        name="destination"
        placeholder="Destination"
        onChange={handleChange}
      /><br />

      <input
        type="date"
        name="date"
        onChange={handleChange}
      /><br />

      <button onClick={handleSearch}>Search</button>

      <h3>Available Rides</h3>

      {rides.length === 0 && <p>No rides found.</p>}

      {rides.map((ride) => (
        <div
          key={ride.id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginTop: "15px",
            borderRadius: "8px"
          }}
        >
          <h4>{ride.source} → {ride.destination}</h4>
          <p><strong>Date:</strong> {ride.date}</p>
          <p><strong>Available Seats:</strong> {ride.availableSeats}</p>
          <p><strong>Price:</strong> ₹{ride.price}</p>
          <p><strong>Vehicle Type:</strong> {ride.vehicleType}</p>
          <p><strong>License Plate:</strong> {ride.licensePlate}</p>
          <p><strong>Driver Email:</strong> {ride.driverEmail}</p>

          <button onClick={() => navigate("/my-bookings")}>
            Book Ride
          </button>
        </div>
      ))}
    </div>
  );
}

export default SearchRide;