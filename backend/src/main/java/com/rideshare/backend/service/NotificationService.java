package com.rideshare.backend.service;

import com.rideshare.backend.dto.NotificationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // =============================
    // Notify all drivers
    // =============================
    public void notifyDriver(String message) {
        NotificationMessage notification =
                new NotificationMessage("DRIVER_NOTIFICATION", message);

        messagingTemplate.convertAndSend("/topic/driver", notification);
    }

    // =============================
    // Notify all passengers
    // =============================
    public void notifyPassenger(String message) {
        NotificationMessage notification =
                new NotificationMessage("PASSENGER_NOTIFICATION", message);

        messagingTemplate.convertAndSend("/topic/passenger", notification);
    }

    // =============================
    // Generic notification (for booking updates)
    // =============================
    public void sendNotification(String message) {
        NotificationMessage notification =
                new NotificationMessage("BOOKING_UPDATE", message);

        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }
}