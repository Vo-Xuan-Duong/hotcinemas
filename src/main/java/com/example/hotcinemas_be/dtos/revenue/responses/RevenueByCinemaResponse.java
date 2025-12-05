package com.example.hotcinemas_be.dtos.revenue.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueByCinemaResponse {
    private Long cinemaId;
    private String cinemaName;
    private String cityName;
    private BigDecimal totalRevenue;
    private Long totalBookings;
    private Long totalTickets;
}
