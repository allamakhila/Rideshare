package com.rideshare.backend.entity;

import jakarta.persistence.*;

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

    @Column(name = "status")
    private String status = "PENDING";

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
}