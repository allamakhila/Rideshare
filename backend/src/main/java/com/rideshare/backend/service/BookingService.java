package com.rideshare.backend.service;

import com.rideshare.backend.entity.Booking;
import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.entity.User;
import com.rideshare.backend.repository.BookingRepository;
import com.rideshare.backend.repository.RideRepository;
import com.rideshare.backend.repository.UserRepository;
import com.rideshare.backend.dto.NotificationMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private BookingUpdateService bookingUpdateService;

    @Autowired
    private DistanceService distanceService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private JavaMailSender mailSender;  // For sending emails

    /**
     * Utility method to send dynamic email notifications
     */
    private void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);           // Dynamic recipient
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

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

        // ===========================
        // NOTIFICATIONS
        // ===========================

        // 1️⃣ Database notification
        User passenger = userRepository.findByEmail(booking.getPassengerEmail())
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        notificationService.createNotification(
                passenger,
                "Your booking for ride from " + ride.getSource() + " to " + ride.getDestination() + " has been confirmed!",
                "BOOKING_CONFIRMED"
        );

        // 2️⃣ Email notification (dynamic recipient)
        sendEmail(
                booking.getPassengerEmail(),
                "Booking Confirmed!",
                "Hello " + booking.getPassengerName() + ",\n\n" +
                        "Your booking from " + ride.getSource() + " to " + ride.getDestination() +
                        " has been confirmed!\n\nThank you for using Smart Ride Sharing System."
        );

        // 3️⃣ WebSocket notification
        notificationService.sendNotification(
                "Booking confirmed for passenger: " + booking.getPassengerName()
        );

        // 4️⃣ Real-time booking update
        bookingUpdateService.sendBookingUpdate(booking);

        return booking;
    }

    // =============================
    // NOTIFY PASSENGERS WHEN RIDE IS REJECTED BY DRIVER
    // =============================
    public void notifyPassengersRideRejected(Long rideId) {

        List<Booking> bookings = bookingRepository.findByRideId(rideId);

        for (Booking booking : bookings) {

            User passenger = userRepository.findByEmail(booking.getPassengerEmail())
                    .orElseThrow(() -> new RuntimeException("Passenger not found"));

            // 1️⃣ Database notification
            notificationService.createNotification(
                    passenger,
                    "Your booking from " + booking.getSource() + " to " + booking.getDestination() +
                            " has been cancelled by the driver.",
                    "BOOKING_CANCELLED"
            );

            // 2️⃣ Email notification (dynamic recipient)
            sendEmail(
                    booking.getPassengerEmail(),
                    "Booking Cancelled",
                    "Hello " + booking.getPassengerName() + ",\n\n" +
                            "Your booking from " + booking.getSource() + " to " + booking.getDestination() +
                            " has been rejected by the driver.\n\nPlease check other available rides."
            );

            // 3️⃣ Existing WebSocket notification
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
    // REJECT SINGLE BOOKING
    // =============================
    public void rejectBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("REJECTED");
        bookingRepository.save(booking);

        User passenger = userRepository.findByEmail(booking.getPassengerEmail())
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        // 1️⃣ Database notification
        notificationService.createNotification(
                passenger,
                "Your booking from " + booking.getSource() + " to " + booking.getDestination() +
                        " has been rejected by the driver.",
                "BOOKING_REJECTED"
        );

        // 2️⃣ Email notification (dynamic recipient)
        sendEmail(
                booking.getPassengerEmail(),
                "Booking Rejected",
                "Hello " + booking.getPassengerName() + ",\n\n" +
                        "Your booking from " + booking.getSource() + " to " + booking.getDestination() +
                        " has been rejected by the driver.\n\nPlease check other available rides."
        );

        // 3️⃣ Existing WebSocket notification
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