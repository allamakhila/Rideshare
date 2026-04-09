import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Leaflet CSS (Required for Map)
import "leaflet/dist/leaflet.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerDashboard from "./pages/PassengerDashboard";

// ✅ Admin Pages - ADD THESE IMPORTS
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// ✅ Existing Pages
import PostRide from "./pages/PostRide";
import BookingsReceived from "./pages/BookingsReceived";
import SearchRide from "./pages/SearchRide";
import MyBookings from "./pages/MyBookings";

// ✅ Transaction History Page
import TransactionHistory from "./pages/TransactionHistory";

// ✅ Route Matching Page
import RouteMatching from "./pages/RouteMatching";

import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ ADMIN ROUTES - ADD THESE TWO LINES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />


        {/* Dashboards */}
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/passenger" element={<PassengerDashboard />} />

        {/* Driver Routes */}
        <Route path="/post-ride" element={<PostRide />} />
        <Route path="/bookings-received" element={<BookingsReceived />} />

        {/* Passenger Routes */}
        <Route path="/search-ride" element={<SearchRide />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Transaction History */}
        <Route path="/transactions" element={<TransactionHistory />} />

        {/* Smart Route Matching */}
        <Route path="/route-matching" element={<RouteMatching />} />

        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  );
}

export default App;