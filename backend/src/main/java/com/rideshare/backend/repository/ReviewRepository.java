package com.rideshare.backend.repository;

import com.rideshare.backend.entity.Review;
import com.rideshare.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Find all reviews where the given user is the reviewee (received reviews)
    List<Review> findByReviewee(User reviewee);
    
    // Find all reviews where the given user is the reviewer (written reviews)
    List<Review> findByReviewer(User reviewer);
    
    // Check if a review exists for a specific ride by a specific reviewer
    boolean existsByRideIdAndReviewerId(Long rideId, Long reviewerId);
    
    // Check if a review exists for a specific booking by a specific reviewer
    boolean existsByBookingIdAndReviewerId(Long bookingId, Long reviewerId);
    
    // Get average rating for a user (as reviewee)
    @Query("SELECT AVG(r.stars) FROM Review r WHERE r.reviewee.id = :userId")
    Double getAverageRatingByRevieweeId(@Param("userId") Long userId);
    
    // Get all reviews for a specific ride
    List<Review> findByRideId(Long rideId);
    
    // Get all reviews for a specific booking
    List<Review> findByBookingId(Long bookingId);
}