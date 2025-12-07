package com.example.hotcinemas_be.repositorys;

import com.example.hotcinemas_be.models.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room,Long> {
    List<Room> findRoomsByCinema_Id(Long cinemaId);

    Integer countByCinema_Id(Long cinemaId);
}
