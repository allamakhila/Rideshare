import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaPlay, FaFlagCheckered, FaStar, FaUser, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaCar, FaIdCard, FaComment } from "react-icons/fa";
import ReactDOM from "react-dom";

function BookingsReceived({ setNotifications, onOpenChat }) {
  const [bookings, setBookings] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (bookings.length > 0) {
      console.log("Booking data sample:", bookings[0]);
    }
  }, [bookings]);

  const handleAccept = async (id) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8081/api/bookings/confirm/${id}`);
      fetchBookings();
      alert("Booking accepted!");
    } catch (error) {
      console.error("Error confirming booking", error);
      alert("Failed to accept booking");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8081/api/bookings/reject/${id}`);
      fetchBookings();
      alert("Booking rejected");
    } catch (error) {
      console.error("Error rejecting booking", error);
      alert("Failed to reject booking");
    } finally {
      setLoading(false);
    }
  };

  const handleStartRide = async (id) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8081/api/bookings/start/${id}`);
      alert("Ride started! Safe journey!");
      fetchBookings();
    } catch (error) {
      console.error("Start ride error", error);
      alert("Failed to start ride");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRide = async (id) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8081/api/bookings/complete/${id}`);
      alert("Ride completed! Thank you for your service!");
      fetchBookings();
    } catch (error) {
      console.error("Complete ride error", error);
      alert("Failed to complete ride");
    } finally {
      setLoading(false);
    }
  };

  const handleDriverReview = (booking) => {
  console.log("🔵 REVIEW BUTTON CLICKED - Booking:", booking);
  console.log("🔵 Booking ID:", booking.id);
  console.log("🔵 Booking Status:", booking.status);
  console.log("🔵 driverReviewed:", booking.driverReviewed);
  setSelectedBooking(booking);
  setShowReviewModal(true);
  console.log("🔵 Modal should now open. showReviewModal set to:", true);
};

  const submitDriverReview = async () => {
    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    setLoading(true);
    try {
      const passengerResponse = await axios.get(
        `http://localhost:8081/api/users/email/${selectedBooking.passengerEmail}`
      );
      
      const passenger = passengerResponse.data;

      const payload = {
        rideId: selectedBooking.ride.id,
        bookingId: selectedBooking.id,
        reviewerId: loggedInUser.id,
        revieweeId: passenger.id,
        stars: rating,
        comments: comment || ""
      };

      await axios.post("http://localhost:8081/api/reviews/create", payload);

      alert("Review submitted successfully!");
      setShowReviewModal(false);
      setRating(0);
      setComment("");
      fetchBookings();
    } catch (error) {
      console.error("Review submission error:", error.response || error);
      alert("Error submitting review: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED": return "#10b981";
      case "PAID": return "#06b6d4";  //
      case "REJECTED": return "#ef4444";
      case "STARTED": return "#8b5cf6";
      case "COMPLETED": return "#3b82f6";
      case "PENDING": return "#f59e0b";
      default: return "#64748b";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "CONFIRMED": return <FaCheck style={{ marginRight: "6px" }} />;
      case "PAID": return <FaCheck style={{ marginRight: "6px" }} />;  
      case "REJECTED": return <FaTimes style={{ marginRight: "6px" }} />;
      case "STARTED": return <FaPlay style={{ marginRight: "6px" }} />;
      case "COMPLETED": return <FaFlagCheckered style={{ marginRight: "6px" }} />;
      default: return null;
    }
  };

  const styles = {
    container: {
      background: "white",
      borderRadius: "20px",
      padding: "20px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px",
      color: "#94a3b8",
    },
    card: {
      background: "#f8fafc",
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "16px",
      border: "1px solid #e2e8f0",
      transition: "all 0.3s ease",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      marginBottom: "15px",
      paddingBottom: "15px",
      borderBottom: "2px solid #e2e8f0",
    },
    passengerInfo: {
      flex: 1,
    },
    passengerName: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "5px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    passengerEmail: {
      fontSize: "12px",
      color: "#64748b",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    statusBadge: (status) => ({
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 14px",
      borderRadius: "30px",
      fontSize: "12px",
      fontWeight: "600",
      background: `${getStatusColor(status)}20`,
      color: getStatusColor(status),
    }),
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "12px",
      marginBottom: "15px",
    },
    detailItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    detailIcon: {
      color: "#3b82f6",
      fontSize: "14px",
      width: "24px",
    },
    detailLabel: {
      fontSize: "11px",
      color: "#64748b",
    },
    detailValue: {
      fontSize: "13px",
      fontWeight: "500",
      color: "#1e293b",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginTop: "15px",
      paddingTop: "15px",
      borderTop: "1px solid #e2e8f0",
    },
    acceptButton: {
      padding: "8px 20px",
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "13px",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    },
    rejectButton: {
      padding: "8px 20px",
      background: "linear-gradient(135deg, #ef4444, #dc2626)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "13px",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    },
    startButton: {
      padding: "8px 20px",
      background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "13px",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    },
    completeButton: {
      padding: "8px 20px",
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "13px",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    },
    reviewButton: {
      padding: "8px 20px",
      background: "linear-gradient(135deg, #f59e0b, #d97706)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "13px",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    },
    reviewedBadge: {
      padding: "8px 16px",
      background: "#dcfce7",
      color: "#166534",
      borderRadius: "10px",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      fontWeight: "500",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    },
    modalContent: {
      background: "white",
      borderRadius: "24px",
      padding: "28px",
      width: "400px",
      maxWidth: "90%",
      textAlign: "center",
    },
    modalTitle: {
      fontSize: "22px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "20px",
    },
    starsContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "8px",
      margin: "20px 0",
    },
    star: (isActive) => ({
      cursor: "pointer",
      color: isActive ? "#f59e0b" : "#cbd5e1",
      fontSize: "40px",
      transition: "all 0.2s",
    }),
    textarea: {
      width: "100%",
      padding: "12px",
      borderRadius: "12px",
      border: "2px solid #e2e8f0",
      fontSize: "14px",
      fontFamily: "inherit",
      resize: "vertical",
      minHeight: "80px",
      marginBottom: "20px",
    },
    modalButtonGroup: {
      display: "flex",
      gap: "12px",
    },
    submitButton: {
      flex: 1,
      padding: "12px",
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
    },
    cancelButton: {
      flex: 1,
      padding: "12px",
      background: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
    },
  };

    return (
  <div style={styles.container}>
    {/* Debug log */}
    {console.log("🔵 Rendering BookingsReceived. Total bookings:", bookings.length)}
    {console.log("🔵 Completed bookings:", bookings.filter(b => b.status === "COMPLETED").length)}
    
    <div style={styles.title}>
      <FaUser /> Bookings Received
    </div>

      {bookings.length === 0 ? (
        <div style={styles.emptyState}>
          <FaUser style={{ fontSize: "48px", color: "#cbd5e1", marginBottom: "16px" }} />
          <p>No bookings yet.</p>
          <p style={{ fontSize: "12px", marginTop: "8px" }}>Check back later for ride requests</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.passengerInfo}>
                <div style={styles.passengerName}>
                  <FaUser /> {booking.passengerName || "Anonymous"}
                </div>
                <div style={styles.passengerEmail}>
                  <FaEnvelope /> {booking.passengerEmail}
                </div>
              </div>
              <div style={styles.statusBadge(booking.status)}>
                {getStatusIcon(booking.status)} {booking.status}
              </div>
            </div>

            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <FaMapMarkerAlt style={styles.detailIcon} />
                <div>
                  <div style={styles.detailLabel}>Route</div>
                  <div style={styles.detailValue}>{booking.ride?.source} → {booking.ride?.destination}</div>
                </div>
              </div>
              <div style={styles.detailItem}>
                <FaCalendarAlt style={styles.detailIcon} />
                <div>
                  <div style={styles.detailLabel}>Date</div>
                  <div style={styles.detailValue}>{booking.ride?.date}</div>
                </div>
              </div>
              <div style={styles.detailItem}>
                <FaUsers style={styles.detailIcon} />
                <div>
                  <div style={styles.detailLabel}>Seats Booked</div>
                  <div style={styles.detailValue}>{booking.seatsBooked} seat(s)</div>
                </div>
              </div>
              <div style={styles.detailItem}>
                <FaCar style={styles.detailIcon} />
                <div>
                  <div style={styles.detailLabel}>Vehicle</div>
                  <div style={styles.detailValue}>{booking.ride?.vehicleType || "N/A"}</div>
                </div>
              </div>
              <div style={styles.detailItem}>
                <FaIdCard style={styles.detailIcon} />
                <div>
                  <div style={styles.detailLabel}>Ride ID</div>
                  <div style={styles.detailValue}>{booking.ride?.id}</div>
                </div>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              {booking.status === "PENDING" && (
                <>
                  <button style={styles.acceptButton} onClick={() => handleAccept(booking.id)} disabled={loading}>
                    <FaCheck /> Accept
                  </button>
                  <button style={styles.rejectButton} onClick={() => handleReject(booking.id)} disabled={loading}>
                    <FaTimes /> Reject
                  </button>
                </>
              )}

              {/* Start Ride - Show for CONFIRMED or PAID status */}
{(booking.status === "CONFIRMED" || booking.status === "PAID") && (
  <button style={styles.startButton} onClick={() => handleStartRide(booking.id)} disabled={loading}>
    <FaPlay /> Start Ride
  </button>
)}

              {booking.status === "STARTED" && (
  <button style={styles.completeButton} onClick={() => handleCompleteRide(booking.id)} disabled={loading}>
    <FaFlagCheckered /> Complete Ride
  </button>
)}

              {booking.status === "COMPLETED" && (
  <>
    {!booking.driverReviewed ? (
      <button 
        onClick={() => {
          console.log("🔵 Button clicked directly for booking ID:", booking.id);
          console.log("🔵 Booking status:", booking.status);
          console.log("🔵 driverReviewed:", booking.driverReviewed);
          handleDriverReview(booking);
        }}
        style={styles.reviewButton}
        disabled={false}
      >
        <FaStar /> Review Passenger
      </button>
    ) : (
      <div style={styles.reviewedBadge}>
        <FaCheck /> Passenger Reviewed
      </div>
    )}
  </>
)}

              {/* Chat Button - Show for CONFIRMED, STARTED, or COMPLETED bookings */}
              {(booking.status === "CONFIRMED" || booking.status === "PAID" || booking.status === "STARTED" || booking.status === "COMPLETED") && (
                <button
                  style={{
                    padding: "8px 20px",
                    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "13px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                  onClick={() => {
                    // Pass the booking and passenger info to parent component
                    if (onOpenChat) {
                      onOpenChat(booking, {
                        id: booking.passengerId,
                        name: booking.passengerName,
                        email: booking.passengerEmail
                      });
                    }
                  }}
                >
                  <FaComment /> Message Passenger
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {showReviewModal &&
  ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999,
      }}
      onClick={() => setShowReviewModal(false)}
    >
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "32px",
          width: "420px",
          maxWidth: "90%",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: "20px" }}>Review Passenger</h3>

        {/* ⭐ Stars */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", margin: "20px 0" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                cursor: "pointer",
                color: star <= rating ? "#f59e0b" : "#cbd5e1",
                fontSize: "48px",
              }}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        {/* ✍️ Comment */}
        <textarea
          placeholder="Write your feedback about the passenger..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "16px",
            border: "2px solid #e2e8f0",
            minHeight: "100px",
            marginBottom: "20px",
          }}
        />

        {/* ✅ Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={submitDriverReview}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "12px",
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          <button
            onClick={() => setShowReviewModal(false)}
            style={{
              flex: 1,
              padding: "12px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "12px",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
    </div>
  );
}

export default BookingsReceived;