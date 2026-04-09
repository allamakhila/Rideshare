package com.rideshare.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // Ride Relationship
    // =========================
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ride_id")
    private Ride ride;

    // =========================
    // Passenger Details
    // =========================
    @Column(name = "passenger_email")
    private String passengerEmail;

    @Column(name = "passenger_name")
    private String passengerName;

    // =========================
    // Ride Details (Stored Separately)
    // =========================
    @Column(name = "source")
    private String source;

    @Column(name = "destination")
    private String destination;

    // =========================
    // Booking Details
    // =========================
    @Column(name = "seats_booked")
    private int seatsBooked;

    // ✅ ADD THIS
@Column(name = "total_amount")
private Double totalAmount;

    @Column(name = "status")
    private String status = "PENDING";

    // ✅ NEW FIELD (Real-time updates support)
    @Column(name = "booking_time")
    private LocalDateTime bookingTime = LocalDateTime.now();

    @Column(name = "order_id", unique = true)
    private String orderId;

    @Column(name = "driver_reviewed")
    private Boolean driverReviewed = false;  // Track if driver has reviewed passenger

    @Column(name = "passenger_reviewed")
    private Boolean passengerReviewed = false;  // Track if passenger has reviewed driver

    public Booking() {}

    // =========================
    // Getters & Setters
    // =========================

    public Long getId() { return id; }

    public Ride getRide() { return ride; }
    public void setRide(Ride ride) { this.ride = ride; }

    public String getPassengerEmail() { return passengerEmail; }
    public void setPassengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; }

    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public int getSeatsBooked() { return seatsBooked; }
    public void setSeatsBooked(int seatsBooked) { this.seatsBooked = seatsBooked; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // ✅ Getter & Setter for bookingTime
    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public Double getTotalAmount() {
    return totalAmount;
}

public void setTotalAmount(Double totalAmount) {
    this.totalAmount = totalAmount;
}

public Boolean getDriverReviewed() { return driverReviewed; }
    public void setDriverReviewed(Boolean driverReviewed) { this.driverReviewed = driverReviewed; }

    public Boolean getPassengerReviewed() { return passengerReviewed; }
    public void setPassengerReviewed(Boolean passengerReviewed) { this.passengerReviewed = passengerReviewed; }
}