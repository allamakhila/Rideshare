import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function PassengerDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("search");
  const [rides, setRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const styles = {
  container: {
    padding: "30px",
    fontFamily: "Segoe UI, sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg,#c7d2fe,#a5b4fc,#c4b5fd)"
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
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

  section: {
  background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
},

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
    boxSizing: "border-box"
  },

  rideCard: {
    border: "1px solid #e5e7eb",
    padding: "18px",
    borderRadius: "10px",
    marginTop: "15px",
    background: "#f9fafb",
    boxShadow: "0 3px 10px rgba(0,0,0,0.05)"
  }
};

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) return;

      const response = await axios.get("http://localhost:8081/api/bookings/passenger", { params: { email: loggedInUser.email } });
      setMyBookings([...response.data].reverse());
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  // ==============================
  // WebSocket for real-time updates
  // ==============================
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    const socket = new SockJS("http://localhost:8081/ws");

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Passenger connected to WebSocket");
        stompClient.subscribe(
          `/topic/passenger/${loggedInUser.email}`,
          (message) => {
            const notification = JSON.parse(message.body);
            alert("📢 " + notification.message);
            fetchBookings(); // refresh bookings list automatically
          }
        );
      }
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  // ==============================
  // Search rides
  // ==============================
  const handleSearch = async () => {
    if (!source || !destination || !date) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8081/api/rides/search", { params: { source: source.trim(), destination: destination.trim(), date } });
      setRides(response.data);
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      alert("Error fetching rides.");
    }
  };

  // ==============================
  // Book ride
  // ==============================
  const handleBook = async (ride, seatsToBook) => {
    if (!seatsToBook || seatsToBook <= 0) { alert("Enter valid seats."); return; }
    if (seatsToBook > ride.availableSeats) { alert("Not enough seats available."); return; }

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      await axios.post(`http://localhost:8081/api/bookings/book/${ride.id}`, {
        passengerEmail: loggedInUser.email,
        passengerName: loggedInUser.name,
        seatsBooked: seatsToBook
      });

      alert("Ride booked successfully!");
      fetchBookings();
      setActiveSection("bookings");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Error booking ride.");
    }
  };

  // ==============================
  // Payment
  // ==============================
  const handleBookingPayment = async (booking) => {
    if (booking.status !== "CONFIRMED") { alert("Ride is not confirmed yet."); return; }

    const pricePerSeat = booking.ride?.price || 0;
    const totalFare = booking.seatsBooked * pricePerSeat;

    try {
      alert("Preparing payment...");
      const orderResponse = await axios.post(`http://localhost:8081/api/payment/create-order?amount=${totalFare}`);
      const order = orderResponse.data;

      const options = {
        key: "rzp_test_SNY0d6qagOQlWy",
        amount: order.amount,
        currency: order.currency,
        name: "RideShare",
        description: "Ride Booking Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post("http://localhost:8081/api/payment/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: booking.id,
              rideId: booking.ride?.id,
              amount: totalFare
            });
            alert("Payment Successful!\nPayment ID: " + response.razorpay_payment_id);
            fetchBookings();
          } catch (error) {
            console.error("Payment verification failed", error);
            alert("Payment verification failed!");
          }
        },
        prefill: { email: JSON.parse(localStorage.getItem("loggedInUser"))?.email },
        theme: { color: "#3399cc" }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error creating payment order.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <h2>Passenger Dashboard</h2>
        <button style={styles.button} onClick={logout}>Logout</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button style={styles.button} onClick={() => setActiveSection("search")}>Search Ride</button>
        <button style={styles.button} onClick={() => { setActiveSection("bookings"); fetchBookings(); }}>My Bookings</button>
        <Link to="/transactions"><button style={styles.button}>Transaction History</button></Link>
        <Link to="/route-matching"><button style={styles.button}>Find a Ride (Smart Match)</button></Link>
      </div>

      {/* ==============================
          Search Rides Section
      ============================== */}
      {activeSection === "search" && (
        <div style={styles.section}>
          <h3>Search Ride</h3>
          <input style={styles.input} placeholder="Source" value={source} onChange={(e) => setSource(e.target.value)} />
          <input style={styles.input} placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
          <input style={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button style={styles.button} onClick={handleSearch}>Search</button>

          {hasSearched && (rides.length > 0 ? rides.map((ride) => (
            <RideCard key={ride.id} ride={ride} handleBook={handleBook} styles={styles} />
          )) : <p style={{ marginTop: "15px" }}>No rides found.</p>)}
        </div>
      )}

      {/* ==============================
          My Bookings Section
      ============================== */}
      {activeSection === "bookings" && (
  <div style={styles.section}>
    <h3>My Bookings</h3>

    {loadingBookings ? (
      <p>Loading your bookings...</p>
    ) : myBookings.length > 0 ? (
      myBookings.map((booking) => {
        const pricePerSeat = booking.ride?.price || 0;
        const totalFare = (booking.seatsBooked || 0) * pricePerSeat;

        // STATUS STYLES
        let statusStyle = {
          padding: "8px 12px",
          borderRadius: "6px",
          color: "white",
          fontWeight: "600",
          display: "block",      // ✅ make it block so button is below
          marginBottom: "10px"
        };

        if (booking.status === "PENDING") {
          statusStyle.backgroundColor = "#f0ad4e"; // orange
        } else if (booking.status === "CONFIRMED") {
          statusStyle.backgroundColor = "#5cb85c"; // green
        } else if (booking.status === "CANCELLED") {
          statusStyle.backgroundColor = "#d9534f"; // red
        } else if (booking.status === "COMPLETED") {
          statusStyle.backgroundColor = "#0275d8"; // blue
        }

        return (
          <div key={booking.id} style={styles.rideCard}>
            <p>
              <strong>
                {booking.source || booking.ride?.source} → {booking.destination || booking.ride?.destination}
              </strong>
            </p>
            <p>Date: {booking.ride?.date}</p>
            <p>Seats Booked: {booking.seatsBooked}</p>
            <p>Distance: {booking.ride?.distance?.toFixed(2) || 0} km</p>
            <p>Price per Seat: ₹{pricePerSeat}</p>
            <p>Total Fare: ₹{totalFare}</p>
            <p>Driver: {booking.ride?.driverEmail || "N/A"}</p>
            <p>Vehicle: {booking.ride?.vehicleType || "N/A"} - {booking.ride?.licensePlate || "N/A"}</p>

            {/* STATUS BOX */}
            <div style={statusStyle}>
              {booking.status === "PENDING" && "Waiting for driver confirmation..."}
              {booking.status === "CONFIRMED" && "Booking Confirmed! ✅"}
              {booking.status === "CANCELLED" && "Booking Cancelled ❌"}
              {booking.status === "COMPLETED" && "Ride Completed ✅"}
            </div>

            {/* PAY BUTTON BELOW STATUS */}
            {booking.status === "CONFIRMED" && (
              <div style={{ marginTop: "10px" }}>
                <button
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    display: "block"
                  }}
                  onClick={() => handleBookingPayment(booking)}
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>
        );
      })
    ) : (
      <p>No bookings yet.</p>
    )}
  </div>
)}
    </div>
  );
}

// ==============================
// Ride Card Component
// ==============================
function RideCard({ ride, handleBook, styles }) {
  const [seatsToBook, setSeatsToBook] = useState("");
  const [totalFare, setTotalFare] = useState(0);

  const handleSeatChange = (e) => {
    const seats = Number(e.target.value);
    setSeatsToBook(seats);
    setTotalFare(seats > 0 ? seats * ride.price : 0);
  };

  return (
    <div style={styles.rideCard}>
      <p><strong>{ride.source} → {ride.destination}</strong></p>
      <p>Date: {ride.date}</p>
      <p>Available Seats: {ride.availableSeats}</p>
      <p>Distance: {ride.distance?.toFixed(2) || 0} km</p>
      <p>Price per Seat: ₹{ride.price}</p>
      <p>Vehicle: {ride.vehicleType}</p>
      <p>License Plate: {ride.licensePlate}</p>

      {ride.availableSeats > 0 ? (
        <>
          <input type="number" placeholder="Seats to book" min="1" max={ride.availableSeats} style={styles.input} value={seatsToBook} onChange={handleSeatChange} />
          {totalFare > 0 && <p><strong>Total Fare: ₹{totalFare}</strong></p>}
          <button style={styles.button} onClick={() => handleBook(ride, seatsToBook)}>Book Ride</button>
        </>
      ) : <p style={{ color: "red" }}>No seats available</p>}
    </div>
  );
}

export default PassengerDashboard;