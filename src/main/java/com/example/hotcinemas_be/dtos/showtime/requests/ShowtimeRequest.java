package com.example.hotcinemas_be.dtos.showtime.requests;

import com.example.hotcinemas_be.enums.MovieFormat;
import com.example.hotcinemas_be.enums.ShowTimeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShowtimeRequest {
    private Long roomId;
    private Long movieId;
    private LocalDate date;
    private LocalTime startTime;
    private Double ticketPrice;
    private MovieFormat movieFormat;
    private ShowTimeStatus status;
}
