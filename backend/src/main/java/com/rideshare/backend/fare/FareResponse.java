package com.rideshare.backend.fare;

public class FareResponse {

    private double distanceInKm;
    private double fare;

    public FareResponse(double distanceInKm, double fare) {
        this.distanceInKm = distanceInKm;
        this.fare = fare;
    }

    public double getDistanceInKm() {
        return distanceInKm;
    }

    public double getFare() {
        return fare;
    }
}