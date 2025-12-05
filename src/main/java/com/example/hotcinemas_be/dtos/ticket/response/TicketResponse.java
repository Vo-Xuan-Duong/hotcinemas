package com.example.hotcinemas_be.dtos.ticket.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TicketResponse {
    private Long id;
    private String ticketCode;
    private String qrCodeBase64;
    private Long bookingId;
    private Long showtimeId;
    private Long seatId;
    private String seatName;
    private String movieTitle;
    private String moviePosterUrl;
    private String cinemaName;
    private String cinemaAddress;
    private String roomName;
    private LocalDate showtimeDateTime;
    private LocalTime showtimeStartTime;
    private LocalTime showtimeEndTime;
}
