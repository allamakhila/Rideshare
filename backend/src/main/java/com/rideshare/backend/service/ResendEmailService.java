package com.rideshare.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ResendEmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Generic email sender
    public void sendEmail(String toEmail, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    // OTP sender
    public void sendOtpEmail(String toEmail, String otp) {

        sendEmail(
                toEmail,
                "Your OTP Code",
                "Your OTP is: " + otp
        );
    }
}