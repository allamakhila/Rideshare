import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import RideMap from "../components/RideMap";

function RouteMatching() {
  const navigate = useNavigate();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [seatsToBook, setSeatsToBook] = useState(1);

  const [vehicleFilter, setVehicleFilter] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const socket = new SockJS("http://localhost:8081/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket (Route Matching)");

      stompClient.subscribe("/topic/rides", (message) => {
        const updatedRide = JSON.parse(message.body);

        setMatches((prevRides) => {
          const newRides = prevRides.map((ride) =>
            ride.id === updatedRide.id ? updatedRide : ride
          );

          let filtered = [...newRides];
          if (vehicleFilter !== "ALL") {
            filtered = filtered.filter((r) => r.vehicleType === vehicleFilter);
          }
          if (maxPrice) {
            filtered = filtered.filter((r) => r.price <= maxPrice);
          }
          if (sortOption === "price") {
            filtered.sort((a, b) => a.price - b.price);
          } else if (sortOption === "seats") {
            filtered.sort((a, b) => b.availableSeats - a.availableSeats);
          }

          return filtered;
        });
      });
    };

    stompClient.activate();
    return () => stompClient.deactivate();
  }, [vehicleFilter, maxPrice, sortOption]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMatches([]);
    setError("");

    try {
      const response = await axios.get(
        "http://localhost:8081/api/rides/search",
        { params: { source, destination, date } }
      );
      setMatches(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookSeat = async (rideId) => {
    try {
      setBookingLoading(true);
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      await axios.post(`http://localhost:8081/api/bookings/book/${rideId}`, {
        passengerEmail: loggedInUser.email,
        passengerName: loggedInUser.name,
        seatsBooked: seatsToBook
      });

      alert("Ride booked successfully!");
      navigate("/passenger");
    } catch (err) {
      console.error(err);
      alert("Failed to book seat. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  let filteredRides = [...matches];
  if (vehicleFilter !== "ALL") filteredRides = filteredRides.filter((ride) => ride.vehicleType === vehicleFilter);
  if (maxPrice) filteredRides = filteredRides.filter((ride) => ride.price <= maxPrice);
  if (sortOption === "price") filteredRides.sort((a, b) => a.price - b.price);
  if (sortOption === "seats") filteredRides.sort((a, b) => b.availableSeats - a.availableSeats);

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Segoe UI, sans-serif",
        background: "linear-gradient(135deg,#c7d2fe,#a5b4fc,#c4b5fd)",
        minHeight: "100vh"
      }}
    >
      <h2>Find Your Ride (Smart Match)</h2>

      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          maxWidth: "420px",
          marginBottom: "30px",
          background: "rgba(255,255,255,0.9)",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
        }}
      >
        <input
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #cbd5f5",
            backgroundColor: "#eef2ff",
            outline: "none"
          }}
        />

        <input
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #cbd5f5",
            backgroundColor: "#eef2ff",
            outline: "none"
          }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #cbd5f5",
            backgroundColor: "#eef2ff",
            outline: "none"
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "linear-gradient(90deg,#6366f1,#4f46e5)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Search Ride
        </button>
      </form>

      {loading && <p>Loading rides...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Filters</h3>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "25px",
          background: "rgba(255,255,255,0.9)",
          padding: "15px",
          borderRadius: "10px",
          width: "fit-content",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}
      >
        <select
          value={vehicleFilter}
          onChange={(e) => setVehicleFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #cbd5f5",
            backgroundColor: "#eef2ff"
          }}
        >
          <option value="ALL">All Vehicles</option>
          <option value="CAR">Car</option>
          <option value="SUV">SUV</option>
          <option value="BIKE">Bike</option>
        </select>

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #cbd5f5",
            backgroundColor: "#eef2ff"
          }}
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #cbd5f5",
            backgroundColor: "#eef2ff"
          }}
        >
          <option value="">Sort By</option>
          <option value="price">Cheapest First</option>
          <option value="seats">Most Seats</option>
        </select>
      </div>

      <RideMap rides={filteredRides} />

      <h3>Matched Rides</h3>

      {filteredRides.length === 0 && !loading && <p>No rides found.</p>}

      {filteredRides.map((ride) => (
        <div
  key={ride.id}
  style={{
    border: "1px solid #c7d2fe",
    padding: "22px",
    marginTop: "22px",
    borderRadius: "14px",
    background: "linear-gradient(135deg,#eef2ff,#ffffff)",
    maxWidth: "520px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
    transition: "0.3s"
  }}
>
          <h4 style={{color:"#4f46e5", marginBottom:"10px"}}>
  {ride.source} → {ride.destination}
</h4>

          <p><strong>Date:</strong> {ride.date}</p>
          <p><strong>Driver:</strong> {ride.driverEmail}</p>
          <p><strong>Vehicle:</strong> {ride.vehicleType}</p>
          <p><strong>License Plate:</strong> {ride.licensePlate}</p>
          <p style={{color:"#2563eb", fontWeight:"600"}}>
  Seats Available: {ride.availableSeats}
</p>
          <p style={{color:"#16a34a", fontWeight:"600"}}>
  Price per Seat: ₹{ride.price}
</p>

          <input
            type="number"
            min="1"
            max={ride.availableSeats}
            value={seatsToBook}
            onChange={(e) => setSeatsToBook(Number(e.target.value))}
            style={{
              padding: "8px",
              marginTop: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5f5",
              backgroundColor: "#eef2ff"
            }}
          />

          <p style={{ marginTop: "10px" }}>
            <strong>Total Fare:</strong> ₹{ride.price * seatsToBook}
          </p>

          <button
            onClick={() => handleBookSeat(ride.id)}
            disabled={ride.availableSeats === 0 || bookingLoading}
            style={{
              padding: "10px 16px",
              background: "linear-gradient(90deg,#22c55e,#16a34a)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            {ride.availableSeats === 0
              ? "Full"
              : bookingLoading
              ? "Booking..."
              : "Book Ride"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default RouteMatching;