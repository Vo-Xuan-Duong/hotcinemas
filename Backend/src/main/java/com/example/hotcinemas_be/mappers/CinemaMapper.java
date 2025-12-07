package com.example.hotcinemas_be.mappers;

import com.example.hotcinemas_be.dtos.cinema.responses.CinemaResponse;
import com.example.hotcinemas_be.models.Cinema;
import com.example.hotcinemas_be.services.RoomService;
import org.springframework.stereotype.Service;

@Service
public class CinemaMapper {
    private final RoomService roomService;

    public CinemaMapper(RoomService roomService) {
        this.roomService = roomService;
    }

    public CinemaResponse mapToResponse(Cinema cinema) {
        if (cinema == null) {
            return null;
        }
        return CinemaResponse.builder()
                .id(cinema.getId())
                .name(cinema.getName())
                .address(cinema.getAddress())
                .phone(cinema.getPhone())
                .email(cinema.getEmail())
                .city(cinema.getCity().getName())
                .latitude(cinema.getLatitude())
                .longitude(cinema.getLongitude())
                .numberOfRooms(roomService.getNumberRoomsByCinemaId(cinema.getId()))
                .createdAt(cinema.getCreatedAt() != null ? cinema.getCreatedAt().toString() : null)
                .updatedAt(cinema.getUpdatedAt() != null ? cinema.getUpdatedAt().toString() : null)
                .build();
    }
}
