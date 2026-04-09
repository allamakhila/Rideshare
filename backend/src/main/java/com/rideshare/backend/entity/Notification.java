package com.rideshare.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who will receive the notification
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    // Message content
    @Column(nullable = false)
    private String message;

    // Status: read/unread
    @Column(nullable = false)
    private boolean isRead = false;

    // Timestamp of creation
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    // Optional: type of notification (BOOKING, REMINDER, CANCELLED)
    private String type;

    public Notification() {}

    // =========================
    // Getters & Setters
    // =========================
    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}