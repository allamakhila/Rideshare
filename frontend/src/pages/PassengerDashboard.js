import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import PassengerReviews from "./PassengerReviews";
import { FaSearch, FaBookmark, FaStar, FaBell, FaUser, FaSignOutAlt, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaRupeeSign, FaCreditCard, FaTimes, FaCheckCircle, FaRoute, FaComment } from "react-icons/fa";
import ChatBox from "./ChatBox";

function PassengerDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("search");
  const [rides, setRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  
  const [showReviews, setShowReviews] = useState(false);
  const [reviewTab, setReviewTab] = useState("received");
  const [averageRating, setAverageRating] = useState(0);
  const [loadingRating, setLoadingRating] = useState(false);
  

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [selectedChatBooking, setSelectedChatBooking] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    if (loggedInUser) {
      fetchAverageRating();
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchAverageRating = async () => {
    if (!loggedInUser) return;
    
    setLoadingRating(true);
    try {
      const response = await axios.get(
        `http://localhost:8081/api/reviews/user/${loggedInUser.id}/average`
      );
      setAverageRating(response.data);
    } catch (error) {
      console.error("Error fetching rating:", error);
    } finally {
      setLoadingRating(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8081/api/chat/unread/${loggedInUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setShowNotifications(false);
    if (showNotifications) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showNotifications]);

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    },
    mainContent: {
      padding: "30px",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      flexWrap: "wrap",
      gap: "15px",
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(10px)",
      padding: "20px 30px",
      borderRadius: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    },
    titleSection: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#000000",
      margin: 0,
    },
    ratingBadge: {
      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
      color: "white",
      padding: "6px 14px",
      borderRadius: "30px",
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
    },
    button: {
      padding: "10px 20px",
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
    },
    reviewButton: {
      padding: "10px 20px",
      background: "linear-gradient(135deg, #f59e0b, #d97706)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    },
    section: {
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "28px",
      padding: "32px",
      marginBottom: "30px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    },
    sectionTitle: {
      fontSize: "22px",
      fontWeight: "600",
      color: "#000000",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    searchContainer: {
      background: "#ffffff",
      borderRadius: "24px",
      padding: "28px",
      marginBottom: "30px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    },
    searchRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "20px",
    },
    inputWrapper: {
      position: "relative",
      width: "100%",
    },
    inputIcon: {
      position: "absolute",
      left: "18px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#3b82f6",
      fontSize: "16px",
    },
    input: {
      width: "100%",
      padding: "16px 18px 16px 50px",
      borderRadius: "16px",
      border: "2px solid #e2e8f0",
      background: "white",
      fontSize: "15px",
      outline: "none",
      transition: "all 0.3s",
      color: "#000000",
      fontWeight: "500",
      boxSizing: "border-box",
    },
    dateWrapper: {
      position: "relative",
      width: "100%",
    },
    searchButtonWrapper: {
      marginTop: "10px",
      display: "flex",
      justifyContent: "center",
    },
    searchButton: {
      padding: "16px 48px",
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      color: "white",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "16px",
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
    },
    rideCard: {
      background: "#ffffff",
      borderRadius: "20px",
      padding: "24px",
      marginBottom: "16px",
      border: "1px solid #e2e8f0",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },
    bookingCard: {
      background: "#ffffff",
      borderRadius: "20px",
      padding: "24px",
      marginBottom: "16px",
      border: "1px solid #e2e8f0",
      transition: "all 0.3s ease",
    },
    statusBadge: (status) => ({
      display: "inline-block",
      padding: "6px 14px",
      borderRadius: "30px",
      fontSize: "12px",
      fontWeight: "600",
      background: status === "COMPLETED" ? "#dcfce7" :
                status === "CONFIRMED" ? "#dbeafe" :
                status === "PAID" ? "#cffafe" :  
                status === "PENDING" ? "#fed7aa" :
                status === "CANCELLED" ? "#fee2e2" :
                "#f1f5f9",
      color: status === "COMPLETED" ? "#166534" :
             status === "CONFIRMED" ? "#1e40af" :
             status === "PAID" ? "#0e7490" : 
             status === "PENDING" ? "#9a3412" :
             status === "CANCELLED" ? "#991b1b" :
             "#475569",
    }),
    navButtons: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "30px",
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(10px)",
      padding: "18px 28px",
      borderRadius: "24px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
    },
    modalContent: {
      background: "white",
      borderRadius: "28px",
      padding: "32px",
      width: "450px",
      maxWidth: "90%",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px",
      color: "#64748b",
      fontSize: "16px",
    },
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

      const response = await axios.get("http://localhost:8081/api/bookings/passenger", { 
        params: { email: loggedInUser.email } 
      });
      setMyBookings([...response.data].reverse());
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (myBookings.length > 0) {
      console.log("Booking data sample:", myBookings[0]);
    }
  }, [myBookings]);

  // WebSocket for notifications
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

            const newNotification = {
              id: Date.now(),
              type: notification.type,
              message: notification.message,
              time: new Date().toLocaleTimeString()
            };

            setNotifications(prev => {
              const updated = [newNotification, ...prev];
              localStorage.setItem("notifications", JSON.stringify(updated));
              return updated;
            });

            fetchBookings();
          }
        );
      }
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  
  // ✅ SINGLE WebSocket for ALL real-time features (Combined)
useEffect(() => {
  if (!loggedInUser) return;
  
  console.log('Setting up WebSocket for passenger:', loggedInUser.id);
  
  const socket = new SockJS('http://localhost:8081/ws');
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    console.log('✅ Connected to WebSocket!');
    
    // 1. Subscribe to passenger notifications
    client.subscribe(`/topic/passenger/${loggedInUser.email}`, (message) => {
      const notification = JSON.parse(message.body);
      console.log('Notification received:', notification);
      
      const newNotification = {
        id: Date.now(),
        type: notification.type,
        message: notification.message,
        time: new Date().toLocaleTimeString()
      };
      
      setNotifications(prev => {
        const updated = [newNotification, ...prev];
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
      
      fetchBookings();
    });
    
    // 2. Subscribe to chat messages
    client.subscribe(`/topic/chat/user/${loggedInUser.id}`, (message) => {
      const newMessage = JSON.parse(message.body);
      console.log('💬 New message received:', newMessage);
      
      setUnreadCount(prev => prev + 1);
      alert(`💬 New message from ${newMessage.senderName}: ${newMessage.message}`);
    });
    
    // 3. Subscribe to unread count updates
    client.subscribe(`/topic/chat/unread/${loggedInUser.id}`, (message) => {
      const count = JSON.parse(message.body);
      console.log('Unread count:', count);
      setUnreadCount(count);
    });
  };

  client.onStompError = (frame) => {
    console.error('STOMP Error:', frame);
  };

  client.activate();

  return () => {
    console.log('Deactivating WebSocket');
    client.deactivate();
  };
}, [loggedInUser]);
  

  const handleSearch = async () => {
    if (!source || !destination || !date) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8081/api/rides/search", { 
        params: { source: source.trim(), destination: destination.trim(), date } 
      });
      setRides(response.data);
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      alert("Error fetching rides.");
    }
  };

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
            alert("Payment Successful!");
            fetchBookings();
          } catch (error) {
            console.error("Payment verification failed", error);
            alert("Payment verification failed!");
          }
        },
        prefill: { email: JSON.parse(localStorage.getItem("loggedInUser"))?.email },
        theme: { color: "#3b82f6" }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error creating payment order.");
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await axios.put(`http://localhost:8081/api/bookings/cancel/${id}`);
      alert("Booking cancelled");
      fetchBookings();
    } catch (error) {
      console.error("Cancel error", error);
    }
  };

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return "Poor 😞";
      case 2: return "Good 🙂";
      case 3: return "Very Good 😊";
      case 4: return "Excellent 😃";
      case 5: return "Outstanding 🤩";
      default: return "";
    }
  };

  const submitReview = async () => {
    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    if (!selectedBooking?.ride?.driverEmail) {
      alert("Driver email missing in this booking.");
      return;
    }

    try {
      const driverResponse = await axios.get(
        `http://localhost:8081/api/users/email/${selectedBooking.ride.driverEmail}`
      );

      const driver = driverResponse.data;
      
      if (driver.id === loggedInUser.id) {
        alert("Error: Cannot review yourself.");
        return;
      }

      const payload = {
        rideId: selectedBooking.ride.id,
        bookingId: selectedBooking.id,
        reviewerId: loggedInUser.id,
        revieweeId: driver.id,
        stars: rating,
        comments: comment || ""
      };

      await axios.post("http://localhost:8081/api/reviews/create", payload);

      alert("Review submitted successfully!");
      setShowReviewModal(false);
      setRating(0);
      setComment("");
      setSelectedBooking(null);
      
      const response = await axios.get("http://localhost:8081/api/bookings/passenger", { 
        params: { email: loggedInUser.email } 
      });
      
      const updatedBookings = [...response.data].reverse();
      setMyBookings(updatedBookings);

    } catch (error) {
      console.error("Review submission error:", error.response || error);
      alert("Error submitting review: " + (error.response?.data || error.message));
    }
  };

  const handleReviewModalClose = () => {
    setShowReviews(false);
    fetchAverageRating();
  };

  const getColor = (type) => {
    switch (type) {
      case "CONFIRMED": return "#10b981";
      case "REJECTED": return "#ef4444";
      case "CANCELLED": return "#f97316";
      case "BOOKING": return "#3b82f6";
      default: return "#64748b";
    }
  };

  const RideCardComponent = ({ ride, handleBook }) => {
    const [seatsToBook, setSeatsToBook] = useState("");
    const [totalFare, setTotalFare] = useState(0);

    const handleSeatChange = (e) => {
      const seats = Number(e.target.value);
      setSeatsToBook(seats);
      setTotalFare(seats > 0 ? seats * ride.price : 0);
    };

    return (
      <div style={styles.rideCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "15px" }}>
          <div>
            <h4 style={{ fontSize: "18px", fontWeight: "600", color: "#000000", margin: 0 }}>
              {ride.source} → {ride.destination}
            </h4>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>📅 {ride.date}</span>
              <span style={{ fontSize: "12px", color: "#64748b" }}>🚗 {ride.vehicleType || "Standard"}</span>
            </div>
          </div>
          <div style={styles.statusBadge(ride.availableSeats > 0 ? "AVAILABLE" : "FULL")}>
            {ride.availableSeats > 0 ? `${ride.availableSeats} seats` : "Full"}
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "15px" }}>
          <div><span style={{ color: "#64748b" }}>Distance:</span> <span style={{ color: "#000000" }}>{ride.distance?.toFixed(2) || 0} km</span></div>
          <div><span style={{ color: "#64748b" }}>Price:</span> <span style={{ color: "#f59e0b", fontWeight: "600" }}>₹{ride.price}/seat</span></div>
          <div><span style={{ color: "#64748b" }}>Vehicle:</span> <span style={{ color: "#000000" }}>{ride.vehicleType || "Not specified"}</span></div>
        </div>

        {ride.availableSeats > 0 ? (
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <input 
              type="number" 
              placeholder="Seats" 
              min="1" 
              max={ride.availableSeats} 
              style={{ ...styles.input, width: "100px", padding: "10px 12px" }}
              value={seatsToBook} 
              onChange={handleSeatChange} 
            />
            {totalFare > 0 && (
              <span style={{ color: "#f59e0b", fontWeight: "600" }}>Total: ₹{totalFare}</span>
            )}
            <button 
              style={styles.button}
              onClick={() => handleBook(ride, seatsToBook)}
            >
              <FaBookmark /> Book Now
            </button>
          </div>
        ) : (
          <p style={{ color: "#ef4444", marginTop: "10px" }}>No seats available</p>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.topBar}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>Passenger Dashboard</h1>
            {!loadingRating && averageRating > 0 && (
              <div style={styles.ratingBadge}>
                <FaStar /> {averageRating.toFixed(1)}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}>
              <FaBell size={20} color="#000000" />
              {/* Unread Message Badge */}
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "10px",
                  minWidth: "18px",
                  textAlign: "center"
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
              {notifications.length > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "10px"
                }}>
                  {notifications.length}
                </span>
              )}
            </div>
            <button style={styles.button} onClick={() => navigate("/profile")}><FaUser /> Profile</button>
            <button style={styles.button} onClick={logout}><FaSignOutAlt /> Logout</button>
          </div>
        </div>

        {showNotifications && (
          <div onClick={(e) => e.stopPropagation()} style={{
            position: "absolute",
            top: "100px",
            right: "40px",
            width: "320px",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            padding: "16px",
            zIndex: 1000,
            border: "1px solid #e2e8f0",
          }}>
            <h4 style={{ color: "#000000", marginBottom: "12px" }}>Notifications</h4>
            {notifications.length === 0 ? (
              <p style={{ color: "#64748b" }}>No notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} onClick={() => setShowNotifications(false)} style={{
                  borderLeft: `3px solid ${getColor(n.type)}`,
                  padding: "10px",
                  marginBottom: "8px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}>
                  <p style={{ margin: 0, color: "#1e293b", fontSize: "13px" }}>{n.message}</p>
                  <small style={{ color: "#64748b" }}>{n.time}</small>
                </div>
              ))
            )}
          </div>
        )}

        <div style={styles.navButtons}>
          <button style={styles.button} onClick={() => setActiveSection("search")}><FaSearch /> Search Ride</button>
          <button style={styles.button} onClick={() => { setActiveSection("bookings"); fetchBookings(); }}><FaBookmark /> My Bookings</button>
          <button style={styles.reviewButton} onClick={() => setShowReviews(true)}><FaStar /> My Reviews</button>
          <Link to="/transactions"><button style={styles.button}><FaCreditCard /> History</button></Link>
          <Link to="/route-matching"><button style={styles.button}><FaRoute /> Smart Match</button></Link>
        </div>

        {showReviews && loggedInUser && (
          <PassengerReviews 
            passengerId={loggedInUser.id}
            passengerName={loggedInUser.name}
            onClose={handleReviewModalClose}
            initialTab={reviewTab}
            setReviewTab={setReviewTab}
          />
        )}

        {activeSection === "search" && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}><FaSearch /> Find Your Ride</h3>
            <div style={styles.searchContainer}>
              <div style={styles.searchRow}>
                <div style={styles.inputWrapper}>
                  <FaMapMarkerAlt style={styles.inputIcon} />
                  <input 
                    style={styles.input} 
                    placeholder="From where?" 
                    value={source} 
                    onChange={(e) => setSource(e.target.value)} 
                  />
                </div>
                <div style={styles.inputWrapper}>
                  <FaMapMarkerAlt style={styles.inputIcon} />
                  <input 
                    style={styles.input} 
                    placeholder="Going to?" 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)} 
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <div style={styles.inputWrapper}>
                  <FaCalendarAlt style={styles.inputIcon} />
                  <input 
                    style={styles.input} 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                  />
                </div>
              </div>
              
              <div style={styles.searchButtonWrapper}>
                <button style={styles.searchButton} onClick={handleSearch}>
                  <FaSearch /> Search Rides
                </button>
              </div>
            </div>

            {hasSearched && (rides.length > 0 ? rides.map((ride) => (
              <RideCardComponent key={ride.id} ride={ride} handleBook={handleBook} />
            )) : <div style={styles.emptyState}>No rides found. Try different search.</div>)}
          </div>
        )}

        {activeSection === "bookings" && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}><FaBookmark /> My Bookings</h3>
            {loadingBookings ? (
              <div style={styles.emptyState}>Loading your bookings...</div>
            ) : myBookings.length > 0 ? (
              myBookings.map((booking) => {
                const pricePerSeat = booking.ride?.price || 0;
                const totalFare = (booking.seatsBooked || 0) * pricePerSeat;

                return (
                  <div key={booking.id} style={styles.bookingCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "15px" }}>
                      <div>
                        <h4 style={{ fontSize: "18px", fontWeight: "600", color: "#000000", margin: 0 }}>
                          {booking.source || booking.ride?.source} → {booking.destination || booking.ride?.destination}
                        </h4>
                        <div style={{ display: "flex", gap: "15px", marginTop: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "13px", color: "#64748b" }}>📅 {booking.ride?.date}</span>
                          <span style={{ fontSize: "13px", color: "#64748b" }}>👤 {booking.seatsBooked} seat(s)</span>
                        </div>
                      </div>
                      <div style={styles.statusBadge(booking.status)}>{booking.status}</div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "15px" }}>
                      <div><span style={{ color: "#64748b" }}>Price:</span> <span style={{ color: "#f59e0b" }}>₹{pricePerSeat}/seat</span></div>
                      <div><span style={{ color: "#64748b" }}>Total:</span> <span style={{ color: "#000000", fontWeight: "600" }}>₹{totalFare}</span></div>
                      <div><span style={{ color: "#64748b" }}>Driver:</span> <span style={{ color: "#000000" }}>{booking.ride?.driverEmail}</span></div>
                    </div>

                    {(booking.status === "PENDING" || booking.status === "CONFIRMED" || booking.status === "PAID") && (
  <button style={{ ...styles.button, background: "#ef4444", marginTop: "10px" }} onClick={() => handleCancelBooking(booking.id)}>
    <FaTimes /> Cancel
  </button>
)}

                    {booking.status === "CONFIRMED" && (
  <button style={{ ...styles.button, background: "#10b981", marginTop: "10px", marginLeft: "10px" }} onClick={() => handleBookingPayment(booking)}>
    <FaCreditCard /> Pay Now
  </button>
)}

{/* If status is PAID, show payment completed badge instead of pay button */}
{booking.status === "PAID" && (
  <div style={{ ...styles.statusBadge("PAID"), marginTop: "10px", display: "inline-block" }}>
    <FaCheckCircle /> Payment Completed
  </div>
)}

                    {booking.status === "COMPLETED" && !booking.passengerReviewed && (
  <button style={{ ...styles.button, background: "#f59e0b", marginTop: "10px" }} onClick={() => handleReview(booking)}>
    <FaStar /> Review Driver
  </button>
)}

                    {booking.passengerReviewed && (
                      <div style={{ ...styles.statusBadge("COMPLETED"), marginTop: "10px", display: "inline-block" }}>
                        <FaCheckCircle /> Reviewed
                      </div>
                    )}

                    {/* Chat Button */}
                    {(booking.status === "CONFIRMED" || booking.status === "PAID" || booking.status === "STARTED" || booking.status === "COMPLETED") && (
                      <button
                        style={{
                          ...styles.button,
                          background: '#8b5cf6',
                          marginTop: '10px',
                          marginRight: '10px'
                        }}
                        onClick={() => {
                          setSelectedChatBooking(booking);
                          setChatUser({
                            id: booking.ride?.driverId,
                            name: booking.ride?.driverName || booking.ride?.driverEmail,
                            email: booking.ride?.driverEmail
                          });
                        }}
                      >
                        <FaComment /> Message Driver
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={styles.emptyState}>No bookings yet. Start by searching for a ride!</div>
            )}
          </div>
        )}

        {showReviewModal && (
          <div style={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: "#000000", marginBottom: "20px", textAlign: "center" }}>Review Driver</h3>
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
                {[1,2,3,4,5].map((star) => (
                  <span key={star} style={{ fontSize: "40px", cursor: "pointer", color: star <= rating ? "#f59e0b" : "#cbd5e1" }} onClick={() => setRating(star)}>★</span>
                ))}
              </div>
              {rating > 0 && <p style={{ textAlign: "center", color: "#f59e0b", marginBottom: "15px" }}>{getRatingText(rating)}</p>}
              <textarea placeholder="Write your review..." value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "16px", border: "2px solid #e2e8f0", color: "#000000", minHeight: "100px", marginBottom: "20px" }} />
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={submitReview} style={{ ...styles.button, flex: 1, background: "#10b981" }}>Submit</button>
                <button onClick={() => setShowReviewModal(false)} style={{ ...styles.button, flex: 1, background: "#ef4444" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        
        {/* ChatBox Modal */}
        {selectedChatBooking && chatUser && (
          <ChatBox
            booking={selectedChatBooking}
            currentUser={loggedInUser}
            otherUser={chatUser}
            onClose={() => setSelectedChatBooking(null)}
          />
        )}
      </div>
    </div>
  );
}

export default PassengerDashboard;