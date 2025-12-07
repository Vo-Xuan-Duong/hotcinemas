package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.services.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/emails")
@RequiredArgsConstructor
public class EmailController {
    private final SupportService supportService;

    @GetMapping("/send-ticket/{bookingId}")
    public ResponseEntity<?> sendEmail(@PathVariable("bookingId") Long bookingId){
        supportService.sendTicketEmail(bookingId);
        return ResponseEntity.ok("Email sent successfully");
    }

}
