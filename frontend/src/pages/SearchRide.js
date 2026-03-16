import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { calculateFare } from "../services/api";

function SearchRide() {

  const navigate = useNavigate();

  // Milestone 1 state
  const [search, setSearch] = useState({
    source: "",
    destination: "",
    date: ""
  });

  const [rides, setRides] = useState([]);

  // Milestone 2 state (Fare Calculation)
  const [pickupLat, setPickupLat] = useState("");
  const [pickupLng, setPickupLng] = useState("");
  const [dropLat, setDropLat] = useState("");
  const [dropLng, setDropLng] = useState("");
  const [vehicleType, setVehicleType] = useState("CAR");
  const [fareResult, setFareResult] = useState(null);

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  // Milestone 1 - Ride Search
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

  // Milestone 2 - Fare Calculation
  const handleFare = async () => {

    try {

      const response = await calculateFare({
        pickupLat,
        pickupLng,
        dropLat,
        dropLng,
        vehicleType,
        waitingMinutes: 0
      });

      setFareResult(response.data);

    } catch (error) {
      console.error("Fare error:", error);
      alert("Failed to calculate fare");
    }
  };

  // 🔹 STEP 2 - Payment Order Creation
  const handlePayment = async (amount) => {

    try {

      const response = await axios.post(
        `http://localhost:8081/api/payment/create-order?amount=${amount}`
      );

      console.log("Order Created:", response.data);

      alert("Payment order created successfully!");

    } catch (error) {

      console.error("Payment error:", error);
      alert("Failed to create payment order");

    }
  };

  return (
    <div style={{ padding: "30px" }}>

      {/* ----------------- Milestone 2 Feature ----------------- */}

      <h2>Fare Estimator</h2>

      <input
        placeholder="Pickup Latitude"
        value={pickupLat}
        onChange={(e) => setPickupLat(e.target.value)}
      /><br />

      <input
        placeholder="Pickup Longitude"
        value={pickupLng}
        onChange={(e) => setPickupLng(e.target.value)}
      /><br />

      <input
        placeholder="Drop Latitude"
        value={dropLat}
        onChange={(e) => setDropLat(e.target.value)}
      /><br />

      <input
        placeholder="Drop Longitude"
        value={dropLng}
        onChange={(e) => setDropLng(e.target.value)}
      /><br />

      <select
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
      >
        <option value="CAR">Car</option>
        <option value="BIKE">Bike</option>
        <option value="SUV">SUV</option>
      </select><br />

      <button onClick={handleFare}>Calculate Fare</button>

      {fareResult && (
        <div style={{ marginTop: "15px" }}>
          <h3>Fare Result</h3>
          <p><strong>Distance:</strong> {fareResult.distanceKm} km</p>
          <h2>Estimated Fare: ₹{fareResult.fare}</h2>
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />

      {/* ----------------- Milestone 1 Feature ----------------- */}

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

          {/* 🔹 STEP 2 Payment Button */}
          <button onClick={() => handlePayment(ride.price)}>
            Pay Now
          </button>

          <br /><br />

          <button onClick={() => navigate("/my-bookings")}>
            Book Ride
          </button>

        </div>
      ))}

    </div>
  );
}

export default SearchRide;