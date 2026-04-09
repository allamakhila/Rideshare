package com.rideshare.backend.controller;

import com.rideshare.backend.entity.Notification;
import com.rideshare.backend.entity.User;
import com.rideshare.backend.repository.UserRepository;
import com.rideshare.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.rideshare.backend.repository.NotificationRepository;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // Send a test notification
    @PostMapping("/send")
    public String sendNotification(@RequestParam String message) {
        notificationService.sendNotification(message);
        return "Notification sent successfully";
    }

    // Get notifications by user ID
    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsById(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationService.getNotificationsForUser(user);
    }

    // Get notifications by email
    @GetMapping("/by-email")
    public List<Notification> getNotificationsByEmail(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationService.getNotificationsForUser(user);
    }

    // Mark notification as read
    @PostMapping("/read/{id}")
    public String markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return "Notification marked as read";
    }

    // Temporary endpoint to create a test notification
    @PostMapping("/test/{userId}")
    public String createTestNotification(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        notificationService.createNotification(user, "Test Notification for " + user.getName(), "TEST");
        return "Test notification created!";
    }
}