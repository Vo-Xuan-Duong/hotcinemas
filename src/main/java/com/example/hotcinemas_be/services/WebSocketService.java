package com.example.hotcinemas_be.services;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendSeatUpdate(Long showtimeId, Object seatUpdate) {
        String destination = "/topic/showtimes/" + showtimeId;
        simpMessagingTemplate.convertAndSend(destination, seatUpdate);

        System.out.println("Đã bắn socket tới: " + destination);
    }
}
