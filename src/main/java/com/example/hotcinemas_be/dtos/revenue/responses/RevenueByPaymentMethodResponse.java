package com.example.hotcinemas_be.dtos.revenue.responses;

import com.example.hotcinemas_be.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueByPaymentMethodResponse {
    private PaymentMethod paymentMethod;
    private BigDecimal totalRevenue;
    private Long totalTransactions;
}
