package com.rideshare.backend.service;

import com.rideshare.backend.entity.Booking;
import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.repository.BookingRepository;
import com.rideshare.backend.repository.RideRepository;
import com.rideshare.backend.dto.NotificationMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private NotificationService notificationService;

    // Real-time update service
    @Autowired
    private BookingUpdateService bookingUpdateService;

    @Autowired
    private DistanceService distanceService;

    // WebSocket messaging
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Books a ride and calculates distance dynamically.
     */
    public Booking bookRide(Long rideId, Booking newBooking) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        // Calculate distance using DistanceService
        double distance = distanceService.calculateDistance(
                ride.getSourceLat(),
                ride.getSourceLng(),
                ride.getDestinationLat(),
                ride.getDestinationLng()
        );
        ride.setDistance(distance);

        // Reduce available seats
        int remainingSeats = ride.getAvailableSeats() - newBooking.getSeatsBooked();
        if (remainingSeats < 0) {
            throw new RuntimeException("Not enough seats available");
        }

        ride.setAvailableSeats(remainingSeats);
        rideRepository.save(ride);

        // Attach ride to booking
        newBooking.setRide(ride);

        if (newBooking.getPassengerEmail() == null || newBooking.getPassengerEmail().isEmpty()) {
            throw new RuntimeException("Passenger email is required");
        }

        newBooking.setStatus("PENDING");

        Booking booking = bookingRepository.save(newBooking);

        // Send notification
        notificationService.sendNotification(
                "New booking confirmed for ride ID: " + ride.getId()
        );

        // Real-time booking update
        bookingUpdateService.sendBookingUpdate(booking);

        return booking;
    }

    // =============================
    // NOTIFY PASSENGERS WHEN RIDE IS REJECTED BY DRIVER
    // =============================
    public void notifyPassengersRideRejected(Long rideId) {

        List<Booking> bookings = bookingRepository.findByRideId(rideId);

        for (Booking booking : bookings) {

            NotificationMessage message =
                    new NotificationMessage(
                            "REJECTED",
                            "❌ Driver rejected your ride booking"
                    );

            messagingTemplate.convertAndSend(
                    "/topic/passenger/" + booking.getPassengerEmail(),
                    message
            );

            System.out.println("Reject notification sent to: " + booking.getPassengerEmail());
        }
    }

    // =============================
    // REJECT SINGLE BOOKING (optional method if you want per passenger reject)
    // =============================
    public void rejectBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("REJECTED");
        bookingRepository.save(booking);

        NotificationMessage message = new NotificationMessage(
                "REJECTED",
                "❌ Driver rejected your booking"
        );

        messagingTemplate.convertAndSend(
                "/topic/passenger/" + booking.getPassengerEmail(),
                message
        );

        System.out.println("Reject notification sent to: " + booking.getPassengerEmail());
    }
}