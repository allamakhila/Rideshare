package com.rideshare.backend.controller;

import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.entity.Booking;
import com.rideshare.backend.repository.BookingRepository;
import com.rideshare.backend.service.RideService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin("*")
public class RideController {

    @Autowired
    private RideService rideService;   // ✅ Use Service now

    @Autowired
    private BookingRepository bookingRepository;

    // Driver posts ride
    @PostMapping("/post")
    public ResponseEntity<String> postRide(@RequestBody Ride ride) {
        rideService.postRide(ride);
        return ResponseEntity.ok("Ride posted successfully");
    }

    // Passenger get all rides
    @GetMapping("/all")
    public List<Ride> getAllRides() {
        return rideService.getAllRides();
    }

    // ✅ SEARCH RIDES (Correct Version)
    @GetMapping("/search")
    public List<Ride> searchRides(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return rideService.searchRides(source, destination, date);
    }

    // Book ride
    @PostMapping("/book")
    public String bookRide(
            @RequestParam Long rideId,
            @RequestParam String passengerEmail,
            @RequestParam String passengerName,
            @RequestParam int seats) {

        Optional<Ride> rideOptional = rideService.getAllRides()
                .stream()
                .filter(r -> r.getId().equals(rideId))
                .findFirst();

        if (rideOptional.isEmpty()) {
            return "Ride not found";
        }

        Ride ride = rideOptional.get();

        if (seats <= 0) {
            return "Invalid seat count";
        }

        if (ride.getAvailableSeats() < seats) {
            return "Not enough seats available";
        }

        ride.setAvailableSeats(ride.getAvailableSeats() - seats);
        rideService.postRide(ride);

        Booking booking = new Booking();
        booking.setRide(ride);
        booking.setPassengerEmail(passengerEmail);
        booking.setPassengerName(passengerName);
        booking.setSeatsBooked(seats);
        booking.setSource(ride.getSource());
        booking.setDestination(ride.getDestination());
        booking.setStatus("PENDING");

        bookingRepository.save(booking);

        return "Ride request sent to driver";
    }

    // Cancel booking
    @PostMapping("/cancel")
    public String cancelBooking(@RequestParam Long bookingId) {

        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);

        if (bookingOptional.isEmpty()) {
            return "Booking not found";
        }

        Booking booking = bookingOptional.get();
        Ride ride = booking.getRide();

        if (ride != null) {
            ride.setAvailableSeats(
                    ride.getAvailableSeats() + booking.getSeatsBooked());
            rideService.postRide(ride);
        }

        bookingRepository.deleteById(bookingId);

        return "Booking cancelled successfully";
    }
}