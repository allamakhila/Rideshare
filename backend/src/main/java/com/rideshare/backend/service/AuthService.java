package com.rideshare.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.rideshare.backend.entity.User;
import com.rideshare.backend.repository.UserRepository;
import com.rideshare.backend.util.JwtUtil;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER USER
    public String register(User user) {

        Optional<User> existing = userRepo.findByEmail(user.getEmail());

        if (existing.isPresent()) {
            return "User already exists";
        }

        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);

        return "User registered successfully";
    }

    // LOGIN USER
    public String login(String email, String password) {

        Optional<User> userOpt = userRepo.findByEmail(email);

        if (userOpt.isPresent()) {

            User user = userOpt.get();

            if (encoder.matches(password, user.getPassword())) {
                return jwtUtil.generateToken(email);
            }
        }

        throw new RuntimeException("Invalid credentials");
    }

    // GET USER BY EMAIL
    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
     public boolean userExists(String email) {
        return userRepo.findByEmail(email).isPresent();
    }
}