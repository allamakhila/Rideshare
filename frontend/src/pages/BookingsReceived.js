import React, { useEffect, useState } from "react";
import axios from "axios";

function BookingsReceived() {
  const [bookings, setBookings] = useState([]);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/bookings/driver/${loggedInUser.email}`
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(
        `http://localhost:8081/api/bookings/confirm/${id}`
      );
      fetchBookings();
    } catch (error) {
      console.error("Error confirming booking", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `http://localhost:8081/api/bookings/reject/${id}`
      );
      fetchBookings();
    } catch (error) {
      console.error("Error rejecting booking", error);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "40px",
      background: "linear-gradient(to right, #dbefff, #eaf6ff)",
      fontFamily: "Arial, sans-serif"
    },
    title: {
      textAlign: "center",
      marginBottom: "30px",
      color: "#0d47a1"
    },
    card: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      marginBottom: "20px",
      transition: "0.3s"
    },
    label: {
      fontWeight: "bold",
      color: "#1565c0"
    },
    status: (status) => ({
      fontWeight: "bold",
      color:
        status === "CONFIRMED"
          ? "green"
          : status === "REJECTED"
          ? "red"
          : "#ff9800"
    }),
    buttonContainer: {
      marginTop: "15px"
    },
    acceptButton: {
      padding: "8px 15px",
      backgroundColor: "#4caf50",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    },
    rejectButton: {
      padding: "8px 15px",
      backgroundColor: "#f44336",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginLeft: "10px"
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Bookings Received</h2>

      {bookings.length === 0 && (
        <p style={{ textAlign: "center" }}>No bookings yet.</p>
      )}

      {bookings.map((booking) => (
  <div key={booking.id} style={styles.card}>

    <p>
      <span style={styles.label}>Passenger Name:</span>{" "}
      {booking.passengerName}
    </p>

    <p>
      <span style={styles.label}>Passenger Email:</span>{" "}
      {booking.passengerEmail}
    </p>

    <p>
      <span style={styles.label}>Source:</span>{" "}
      {booking.source}
    </p>

    <p>
      <span style={styles.label}>Destination:</span>{" "}
      {booking.destination}
    </p>

    <p>
      <span style={styles.label}>Seats Booked:</span>{" "}
      {booking.seatsBooked}
    </p>

    <p>
      <span style={styles.label}>Status:</span>{" "}
      <span style={styles.status(booking.status)}>
        {booking.status}
      </span>
    </p>

    <p>
      <span style={styles.label}>Ride ID:</span>{" "}
      {booking.ride?.id}
    </p>

    {booking.status === "PENDING" && (
      <div style={styles.buttonContainer}>
        <button
          style={styles.acceptButton}
          onClick={() => handleAccept(booking.id)}
        >
          Accept
        </button>

        <button
          style={styles.rejectButton}
          onClick={() => handleReject(booking.id)}
        >
          Reject
        </button>
      </div>
    )}
  </div>
))}
    </div>
  );
}

export default BookingsReceived;