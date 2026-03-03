import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerDashboard from "./pages/PassengerDashboard";

// ✅ New Pages
import PostRide from "./pages/PostRide";
import BookingsReceived from "./pages/BookingsReceived";
import SearchRide from "./pages/SearchRide";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/passenger" element={<PassengerDashboard />} />

        {/* Driver Routes */}
        <Route path="/post-ride" element={<PostRide />} />
        <Route path="/bookings-received" element={<BookingsReceived />} />

        {/* Passenger Routes */}
        <Route path="/search-ride" element={<SearchRide />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;