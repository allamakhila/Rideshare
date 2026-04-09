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
import com.rideshare.backend.repository.UserRepository;
import com.rideshare.backend.service.AuthService;

import org.springframework.security.crypto.password.PasswordEncoder;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Map<String, String> otpStorage = new HashMap<>();

    // ===== RegisterDTO =====
    public static class RegisterDTO {
        private String name;
        private String email;
        private String password;
        private String role; // "PASSENGER", "DRIVER", or "ADMIN"

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    // ===== Send OTP =====
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody OtpRequest request) {

        String email = request.getEmail();

        if (authService.userExists(email)) {
            return ResponseEntity.badRequest().body("Account already exists");
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

    // ===== Verify OTP =====
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

    // ===== Register (dynamic role) =====
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterDTO dto) {
        // Check if email already exists
        if (userRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Validate role
        String role = dto.getRole();
        if (!role.equalsIgnoreCase("PASSENGER") && 
            !role.equalsIgnoreCase("DRIVER") && 
            !role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.badRequest().body("Invalid role. Must be PASSENGER, DRIVER, or ADMIN");
        }

        // Create user
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(role.toUpperCase()); // Store in uppercase

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully as " + role.toUpperCase());
    }

    // ===== Login =====
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {

        String token = authService.login(request.getEmail(), request.getPassword());

        User user = authService.getUserByEmail(request.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("name", user.getName());
        response.put("id", user.getId());
        response.put("email", user.getEmail());

        return response;
    }
}