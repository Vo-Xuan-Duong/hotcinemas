package com.example.hotcinemas_be.dtos.showtime.responses;

import com.example.hotcinemas_be.enums.ShowTimeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShowtimeInfo {
    private Long showtimeId;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long roomId;
    private String roomName;
    private BigDecimal price;
    private ShowTimeStatus status;
}

