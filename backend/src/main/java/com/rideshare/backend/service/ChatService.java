package com.rideshare.backend.service;

import com.rideshare.backend.dto.ChatMessageDTO;
import com.rideshare.backend.entity.ChatMessage;
import com.rideshare.backend.entity.Booking;
import com.rideshare.backend.repository.ChatMessageRepository;
import com.rideshare.backend.repository.BookingRepository;
import com.rideshare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
public ChatMessageDTO sendMessage(Long bookingId, Long senderId, Long receiverId, String message) {
    // Verify booking exists
    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    // Get sender details
    var sender = userRepository.findById(senderId)
            .orElseThrow(() -> new RuntimeException("Sender not found"));

    // Get receiver details
    var receiver = userRepository.findById(receiverId)
            .orElseThrow(() -> new RuntimeException("Receiver not found"));

    // Create and save message
    ChatMessage chatMessage = new ChatMessage();
    chatMessage.setBookingId(bookingId);
    chatMessage.setSenderId(senderId);
    chatMessage.setSenderEmail(sender.getEmail());
    chatMessage.setSenderName(sender.getName());
    chatMessage.setReceiverId(receiverId);
    chatMessage.setReceiverEmail(receiver.getEmail());
    chatMessage.setMessage(message);
    chatMessage.setRead(false);

    ChatMessage saved = chatMessageRepository.save(chatMessage);

    // Convert to DTO
    ChatMessageDTO dto = new ChatMessageDTO(
        saved.getId(), saved.getBookingId(), saved.getSenderId(),
        saved.getSenderEmail(), saved.getSenderName(), saved.getReceiverId(),
        saved.getReceiverEmail(), saved.getMessage(), saved.isRead(), saved.getCreatedAt()
    );

    // Send real-time notification to booking room
    messagingTemplate.convertAndSend("/topic/chat/" + bookingId, dto);
    System.out.println("✅ Message sent to /topic/chat/" + bookingId);
    
    // Send to user-specific topic (for dashboard notifications)
    messagingTemplate.convertAndSend("/topic/chat/user/" + receiverId, dto);
    System.out.println("✅ Message sent to /topic/chat/user/" + receiverId);
    
    // Send unread count update
    Long unreadCount = getUnreadCount(receiverId);
    messagingTemplate.convertAndSend("/topic/chat/unread/" + receiverId, unreadCount);
    System.out.println("✅ Unread count sent to /topic/chat/unread/" + receiverId + " = " + unreadCount);
    
    return dto;
}

    public List<ChatMessageDTO> getChatHistory(Long bookingId) {
        List<ChatMessage> messages = chatMessageRepository.findByBookingIdOrderByCreatedAtAsc(bookingId);
        return messages.stream()
                .map(msg -> new ChatMessageDTO(
                    msg.getId(), msg.getBookingId(), msg.getSenderId(),
                    msg.getSenderEmail(), msg.getSenderName(), msg.getReceiverId(),
                    msg.getReceiverEmail(), msg.getMessage(), msg.isRead(), msg.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void markMessagesAsRead(Long bookingId, Long userId) {
        List<ChatMessage> messages = chatMessageRepository.findByBookingIdOrderByCreatedAtAsc(bookingId);
        for (ChatMessage msg : messages) {
            if (msg.getReceiverId().equals(userId) && !msg.isRead()) {
                msg.setRead(true);
                chatMessageRepository.save(msg);
            }
        }
    }

    public Long getUnreadCount(Long userId) {
        return chatMessageRepository.countUnreadMessages(userId);
    }

    public List<ChatMessageDTO> getUserConversations(Long userId) {
        List<ChatMessage> messages = chatMessageRepository.findUserConversations(userId);
        return messages.stream()
                .limit(50)
                .map(msg -> new ChatMessageDTO(
                    msg.getId(), msg.getBookingId(), msg.getSenderId(),
                    msg.getSenderEmail(), msg.getSenderName(), msg.getReceiverId(),
                    msg.getReceiverEmail(), msg.getMessage(), msg.isRead(), msg.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}