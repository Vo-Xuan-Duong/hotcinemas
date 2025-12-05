package com.example.hotcinemas_be.dtos.booking.responses;

import com.example.hotcinemas_be.dtos.seat.SeatSnapshot;
import com.example.hotcinemas_be.enums.BookingStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingItemResponse {
    private Long id;
    private Long showtimeId;
    private String bookingCode;
    private String userId;
    private String userFullName;
    private String userEmail;
    private BigDecimal originalPrice;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private BookingStatus bookingStatus;
    private List<SeatSnapshot> seatSnapshots;
    private LocalDateTime bookingDate;
}
