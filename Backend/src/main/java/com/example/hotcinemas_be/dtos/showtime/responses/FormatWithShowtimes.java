package com.example.hotcinemas_be.dtos.showtime.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormatWithShowtimes {
    private String formatType;
    private List<ShowtimeInfo> showtimes;
}

