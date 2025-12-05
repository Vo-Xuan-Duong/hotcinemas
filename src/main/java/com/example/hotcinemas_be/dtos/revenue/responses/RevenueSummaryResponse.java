package com.example.hotcinemas_be.dtos.revenue.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueSummaryResponse {
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalRevenue;
    private BigDecimal averageRevenuePerDay;
    private Long totalBookings;
    private Long totalTickets;
    private Long totalSuccessfulPayments;
    private Long totalPendingPayments;
    private Long totalFailedPayments;
    private BigDecimal averageBookingValue;
}
