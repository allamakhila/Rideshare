package com.rideshare.backend.repository;

import com.rideshare.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    List<ChatMessage> findByBookingIdOrderByCreatedAtAsc(Long bookingId);
    
    @Query("SELECT c FROM ChatMessage c WHERE (c.senderId = :userId OR c.receiverId = :userId) ORDER BY c.createdAt DESC")
    List<ChatMessage> findUserConversations(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(c) FROM ChatMessage c WHERE c.receiverId = :userId AND c.isRead = false")
    Long countUnreadMessages(@Param("userId") Long userId);
}