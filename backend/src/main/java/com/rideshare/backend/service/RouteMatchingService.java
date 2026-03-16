package com.rideshare.backend.service;

import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.repository.RideRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class RouteMatchingService {

    @Autowired
    private RideRepository rideRepository;

    public List<Ride> findMatchingRides(String source, String destination) {

        List<Ride> allRides = rideRepository.findAll();

        List<Ride> directMatches = new ArrayList<>();
        List<Ride> partialMatches = new ArrayList<>();

        for (Ride ride : allRides) {

            // ✅ Driver availability check
            if (ride.getRideStatus() != null &&
                ride.getRideStatus().equals("POSTED") &&
                ride.getAvailableSeats() > 0) {

                // ✅ Direct Match (Highest Priority)
                if (ride.getSource().equalsIgnoreCase(source)
                        && ride.getDestination().equalsIgnoreCase(destination)) {

                    directMatches.add(ride);
                }

                // ✅ Partial Match (Lower Priority)
                else if (ride.getSource().equalsIgnoreCase(source)
                        || ride.getDestination().equalsIgnoreCase(destination)) {

                    partialMatches.add(ride);
                }
            }
        }

        // ✅ Matching Priority (Direct matches first)
        List<Ride> finalMatches = new ArrayList<>();
        finalMatches.addAll(directMatches);
        finalMatches.addAll(partialMatches);

        // ✅ Limit matching results (Max 10 rides)
        if (finalMatches.size() > 10) {
            return finalMatches.subList(0, 10);
        }

        return finalMatches;
    }
}