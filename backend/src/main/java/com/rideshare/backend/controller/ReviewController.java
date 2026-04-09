package com.rideshare.backend.controller;

import com.rideshare.backend.dto.ReviewDTO;
import com.rideshare.backend.dto.ReviewResponseDTO;
import com.rideshare.backend.dto.ReviewSummaryDTO;
import com.rideshare.backend.entity.Review;
import com.rideshare.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // ✅ Create Review (YOUR EXISTING ENDPOINT - PRESERVED)
    @PostMapping("/create")
    public ResponseEntity<?> createReview(@RequestBody ReviewDTO dto) {
        try {
            if (dto.getRideId() == null || dto.getReviewerId() == null || 
                dto.getRevieweeId() == null || dto.getBookingId() == null) {
                return ResponseEntity.badRequest().body("Ride ID, Booking ID, reviewer ID, and reviewee ID are required.");
            }

            Review review = reviewService.createReview(
                    dto.getRideId(),
                    dto.getBookingId(),
                    dto.getReviewerId(),
                    dto.getRevieweeId(),
                    dto.getStars(),
                    dto.getComments()
            );
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Get all reviews for a user (returns List<Review> - for backward compatibility)
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getReviewsForUser(@PathVariable Long userId) {
        try {
            List<Review> reviews = reviewService.getReviewsForUser(userId);
            return ResponseEntity.ok(reviews);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ NEW: Get all reviews for a user as DTOs (for driver dashboard)
    @GetMapping("/user/{userId}/details")
    public ResponseEntity<?> getReviewsForUserAsDTO(@PathVariable Long userId) {
        try {
            List<ReviewResponseDTO> reviews = reviewService.getReviewsForUserAsDTO(userId);
            return ResponseEntity.ok(reviews);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ NEW: Get review summary with statistics (for driver dashboard)
    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<?> getReviewSummary(@PathVariable Long userId) {
        try {
            ReviewSummaryDTO summary = reviewService.getReviewSummary(userId);
            return ResponseEntity.ok(summary);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ⭐ Get average rating (YOUR EXISTING ENDPOINT - PRESERVED)
    @GetMapping("/user/{userId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long userId) {
        Double avgRating = reviewService.getAverageRating(userId);
        return ResponseEntity.ok(avgRating);
    }

    // ✅ NEW: Get reviews given by a user (reviews they wrote)
    @GetMapping("/user/{userId}/given")
    public ResponseEntity<?> getReviewsGivenByUser(@PathVariable Long userId) {
        try {
            List<ReviewResponseDTO> reviews = reviewService.getReviewsGivenByUser(userId);
            return ResponseEntity.ok(reviews);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ NEW: Check if user has reviewed a booking
    @GetMapping("/check")
    public ResponseEntity<Boolean> hasUserReviewedBooking(
            @RequestParam Long bookingId,
            @RequestParam Long reviewerId) {
        boolean hasReviewed = reviewService.hasUserReviewedBooking(bookingId, reviewerId);
        return ResponseEntity.ok(hasReviewed);
    }
}