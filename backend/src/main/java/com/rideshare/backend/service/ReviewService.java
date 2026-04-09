package com.rideshare.backend.service;

import com.rideshare.backend.dto.ReviewResponseDTO;
import com.rideshare.backend.dto.ReviewSummaryDTO;
import com.rideshare.backend.entity.Review;
import com.rideshare.backend.entity.User;
import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.entity.Booking;
import com.rideshare.backend.repository.ReviewRepository;
import com.rideshare.backend.repository.UserRepository;
import com.rideshare.backend.repository.RideRepository;
import com.rideshare.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // ✅ Create a review
    @Transactional
    public Review createReview(Long rideId, Long bookingId, Long reviewerId, Long revieweeId, int stars, String comments) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
                
        // ✅ Check if booking exists and is COMPLETED
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
                
        if (!"COMPLETED".equals(booking.getStatus())) {
            throw new RuntimeException("You can review only completed rides");
        }

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        User reviewee = userRepository.findById(revieweeId)
                .orElseThrow(() -> new RuntimeException("Reviewee not found"));

        // ❗ Prevent self-review
        if (reviewer.getId().equals(reviewee.getId())) {
            throw new RuntimeException("You cannot review yourself");
        }

        // ✅ Check role validation
        if (reviewer.getRole().equals(reviewee.getRole())) {
            throw new RuntimeException("Driver can review only passenger and passenger can review only driver");
        }

        // ✅ Check if already reviewed this specific booking
        if (reviewRepository.existsByBookingIdAndReviewerId(bookingId, reviewerId)) {
            throw new RuntimeException("You have already reviewed this booking");
        }

        Review review = new Review();
        review.setRide(ride);
        review.setBooking(booking);
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setStars(stars);
        review.setComments(comments);
        // Both timestamp and createdAt will be auto-set in constructor

        // Save the review
        Review savedReview = reviewRepository.save(review);
        
         if (reviewer.getRole().equals("PASSENGER")) {
        booking.setPassengerReviewed(true);
        System.out.println("Setting passengerReviewed to true for booking: " + bookingId);
    } else if (reviewer.getRole().equals("DRIVER")) {
        booking.setDriverReviewed(true);
        System.out.println("Setting driverReviewed to true for booking: " + bookingId);
    }
    
    // Save and flush to ensure it's committed to database
    bookingRepository.saveAndFlush(booking);
    
    // Update the reviewee's average rating
    updateAverageRating(revieweeId);
    
    return savedReview;
}

    // ✅ Get all reviews for a user (returns List<Review> for backward compatibility)
    public List<Review> getReviewsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return reviewRepository.findByReviewee(user);
    }

    // ✅ Get all reviews for a user as DTOs (reviews received)
    public List<ReviewResponseDTO> getReviewsForUserAsDTO(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Review> reviews = reviewRepository.findByReviewee(user);
        
        return reviews.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // ✅ Get review summary with statistics (for dashboard)
    public ReviewSummaryDTO getReviewSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Review> reviews = reviewRepository.findByReviewee(user);
        
        Double averageRating = reviews.stream()
                .mapToInt(Review::getStars)
                .average()
                .orElse(0.0);
        
        int totalReviews = reviews.size();
        
        // Count stars
        int fiveStar = (int) reviews.stream().filter(r -> r.getStars() == 5).count();
        int fourStar = (int) reviews.stream().filter(r -> r.getStars() == 4).count();
        int threeStar = (int) reviews.stream().filter(r -> r.getStars() == 3).count();
        int twoStar = (int) reviews.stream().filter(r -> r.getStars() == 2).count();
        int oneStar = (int) reviews.stream().filter(r -> r.getStars() == 1).count();
        
        // Get recent 10 reviews
        List<ReviewResponseDTO> recentReviews = reviews.stream()
                .sorted(Comparator.comparing(Review::getCreatedAt).reversed())
                .limit(10)
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        
        return new ReviewSummaryDTO(
            averageRating, 
            totalReviews, 
            fiveStar, 
            fourStar, 
            threeStar, 
            twoStar, 
            oneStar, 
            recentReviews
        );
    }

    // ⭐ Get average rating
    public Double getAverageRating(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Double avg = reviewRepository.getAverageRatingByRevieweeId(userId);

        // ⭐ SET average rating to user
        user.setAverageRating(avg != null ? avg : 0.0);
        userRepository.save(user);

        return avg != null ? avg : 0.0;
    }

    // ✅ Helper method to update average rating
    private void updateAverageRating(Long userId) {
        try {
            Double avg = reviewRepository.getAverageRatingByRevieweeId(userId);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setAverageRating(avg != null ? avg : 0.0);
            userRepository.save(user);
        } catch (Exception e) {
            // Log the error but don't throw it - we don't want review creation to fail if rating update fails
            System.err.println("Error updating average rating: " + e.getMessage());
        }
    }

    // ✅ Helper method to convert Review to ReviewResponseDTO
    private ReviewResponseDTO convertToResponseDTO(Review review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        
        dto.setId(review.getId());
        
        // Reviewer details (who wrote the review)
        if (review.getReviewer() != null) {
            dto.setReviewerId(review.getReviewer().getId());
            dto.setReviewerName(review.getReviewer().getName());
            dto.setReviewerEmail(review.getReviewer().getEmail());
            dto.setReviewerRole(review.getReviewer().getRole());
        }
        
        // Reviewee details (who received the review)
        if (review.getReviewee() != null) {
            dto.setRevieweeId(review.getReviewee().getId());
            dto.setRevieweeName(review.getReviewee().getName());
            dto.setRevieweeEmail(review.getReviewee().getEmail());
            dto.setRevieweeRole(review.getReviewee().getRole());
        }
        
        dto.setStars(review.getStars());
        dto.setComments(review.getComments());
        dto.setCreatedAt(review.getCreatedAt());
        
        // Set ride details
        if (review.getRide() != null) {
            dto.setRideId(review.getRide().getId());
            dto.setRideSource(review.getRide().getSource());
            dto.setRideDestination(review.getRide().getDestination());
            dto.setRideDate(review.getRide().getDate() != null ? 
                review.getRide().getDate().toString() : null);
        }
        
        // Set booking details
        if (review.getBooking() != null) {
            dto.setBookingId(review.getBooking().getId());
            dto.setSeatsBooked(review.getBooking().getSeatsBooked());
        }
        
        return dto;
    }

    // ✅ Get reviews where user is the reviewer (reviews given by user)
    public List<ReviewResponseDTO> getReviewsGivenByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Review> reviews = reviewRepository.findByReviewer(user);
        
        return reviews.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // ✅ Check if user has already reviewed a booking
    public boolean hasUserReviewedBooking(Long bookingId, Long reviewerId) {
        return reviewRepository.existsByBookingIdAndReviewerId(bookingId, reviewerId);
    }
}