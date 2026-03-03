package com.rideshare.backend.repository;

import com.rideshare.backend.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDateAndAvailableSeatsGreaterThan(
            String source,
            String destination,
            LocalDate date,
            int seats
    );

    List<Ride> findByDriverEmail(String email);
}