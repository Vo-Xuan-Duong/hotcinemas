package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.dtos.booking.responses.BookingDetailResponse;
import com.example.hotcinemas_be.dtos.ticket.response.TicketResponse;
import com.example.hotcinemas_be.services.BookingService;
import com.example.hotcinemas_be.services.SupportService;
import com.example.hotcinemas_be.services.TicketService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private TicketService ticketService;
    private final BookingService bookingService;
    private final SupportService supportService;

    @GetMapping("/download-booking/{bookingId}")
    public ResponseEntity<?> downloadBookingPDF(@PathVariable Long bookingId) {
            byte[] pdf = supportService.generateBookingPdf(bookingId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ve_" + bookingId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);

    }
}
