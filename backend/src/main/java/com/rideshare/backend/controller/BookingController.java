package com.rideshare.backend.controller;

import com.rideshare.backend.entity.Booking;
import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.repository.BookingRepository;
import com.rideshare.backend.service.BookingService;
import com.rideshare.backend.service.BookingUpdateService;
import com.rideshare.backend.service.DistanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.rideshare.backend.dto.NotificationMessage;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingUpdateService bookingUpdateService;

    @Autowired
    private DistanceService distanceService;

    @Autowired
private SimpMessagingTemplate messagingTemplate;

    // Formatter to convert LocalDate to String
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // =========================
    // Passenger booking history with dynamic distance, driver email, and date
    // =========================
    @GetMapping("/passenger")
public List<BookingDTO> getPassengerBookings(@RequestParam String email) {
    List<Booking> bookings = bookingRepository.findByPassengerEmail(email);
    List<BookingDTO> bookingDTOs = new ArrayList<>();

    for (Booking booking : bookings) {
        Ride ride = booking.getRide();

        RideDTO rideDTO = new RideDTO();
        if (ride != null) {
            rideDTO.setId(ride.getId());
            rideDTO.setSource(ride.getSource());
            rideDTO.setDestination(ride.getDestination());
            rideDTO.setDistance(ride.getDistance()); // ✅ use precomputed distance
            rideDTO.setPrice(ride.getPrice());
            rideDTO.setVehicleType(ride.getVehicleType());
            rideDTO.setLicensePlate(ride.getLicensePlate());
            rideDTO.setDriverEmail(ride.getDriverEmail());
            if (ride.getDate() != null) rideDTO.setDate(ride.getDate().toString());
        }

        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setId(booking.getId());
        bookingDTO.setSeatsBooked(booking.getSeatsBooked());
        bookingDTO.setRide(rideDTO);
        bookingDTO.setStatus(booking.getStatus());

        bookingDTOs.add(bookingDTO);
    }

    return bookingDTOs;
}

    // =========================
    // Driver bookings received
    // =========================
    @GetMapping("/driver/{email}")
    public List<Booking> getDriverBookings(@PathVariable String email) {
        return bookingRepository.findByRide_DriverEmail(email);
    }

    // =========================
    // Book a ride
    // =========================
    @PostMapping("/book/{rideId}")
public Booking bookRide(@PathVariable Long rideId, @RequestBody Booking booking) {

    Booking savedBooking = bookingService.bookRide(rideId, booking);

    Ride ride = savedBooking.getRide();

    if (ride != null) {

        String driverEmail = ride.getDriverEmail();

        NotificationMessage notification =
                new NotificationMessage("BOOKING", "New passenger booked your ride");

        messagingTemplate.convertAndSend(
                "/topic/driver/" + driverEmail,
                notification
        );
    }

    bookingUpdateService.sendBookingUpdate(savedBooking);

    return savedBooking;
}

    // =========================
    // Confirm booking
    // =========================
    @PutMapping("/confirm/{id}")
    public Booking confirmBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus("CONFIRMED");
        Booking updatedBooking = bookingRepository.save(booking);
        bookingUpdateService.sendBookingUpdate(updatedBooking);
        return updatedBooking;
    }

    // =========================
    // Reject booking
    // =========================
    @PutMapping("/reject/{id}")
public Booking rejectBooking(@PathVariable Long id) {
    Booking booking = bookingRepository.findById(id).orElseThrow();
    booking.setStatus("REJECTED");
    Booking updatedBooking = bookingRepository.save(booking);

    // Send WebSocket notification to passenger
    String passengerEmail = booking.getPassengerEmail();
    NotificationMessage notification =
            new NotificationMessage("REJECTION", "Driver has rejected your ride");

    messagingTemplate.convertAndSend(
            "/topic/passenger/" + passengerEmail,
            notification
    );

    bookingUpdateService.sendBookingUpdate(updatedBooking);
    return updatedBooking;
}
    // =========================
    // DTO Classes
    // =========================
    public static class BookingDTO {
        private Long id;
        private int seatsBooked;
        private RideDTO ride;
        private String status;

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public int getSeatsBooked() { return seatsBooked; }
        public void setSeatsBooked(int seatsBooked) { this.seatsBooked = seatsBooked; }
        public RideDTO getRide() { return ride; }
        public void setRide(RideDTO ride) { this.ride = ride; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class RideDTO {
        private Long id;
        private String source;
        private String destination;
        private double distance;
        private double price;
        private String vehicleType;
        private String licensePlate;
        private String driverEmail; // new field
        private String date;        // new field

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public String getDestination() { return destination; }
        public void setDestination(String destination) { this.destination = destination; }
        public double getDistance() { return distance; }
        public void setDistance(double distance) { this.distance = distance; }
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
        public String getVehicleType() { return vehicleType; }
        public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
        public String getLicensePlate() { return licensePlate; }
        public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
        public String getDriverEmail() { return driverEmail; }
        public void setDriverEmail(String driverEmail) { this.driverEmail = driverEmail; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
    }
}