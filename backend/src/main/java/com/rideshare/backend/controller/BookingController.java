package com.rideshare.backend.controller;

import com.rideshare.backend.entity.Booking;
import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.entity.User; 
import com.rideshare.backend.repository.BookingRepository;
import com.rideshare.backend.repository.UserRepository;
import com.rideshare.backend.service.BookingService;
import com.rideshare.backend.service.BookingUpdateService;
import com.rideshare.backend.service.DistanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.rideshare.backend.dto.NotificationMessage;

import java.time.LocalDateTime;
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

    @Autowired
    private UserRepository userRepository;

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

    // =========================
    // Passenger booking history
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
                rideDTO.setDistance(ride.getDistance());
                rideDTO.setPrice(ride.getPrice());
                rideDTO.setVehicleType(ride.getVehicleType());
                rideDTO.setLicensePlate(ride.getLicensePlate());
                rideDTO.setDriverEmail(ride.getDriverEmail());

                // Fetch driverId from userRepository
                Long driverId = null;
                if (ride.getDriverEmail() != null) {
                    driverId = userRepository.findByEmail(ride.getDriverEmail())
                            .map(User::getId)
                            .orElse(null);
                }
                rideDTO.setDriverId(driverId);
                rideDTO.setRideStatus(ride.getRideStatus());

                if (ride.getDate() != null) rideDTO.setDate(ride.getDate().toString());
            }

            BookingDTO bookingDTO = new BookingDTO();
            bookingDTO.setId(booking.getId());
            bookingDTO.setSeatsBooked(booking.getSeatsBooked());
            bookingDTO.setRide(rideDTO);
            bookingDTO.setStatus(booking.getStatus());
            bookingDTO.setPassengerReviewed(booking.getPassengerReviewed());
            bookingDTO.setDriverReviewed(booking.getDriverReviewed());
            bookingDTO.setPassengerName(booking.getPassengerName());
            bookingDTO.setPassengerEmail(booking.getPassengerEmail());

            bookingDTOs.add(bookingDTO);
        }

        return bookingDTOs;
    }

    // =========================
    // Driver bookings received
    // =========================
    @GetMapping("/driver/{email}")
    public List<BookingDTO> getDriverBookings(@PathVariable String email) {
        List<Booking> bookings = bookingRepository.findByRide_DriverEmail(email);
        List<BookingDTO> bookingDTOs = new ArrayList<>();

        for (Booking booking : bookings) {
            Ride ride = booking.getRide();

            RideDTO rideDTO = new RideDTO();
            if (ride != null) {
                rideDTO.setId(ride.getId());
                rideDTO.setSource(ride.getSource());
                rideDTO.setDestination(ride.getDestination());
                rideDTO.setDistance(ride.getDistance());
                rideDTO.setPrice(ride.getPrice());
                rideDTO.setVehicleType(ride.getVehicleType());
                rideDTO.setLicensePlate(ride.getLicensePlate());
                rideDTO.setDriverEmail(ride.getDriverEmail());
                rideDTO.setRideStatus(ride.getRideStatus());
                
                // Fetch driverId
                Long driverId = null;
                if (ride.getDriverEmail() != null) {
                    driverId = userRepository.findByEmail(ride.getDriverEmail())
                            .map(User::getId)
                            .orElse(null);
                }
                rideDTO.setDriverId(driverId);
                
                if (ride.getDate() != null) rideDTO.setDate(ride.getDate().toString());
            }

            // Get passenger ID
            Long passengerId = null;
            if (booking.getPassengerEmail() != null) {
                passengerId = userRepository.findByEmail(booking.getPassengerEmail())
                        .map(User::getId)
                        .orElse(null);
            }

            BookingDTO bookingDTO = new BookingDTO();
            bookingDTO.setId(booking.getId());
            bookingDTO.setSeatsBooked(booking.getSeatsBooked());
            bookingDTO.setRide(rideDTO);
            bookingDTO.setStatus(booking.getStatus());
            bookingDTO.setPassengerReviewed(booking.getPassengerReviewed());
            bookingDTO.setDriverReviewed(booking.getDriverReviewed());
            bookingDTO.setPassengerName(booking.getPassengerName());
            bookingDTO.setPassengerEmail(booking.getPassengerEmail());
            bookingDTO.setPassengerId(passengerId);

            bookingDTOs.add(bookingDTO);
        }

        return bookingDTOs;
    }

    // =========================
    // Book a ride
    // =========================
    @PostMapping("/book/{rideId}")
    public Booking bookRide(@PathVariable Long rideId, @RequestBody Booking booking) {

        Booking savedBooking = bookingService.bookRide(rideId, booking);
        Ride ride = savedBooking.getRide();

        String time = LocalDateTime.now().format(FORMATTER);

        if (ride != null) {

            String driverEmail = ride.getDriverEmail();

            // 🔔 DRIVER
            messagingTemplate.convertAndSend(
                    "/topic/driver/" + driverEmail,
                    new NotificationMessage(
                            "BOOKING",
                            "New passenger booked your ride on " + time
                    )
            );

            // 🔔 PASSENGER
            messagingTemplate.convertAndSend(
                    "/topic/passenger/" + savedBooking.getPassengerEmail(),
                    new NotificationMessage(
                            "BOOKED",
                            "Ride booked successfully on " + time
                    )
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

        String time = LocalDateTime.now().format(FORMATTER);

        // 🔔 PASSENGER
        messagingTemplate.convertAndSend(
                "/topic/passenger/" + booking.getPassengerEmail(),
                new NotificationMessage(
                        "CONFIRMED",
                        "Driver accepted your ride on " + time
                )
        );

        // 🔔 DRIVER
        messagingTemplate.convertAndSend(
                "/topic/driver/" + booking.getRide().getDriverEmail(),
                new NotificationMessage(
                        "CONFIRMED",
                        "You accepted a booking on " + time
                )
        );

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

        String time = LocalDateTime.now().format(FORMATTER);

        // 🔔 PASSENGER
        messagingTemplate.convertAndSend(
                "/topic/passenger/" + booking.getPassengerEmail(),
                new NotificationMessage(
                        "REJECTED",
                        "Driver rejected your ride on " + time
                )
        );

        // 🔔 DRIVER
        messagingTemplate.convertAndSend(
                "/topic/driver/" + booking.getRide().getDriverEmail(),
                new NotificationMessage(
                        "REJECTED",
                        "You rejected a booking on " + time
                )
        );

        bookingUpdateService.sendBookingUpdate(updatedBooking);
        return updatedBooking;
    }

    // =========================
    // Cancel booking (Passenger)
    // =========================
    @PutMapping("/cancel/{id}")
    public Booking cancelBooking(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus("CANCELLED");
        Booking updatedBooking = bookingRepository.save(booking);

        String time = LocalDateTime.now().format(FORMATTER);

        // 🔔 DRIVER
        messagingTemplate.convertAndSend(
                "/topic/driver/" + booking.getRide().getDriverEmail(),
                new NotificationMessage(
                        "CANCELLED",
                        "Passenger cancelled the ride on " + time
                )
        );

        // 🔔 PASSENGER
        messagingTemplate.convertAndSend(
                "/topic/passenger/" + booking.getPassengerEmail(),
                new NotificationMessage(
                        "CANCELLED",
                        "You cancelled your ride on " + time
                )
        );

        return updatedBooking;
    } 

    // =========================
    // Ride started
    // =========================
    @PutMapping("/start/{id}")
    public Booking startRide(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus("STARTED");
        Booking updatedBooking = bookingRepository.save(booking);

        String time = LocalDateTime.now().format(FORMATTER);

        messagingTemplate.convertAndSend(
                "/topic/passenger/" + booking.getPassengerEmail(),
                new NotificationMessage(
                        "STARTED",
                        "Your ride has started on " + time + " 🚗"
                )
        );
        
        messagingTemplate.convertAndSend(
                "/topic/driver/" + booking.getRide().getDriverEmail(),
                new NotificationMessage(
                        "STARTED",
                        "Ride started successfully on " + time
                )
        );

        return updatedBooking;
    }

    // =========================
    // Ride completed
    // =========================
    @PutMapping("/complete/{id}")
    public Booking completeRide(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus("COMPLETED");
        Booking updatedBooking = bookingRepository.save(booking);

        String time = LocalDateTime.now().format(FORMATTER);

        messagingTemplate.convertAndSend(
                "/topic/passenger/" + booking.getPassengerEmail(),
                new NotificationMessage(
                        "COMPLETED",
                        "Ride completed successfully on " + time + " ✅"
                )
        );
        
        messagingTemplate.convertAndSend(
                "/topic/driver/" + booking.getRide().getDriverEmail(),
                new NotificationMessage(
                        "COMPLETED",
                        "Ride completed successfully on " + time + " ✅"
                )
        );

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
        private Boolean passengerReviewed;
        private Boolean driverReviewed;
        private String passengerName;
        private String passengerEmail;
        private Long passengerId;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public int getSeatsBooked() { return seatsBooked; }
        public void setSeatsBooked(int seatsBooked) { this.seatsBooked = seatsBooked; }
        
        public RideDTO getRide() { return ride; }
        public void setRide(RideDTO ride) { this.ride = ride; }
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public Boolean getPassengerReviewed() { return passengerReviewed; }
        public void setPassengerReviewed(Boolean passengerReviewed) { this.passengerReviewed = passengerReviewed; }

        public Boolean getDriverReviewed() { return driverReviewed; }
        public void setDriverReviewed(Boolean driverReviewed) { this.driverReviewed = driverReviewed; }

        public String getPassengerName() { return passengerName; }
        public void setPassengerName(String passengerName) { this.passengerName = passengerName; }

        public String getPassengerEmail() { return passengerEmail; }
        public void setPassengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; }

        public Long getPassengerId() { return passengerId; }
        public void setPassengerId(Long passengerId) { this.passengerId = passengerId; }
    }

    public static class RideDTO {
        private Long id;
        private String source;
        private String destination;
        private double distance;
        private double price;
        private String vehicleType;
        private String licensePlate;
        private String driverEmail;
        private String date;
        private Long driverId;
        private String rideStatus;

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
        
        public Long getDriverId() { return driverId; }
        public void setDriverId(Long driverId) { this.driverId = driverId; }
        
        public String getRideStatus() { return rideStatus; }
        public void setRideStatus(String rideStatus) { this.rideStatus = rideStatus; }
    }
}