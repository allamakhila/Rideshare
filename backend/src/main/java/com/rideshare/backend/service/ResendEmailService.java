package com.rideshare.backend.service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ResendEmailService {

    @Value("${RESEND_API_KEY}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient();

    // Generic email sender
    public void sendEmail(String toEmail, String subject, String body) throws IOException {

    MediaType mediaType = MediaType.parse("application/json");

    String json = "{"
            + "\"from\":\"RideShare <onboarding@resend.dev>\","
            + "\"to\":[\"" + toEmail + "\"],"
            + "\"subject\":\"" + subject + "\","
            + "\"html\":\"<h2>" + body.replace("\n","<br>") + "</h2>\""
            + "}";

    RequestBody requestBody = RequestBody.create(json, mediaType);

    Request request = new Request.Builder()
            .url("https://api.resend.com/emails")
            .post(requestBody)
            .addHeader("Authorization", "Bearer " + apiKey)
            .addHeader("Content-Type", "application/json")
            .build();

    Response response = client.newCall(request).execute();

    String responseBody = response.body().string();

    System.out.println("Resend Response Code: " + response.code());
    System.out.println("Resend Response Body: " + responseBody);

    if (!response.isSuccessful()) {
        throw new RuntimeException("Failed to send email: " + responseBody);
    }
}

    // OTP sender
    public void sendOtpEmail(String toEmail, String otp) throws IOException {
        sendEmail(
    toEmail,
    "Your OTP Code",
    "Your OTP is: " + otp
);
    }
}