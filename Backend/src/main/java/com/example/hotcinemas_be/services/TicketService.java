package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.ticket.response.TicketResponse;
import com.example.hotcinemas_be.mappers.TicketMapper;
import com.example.hotcinemas_be.models.Booking;
import com.example.hotcinemas_be.models.Seat;
import com.example.hotcinemas_be.models.Ticket;
import com.example.hotcinemas_be.repositorys.BookingRepository;
import com.example.hotcinemas_be.repositorys.SeatRepository;
import com.example.hotcinemas_be.repositorys.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;

    public List<Long> getSeatsBookedInShowtime(Long showtimeId) {
        List<Booking> bookings = bookingRepository.findByShowtimeId(showtimeId);

        return bookings.stream()
                .flatMap(booking -> booking.getTickets().stream())
                .map(ticket -> ticket.getSeat().getId())
                .toList();
    }

    public void createTicketsForBooking(Booking booking) {
        List<Ticket> tickets = booking.getSeatSnapshots().stream()
                .map(seatSnapshot -> {
                    Seat seat = Seat.builder().id(seatSnapshot.getSeatId()).build();
                    return Ticket.builder()
                            .booking(booking)
                            .showtime(booking.getShowtime())
                            .seatName(seatSnapshot.getSeatName())
                            .seat(seat)
                            .price(seatSnapshot.getPrice())
                            .ticketCode(booking.getBookingCode() + "-" + seatSnapshot.getSeatName())
                            .build();
                })
                .toList();

        ticketRepository.saveAll(tickets);
    }

    public List<TicketResponse> getTicketsByBookingId(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with code: " + bookingId));

        List<Ticket> tickets = ticketRepository.findByBooking(booking);

        return tickets.stream()
                .map(ticket -> {
                    try {
                        return ticketMapper.mapToResponse(ticket);
                    } catch (Exception e) {
                        throw new RuntimeException("Error mapping ticket to response", e);
                    }
                })
                .toList();
    }
}
