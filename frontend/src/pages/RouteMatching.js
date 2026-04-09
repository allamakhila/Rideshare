import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import RideMap from "../components/RideMap";
import { FaSearch, FaFilter, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign, FaUser, FaSortAmountDown, FaBookmark, FaCheckCircle } from "react-icons/fa";

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

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      padding: "40px 20px",
    },
    mainContent: {
      maxWidth: "1400px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "30px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      color: "white",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    subtitle: {
      color: "#94a3b8",
      fontSize: "14px",
    },
    searchCard: {
      background: "rgba(255,255,255,0.95)",
      borderRadius: "24px",
      padding: "28px",
      marginBottom: "30px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    },
    searchForm: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "20px",
    },
    inputGroup: {
      position: "relative",
    },
    inputIcon: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#3b82f6",
      fontSize: "16px",
    },
    input: {
      width: "100%",
      padding: "14px 16px 14px 45px",
      borderRadius: "14px",
      border: "2px solid #e2e8f0",
      background: "white",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.3s",
      color: "#1e293b",
      fontWeight: "500",
      boxSizing: "border-box",
    },
    searchButton: {
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      color: "white",
      border: "none",
      borderRadius: "14px",
      padding: "14px 28px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    },
    filterSection: {
      background: "rgba(255,255,255,0.95)",
      borderRadius: "24px",
      padding: "20px 28px",
      marginBottom: "30px",
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      alignItems: "center",
    },
    filterTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#1e293b",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    filterSelect: {
      padding: "10px 16px",
      borderRadius: "12px",
      border: "2px solid #e2e8f0",
      background: "white",
      fontSize: "14px",
      outline: "none",
      color: "#1e293b",
      cursor: "pointer",
    },
    filterInput: {
      padding: "10px 16px",
      borderRadius: "12px",
      border: "2px solid #e2e8f0",
      background: "white",
      fontSize: "14px",
      outline: "none",
      width: "150px",
    },
    mapSection: {
      background: "rgba(255,255,255,0.95)",
      borderRadius: "24px",
      padding: "20px",
      marginBottom: "30px",
    },
    mapTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "15px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    resultsSection: {
      marginTop: "30px",
    },
    resultsTitle: {
      fontSize: "22px",
      fontWeight: "600",
      color: "white",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    ridesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
      gap: "20px",
    },
    rideCard: {
      background: "white",
      borderRadius: "20px",
      padding: "20px",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      border: "1px solid #e2e8f0",
    },
    rideHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "15px",
      paddingBottom: "15px",
      borderBottom: "2px solid #e2e8f0",
    },
    rideRoute: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1e293b",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexWrap: "wrap",
    },
    rideStatus: (availableSeats) => ({
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      background: availableSeats > 0 ? "#dcfce7" : "#fee2e2",
      color: availableSeats > 0 ? "#166534" : "#991b1b",
    }),
    rideDetails: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
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
      fontSize: "12px",
      color: "#64748b",
    },
    detailValue: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#1e293b",
    },
    priceHighlight: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#f59e0b",
    },
    bookingSection: {
      marginTop: "15px",
      paddingTop: "15px",
      borderTop: "1px solid #e2e8f0",
      display: "flex",
      gap: "12px",
      alignItems: "center",
      flexWrap: "wrap",
    },
    seatInput: {
      width: "80px",
      padding: "10px",
      borderRadius: "12px",
      border: "2px solid #e2e8f0",
      fontSize: "14px",
      textAlign: "center",
    },
    bookButton: {
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      padding: "10px 20px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    },
    loadingState: {
      textAlign: "center",
      padding: "60px",
      color: "#94a3b8",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px",
      background: "rgba(255,255,255,0.05)",
      borderRadius: "24px",
    },
    emptyIcon: {
      fontSize: "64px",
      color: "#475569",
      marginBottom: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <FaSearch /> Smart Ride Matching
          </h1>
          <p style={styles.subtitle}>Find and book rides that match your route</p>
        </div>

        {/* Search Card */}
        <div style={styles.searchCard}>
          <form onSubmit={handleSearch}>
            <div style={styles.searchForm}>
              <div style={styles.inputGroup}>
                <FaMapMarkerAlt style={styles.inputIcon} />
                <input
                  style={styles.input}
                  placeholder="From where?"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <FaMapMarkerAlt style={styles.inputIcon} />
                <input
                  style={styles.input}
                  placeholder="Going to?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <FaCalendarAlt style={styles.inputIcon} />
                <input
                  type="date"
                  style={styles.input}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" style={styles.searchButton}>
              <FaSearch /> Search Rides
            </button>
          </form>
        </div>

        {/* Filters Section */}
        <div style={styles.filterSection}>
          <div style={styles.filterTitle}>
            <FaFilter /> Filters:
          </div>
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="ALL">All Vehicles</option>
            <option value="CAR">Car</option>
            <option value="SUV">SUV</option>
            <option value="HatchBack">HatchBack</option>
            <option value="Sedan">Sedan</option>
          </select>
          <input
            type="number"
            placeholder="Max Price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={styles.filterInput}
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">Sort By</option>
            <option value="price">Cheapest First</option>
            <option value="seats">Most Seats Available</option>
          </select>
        </div>

        {/* Map Section */}
        <div style={styles.mapSection}>
          <div style={styles.mapTitle}>
            <FaMapMarkerAlt /> Route Map
          </div>
          <RideMap rides={filteredRides} />
        </div>

        {/* Results Section */}
        <div style={styles.resultsSection}>
          <div style={styles.resultsTitle}>
            <FaCar /> Available Rides ({filteredRides.length})
          </div>

          {loading && (
            <div style={styles.loadingState}>
              <div>Searching for rides...</div>
            </div>
          )}

          {error && (
            <div style={{ ...styles.loadingState, color: "#ef4444" }}>
              {error}
            </div>
          )}

          {!loading && filteredRides.length === 0 && !error && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🚗</div>
              <p style={{ color: "#94a3b8" }}>No rides found for your search.</p>
              <p style={{ color: "#64748b", fontSize: "13px", marginTop: "8px" }}>
                Try different dates or locations
              </p>
            </div>
          )}

          <div style={styles.ridesGrid}>
            {filteredRides.map((ride) => (
              <div key={ride.id} style={styles.rideCard}>
                <div style={styles.rideHeader}>
                  <div style={styles.rideRoute}>
                    <FaMapMarkerAlt style={{ color: "#ef4444", fontSize: "12px" }} />
                    {ride.source}
                    <span>→</span>
                    <FaMapMarkerAlt style={{ color: "#10b981", fontSize: "12px" }} />
                    {ride.destination}
                  </div>
                  <div style={styles.rideStatus(ride.availableSeats)}>
                    {ride.availableSeats} seats left
                  </div>
                </div>

                <div style={styles.rideDetails}>
                  <div style={styles.detailItem}>
                    <FaCalendarAlt style={styles.detailIcon} />
                    <div>
                      <div style={styles.detailLabel}>Date</div>
                      <div style={styles.detailValue}>{ride.date}</div>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <FaUser style={styles.detailIcon} />
                    <div>
                      <div style={styles.detailLabel}>Driver</div>
                      <div style={styles.detailValue}>
                        {ride.driverEmail?.split('@')[0]}
                      </div>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <FaCar style={styles.detailIcon} />
                    <div>
                      <div style={styles.detailLabel}>Vehicle</div>
                      <div style={styles.detailValue}>{ride.vehicleType || "Standard"}</div>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <FaRupeeSign style={styles.detailIcon} />
                    <div>
                      <div style={styles.detailLabel}>Price</div>
                      <div style={styles.priceHighlight}>₹{ride.price}</div>
                    </div>
                  </div>
                </div>

                <div style={styles.bookingSection}>
                  <input
                    type="number"
                    min="1"
                    max={ride.availableSeats}
                    value={seatsToBook}
                    onChange={(e) => setSeatsToBook(Number(e.target.value))}
                    style={styles.seatInput}
                    disabled={ride.availableSeats === 0}
                  />
                  <span style={{ fontSize: "14px", color: "#64748b" }}>
                    Total: ₹{ride.price * seatsToBook}
                  </span>
                  <button
                    onClick={() => handleBookSeat(ride.id)}
                    disabled={ride.availableSeats === 0 || bookingLoading}
                    style={styles.bookButton}
                  >
                    {ride.availableSeats === 0 ? (
                      "Full"
                    ) : bookingLoading ? (
                      "Booking..."
                    ) : (
                      <>
                        <FaBookmark /> Book Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteMatching;