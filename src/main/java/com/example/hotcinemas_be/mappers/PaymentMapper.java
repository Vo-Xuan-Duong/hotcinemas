package com.example.hotcinemas_be.mappers;

import com.example.hotcinemas_be.dtos.payment.responses.PaymentResponse;
import com.example.hotcinemas_be.models.Payment;
import org.springframework.stereotype.Service;

@Service
public class PaymentMapper {

    public PaymentResponse mapToResponse(Payment payment) {
        if (payment == null) {
            return null;
        }

        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .paymentDate(payment.getPaymentDate())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .bookingCode(payment.getBookingCode())
                .status(payment.getStatus())
                .build();
    }
}
