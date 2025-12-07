package com.example.hotcinemas_be.mappers;

import com.example.hotcinemas_be.dtos.ticket.response.TicketResponse;
import com.example.hotcinemas_be.services.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicketMapper {

    public TicketResponse mapToResponse(com.example.hotcinemas_be.models.Ticket ticket) throws Exception {
        if (ticket == null) {
            return null;
        }

        return TicketResponse.builder()
                .id(ticket.getId())
                .ticketCode(ticket.getTicketCode())
                .bookingId(ticket.getBooking().getId())
                .showtimeId(ticket.getShowtime().getId())
                .seatId(ticket.getSeat().getId())
                .seatName(ticket.getSeatName())
                .movieTitle(ticket.getShowtime().getMovie().getTitle())
                .moviePosterUrl(ticket.getShowtime().getMovie().getPosterPath())
                .cinemaName(ticket.getShowtime().getRoom().getCinema().getName())
                .cinemaAddress(ticket.getShowtime().getRoom().getCinema().getAddress())
                .roomName(ticket.getShowtime().getRoom().getName())
                .showtimeDateTime(ticket.getShowtime().getDate())
                .showtimeStartTime(ticket.getShowtime().getStartTime())
                .showtimeEndTime(ticket.getShowtime().getEndTime())
                .build();
    }
}
