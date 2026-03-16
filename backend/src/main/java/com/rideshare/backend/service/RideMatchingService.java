package com.rideshare.backend.service;

import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.repository.RideRepository;
import com.rideshare.backend.config.GoogleMapsConfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class RideMatchingService {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private GoogleMapsConfig googleMapsConfig;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Ride> findMatchingRides(String source, String destination) {

        List<Ride> rides = rideRepository.findAll();

        // For now return rides with same source/destination
        return rides.stream()
                .filter(ride ->
                        ride.getSource().equalsIgnoreCase(source)
                        && ride.getDestination().equalsIgnoreCase(destination))
                .toList();
    }
}