import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PassengerDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("search");
  const [rides, setRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const styles = {
    container: {
      padding: "30px",
      fontFamily: "Arial",
      backgroundColor: "#b3d9ff",
      minHeight: "100vh",
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "30px",
    },
    button: {
      padding: "8px 15px",
      backgroundColor: "#2196F3",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "10px"
    },
    section: {
      backgroundColor: "#e6f2ff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    },
    input: {
      width: "100%",
      padding: "8px",
      margin: "8px 0",
      borderRadius: "5px",
      border: "1px solid #ccc"
    },
    rideCard: {
      border: "1px solid #ddd",
      padding: "15px",
      borderRadius: "8px",
      marginTop: "10px"
    }
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
      const passengerBookings = storedBookings.filter(
        (booking) => booking.passengerEmail === loggedInUser.email
      );
      setMyBookings(passengerBookings);
    }
  }, []);

  // ✅ SEARCH FUNCTION
  const handleSearch = async () => {
    if (!source || !destination || !date) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8081/api/rides/search",
        {
          params: {
            source: source.trim(),
            destination: destination.trim(),
            date: date
          }
        }
      );

      setRides(response.data);
      setHasSearched(true);

    } catch (error) {
      console.error("Search error:", error);
      alert("Error fetching rides.");
    }
  };

  // ✅ BOOK FUNCTION
  const handleBook = async (ride, seatsToBook) => {

    if (!seatsToBook || seatsToBook <= 0) {
      alert("Enter valid seats.");
      return;
    }

    if (seatsToBook > ride.availableSeats) {
      alert("Not enough seats available.");
      return;
    }

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      await axios.post(
        "http://localhost:8081/api/rides/book",
        null,
        {
          params: {
            rideId: ride.id,
            passengerEmail: loggedInUser.email,
            passengerName: loggedInUser.name,
            seats: seatsToBook
          }
        }
      );

      alert("Ride booked successfully!");

      handleSearch(); // refresh rides

    } catch (error) {
      console.error("Booking error:", error);
      alert("Error booking ride.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <h2>Passenger Dashboard</h2>
        <button style={styles.button} onClick={logout}>
          Logout
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button style={styles.button} onClick={() => setActiveSection("search")}>
          Search Ride
        </button>

        <button style={styles.button} onClick={() => setActiveSection("bookings")}>
          My Bookings
        </button>
      </div>

      {activeSection === "search" && (
        <div style={styles.section}>
          <h3>Search Ride</h3>

          <input
            style={styles.input}
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <input
            style={styles.input}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button style={styles.button} onClick={handleSearch}>
            Search
          </button>

          {hasSearched && (
            rides.length > 0 ? (
              rides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  handleBook={handleBook}
                  styles={styles}
                />
              ))
            ) : (
              <p style={{ marginTop: "15px" }}>No rides found.</p>
            )
          )}
        </div>
      )}

      {activeSection === "bookings" && (
        <div style={styles.section}>
          <h3>My Bookings</h3>

          {myBookings.length > 0 ? (
            myBookings.map((booking) => (
              <div key={booking.id} style={styles.rideCard}>
                <p><strong>{booking.source} → {booking.destination}</strong></p>
                <p>Date: {booking.date}</p>
                <p>Seats Booked: {booking.seatsBooked}</p>
              </div>
            ))
          ) : (
            <p>No bookings yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

function RideCard({ ride, handleBook, styles }) {
  const [seatsToBook, setSeatsToBook] = useState("");

  return (
    <div style={styles.rideCard}>
      <p><strong>{ride.source} → {ride.destination}</strong></p>
      <p>Date: {ride.date}</p>
      <p><strong>Available Seats: {ride.availableSeats}</strong></p>
      <p>Price: ₹{ride.price}</p>
      <p>Vehicle: {ride.vehicleType}</p>
      <p>License Plate: {ride.licensePlate}</p>

      {ride.availableSeats > 0 ? (
        <>
          <input
            type="number"
            placeholder="Seats to book"
            min="1"
            max={ride.availableSeats}
            style={styles.input}
            value={seatsToBook}
            onChange={(e) => setSeatsToBook(Number(e.target.value))}
          />

          <button
            style={styles.button}
            onClick={() => handleBook(ride, seatsToBook)}
          >
            Book Ride
          </button>
        </>
      ) : (
        <p style={{ color: "red" }}>No seats available</p>
      )}
    </div>
  );
}

export default PassengerDashboard;