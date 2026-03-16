package com.rideshare.backend.controller;

import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.dto.RideRequestDTO;
import com.rideshare.backend.service.RouteMatchingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin("*")
public class RouteMatchingController {

    @Autowired
    private RouteMatchingService routeMatchingService;

    @PostMapping("/match")
    public List<Ride> findMatches(@RequestBody RideRequestDTO request){

        return routeMatchingService.findMatchingRides(
                request.getSource(),
                request.getDestination()
        );
    }
}