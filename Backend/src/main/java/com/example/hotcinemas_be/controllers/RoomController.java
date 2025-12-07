package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.dtos.common.ResponseData;
import com.example.hotcinemas_be.dtos.room.requests.RoomRequest;
import com.example.hotcinemas_be.services.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rooms")
@Tag(name = "Room Management", description = "APIs for managing rooms in the cinema system")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @Operation(summary = "Get all rooms", description = "Retrieve a list of all rooms in the cinema system")
    @GetMapping
    public ResponseEntity<?> getAllRooms(Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully retrieved all rooms")
                .data(roomService.getPageRooms(pageable))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get room by ID", description = "Retrieve a specific room by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully retrieved room with ID: " + id)
                .data(roomService.getRoomById(id))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get rooms by cinema ID", description = "Retrieve all rooms associated with a specific cinema ID")
    @GetMapping("/cinema/{cinemaId}")
    public ResponseEntity<?> getRoomsByCinemaId(@PathVariable Long cinemaId) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully retrieved rooms for cinema ID: " + cinemaId)
                .data(roomService.getPageRoomsByCinemaId(cinemaId))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Create a new room", description = "Create a new room in the cinema system")
    @PostMapping("/cinema/{cinemaId}")
    public ResponseEntity<?> createRoom(@PathVariable Long cinemaId, @RequestBody RoomRequest roomRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Successfully created a new room")
                .data(roomService.createRoom(cinemaId, roomRequest))
                .build();
        return ResponseEntity.status(201).body(responseData);
    }

    @Operation(summary = "Update a room", description = "Update an existing room in the cinema system")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody RoomRequest roomRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully updated room with ID: " + id)
                .data(roomService.updateRoom(id, roomRequest))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Delete a room", description = "Delete a specific room by its ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully deleted room with ID: " + id)
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Delete all rooms by cinema ID", description = "Delete all rooms associated with a specific cinema ID")
    @DeleteMapping("/cinema/{cinemaId}")
    public ResponseEntity<?> deleteRoomsByCinemaId(@PathVariable Long cinemaId) {
        roomService.deleteRoomsByCinemaId(cinemaId);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully deleted all rooms for cinema ID: " + cinemaId)
                .build();
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/all-no-page")
    public ResponseEntity<?> getAllRoomsNoPage() {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully retrieved all rooms without pagination")
                .data(roomService.getAllRoomsNoPage())
                .build();
        return ResponseEntity.ok(responseData);
    }
}
