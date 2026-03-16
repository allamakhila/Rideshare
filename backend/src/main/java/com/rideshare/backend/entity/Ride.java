package com.rideshare.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;
    private String destination;


    private double sourceLat;
    private double sourceLng;
    private double destinationLat;
    private double destinationLng;

    private LocalDate date;
    private LocalTime time;

    private int availableSeats;
    private double price;

    private double distance;

    private String driverEmail;

    // Existing added fields
    private String vehicleType;
    private String licensePlate;

    // ✅ NEW FIELDS FOR MILESTONE 2
    private String rideStatus; // POSTED, BOOKED, STARTED, COMPLETED, CANCELLED

    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    public Ride() {
        this.createdAt = LocalDateTime.now();
        this.rideStatus = "POSTED";
    }

    public Long getId() {
        return id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public double getSourceLat() { 
        return sourceLat; 
    }
    public void setSourceLat(double sourceLat) { 
        this.sourceLat = sourceLat; 
    }

    public double getSourceLng() { 
        return sourceLng; 
    }
    public void setSourceLng(double sourceLng) { 
        this.sourceLng = sourceLng; 
    }

    public double getDestinationLat() { 
        return destinationLat; 
    }
    public void setDestinationLat(double destinationLat) { 
        this.destinationLat = destinationLat; 
    }

    public double getDestinationLng() { 
        return destinationLng; 
    }
    public void setDestinationLng(double destinationLng) { 
        this.destinationLng = destinationLng; 
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getDistance() { 
        return distance; 
    } 
    public void setDistance(double distance) { 
        this.distance = distance; 
    }

    public String getDriverEmail() {
        return driverEmail;
    }

    public void setDriverEmail(String driverEmail) {
        this.driverEmail = driverEmail;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    // ✅ NEW GETTERS & SETTERS

    public String getRideStatus() {
        return rideStatus;
    }

    public void setRideStatus(String rideStatus) {
        this.rideStatus = rideStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}