package com.rideshare.backend.controller;

import com.rideshare.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Send notification (for testing real-time updates)
    @PostMapping("/send")
    public String sendNotification(@RequestParam String message) {

        notificationService.sendNotification(message);

        return "Notification sent successfully";
    }

}