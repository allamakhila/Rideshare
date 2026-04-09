package com.rideshare.backend.dto;

import java.util.List;

public class ReviewSummaryDTO {
    private Double averageRating;
    private int totalReviews;
    private int fiveStarCount;
    private int fourStarCount;
    private int threeStarCount;
    private int twoStarCount;
    private int oneStarCount;
    private List<ReviewResponseDTO> recentReviews;

    // ✅ Constructors
    public ReviewSummaryDTO() {}

    public ReviewSummaryDTO(Double averageRating, int totalReviews, 
                           int fiveStarCount, int fourStarCount, 
                           int threeStarCount, int twoStarCount, 
                           int oneStarCount, List<ReviewResponseDTO> recentReviews) {
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.fiveStarCount = fiveStarCount;
        this.fourStarCount = fourStarCount;
        this.threeStarCount = threeStarCount;
        this.twoStarCount = twoStarCount;
        this.oneStarCount = oneStarCount;
        this.recentReviews = recentReviews;
    }

    // ✅ Getters and Setters
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public int getTotalReviews() { return totalReviews; }
    public void setTotalReviews(int totalReviews) { this.totalReviews = totalReviews; }

    public int getFiveStarCount() { return fiveStarCount; }
    public void setFiveStarCount(int fiveStarCount) { this.fiveStarCount = fiveStarCount; }

    public int getFourStarCount() { return fourStarCount; }
    public void setFourStarCount(int fourStarCount) { this.fourStarCount = fourStarCount; }

    public int getThreeStarCount() { return threeStarCount; }
    public void setThreeStarCount(int threeStarCount) { this.threeStarCount = threeStarCount; }

    public int getTwoStarCount() { return twoStarCount; }
    public void setTwoStarCount(int twoStarCount) { this.twoStarCount = twoStarCount; }

    public int getOneStarCount() { return oneStarCount; }
    public void setOneStarCount(int oneStarCount) { this.oneStarCount = oneStarCount; }

    public List<ReviewResponseDTO> getRecentReviews() { return recentReviews; }
    public void setRecentReviews(List<ReviewResponseDTO> recentReviews) { this.recentReviews = recentReviews; }
}