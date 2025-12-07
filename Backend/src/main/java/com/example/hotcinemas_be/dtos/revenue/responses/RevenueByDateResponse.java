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
public class RevenueByDateResponse {
    private LocalDate date;
    private BigDecimal totalRevenue;
    private Long totalBookings;
    private Long totalTickets;
}
