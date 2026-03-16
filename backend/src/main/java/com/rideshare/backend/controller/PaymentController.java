package com.rideshare.backend.controller;

import com.rideshare.backend.dto.PaymentRequest;
import com.rideshare.backend.entity.Booking;
import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.entity.Payment;
import com.rideshare.backend.repository.BookingRepository;
import com.rideshare.backend.repository.RideRepository;
import com.rideshare.backend.service.PaymentService;
import com.razorpay.Utils;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RideRepository rideRepository;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    // =============================
    // CREATE ORDER API
    // =============================
    @PostMapping("/create-order")
    public String createOrder(@RequestParam double amount) throws Exception {
        return paymentService.createOrder(amount);
    }

    // =============================
    // VERIFY PAYMENT API
    // =============================
    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@RequestBody PaymentRequest request) {
        try {

            String razorpayOrderId = request.getRazorpayOrderId();
            String razorpayPaymentId = request.getRazorpayPaymentId();
            String razorpaySignature = request.getRazorpaySignature();
            Long bookingId = request.getBookingId();
            Long rideId = request.getRideId();
            double amount = request.getAmount();

            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (!isValid) {
                return ResponseEntity.status(400).body("Invalid payment signature");
            }

            Booking booking = bookingRepository.findById(bookingId).orElseThrow();
            Ride ride = rideRepository.findById(rideId).orElseThrow();

            paymentService.savePayment(
                    razorpayOrderId,
                    razorpayPaymentId,
                    razorpaySignature,
                    amount,
                    booking,
                    ride
            );

            booking.setStatus("PAID");
            bookingRepository.save(booking);

            return ResponseEntity.ok("Payment verified and stored successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Payment verification failed");
        }
    }

    // =============================
    // GET ALL TRANSACTIONS (ADMIN)
    // =============================
    @GetMapping("/transactions")
    public List<Payment> getAllTransactions() {
        return paymentService.getAllTransactions();
    }

    // =============================
    // DRIVER TRANSACTION HISTORY
    // =============================
    @GetMapping("/history/driver/{email}")
    public List<Payment> getDriverPayments(@PathVariable String email) {
        return paymentService.getPaymentsByDriver(email);
    }

    // =============================
    // PASSENGER TRANSACTION HISTORY  ✅ NEW API
    // =============================
    @GetMapping("/history/passenger/{email}")
    public List<Payment> getPassengerPayments(@PathVariable String email) {
        return paymentService.getPaymentsByPassenger(email);
    }

}