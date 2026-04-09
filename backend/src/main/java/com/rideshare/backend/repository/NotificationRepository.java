package com.rideshare.backend.repository;

import com.rideshare.backend.entity.Notification;
import com.rideshare.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Fetch all notifications for a specific user, newest first
    List<Notification> findByUserOrderByTimestampDesc(User user);
}