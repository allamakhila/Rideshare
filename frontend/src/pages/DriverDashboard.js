import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BookingsReceived from "./BookingsReceived";
import DriverReviews from "./DriverReviews";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { FaCar, FaBookmark, FaStar, FaBell, FaUser, FaSignOutAlt, FaRoute, FaCreditCard, FaPlusCircle, FaComment } from "react-icons/fa";
import ChatBox from "./ChatBox"; 


function DriverDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("bookings");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [showReviews, setShowReviews] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingRating, setLoadingRating] = useState(false);

  const [selectedChatBooking, setSelectedChatBooking] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    const saved = localStorage.getItem("driverNotifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

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

  // ✅ SINGLE WebSocket for ALL real-time features (Combined)
  useEffect(() => {
    if (!loggedInUser) return;
    
    console.log('Setting up WebSocket for driver:', loggedInUser.id);
    
    const socket = new SockJS('http://localhost:8081/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log('✅ Connected to WebSocket!');
      
      // 1. Subscribe to driver notifications
      client.subscribe(`/topic/driver/${loggedInUser.email}`, (message) => {
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
          localStorage.setItem("driverNotifications", JSON.stringify(updated));
          return updated;
        });
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
    header: {
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
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#000000",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "15px",
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
    card: {
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "28px",
      padding: "28px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    },
    notificationBell: {
      position: "relative",
      cursor: "pointer",
      color: "#000000",
    },
    notificationBadge: {
      position: "absolute",
      top: "-8px",
      right: "-8px",
      background: "#ef4444",
      color: "white",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: "10px",
    },
    notificationDropdown: {
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
    },
    notificationTitle: {
      color: "#000000",
      marginBottom: "12px",
      fontSize: "16px",
      fontWeight: "600",
    },
    notificationItem: (type) => ({
      borderLeft: `3px solid ${getColor(type)}`,
      padding: "10px",
      marginBottom: "8px",
      background: "#f8fafc",
      borderRadius: "8px",
      cursor: "pointer",
    }),
    notificationMessage: {
      margin: 0,
      color: "#1e293b",
      fontSize: "13px",
    },
    notificationTime: {
      color: "#64748b",
      fontSize: "11px",
    },
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const getColor = (type) => {
    switch (type) {
      case "CONFIRMED": return "#10b981";
      case "PAID": return "#06b6d4";     
      case "REJECTED": return "#ef4444";
      case "CANCELLED": return "#f97316";
      case "BOOKING": return "#3b82f6";
      case "STARTED": return "#8b5cf6";
      case "COMPLETED": return "#06b6d4";
      default: return "#64748b";
    }
  };

  const handleReviewModalClose = () => {
    setShowReviews(false);
    fetchAverageRating();
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.title}>
            <FaCar style={{ color: "#3b82f6" }} /> Driver Dashboard
            {!loadingRating && averageRating > 0 && (
              <div style={styles.ratingBadge}>
                <FaStar /> {averageRating.toFixed(1)}
              </div>
            )}
            {!loadingRating && averageRating === 0 && (
              <div style={{ ...styles.ratingBadge, background: "#9ca3af" }}>
                <FaStar /> No ratings yet
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div
              style={styles.notificationBell}
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
              }}
            >
              <FaBell size={20} />
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
                <span style={styles.notificationBadge}>
                  {notifications.length}
                </span>
              )}
            </div>

            <button style={styles.button} onClick={() => navigate("/profile")}>
              <FaUser /> Profile
            </button>

            <button style={styles.button} onClick={logout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={styles.notificationDropdown}
          >
            <h4 style={styles.notificationTitle}>Notifications</h4>
            {notifications.length === 0 ? (
              <p style={{ color: "#64748b" }}>No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={styles.notificationItem(n.type)}
                  onClick={() => setShowNotifications(false)}
                >
                  <p style={styles.notificationMessage}>{n.message}</p>
                  <small style={styles.notificationTime}>{n.time}</small>
                </div>
              ))
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={styles.navButtons}>
          <button style={styles.button} onClick={() => navigate("/post-ride")}>
            <FaPlusCircle /> Post a Ride
          </button>
          <button
            style={styles.button}
            onClick={() => setActiveSection("bookings")}
          >
            <FaBookmark /> Bookings Received
          </button>
          <button
            style={styles.reviewButton}
            onClick={() => setShowReviews(true)}
          >
            <FaStar /> View My Reviews
          </button>
          <Link to="/transactions">
            <button style={styles.button}>
              <FaCreditCard /> Transaction History
            </button>
          </Link>
        </div>

        {/* Reviews Modal */}
        {showReviews && loggedInUser && (
          <DriverReviews
            driverId={loggedInUser.id}
            driverName={loggedInUser.name}
            onClose={handleReviewModalClose}
          />
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

        {/* Main Card */}
        <div style={styles.card}>
          {activeSection === "bookings" ? (
            <BookingsReceived 
              setNotifications={setNotifications}
              onOpenChat={(booking, otherUser) => {
                setSelectedChatBooking(booking);
                setChatUser(otherUser);
              }}
            />
          ) : (
            <p style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
              Click "Post a Ride" to add a new ride.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;