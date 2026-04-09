package com.rideshare.backend.controller;

import com.rideshare.backend.dto.ChatMessageDTO;
import com.rideshare.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // WebSocket endpoint for real-time chat
    @MessageMapping("/chat.send")
    @SendTo("/topic/chat")
    public ChatMessageDTO sendMessage(@Payload ChatMessageDTO message) {
        return chatService.sendMessage(
            message.getBookingId(),
            message.getSenderId(),
            message.getReceiverId(),
            message.getMessage()
        );
    }

    // REST endpoint to get chat history
    @GetMapping("/history/{bookingId}")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(@PathVariable Long bookingId) {
        return ResponseEntity.ok(chatService.getChatHistory(bookingId));
    }

    // Mark messages as read
    @PutMapping("/read/{bookingId}")
    public ResponseEntity<?> markAsRead(@PathVariable Long bookingId, @RequestParam Long userId) {
        chatService.markMessagesAsRead(bookingId, userId);
        return ResponseEntity.ok().build();
    }

    // Get unread count
    @GetMapping("/unread/{userId}")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long userId) {
        Map<String, Long> response = new HashMap<>();
        response.put("count", chatService.getUnreadCount(userId));
        return ResponseEntity.ok(response);
    }

    // Get user's recent conversations
    @GetMapping("/conversations/{userId}")
    public ResponseEntity<List<ChatMessageDTO>> getUserConversations(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getUserConversations(userId));
    }
}