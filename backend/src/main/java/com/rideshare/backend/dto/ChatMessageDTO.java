package com.rideshare.backend.dto;

import java.time.LocalDateTime;

public class ChatMessageDTO {
    private Long id;
    private Long bookingId;
    private Long senderId;
    private String senderEmail;
    private String senderName;
    private Long receiverId;
    private String receiverEmail;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
    private String type; // "TEXT", "LOCATION", "ETA"

    // Constructors
    public ChatMessageDTO() {}

    public ChatMessageDTO(Long id, Long bookingId, Long senderId, String senderEmail, 
                          String senderName, Long receiverId, String receiverEmail, 
                          String message, boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.bookingId = bookingId;
        this.senderId = senderId;
        this.senderEmail = senderEmail;
        this.senderName = senderName;
        this.receiverId = receiverId;
        this.receiverEmail = receiverEmail;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
        this.type = "TEXT";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getReceiverEmail() { return receiverEmail; }
    public void setReceiverEmail(String receiverEmail) { this.receiverEmail = receiverEmail; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}