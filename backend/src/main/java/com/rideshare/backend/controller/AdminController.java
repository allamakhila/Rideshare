package com.rideshare.backend.controller;

import com.rideshare.backend.entity.User;
import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.entity.Booking;
import com.rideshare.backend.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ✅ Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    // ✅ Block user
    @PutMapping("/block/{userId}")
    public String blockUser(@PathVariable Long userId) {
        return adminService.blockUser(userId);
    }

    // ✅ Unblock user
    @PutMapping("/unblock/{userId}")
    public String unblockUser(@PathVariable Long userId) {
        return adminService.unblockUser(userId);
    }

    // ✅ Get all rides
    @GetMapping("/rides")
    public List<Ride> getAllRides() {
        return adminService.getAllRides();
    }

    // ✅ Get all bookings
    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return adminService.getAllBookings();
    }

    // ✅ Dashboard stats
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return adminService.getDashboardStats();
    }
    
    // ✅ Get total earnings (optional separate endpoint)
    @GetMapping("/earnings")
    public Double getTotalEarnings() {
        return adminService.getTotalEarnings();
    }
}