package com.rideshare.backend.repository;

import com.rideshare.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByPassengerEmail(String passengerEmail);

    // ✅ Correct way using relationship
    List<Booking> findByRide_DriverEmail(String driverEmail);
}