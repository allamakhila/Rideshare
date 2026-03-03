package com.rideshare.backend.service;

import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.repository.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RideService {

    @Autowired
    private RideRepository rideRepository;

    public Ride postRide(Ride ride) {
        return rideRepository.save(ride);
    }

    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    public List<Ride> searchRides(String source, String destination, LocalDate date) {
        return rideRepository
                .findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDateAndAvailableSeatsGreaterThan(
                        source.trim(),
                        destination.trim(),
                        date,
                        0
                );
    }
}