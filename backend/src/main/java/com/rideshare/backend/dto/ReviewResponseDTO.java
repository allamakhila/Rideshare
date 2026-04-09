package com.rideshare.backend.dto;

import java.time.LocalDateTime;

public class ReviewResponseDTO {
    private Long id;
    
    // Reviewer details (who wrote the review)
    private Long reviewerId;
    private String reviewerName;
    private String reviewerEmail;
    private String reviewerRole;
    
    // Reviewee details (who received the review) - ADD THESE!
    private Long revieweeId;
    private String revieweeName;
    private String revieweeEmail;
    private String revieweeRole;
    
    private int stars;
    private String comments;
    private LocalDateTime createdAt;
    
    // Ride details
    private Long rideId;
    private String rideSource;
    private String rideDestination;
    private String rideDate;
    
    // Booking details
    private Long bookingId;
    private int seatsBooked;

    // Constructors
    public ReviewResponseDTO() {}

    // Getters and Setters for ALL fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    // Reviewer getters/setters
    public Long getReviewerId() { return reviewerId; }
    public void setReviewerId(Long reviewerId) { this.reviewerId = reviewerId; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public String getReviewerEmail() { return reviewerEmail; }
    public void setReviewerEmail(String reviewerEmail) { this.reviewerEmail = reviewerEmail; }

    public String getReviewerRole() { return reviewerRole; }
    public void setReviewerRole(String reviewerRole) { this.reviewerRole = reviewerRole; }

    // Reviewee getters/setters - ADD THESE!
    public Long getRevieweeId() { return revieweeId; }
    public void setRevieweeId(Long revieweeId) { this.revieweeId = revieweeId; }

    public String getRevieweeName() { return revieweeName; }
    public void setRevieweeName(String revieweeName) { this.revieweeName = revieweeName; }

    public String getRevieweeEmail() { return revieweeEmail; }
    public void setRevieweeEmail(String revieweeEmail) { this.revieweeEmail = revieweeEmail; }

    public String getRevieweeRole() { return revieweeRole; }
    public void setRevieweeRole(String revieweeRole) { this.revieweeRole = revieweeRole; }

    public int getStars() { return stars; }
    public void setStars(int stars) { this.stars = stars; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getRideId() { return rideId; }
    public void setRideId(Long rideId) { this.rideId = rideId; }

    public String getRideSource() { return rideSource; }
    public void setRideSource(String rideSource) { this.rideSource = rideSource; }

    public String getRideDestination() { return rideDestination; }
    public void setRideDestination(String rideDestination) { this.rideDestination = rideDestination; }

    public String getRideDate() { return rideDate; }
    public void setRideDate(String rideDate) { this.rideDate = rideDate; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public int getSeatsBooked() { return seatsBooked; }
    public void setSeatsBooked(int seatsBooked) { this.seatsBooked = seatsBooked; }
}