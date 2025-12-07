package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.room.requests.RoomRequest;
import com.example.hotcinemas_be.dtos.room.responses.RoomResponse;
import com.example.hotcinemas_be.exceptions.ErrorCode;
import com.example.hotcinemas_be.exceptions.ErrorException;
import com.example.hotcinemas_be.mappers.RoomMapper;
import com.example.hotcinemas_be.models.Cinema;
import com.example.hotcinemas_be.models.Room;
import com.example.hotcinemas_be.repositorys.CinemaRepository;
import com.example.hotcinemas_be.repositorys.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final CinemaRepository cinemaRepository;
    private final SeatService seatService;


    public RoomResponse createRoom(Long cinemaId, RoomRequest roomRequest) {
        Cinema cinema = cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new RuntimeException("Cinema not found with id: " + cinemaId));

        log.info("Creating room with request: {}", roomRequest);

        Room room = new Room();
        room.setName(roomRequest.getName());
        room.setRoomType(roomRequest.getRoomType());
        room.setPrice(roomRequest.getPrice());
        room.setIsActive(true);
        room.setCinema(cinema);
        Room savedRoom = roomRepository.save(room);

        seatService.createSeatsForRoom(savedRoom.getId(), roomRequest.getRowsCount(), roomRequest.getSeatsPerRow(),
                roomRequest.getRowVip());
        return roomMapper.mapToResponse(savedRoom);
    }

    public RoomResponse getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(
                        () -> new ErrorException("Room not found with id: " + roomId, ErrorCode.ERROR_MODEL_NOT_FOUND));
        return roomMapper.mapToResponse(room);
    }

    public RoomResponse updateRoom(Long roomId, RoomRequest roomRequest) {
        Room room = roomRepository.findById(roomId).orElseThrow(
                () -> new ErrorException("Room not found with id: " + roomId, ErrorCode.ERROR_MODEL_NOT_FOUND));

        room.setName(roomRequest.getName());
        room.setRoomType(roomRequest.getRoomType());
        room.setPrice(roomRequest.getPrice());
        room.setIsActive(room.getIsActive());

        return roomMapper.mapToResponse(roomRepository.save(room));
    }

    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(
                        () -> new ErrorException("Room not found with id: " + roomId, ErrorCode.ERROR_MODEL_NOT_FOUND));
        roomRepository.delete(room);
    }

    public Page<RoomResponse> getPageRooms(Pageable pageable) {
        Page<Room> rooms = roomRepository.findAll(pageable);
        return rooms.map(roomMapper::mapToResponse);
    }

    public List<RoomResponse> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        if (rooms.isEmpty()) {
            throw new ErrorException("No rooms found", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return rooms.stream().map(roomMapper::mapToResponse).toList();
    }

    public List<RoomResponse> getAllRoomsByCinemaId(Long cinemaId) {
        return List.of();
    }

    public List<RoomResponse> getPageRoomsByCinemaId(Long cinemaId) {
        List<Room> rooms = roomRepository.findRoomsByCinema_Id(cinemaId);
        if (rooms.isEmpty()) {
            throw new ErrorException("No rooms found for cinema with id: " + cinemaId, ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return rooms.stream().map(roomMapper::mapToResponse).toList();
    }

    public void deleteRoomsByCinemaId(Long cinemaId) {
        List<Room> rooms = roomRepository.findRoomsByCinema_Id(cinemaId);
        if (rooms.isEmpty()) {
            throw new ErrorException("No rooms found for cinema with id: " + cinemaId, ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        for (Room room : rooms) {
            seatService.deleteSeatsByRoomId(room.getId());
            roomRepository.delete(room);
        }
    }

    public Integer getNumberRoomsByCinemaId(Long cinemaId) {
        return roomRepository.countByCinema_Id(cinemaId);
    }

    public List<RoomResponse> getAllRoomsNoPage() {
        List<Room> rooms = roomRepository.findAll();
        if (rooms.isEmpty()) {
            throw new ErrorException("No rooms found", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return rooms.stream().map(roomMapper::mapToResponse).toList();
    }
}
