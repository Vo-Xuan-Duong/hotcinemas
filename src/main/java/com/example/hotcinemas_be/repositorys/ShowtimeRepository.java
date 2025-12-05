package com.example.hotcinemas_be.repositorys;

import com.example.hotcinemas_be.models.Showtime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
        Page<Showtime> findByMovie_Id(Long movieId, Pageable pageable);

        List<Showtime> findByMovie_Id(Long movieId);

        Page<Showtime> findByRoom_Id(Long roomId, Pageable pageable);

        List<Showtime> findByRoom_Id(Long roomId);

        Optional<Showtime> findByMovie_IdAndRoom_IdAndStartTimeAndEndTime(Long movie_id, Long room_id,
                                                                          LocalTime startTime, LocalTime endTime);

        Boolean existsByRoom_IdAndStartTimeAndEndTime(Long room_id, LocalTime startTime, LocalTime endTime);

        // Detect any overlap where existing.startTime < newEnd AND existing.endTime >
        // newStart
        Boolean existsByRoom_IdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(Long room_id,LocalDate date ,LocalTime endTime,
                        LocalTime startTime);

        List<Showtime> findByStatusAndDateAndStartTimeLessThanEqual(
                        com.example.hotcinemas_be.enums.ShowTimeStatus status,LocalDate date, LocalTime now);

        List<Showtime> findByStatusAndDateAndEndTimeLessThanEqual(
                        com.example.hotcinemas_be.enums.ShowTimeStatus status, LocalDate date ,LocalTime now);

        List<Showtime> findByStatusAndDateLessThan(
                        com.example.hotcinemas_be.enums.ShowTimeStatus status, LocalDate date);

        // Query phức tạp để lọc showtime theo nhiều tiêu chí
        @Query("SELECT s FROM Showtime s " +
                        "JOIN s.room r " +
                        "JOIN r.cinema c " +
                        "JOIN c.city city " +
                        "WHERE (:movieId IS NULL OR s.movie.id = :movieId) " +
                        "AND (:cinemaAddress IS NULL OR LOWER(c.address) LIKE LOWER(CONCAT('%', :cinemaAddress, '%'))) "+
                        "AND (:cinemaCity IS NULL OR LOWER(city.name) LIKE LOWER(CONCAT('%', :cinemaCity, '%'))) " +
                        "AND (:cinemaId IS NULL OR c.id = :cinemaId) " +
                        "AND (:showDate IS NULL OR s.date = :showDate) " +
                        "AND (:movieFormat IS NULL OR s.movieFormat = :movieFormat)")
        List<Showtime> findShowtimesWithFilters(
                        @Param("movieId") Long movieId,
                        @Param("cinemaAddress") String cinemaAddress,
                        @Param("cinemaCity") String cinemaCity,
                        @Param("cinemaId") Long cinemaId,
                        @Param("showDate") LocalDate showDate,
                        @Param("movieFormat") com.example.hotcinemas_be.enums.MovieFormat movieFormat);

        @Query("SELECT s FROM Showtime s " +
                        "JOIN s.room r " +
                        "JOIN r.cinema c " +
                        "JOIN c.city city " +
                        "WHERE (:movieId IS NULL OR s.movie.id = :movieId) " +
                        "AND (:cinemaAddress IS NULL OR LOWER(c.address) LIKE LOWER(CONCAT('%', :cinemaAddress, '%'))) "
                        +
                        "AND (:cinemaCity IS NULL OR LOWER(city.name) LIKE LOWER(CONCAT('%', :cinemaCity, '%'))) " +
                        "AND (:showDate IS NULL OR s.date = :showDate) " +
                        "AND (:movieFormat IS NULL OR s.movieFormat = :movieFormat)")
        Page<Showtime> findShowtimesWithFiltersPaged(
                        @Param("movieId") Long movieId,
                        @Param("cinemaAddress") String cinemaAddress,
                        @Param("cinemaCity") String cinemaCity,
                        @Param("showDate") LocalDate showDate,
                        @Param("movieFormat") com.example.hotcinemas_be.enums.MovieFormat movieFormat,
                        Pageable pageable);

        // Query to get distinct cinemas showing a movie on a specific date
        @Query("SELECT DISTINCT c.id FROM Showtime s " +
                "JOIN s.room r " +
                "JOIN r.cinema c " +
                        "WHERE s.movie.id = :movieId " +
                        "AND s.date = :showDate " +
                        "ORDER BY c.id")
        Page<Long> findDistinctCinemaIdsByMovieAndDate(
                        @Param("movieId") Long movieId,
                        @Param("showDate") LocalDate showDate,
                        Pageable pageable);

        // Query to get all showtimes for a movie at specific cinemas on a date
        @Query("SELECT s FROM Showtime s " +
                "JOIN fetch s.room r " +
                "JOIN fetch r.cinema c " +
                        "WHERE s.movie.id = :movieId " +
                        "AND s.date = :showDate " +
                        "AND c.id IN :cinemaIds " +
                        "ORDER BY c.id, s.movieFormat, s.startTime")
        List<Showtime> findByMovieDateAndCinemaIds(
                        @Param("movieId") Long movieId,
                        @Param("showDate") LocalDate showDate,
                        @Param("cinemaIds") List<Long> cinemaIds);

        // Count distinct cinemas showing a movie on a date
        @Query("SELECT COUNT(DISTINCT c.id) FROM Showtime s " +
                "JOIN s.room r " +
                "JOIN r.cinema c " +
                        "WHERE s.movie.id = :movieId " +
                        "AND s.date = :showDate")
        Long countDistinctCinemasByMovieAndDate(
                        @Param("movieId") Long movieId,
                        @Param("showDate") LocalDate showDate);

        @Query("SELECT DISTINCT s.movie.id FROM Showtime s " +
                "JOIN s.room r " +
                "JOIN r.cinema c " +
                        "WHERE c.id = :cinemaId " +
                        "AND s.date = :date " +
                        "ORDER BY s.movie.id")
        Page<Long> findDistinctMovieIdsByCinemaAndDate(Long cinemaId, LocalDate date, Pageable pageable);

        @Query("SELECT s FROM Showtime s " +
                "JOIN fetch s.room r " +
                "JOIN fetch r.cinema c " +
                        "WHERE c.id = :cinemaId " +
                        "AND s.date = :date " +
                        "AND s.movie.id IN :movieIds " +
                        "ORDER BY s.movie.id, s.movieFormat, s.startTime")
        List<Showtime> findByCinemaDateAndMovieIds(Long cinemaId, LocalDate date, List<Long> movieIds);
}
