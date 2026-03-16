package com.rideshare.backend.repository;

import com.rideshare.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByStatus(String status);

    // Driver transaction history
    List<Payment> findByRide_DriverEmail(String email);

    // ✅ Passenger transaction history
    List<Payment> findByBooking_PassengerEmail(String email);

}