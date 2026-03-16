package com.rideshare.backend.fare;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class FareService {

    @Value("${fare.bike.base}")
    private double bikeBase;

    @Value("${fare.bike.rate}")
    private double bikeRate;

    @Value("${fare.auto.base}")
    private double autoBase;

    @Value("${fare.auto.rate}")
    private double autoRate;

    @Value("${fare.car.base}")
    private double carBase;

    @Value("${fare.car.rate}")
    private double carRate;

    @Value("${fare.surge.enabled}")
    private boolean surgeEnabled;

    @Value("${fare.surge.multiplier}")
    private double surgeMultiplier;

    @Value("${fare.minimum}")
    private double minimumFare;

    @Value("${fare.night.enabled}")
    private boolean nightEnabled;

    @Value("${fare.night.percentage}")
    private double nightPercentage;

    @Value("${fare.night.start}")
    private int nightStart;

    @Value("${fare.night.end}")
    private int nightEnd;

    @Value("${fare.waiting.enabled}")
    private boolean waitingEnabled;

    @Value("${fare.waiting.freeMinutes}")
    private int freeWaitingMinutes;

    @Value("${fare.waiting.perMinute}")
    private double waitingPerMinute;

    public double calculateFare(double distanceInKm, String vehicleType, int waitingMinutes) {

        double baseFare;
        double rate;

        switch (vehicleType.toLowerCase()) {

            case "bike":
                baseFare = bikeBase;
                rate = bikeRate;
                break;

            case "auto":
                baseFare = autoBase;
                rate = autoRate;
                break;

            case "car":
                baseFare = carBase;
                rate = carRate;
                break;

            default:
                throw new RuntimeException("Invalid vehicle type");
        }

        double fare = baseFare + (rate * distanceInKm);

        // 1️⃣ Apply surge if enabled
        if (surgeEnabled) {
            fare = fare * surgeMultiplier;
        }

        // 2️⃣ Apply night charges
        if (nightEnabled) {

            int currentHour = java.time.LocalTime.now().getHour();
            boolean isNight;

            // Example case: 22 to 5 (crosses midnight)
            if (nightStart > nightEnd) {
                isNight = currentHour >= nightStart || currentHour < nightEnd;
            } else {
                isNight = currentHour >= nightStart && currentHour < nightEnd;
            }

            if (isNight) {
                fare = fare + (fare * (nightPercentage / 100));
            }
        }

        // Apply waiting charges
if (waitingEnabled && waitingMinutes > freeWaitingMinutes) {
    int extraMinutes = waitingMinutes - freeWaitingMinutes;
    fare = fare + (extraMinutes * waitingPerMinute);
}

        // 3️⃣ Apply minimum fare at the end
        if (fare < minimumFare) {
            fare = minimumFare;
        }

        return fare;
    }
}