package com.example.hotcinemas_be.repositorys;

import com.example.hotcinemas_be.enums.SeatType;
import com.example.hotcinemas_be.models.Seat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByRoomId(Long roomId);

    List<Seat> findByRoomIdAndIsActiveTrue(Long roomId);

    List<Seat> findBySeatType(SeatType seatType);

    List<Seat> findByRoomIdAndSeatType(Long roomId, SeatType seatType);

    Optional<Seat> findByRoomIdAndName(Long roomId, String name);

    Page<Seat> findByRoomId(Long roomId, Pageable pageable);

    @Query("SELECT s FROM Seat s WHERE s.room.cinema.id = :cinemaId")
    List<Seat> findByCinemaId(@Param("cinemaId") Long cinemaId);
}
