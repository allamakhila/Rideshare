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

    public void sendOtpEmail(String toEmail, String otp) throws IOException {

        MediaType mediaType = MediaType.parse("application/json");

        String json = "{"
                + "\"from\":\"RideShare <onboarding@resend.dev>\","
                + "\"to\":[\"" + toEmail + "\"],"
                + "\"subject\":\"Your OTP Code\","
                + "\"html\":\"<h2>Your OTP is: " + otp + "</h2>\""
                + "}";

        RequestBody body = RequestBody.create(json, mediaType);

        Request request = new Request.Builder()
                .url("https://api.resend.com/emails")
                .post(body)
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
}