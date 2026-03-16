package com.rideshare.backend.service;

import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.repository.RideRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class RideService {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private BookingService bookingService;

    // =============================
    // POST RIDE
    // =============================
    public Ride postRide(Ride ride) {
        return rideRepository.save(ride);
    }

    // =============================
    // GET ALL RIDES
    // =============================
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    // =============================
    // SEARCH RIDES
    // =============================
    public List<Ride> searchRides(String source, String destination, LocalDate date) {
        return rideRepository.findBySourceAndDestinationAndDate(source, destination, date);
    }

    // =============================
    // GET RIDES BY DRIVER
    // =============================
    public List<Ride> getRidesByDriver(String email) {
        return rideRepository.findByDriverEmail(email);
    }

    // =============================
    // REJECT RIDE (updates ride status and notifies passengers)
    // =============================
    public void rejectRide(Long rideId) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        ride.setRideStatus("REJECTED");
        rideRepository.save(ride);

        // Notify passengers in real-time
        bookingService.notifyPassengersRideRejected(rideId);

        // Optional: old notification system
        notificationService.notifyPassenger(
                "Ride " + rideId + " has been rejected by the driver"
        );
    }

    // =============================
    // RESCHEDULE RIDE
    // =============================
    public Ride rescheduleRide(Long rideId, Ride updatedRide) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        ride.setDate(updatedRide.getDate());
        ride.setTime(updatedRide.getTime());

        Ride savedRide = rideRepository.save(ride);

        notificationService.notifyPassenger(
                "Ride " + rideId + " has been rescheduled"
        );

        return savedRide;
    }

    // =============================
    // NOTIFY DRIVER
    // =============================
    public void notifyDriver(String message) {
        notificationService.notifyDriver(message);
    }

    // =============================
    // ROUTE MATCHING
    // =============================
    public List<Ride> matchRides(String passengerSource, String passengerDestination, LocalDate date) {

        List<Ride> rides = rideRepository.findByDateAndAvailableSeatsGreaterThan(date, 0);

        List<Ride> matchedRides = new java.util.ArrayList<>();

        for (Ride ride : rides) {

            if (ride.getSource().equalsIgnoreCase(passengerSource)
                    && ride.getDestination().equalsIgnoreCase(passengerDestination)) {

                matchedRides.add(ride);
            } else if (isPartialMatch(ride, passengerSource, passengerDestination)) {
                matchedRides.add(ride);
            }
        }

        matchedRides.sort(java.util.Comparator.comparing(
                r -> r.getTime() != null ? r.getTime() : LocalTime.MIDNIGHT
        ));

        return matchedRides;
    }

    // =============================
    // PARTIAL ROUTE MATCHING
    // =============================
    private boolean isPartialMatch(Ride ride, String passengerSource, String passengerDestination) {

        return ride.getSource().toLowerCase().contains(passengerSource.toLowerCase())
                || ride.getDestination().toLowerCase().contains(passengerDestination.toLowerCase());
    }
}