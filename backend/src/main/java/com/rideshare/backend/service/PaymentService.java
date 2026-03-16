package com.rideshare.backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.rideshare.backend.entity.Payment;
import com.rideshare.backend.entity.Ride;
import com.rideshare.backend.repository.PaymentRepository;
import com.rideshare.backend.repository.BookingRepository;
import com.rideshare.backend.entity.Booking;

import java.util.List;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // =========================
    // Create Razorpay Order
    // =========================
    public String createOrder(double amount) throws Exception {

        // ✅ Debug info
        System.out.println("========== RAZORPAY DEBUG ==========");
        System.out.println("KEY ID: " + razorpayKeyId);
        System.out.println("KEY SECRET: " + razorpayKeySecret);
        System.out.println("====================================");

        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject options = new JSONObject();
        options.put("amount", (int) (amount * 100)); // amount in paise
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = razorpayClient.orders.create(options);

        return order.toString();
    }

    // =========================
    // Save Payment after success
    // =========================
    public void savePayment(String orderId, String paymentId, String signature, double amount, Booking booking, Ride ride) {
        Payment payment = new Payment();
        payment.setRazorpayOrderId(orderId);
        payment.setRazorpayPaymentId(paymentId);
        payment.setRazorpaySignature(signature);
        payment.setRide(ride);        // associate ride
        payment.setAmount(amount);
        payment.setStatus("PAID");

        // Optionally associate booking if you add a booking field in Payment
        if (booking != null) {
            payment.setBooking(booking);
        }

        paymentRepository.save(payment);
        System.out.println("Payment saved successfully in DB with booking and ride");
    }

    // =========================
    // Update Booking Status to PAID
    // =========================
    public void updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking != null) {
            booking.setStatus(status);
            bookingRepository.save(booking);
            System.out.println("Booking status updated to: " + status);
        } else {
            System.out.println("Booking not found for id: " + bookingId);
        }
    }

    // =========================
    // Get all transaction history
    // =========================
    public List<Payment> getAllTransactions() {
        return paymentRepository.findAll();
    }

    // =========================
    // Get payments by driver email
    // =========================
    public List<Payment> getPaymentsByDriver(String email) {
        return paymentRepository.findByRide_DriverEmail(email);
    }

    public List<Payment> getPaymentsByPassenger(String email) {
    return paymentRepository.findByBooking_PassengerEmail(email);
}
}