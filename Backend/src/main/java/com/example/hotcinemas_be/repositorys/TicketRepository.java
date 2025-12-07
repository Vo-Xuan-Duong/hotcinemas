package com.example.hotcinemas_be.repositorys;

import com.example.hotcinemas_be.models.Booking;
import com.example.hotcinemas_be.models.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByBooking(Booking booking);
}
