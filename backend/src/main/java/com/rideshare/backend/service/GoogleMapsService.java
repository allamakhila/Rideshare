package com.rideshare.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class GoogleMapsService {

    @Value("${google.maps.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public double getDistance(String origin, String destination) {

        String url = "https://maps.googleapis.com/maps/api/distancematrix/json"
                + "?origins=" + origin
                + "&destinations=" + destination
                + "&key=" + apiKey;

        ResponseEntity<String> response =
                restTemplate.getForEntity(url, String.class);

        System.out.println(response.getBody());

        return 0;
    }
}