package com.rideshare.backend.fare;

import com.rideshare.backend.service.DistanceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fare")
public class FareController {

    private final FareService fareService;
    private final DistanceService distanceService;

    public FareController(FareService fareService,
                          DistanceService distanceService) {
        this.fareService = fareService;
        this.distanceService = distanceService;
    }

    @GetMapping("/calculate")
    public FareResponse calculateFare(
            @RequestParam double pickupLat,
            @RequestParam double pickupLng,
            @RequestParam double dropLat,
            @RequestParam double dropLng,
            @RequestParam String vehicleType,
            @RequestParam(defaultValue = "0") int waitingMinutes) {

        // Prevent same pickup and drop
        if (pickupLat == dropLat && pickupLng == dropLng) {
            return new FareResponse(0, 0);
        }

        double distanceInKm = distanceService.calculateDistance(
                pickupLat, pickupLng, dropLat, dropLng);

        if (distanceInKm <= 0) {
            return new FareResponse(0, 0);
        }

        double fare = fareService.calculateFare(distanceInKm, vehicleType, waitingMinutes);

        return new FareResponse(distanceInKm, fare);
    }
}