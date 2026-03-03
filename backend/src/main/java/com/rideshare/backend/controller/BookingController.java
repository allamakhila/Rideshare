package com.rideshare.backend.controller;

import com.rideshare.backend.entity.Booking;
import com.rideshare.backend.repository.BookingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    // =========================
    // Passenger booking history
    // =========================
    @GetMapping("/passenger")
    public List<Booking> getPassengerBookings(@RequestParam String email) {
        return bookingRepository.findByPassengerEmail(email);
    }

    // =========================
    // Driver bookings received
    // =========================
    @GetMapping("/driver/{email}")
public List<Booking> getDriverBookings(@PathVariable String email) {
    return bookingRepository.findByRide_DriverEmail(email);
}
@PutMapping("/confirm/{id}")
public Booking confirmBooking(@PathVariable Long id) {
    Booking booking = bookingRepository.findById(id).orElseThrow();
    booking.setStatus("CONFIRMED");
    return bookingRepository.save(booking);
}

@PutMapping("/reject/{id}")
public Booking rejectBooking(@PathVariable Long id) {
    Booking booking = bookingRepository.findById(id).orElseThrow();
    booking.setStatus("REJECTED");
    return bookingRepository.save(booking);
}
}