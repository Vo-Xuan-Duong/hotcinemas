package com.example.hotcinemas_be.mappers;

import com.example.hotcinemas_be.dtos.room.responses.RoomResponse;
import com.example.hotcinemas_be.models.Room;
import org.springframework.stereotype.Service;

@Service
public class RoomMapper {
    public RoomResponse mapToResponse(Room room) {
        if (room == null) {
            return null;
        }

        return RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .roomType(room.getRoomType().name()) // Assuming roomType is an enum
                .price(room.getPrice())
                .isActive(room.getIsActive())
                .build();
    }
}
