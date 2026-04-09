package com.rideshare.backend.dto;

public class ReviewDTO {
    private Long rideId;
    private Long bookingId;
    private Long reviewerId;
    private Long revieweeId;
    private int stars;
    private String comments;

    // ✅ Constructors
    public ReviewDTO() {}

    public ReviewDTO(Long rideId, Long bookingId, Long reviewerId, Long revieweeId, int stars, String comments) {
        this.rideId = rideId;
        this.bookingId = bookingId;
        this.reviewerId = reviewerId;
        this.revieweeId = revieweeId;
        this.stars = stars;
        this.comments = comments;
    }

    // ✅ Getters and Setters
    public Long getRideId() { 
        return rideId; 
    }
    
    public void setRideId(Long rideId) { 
        this.rideId = rideId; 
    }

    public Long getBookingId() { 
        return bookingId; 
    }
    
    public void setBookingId(Long bookingId) { 
        this.bookingId = bookingId; 
    }

    public Long getReviewerId() { 
        return reviewerId; 
    }
    
    public void setReviewerId(Long reviewerId) { 
        this.reviewerId = reviewerId; 
    }

    public Long getRevieweeId() { 
        return revieweeId; 
    }
    
    public void setRevieweeId(Long revieweeId) { 
        this.revieweeId = revieweeId; 
    }

    public int getStars() { 
        return stars; 
    }
    
    public void setStars(int stars) { 
        this.stars = stars; 
    }

    public String getComments() { 
        return comments; 
    }
    
    public void setComments(String comments) { 
        this.comments = comments; 
    }

    @Override
    public String toString() {
        return "ReviewDTO{" +
                "rideId=" + rideId +
                ", bookingId=" + bookingId +
                ", reviewerId=" + reviewerId +
                ", revieweeId=" + revieweeId +
                ", stars=" + stars +
                ", comments='" + comments + '\'' +
                '}';
    }
}