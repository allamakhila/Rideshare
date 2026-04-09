package com.rideshare.backend.service;

import com.rideshare.backend.dto.NotificationMessage;
import com.rideshare.backend.entity.Notification;
import com.rideshare.backend.entity.User;
import com.rideshare.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import jakarta.annotation.PostConstruct;
import java.util.List;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private JavaMailSender mailSender;  // For email notifications

    // =============================
    // Twilio configuration
    // =============================
    @Value("${twilio.account.sid}")
    private String twilioAccountSid;

    @Value("${twilio.auth.token}")
    private String twilioAuthToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    @PostConstruct
    public void initTwilio() {
        Twilio.init(twilioAccountSid, twilioAuthToken);
    }

    // =============================
    // Notify all drivers (WebSocket)
    // =============================
    public void notifyDriver(String message) {
        NotificationMessage notification =
                new NotificationMessage("DRIVER_NOTIFICATION", message);

        messagingTemplate.convertAndSend("/topic/driver", notification);
    }

    // =============================
    // Notify all passengers (WebSocket)
    // =============================
    public void notifyPassenger(String message) {
        NotificationMessage notification =
                new NotificationMessage("PASSENGER_NOTIFICATION", message);

        messagingTemplate.convertAndSend("/topic/passenger", notification);
    }

    // =============================
    // Generic notification (WebSocket for booking updates)
    // =============================
    public void sendNotification(String message) {
        NotificationMessage notification =
                new NotificationMessage("BOOKING_UPDATE", message);

        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }

    // =============================
    // Create a new notification (Database)
    // =============================
    public Notification createNotification(User user, String message, String type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        return notificationRepository.save(notification);
    }

    // =============================
    // Get all notifications for a user (Database)
    // =============================
    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByUserOrderByTimestampDesc(user);
    }

    // =============================
    // Mark a notification as read (Database)
    // =============================
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // =============================
    // Send Email Notification
    // =============================
    public void sendEmailNotification(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);        // Dynamic recipient
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    // =============================
    // Send SMS Notification via Twilio
    // =============================
    public void sendSmsNotification(String toNumber, String body) {
        Message.creator(
                new PhoneNumber(toNumber),
                new PhoneNumber(twilioPhoneNumber),
                body
        ).create();
    }
}