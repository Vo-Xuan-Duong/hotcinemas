package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.seat.requests.SeatRequest;
import com.example.hotcinemas_be.dtos.seat.responses.SeatResponse;
import com.example.hotcinemas_be.enums.SeatStatus;
import com.example.hotcinemas_be.enums.SeatType;
import com.example.hotcinemas_be.mappers.SeatMapper;
import com.example.hotcinemas_be.models.Room;
import com.example.hotcinemas_be.models.Seat;
import com.example.hotcinemas_be.repositorys.RoomRepository;
import com.example.hotcinemas_be.repositorys.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;
    private final SeatMapper seatMapper;
    private final RoomRepository roomRepository;

    public SeatResponse createSeat(SeatRequest seatRequest) {
        // Validate room exists
        Room room = roomRepository.findById(seatRequest.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + seatRequest.getRoomId()));

        // Check if seat already exists at this position
        seatRepository.findByRoomIdAndName(
                seatRequest.getRoomId(),
                seatRequest.getName()).ifPresent(seat -> {
                    throw new RuntimeException("Seat already exists at position " +
                            seatRequest.getName() + " in room "
                            + seatRequest.getRoomId());
                });

        Seat seat = Seat.builder()
                .room(room)
                .name(seatRequest.getName())
                .seatType(seatRequest.getSeatType() != null ? seatRequest.getSeatType() : SeatType.NORMAL)
                .status(SeatStatus.AVAILABLE)
                .col(seatRequest.getCol())
                .row(seatRequest.getRow())
                .isActive(seatRequest.getIsActive() != null ? seatRequest.getIsActive() : true)
                .build();

        Seat savedSeat = seatRepository.save(seat);
        return seatMapper.mapToResponse(savedSeat);
    }

    @Transactional(readOnly = true)
    public SeatResponse getSeatById(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + seatId));
        return seatMapper.mapToResponse(seat);
    }

    public SeatResponse updateSeat(Long seatId, SeatRequest seatRequest) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + seatId));

        // Update other fields
        if (seatRequest.getName() != null) {
            seat.setName(seatRequest.getName());
        }
        if (seatRequest.getSeatType() != null) {
            seat.setSeatType(seatRequest.getSeatType());
        }
        if (seatRequest.getStatus() != null) {
            seat.setStatus(seatRequest.getStatus());
        }
        if (seatRequest.getCol() != null) {
            seat.setCol(seatRequest.getCol());
        }
        if (seatRequest.getRow() != null) {
            seat.setRow(seatRequest.getRow());
        }
        if (seatRequest.getIsActive() != null) {
            seat.setIsActive(seatRequest.getIsActive());
        }

        Seat updatedSeat = seatRepository.save(seat);
        return seatMapper.mapToResponse(updatedSeat);
    }

    public void deleteSeat(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + seatId));
        seatRepository.delete(seat);
    }

    @Transactional(readOnly = true)
    public List<SeatResponse> getSeatsByRoomId(Long roomId) {
        List<Seat> seats = seatRepository.findByRoomId(roomId);
        return seats.stream().map(seatMapper::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<SeatResponse> getSeatsByRoomIdAndActive(Long roomId) {
        List<Seat> seats = seatRepository.findByRoomIdAndIsActiveTrue(roomId);
        return seats.stream().map(seatMapper::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<SeatResponse> getSeatsBySeatType(SeatType seatType) {
        List<Seat> seats = seatRepository.findBySeatType(seatType);
        return seats.stream().map(seatMapper::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<SeatResponse> getSeatsByRoomIdAndSeatType(Long roomId, SeatType seatType) {
        List<Seat> seats = seatRepository.findByRoomIdAndSeatType(roomId, seatType);
        return seats.stream().map(seatMapper::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<SeatResponse> getSeatsByCinemaId(Long cinemaId) {
        List<Seat> seats = seatRepository.findByCinemaId(cinemaId);
        return seats.stream().map(seatMapper::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public SeatResponse getSeatByRoomAndPosition(Long roomId, String name) {
        Seat seat = seatRepository.findByRoomIdAndName(roomId, name)
                .orElseThrow(() -> new RuntimeException(
                        "Seat not found at position " + name + " in room " + roomId));
        return seatMapper.mapToResponse(seat);
    }

    @Async
    @Transactional
    public void createSeatsForRoom(Long roomId, Integer rowsCount, Integer seatsPerRow, List<Long> rowVip) {
        if (roomId == null) {
            throw new IllegalArgumentException("Room ID cannot be null");
        }
        if (rowsCount == null || seatsPerRow == null || rowsCount <= 0 || seatsPerRow <= 0) {
            throw new IllegalArgumentException("Invalid seat configuration");
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));

        List<Seat> seatsToSave = new ArrayList<>();

        for (int rowIndex = 0; rowIndex < rowsCount; rowIndex++) {

            char rowLetter = (char) ('A' + rowIndex);
            String rowLabel = String.valueOf(rowLetter);

            SeatType seatType = (rowVip != null && rowVip.contains((long) rowIndex))
                    ? SeatType.VIP
                    : SeatType.NORMAL;

            for (int seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
                Seat seat = Seat.builder()
                        .room(room)
                        .name(rowLetter + String.valueOf(seatNumber))
                        .seatType(seatType)
                        .status(SeatStatus.AVAILABLE)
                        .col(seatNumber)
                        .row(rowIndex)
                        .isActive(true)
                        .build();

                seatsToSave.add(seat);
            }
        }

        seatRepository.saveAll(seatsToSave);
    }


    public void deleteSeatsByRoomId(Long roomId) {
        List<Seat> seats = seatRepository.findByRoomId(roomId);
        if (seats.isEmpty()) {
            throw new RuntimeException("No seats found for room with id: " + roomId);
        }
        seatRepository.deleteAll(seats);
    }

    public SeatResponse activateSeat(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + seatId));
        seat.setIsActive(true);
        Seat updatedSeat = seatRepository.save(seat);
        return seatMapper.mapToResponse(updatedSeat);
    }

    public SeatResponse deactivateSeat(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + seatId));
        seat.setIsActive(false);
        Seat updatedSeat = seatRepository.save(seat);
        return seatMapper.mapToResponse(updatedSeat);
    }



}
