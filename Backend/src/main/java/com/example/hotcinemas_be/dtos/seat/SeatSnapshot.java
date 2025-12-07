package com.example.hotcinemas_be.dtos.seat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatSnapshot implements Serializable {
    private Long seatId;   // 1
    private String seatName;   // "A5"
    private BigDecimal price;  // 100000
    private String seatType;   // "VIP"
}
