package com.rideshare.backend.controller;

import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.service.RideMatchingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/match")
@CrossOrigin("*")
public class RideMatchingController {

    @Autowired
    private RideMatchingService rideMatchingService;

    @GetMapping("/rides")
    public List<Ride> findMatchingRides(
            @RequestParam String source,
            @RequestParam String destination) {

        return rideMatchingService.findMatchingRides(source, destination);
    }
}