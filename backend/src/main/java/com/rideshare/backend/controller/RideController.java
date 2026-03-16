package com.rideshare.backend.controller;

import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.entity.Booking;
import com.rideshare.backend.repository.BookingRepository;
import com.rideshare.backend.service.DistanceService;
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
    private RideService rideService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DistanceService distanceService;

    // =============================
    // POST RIDE (Driver creates ride)
    // =============================
    @PostMapping
    public ResponseEntity<Ride> postRide(@RequestBody Ride ride) {
        double distance = distanceService.calculateDistance(
                ride.getSourceLat(),
                ride.getSourceLng(),
                ride.getDestinationLat(),
                ride.getDestinationLng()
        );
        ride.setDistance(distance);
        Ride savedRide = rideService.postRide(ride);
        return ResponseEntity.ok(savedRide);
    }

    // =============================
    // GET ALL RIDES
    // =============================
    @GetMapping
    public List<Ride> getAllRides() {
        return rideService.getAllRides();
    }

    // =============================
    // SEARCH RIDES
    // =============================
    @GetMapping("/search")
    public List<Ride> searchRides(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<Ride> rides = rideService.searchRides(source, destination, date);

        // Dynamically calculate distance for search results
        for (Ride ride : rides) {
            double distance = distanceService.calculateDistance(
                    ride.getSourceLat(),
                    ride.getSourceLng(),
                    ride.getDestinationLat(),
                    ride.getDestinationLng()
            );
            ride.setDistance(distance);
        }

        return rides;
    }

    // =============================
    // BOOK RIDE
    // =============================
    @PostMapping("/book")
    public ResponseEntity<Booking> bookRide(
            @RequestParam Long rideId,
            @RequestParam String passengerEmail,
            @RequestParam String passengerName,
            @RequestParam int seats) {

        Optional<Ride> rideOptional = rideService.getAllRides()
                .stream()
                .filter(r -> r.getId().equals(rideId))
                .findFirst();

        if (rideOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Ride ride = rideOptional.get();

        if (seats <= 0 || ride.getAvailableSeats() < seats) {
            return ResponseEntity.badRequest().build();
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

        rideService.notifyDriver("Passenger booked your ride: " + rideId);

        return ResponseEntity.ok(booking);
    }

    // =============================
    // CANCEL BOOKING
    // =============================
    @PostMapping("/cancel")
    public String cancelBooking(@RequestParam Long bookingId) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (bookingOptional.isEmpty()) return "Booking not found";

        Booking booking = bookingOptional.get();
        Ride ride = booking.getRide();

        if (ride != null) {
            ride.setAvailableSeats(ride.getAvailableSeats() + booking.getSeatsBooked());
            rideService.postRide(ride);
        }

        bookingRepository.deleteById(bookingId);
        return "Booking cancelled successfully";
    }

    // =============================
    // DRIVER RIDE HISTORY
    // =============================
    @GetMapping("/history/driver/{email}")
    public List<Ride> getDriverRideHistory(@PathVariable String email) {
        return rideService.getRidesByDriver(email);
    }

    // =============================
    // DRIVER BOOKINGS RECEIVED (NEW)
    // =============================
    @GetMapping("/driver/bookings/{email}")
    public List<Booking> getDriverBookings(@PathVariable String email) {
        List<Ride> rides = rideService.getRidesByDriver(email);
        List<Booking> allBookings = new java.util.ArrayList<>();

        for (Ride ride : rides) {
            List<Booking> bookings = bookingRepository.findByRideId(ride.getId());
            allBookings.addAll(bookings);
        }

        return allBookings;
    }

    // =============================
    // PASSENGER RIDE HISTORY
    // =============================
    @GetMapping("/history/passenger/{email}")
    public List<Booking> getPassengerRideHistory(@PathVariable String email) {
        List<Booking> bookings = bookingRepository.findByPassengerEmail(email);

        // Force loading Ride object to include all Milestone 2 fields
        bookings.forEach(b -> {
            if (b.getRide() != null) {
                b.getRide().getDriverEmail();
                b.getRide().getDate();
                b.getRide().getTime();
                b.getRide().getVehicleType();
                b.getRide().getLicensePlate();
                b.getRide().getRideStatus();
                b.getRide().getCreatedAt();
                b.getRide().getCompletedAt();
            }
        });

        return bookings;
    }

    // =============================
    // COMPLETE RIDE
    // =============================
    @PutMapping("/complete/{rideId}")
    public ResponseEntity<?> completeRide(@PathVariable Long rideId) {
        Optional<Ride> rideOptional = rideService.getAllRides()
                .stream()
                .filter(r -> r.getId().equals(rideId))
                .findFirst();

        if (rideOptional.isEmpty()) return ResponseEntity.badRequest().body("Ride not found");

        Ride ride = rideOptional.get();
        ride.setRideStatus("COMPLETED");
        ride.setCompletedAt(java.time.LocalDateTime.now());
        rideService.postRide(ride);

        return ResponseEntity.ok("Ride marked as completed");
    }

    // =============================
    // REJECT RIDE (Driver)
    // =============================
    @PutMapping("/reject/{rideId}")
    public String rejectRide(@PathVariable Long rideId) {
        rideService.rejectRide(rideId);
        return "Ride rejected successfully";
    }

    // =============================
    // RESCHEDULE RIDE (Driver)
    // =============================
    @PutMapping("/reschedule/{rideId}")
    public Ride rescheduleRide(@PathVariable Long rideId, @RequestBody Ride updatedRide) {
        return rideService.rescheduleRide(rideId, updatedRide);
    }

    // =============================
    // ROUTE MATCHING ENDPOINT
    // =============================
    @GetMapping("/match")
    public List<Ride> matchRides(
            @RequestParam String passengerSource,
            @RequestParam String passengerDestination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return rideService.matchRides(passengerSource, passengerDestination, date);
    }
}