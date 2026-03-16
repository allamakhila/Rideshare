package com.rideshare.backend.repository;

import com.rideshare.backend.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {

    // =============================
    // Search rides by source, destination, date and available seats
    // =============================
    List<Ride> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDateAndAvailableSeatsGreaterThan(
            String source,
            String destination,
            LocalDate date,
            int seats
    );

    // =============================
    // Convenience method for RideService search
    // =============================
    default List<Ride> findBySourceAndDestinationAndDate(String source, String destination, LocalDate date) {
        // Use the above method with availableSeats > 0 by default
        return findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDateAndAvailableSeatsGreaterThan(
                source, destination, date, 0
        );
    }

    // =============================
    // Get rides posted by a driver
    // =============================
    List<Ride> findByDriverEmail(String email);

    // =============================
    // Get rides by status (e.g., CANCELLED, COMPLETED)
    // =============================
    List<Ride> findByRideStatus(String rideStatus);

    // =============================
    // Find rides by date with available seats (for route matching)
    // =============================
    List<Ride> findByDateAndAvailableSeatsGreaterThan(LocalDate date, int seats);
}