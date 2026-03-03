package com.rideshare.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import com.rideshare.backend.dto.LoginRequest;
import com.rideshare.backend.entity.User;
import com.rideshare.backend.service.AuthService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private AuthService authService;

    private static final Map<String, String> otpStorage = new HashMap<>();


    // Send OTP
    @PostMapping("/send-otp")
public ResponseEntity<String> sendOtp(@RequestBody OtpRequest request) {

    String email = request.getEmail();

    if (authService.userExists(email)) {
        return ResponseEntity
                .badRequest()
                .body("Account already exists");
    }

    String otp = String.valueOf(new Random().nextInt(900000) + 100000);
    otpStorage.put(email, otp);

    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(email);
    message.setSubject("Your OTP Code");
    message.setText("Your OTP is: " + otp);

    mailSender.send(message);

    return ResponseEntity.ok("OTP sent successfully");
}


    // Verify OTP
    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody OtpRequest request) {

        String email = request.getEmail();
        String otp = request.getOtp();

        if (otpStorage.containsKey(email) && otpStorage.get(email).equals(otp)) {
            otpStorage.remove(email);
            return "OTP verified successfully";
        }

        return "Invalid OTP";
    }


    // Register
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return authService.register(user);
    }


    // Login
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {

        String token = authService.login(request.getEmail(), request.getPassword());

        User user = authService.getUserByEmail(request.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("name", user.getName());   // ✅ ADD THIS LINE

        return response;
    }

}