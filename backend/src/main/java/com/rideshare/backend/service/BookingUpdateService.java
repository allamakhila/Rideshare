package com.rideshare.backend.service;

import com.rideshare.backend.entity.Booking;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class BookingUpdateService {

    private final SimpMessagingTemplate messagingTemplate;

    // Constructor Injection
    public BookingUpdateService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Send real-time booking updates to frontend
    public void sendBookingUpdate(Booking booking) {
        messagingTemplate.convertAndSend("/topic/bookings", booking);
    }
}