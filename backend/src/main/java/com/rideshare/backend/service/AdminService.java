package com.rideshare.backend.service;

import com.rideshare.backend.entity.User;
import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.entity.Booking;
import com.rideshare.backend.repository.UserRepository;
import com.rideshare.backend.repository.RideRepository;
import com.rideshare.backend.repository.BookingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // ✅ Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Block user
    public String blockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(true);
        userRepository.save(user);
        return "User blocked successfully";
    }

    // ✅ Unblock user
    public String unblockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(false);
        userRepository.save(user);
        return "User unblocked successfully";
    }

    // ✅ Get all rides
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    // ✅ Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ✅ Get total earnings from paid bookings
    public Double getTotalEarnings() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        // Calculate earnings from bookings with PAID status
        return allBookings.stream()
                .filter(booking -> "PAID".equals(booking.getStatus()))
                .mapToDouble(booking -> {
                    // Use totalAmount from Booking entity
                    if (booking.getTotalAmount() != null) {
                        return booking.getTotalAmount();
                    } 
                    return 0.0;
                })
                .sum();
    }

    // ✅ Alternative: Use repository query for better performance
    public Double getTotalEarningsOptimized() {
        // Use the repository method
        Double earnings = bookingRepository.sumTotalAmountByStatusPaid();
        return earnings != null ? earnings : 0.0;
    }

    // ✅ Dashboard stats with earnings included
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Basic counts
        stats.put("totalUsers", userRepository.count());
        stats.put("totalRides", rideRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        
        // Calculate cancelled rides
        long cancelledRides = rideRepository.findAll().stream()
                .filter(ride -> "CANCELLED".equals(ride.getRideStatus()))
                .count();
        stats.put("cancelledRides", cancelledRides);
        
        // ✅ Calculate total earnings (using optimized method)
        Double totalEarnings = getTotalEarningsOptimized();
        stats.put("totalEarnings", totalEarnings);
        
        // Calculate active rides
        long activeRides = rideRepository.findAll().stream()
                .filter(ride -> "ACTIVE".equals(ride.getRideStatus()) || 
                                "POSTED".equals(ride.getRideStatus()))
                .count();
        stats.put("activeRides", activeRides);
        
        // Calculate completed rides
        long completedRides = rideRepository.findAll().stream()
                .filter(ride -> "COMPLETED".equals(ride.getRideStatus()))
                .count();
        stats.put("completedRides", completedRides);
        
        return stats;
    }
}