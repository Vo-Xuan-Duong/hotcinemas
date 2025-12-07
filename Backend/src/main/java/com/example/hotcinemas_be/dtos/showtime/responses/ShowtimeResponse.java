package com.example.hotcinemas_be.dtos.showtime.responses;

import com.example.hotcinemas_be.enums.MovieFormat;
import com.example.hotcinemas_be.enums.ShowTimeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShowtimeResponse {
    private Long id;
    private String movieTitle;
    private String cinemaName;
    private String roomName;
    private LocalDate showDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal price;
    private MovieFormat movieFormat;
    private String movieFormatLabel;
    private ShowTimeStatus status;
    private Integer totalSeats;
    private Integer seatsBooked;
    private Boolean isActive ;
}
