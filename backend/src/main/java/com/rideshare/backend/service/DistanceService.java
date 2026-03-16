package com.rideshare.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DistanceService {

    private final WebClient webClient;

    public DistanceService() {
        this.webClient = WebClient.builder()
                .baseUrl("http://router.project-osrm.org")
                .build();
    }

    public double calculateDistance(double pickupLat, double pickupLng,
                                    double dropLat, double dropLng) {

        try {

            String url = "/route/v1/driving/" +
                    pickupLng + "," + pickupLat + ";" +
                    dropLng + "," + dropLat +
                    "?overview=false";

            String response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null) {
                return 0;
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            JsonNode routes = root.path("routes");

            if (!routes.isArray() || routes.size() == 0) {
                return 0;
            }

            double distanceInMeters = routes.get(0)
                    .path("distance")
                    .asDouble();

            return distanceInMeters / 1000.0;

        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}