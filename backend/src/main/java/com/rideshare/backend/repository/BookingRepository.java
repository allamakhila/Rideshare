package com.rideshare.backend.repository;

import com.rideshare.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByPassengerEmail(String passengerEmail);

    // ✅ Correct way using relationship
    List<Booking> findByRide_DriverEmail(String driverEmail);

    // ✅ New method to find booking by Razorpay order ID
    Booking findByOrderId(String orderId);

    List<Booking> findByRideId(Long rideId);
    
    // ✅ ADD THESE METHODS FOR EARNINGS CALCULATION
    
    // Method 1: Sum totalAmount for bookings with status = 'PAID'
    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = 'PAID'")
    Double sumTotalAmountByStatusPaid();
    
    // Method 2: Sum totalAmount for bookings with specific status (more flexible)
    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = :status")
    Double sumTotalAmountByStatus(@Param("status") String status);
    
    // Method 3: Count total number of paid bookings
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'PAID'")
    Long countPaidBookings();
    
    // Method 4: Get all paid bookings (if you need the list)
    List<Booking> findByStatus(String status);
    
    // Method 5: Get earnings within date range (if you have bookingTime field)
    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = 'PAID' AND b.bookingTime BETWEEN :startDate AND :endDate")
    Double sumEarningsBetweenDates(@Param("startDate") java.time.LocalDateTime startDate, 
                                   @Param("endDate") java.time.LocalDateTime endDate);
}