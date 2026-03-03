package com.rideshare.backend.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "otp")
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String otp;
    private LocalDateTime expiryTime;

    public Otp() {}

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public LocalDateTime getExpiryTime() { return expiryTime; }
    public void setExpiryTime(LocalDateTime expiryTime) { this.expiryTime = expiryTime; }
}
