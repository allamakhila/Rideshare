import React, { useState, useEffect } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const fetchBookings = async () => {
    if (!loggedInUser?.email) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:8081/api/bookings/passenger`,
        { params: { email: loggedInUser.email } }
      );
      setBookings(response.data.reverse()); // newest first
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleBookingPayment = async (booking) => {
    if (booking.status !== "CONFIRMED") {
      alert("Ride is not confirmed yet.");
      return;
    }

    const pricePerSeat = booking.ride?.price || 0;
    const totalFare = booking.seatsBooked * pricePerSeat;

    try {
      alert("Preparing payment...");

      const orderResponse = await axios.post(
        `http://localhost:8081/api/payment/create-order?amount=${totalFare}`
      );

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
        prefill: { email: loggedInUser?.email },
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
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
        background: "linear-gradient(135deg,#c7d2fe,#a5b4fc,#c4b5fd)"
      }}
    >
      <h2 style={{ marginBottom: "25px", color: "#3730a3" }}>
        🚗 My Ride Bookings
      </h2>

      <button
        onClick={fetchBookings}
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          background: "linear-gradient(90deg,#6366f1,#4f46e5)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "500"
        }}
      >
        Refresh Bookings
      </button>

      <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "25px",
    background: "linear-gradient(135deg,#e0e7ff,#f5f3ff,#ede9fe)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)"
  }}
>

      {loading ? (
        <p>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((booking) => {
          const pricePerSeat = booking.ride?.price || 0;
          const totalFare = booking.seatsBooked * pricePerSeat;

          let statusStyle = {
            padding: "6px 14px",
            borderRadius: "20px",
            color: "white",
            fontWeight: "600",
            display: "inline-block",
            marginTop: "10px",
            fontSize: "13px"
          };

          let statusText = "";

          if (booking.status === "PENDING") {
            statusStyle.backgroundColor = "#f0ad4e";
            statusText = "Waiting for driver confirmation...";
          } else if (booking.status === "CONFIRMED") {
            statusStyle.backgroundColor = "#22c55e";
            statusText = "Booking Confirmed! ✅";
          } else if (booking.status === "CANCELLED" || booking.status === "REJECTED") {
            statusStyle.backgroundColor = "#ef4444";
            statusText = "Booking Rejected ❌";
          } else if (booking.status === "COMPLETED") {
            statusStyle.backgroundColor = "#3b82f6";
            statusText = "Ride Completed ✅";
          }

          return (
            <div
              key={booking.id}
              style={{
                marginBottom: "20px",
                padding: "20px",
                border: "1px solid #c7d2fe",
                borderRadius: "12px",
                background: "linear-gradient(135deg,#eef2ff,#ffffff)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                maxWidth: "520px",
                width: "100%"
              }}
            >
              <h3 style={{ color: "#4f46e5", marginBottom: "10px" }}>
                {(booking.source || booking.ride?.source)} → {(booking.destination || booking.ride?.destination)}
              </h3>

              <p><strong>Date:</strong> {booking.ride?.date || "N/A"}</p>
              <p><strong>Seats Booked:</strong> {booking.seatsBooked}</p>
              <p><strong>Distance:</strong> {booking.ride?.distance?.toFixed(2) || 0} km</p>
              <p><strong>Price per Seat:</strong> ₹{pricePerSeat}</p>

              <p style={{ color: "#16a34a", fontWeight: "600" }}>
                Total Fare: ₹{totalFare}
              </p>

              <p><strong>Driver:</strong> {booking.ride?.driverEmail || "N/A"}</p>

              <p>
                <strong>Vehicle:</strong> {booking.ride?.vehicleType || "N/A"} - {booking.ride?.licensePlate || "N/A"}
              </p>

              <div style={statusStyle}>{statusText}</div>

              {booking.status === "CONFIRMED" && (
                <div style={{ marginTop: "10px" }}>
                  <button
                    style={{
                      padding: "10px 16px",
                      background: "linear-gradient(90deg,#22c55e,#16a34a)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
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
      )}

      </div>

    </div>
  );
}

export default MyBookings;