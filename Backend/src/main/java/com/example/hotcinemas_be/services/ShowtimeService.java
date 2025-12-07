package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.seat.responses.SeatUpdateForWebSocket;
import com.example.hotcinemas_be.dtos.showtime.requests.ShowtimeFilterRequest;
import com.example.hotcinemas_be.dtos.showtime.requests.ShowtimeRequest;
import com.example.hotcinemas_be.dtos.showtime.responses.*;
import com.example.hotcinemas_be.enums.ShowTimeStatus;
import com.example.hotcinemas_be.exceptions.ErrorCode;
import com.example.hotcinemas_be.exceptions.ErrorException;
import com.example.hotcinemas_be.mappers.ShowtimeMapper;
import com.example.hotcinemas_be.models.*;
import com.example.hotcinemas_be.repositorys.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final ShowtimeMapper showtimeMapper;
    private final RoomRepository roomRepository;
    private final MovieRepository movieRepository;
    private final CinemaRepository cinemaRepository;
    private final TicketService ticketService;
    private final RedisService redisService;
    private final WebSocketService webSocketService;
    private final AuthService authService;


    public ShowtimeResponse createShowtime(ShowtimeRequest showtimeRequest) {
        Room room = roomRepository.findById(showtimeRequest.getRoomId()).orElseThrow(
                () -> new ErrorException("Room not found with id: " + showtimeRequest.getRoomId(),
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        Movie movie = movieRepository.findById(showtimeRequest.getMovieId())
                .orElseThrow(() -> new ErrorException("Movie not found with id: " + showtimeRequest.getMovieId(),
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        if (isOverlappingShowtime(showtimeRequest.getRoomId(), showtimeRequest.getDate(),
                showtimeRequest.getStartTime(),
                showtimeRequest.getStartTime().plusMinutes(movie.getDurationMinutes()))) {
            throw new ErrorException("Showtime overlaps with an existing showtime in the same room.",
                    ErrorCode.ERROR_SHOWTIME_CONFLICT);
        }

        Showtime showtime = new Showtime();
        showtime.setRoom(room);
        showtime.setDate(showtimeRequest.getDate());
        showtime.setStartTime(showtimeRequest.getStartTime());
        showtime.setEndTime(showtimeRequest.getStartTime().plusMinutes(movie.getDurationMinutes()));
        showtime.setTicketPrice(BigDecimal.valueOf(showtimeRequest.getTicketPrice()));
        showtime.setMovie(movie);
        showtime.setMovieFormat(showtimeRequest.getMovieFormat());
        showtime.setStatus(ShowTimeStatus.OPEN_FOR_BOOKING);
        showtime = showtimeRepository.save(showtime);


        return showtimeMapper.mapToResponse(showtime);
    }

    private Boolean isOverlappingShowtime(Long roomId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        return showtimeRepository.existsByRoom_IdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(roomId, date, endTime,
                startTime);
    }

    public ShowtimeResponse updateShowtime(Long showtimeId, ShowtimeRequest showtimeRequest) {
        Room room = roomRepository.findById(showtimeRequest.getRoomId()).orElseThrow(
                () -> new ErrorException("Room not found with id: " + showtimeRequest.getRoomId(),
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        Movie movie = movieRepository.findById(showtimeRequest.getMovieId())
                .orElseThrow(() -> new ErrorException("Movie not found with id: " + showtimeRequest.getMovieId(),
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ErrorException("Showtime not found with id: " + showtimeId,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        showtime.setRoom(room);
        showtime.setStartTime(showtimeRequest.getStartTime());
        showtime.setEndTime(showtimeRequest.getStartTime().plusMinutes(movie.getDurationMinutes()));
        showtime.setTicketPrice(BigDecimal.valueOf(showtimeRequest.getTicketPrice()));
        showtime.setMovie(movie);
        showtime.setMovieFormat(showtimeRequest.getMovieFormat());
        showtime.setStatus(showtimeRequest.getStatus());
        showtime = showtimeRepository.save(showtime);

        return showtimeMapper.mapToResponse(showtime);
    }

    public ShowtimeResponse getShowtimeById(Long showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ErrorException("Showtime not found with id: " + showtimeId,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        return showtimeMapper.mapToResponse(showtime);
    }

    public Page<ShowtimeResponse> getAllShowTimes(Pageable pageable) {
        Page<Showtime> showtimePage = showtimeRepository.findAll(pageable);
        return showtimePage.map(showtimeMapper::mapToResponse);
    }

    public void deleteShowtime(Long showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ErrorException("Showtime not found with id: " + showtimeId,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        showtimeRepository.delete(showtime);
    }

    public Page<ShowtimeResponse> getShowtimesByMovieId(Long movieId, Pageable pageable) {
        Page<Showtime> showtimePage = showtimeRepository.findByMovie_Id(movieId, pageable);
        return showtimePage.map(showtimeMapper::mapToResponse);
    }

    public Page<ShowtimeResponse> getShowtimesByRoomId(Long roomId, Pageable pageable) {
        Page<Showtime> showtimePage = showtimeRepository.findByRoom_Id(roomId, pageable);
        return showtimePage.map(showtimeMapper::mapToResponse);
    }

    public void deleteShowtimesByMovieId(Long movieId) {

        List<Showtime> showtimes = showtimeRepository.findByMovie_Id(movieId);
        if (showtimes.isEmpty()) {
            return;
        }
        showtimeRepository.deleteAll(showtimes);

    }

    public void deleteShowtimesByRoomId(Long roomId) {
        List<Showtime> showtimes = showtimeRepository.findByRoom_Id(roomId);
        if (showtimes.isEmpty()) {
            return;
        }
        showtimeRepository.deleteAll(showtimes);
    }

    public boolean updateShowtimeStatus(Long showtimeId, ShowTimeStatus status) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ErrorException("Showtime not found with id: " + showtimeId,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        if (showtime.getStatus() == status) {
            return false; // No change needed
        }
        showtime.setStatus(status);
        showtimeRepository.save(showtime);
        return true;
    }

    public List<ShowtimeResponse> getShowtimesWithFilters(ShowtimeFilterRequest filterRequest) {
        List<Showtime> showtimes = showtimeRepository.findShowtimesWithFilters(
                filterRequest.getMovieId(),
                filterRequest.getCinemaAddress(),
                filterRequest.getCinemaCity(),
                filterRequest.getCinemaId(),
                filterRequest.getShowDate(),
                filterRequest.getMovieFormat());
        return showtimes.stream().map(showtimeMapper::mapToResponse).toList();
    }

    public Page<CinemaWithShowtimes> getCinemaShowtimesByMovieAndDate(
            Long movieId, LocalDate date, Long cityId, Double latitude, Double longitude, Pageable pageable) {

        // Get cinema IDs for current page
        Page<Cinema> cinemaIdsPage ;

        if(cityId != null){
            cinemaIdsPage = cinemaRepository.findCinemasByCity_IdAndIsActiveTrue(cityId, pageable);
        } else if(latitude != null && longitude != null){
            cinemaIdsPage = cinemaRepository.findNearestCinemas(latitude, longitude, pageable);
        }
        else {
            cinemaIdsPage = cinemaRepository.findAll(pageable);
        }

        List<Long> cinemaIds = cinemaIdsPage.getContent().stream()
                .map(Cinema::getId)
                .toList();

        // Get all showtimes for these cinemas
        List<Showtime> showtimes = showtimeRepository.findByMovieDateAndCinemaIds(movieId, date, cinemaIds);

        // Group showtimes by cinema
        List<CinemaWithShowtimes> cinemaList = showtimeMapper.groupShowtimesByCinema(showtimes);

        if(latitude != null && longitude != null){
            // Calculate distance for each cinema
            for(CinemaWithShowtimes cinema : cinemaList){
                double distance = calculateDistance(
                        latitude,
                        longitude,
                        cinema.getLatitude(),
                        cinema.getLongitude()
                );
                cinema.setDistance(distance);
            }
            // Sort cinemas by distance
            cinemaList.sort((c1, c2) -> Double.compare(c1.getDistance(), c2.getDistance()));
        }

        return new org.springframework.data.domain.PageImpl<>(
                cinemaList,
                pageable,
                cinemaIdsPage.getTotalElements()
        );
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * @return distance in kilometers
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371; // Earth's radius in kilometers

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c; // Distance in kilometers
    }

    public Page<MovieWithShowtimes> getShowtimesByCinemaAndDate(Long cinemaId, LocalDate date, Pageable pageable) {
        // Get movie IDs for current page
        Page<Long> movieIdsPage = showtimeRepository.findDistinctMovieIdsByCinemaAndDate(cinemaId, date, pageable);

        List<Long> movieIds = movieIdsPage.getContent();

        // Get all showtimes for these movies
        List<Showtime> showtimes = showtimeRepository.findByCinemaDateAndMovieIds(cinemaId, date, movieIds);

        // Group showtimes by movie
        List<MovieWithShowtimes> movieList = showtimeMapper.groupShowtimesByMovie(showtimes);

        return new org.springframework.data.domain.PageImpl<>(
                movieList,
                pageable,
                movieIdsPage.getTotalElements()
        );
    }


    // Scheduler: update showtime statuses by time
    @Transactional
    @Scheduled(fixedDelay = 60000) // Run every minute
    public void updateShowtimeStatusesJob() {
        LocalTime now = LocalTime.now();
        LocalDate today = LocalDate.now();

        // OPEN_FOR_BOOKING -> BOOKING_CLOSED (30 minutes before start time)
        LocalTime bookingCutoffTime = now.plusMinutes(30);
        List<Showtime> toBookingClosed = showtimeRepository
                .findByStatusAndDateAndStartTimeLessThanEqual(
                        ShowTimeStatus.OPEN_FOR_BOOKING, today, bookingCutoffTime);
        toBookingClosed.forEach(s -> s.setStatus(ShowTimeStatus.BOOKING_CLOSED));
        if (!toBookingClosed.isEmpty()) {
            showtimeRepository.saveAll(toBookingClosed);
            log.info("Updated {} showtime to BOOKING_CLOSED", toBookingClosed.size());
        }

        // BOOKING_CLOSED -> ONGOING when startTime <= now
        List<Showtime> toOngoing = showtimeRepository
                .findByStatusAndDateAndStartTimeLessThanEqual(
                        ShowTimeStatus.BOOKING_CLOSED, today, now);
        toOngoing.forEach(s -> s.setStatus(ShowTimeStatus.ONGOING));
        if (!toOngoing.isEmpty()) {
            showtimeRepository.saveAll(toOngoing);
            log.info("Updated {} showtime to ONGOING", toOngoing.size());
        }

        // ONGOING -> FINISHED when endTime <= now
        List<Showtime> toFinished = showtimeRepository
                .findByStatusAndDateAndEndTimeLessThanEqual(
                        ShowTimeStatus.ONGOING, today, now);
        toFinished.forEach(s -> s.setStatus(ShowTimeStatus.FINISHED));
        if (!toFinished.isEmpty()) {
            showtimeRepository.saveAll(toFinished);
            log.info("Updated {} showtime to FINISHED", toFinished.size());
        }
    }

    // Scheduler: check and release expired seat locks every second
    @Scheduled(fixedDelay = 1000) // Run every second
    public void releaseExpiredSeatLocksJob() {
        try {
            // Get all keys matching the seat lock pattern
            java.util.Set<String> lockKeys = redisService.keys("seat_lock:showtime_*:seat_*");

            if (lockKeys == null || lockKeys.isEmpty()) {
                return;
            }

            int releasedCount = 0;
            for (String key : lockKeys) {
                // Check if key still exists (not expired)
                Long ttl = redisService.getExpire(key);

                // If TTL is -2, key doesn't exist (expired), if -1, key has no expiry
                // We only care about keys that just expired or are about to expire
                if (ttl != null && ttl <= 0 && ttl != -1) {
                    // Parse showtime and seat IDs from key
                    // Key format: seat_lock:showtime_{showtimeId}:seat_{seatId}
                    String[] parts = key.split(":");
                    if (parts.length == 3) {
                        try {
                            Long showtimeId = Long.parseLong(parts[1].replace("showtime_", ""));
                            Long seatId = Long.parseLong(parts[2].replace("seat_", ""));

                            // Delete the expired key
                            redisService.delete(key);

                            // Notify via WebSocket that seat is now available
                            webSocketService.sendSeatUpdate(showtimeId,
                                    SeatUpdateForWebSocket.builder()
                                            .seatId(seatId)
                                            .status(com.example.hotcinemas_be.enums.SeatStatus.AVAILABLE)
                                            .build());

                            releasedCount++;
                        } catch (NumberFormatException e) {
                            log.warn("Failed to parse seat lock key: {}", key);
                        }
                    }
                }
            }

            if (releasedCount > 0) {
                log.info("Released {} expired seat locks", releasedCount);
            }
        } catch (Exception e) {
            log.error("Error in releaseExpiredSeatLocksJob: {}", e.getMessage(), e);
        }
    }

    public void lockSeatForShowtime(Long showtimeId, Long seatId, Long userId) {
        String key = "seat_lock:showtime_" + showtimeId + ":seat_" + seatId;

        if(redisService.hasKey(key)) {
            throw new ErrorException("Seat is already locked for this showtime.",
                    ErrorCode.ERROR_SEAT_ALREADY_LOCKED);
        }

        redisService.set(key, userId, 10, java.util.concurrent.TimeUnit.MINUTES);

        webSocketService.sendSeatUpdate(showtimeId,
                SeatUpdateForWebSocket.builder()
                        .seatId(seatId)
                        .lockedByUserId(userId)
                        .status(com.example.hotcinemas_be.enums.SeatStatus.HELD)
                        .build());
    }

    public void unlockSeatForShowtime(Long showtimeId, Long seatId) {
        String key = "seat_lock:showtime_" + showtimeId + ":seat_" + seatId;

        if(redisService.hasKey(key)) {
            redisService.delete(key);
        }

        webSocketService.sendSeatUpdate(showtimeId,
                SeatUpdateForWebSocket.builder()
                        .seatId(seatId)
                        .lockedByUserId(0)
                        .status(com.example.hotcinemas_be.enums.SeatStatus.AVAILABLE)
                        .build());
    }

    public List<ShowtimeSeatResponse> getSeatsByShowtimeId(Long showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ErrorException("Showtime not found with id: " + showtimeId,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        List<Seat> seats = showtime.getRoom().getSeats();

        List<String> seatKeys = seats.stream()
                .map(seat -> "seat_lock:showtime_" + showtimeId + ":seat_" + seat.getId())
                .toList();

        List<Object> redisValues = redisService.getMultiple(seatKeys);

        java.util.Map<Long, Long> seatLockMap = new java.util.HashMap<>();
        for (int i = 0; i < seats.size(); i++) {
            Object val = (redisValues != null && i < redisValues.size()) ? redisValues.get(i) : null;
            if (Objects.nonNull(val)) {
                try {
                    Long userId = Long.valueOf(val.toString());
                    seatLockMap.put(seats.get(i).getId(), userId);
                } catch (NumberFormatException e) {
                    // Log error nếu cần
                }
            }
        }

        List<Long> seatIdsBooked = ticketService.getSeatsBookedInShowtime(showtimeId);
        java.util.Set<Long> bookedSeatIds = (seatIdsBooked == null) ? java.util.Collections.emptySet()
                : new java.util.HashSet<>(seatIdsBooked);

        BigDecimal basePrice = showtime.getTicketPrice();

        return seats.stream()
                .map(seat -> {
                    com.example.hotcinemas_be.enums.SeatStatus status;
                    Long lockedBy = null;

                    if (bookedSeatIds.contains(seat.getId())) {
                        status = com.example.hotcinemas_be.enums.SeatStatus.BOOKED;
                    } else if (seatLockMap.containsKey(seat.getId())) {
                        status = com.example.hotcinemas_be.enums.SeatStatus.HELD;
                        lockedBy = seatLockMap.get(seat.getId());
                    } else {
                        status = seat.getStatus();
                    }

                    // Calculate price based on seat type
                    BigDecimal seatPrice = calculateSeatPrice(basePrice, seat.getSeatType());

                    return ShowtimeSeatResponse.builder()
                            .id(seat.getId())
                            .name(seat.getName())
                            .seatType(seat.getSeatType())
                            .status(status)
                            .price(seatPrice)
                            .col(seat.getCol())
                            .row(seat.getRow())
                            .lockedByUserId(lockedBy != null ? lockedBy : 0)
                            .build();
                })
                .toList();
    }

    private BigDecimal calculateSeatPrice(BigDecimal basePrice, com.example.hotcinemas_be.enums.SeatType seatType) {
        if (basePrice == null) {
            basePrice = BigDecimal.ZERO;
        }

        return switch (seatType) {
            case VIP -> basePrice.add(new BigDecimal("20000"));
            case COUPLE ->
                // Couple seat is for 2 people, so multiply by 2 and add extra fee
                    basePrice.multiply(new BigDecimal("2"));
            default -> basePrice;
        };
    }
}
