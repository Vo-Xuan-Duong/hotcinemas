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
public class RevenueByMovieResponse {
    private Long movieId;
    private String movieTitle;
    private String posterPath;
    private BigDecimal totalRevenue;
    private Long totalBookings;
    private Long totalTickets;
}
