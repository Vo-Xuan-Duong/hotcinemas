package com.example.hotcinemas_be.mappers;

import com.example.hotcinemas_be.dtos.showtime.responses.*;
import com.example.hotcinemas_be.models.Cinema;
import com.example.hotcinemas_be.models.Showtime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowtimeMapper {

    public ShowtimeResponse mapToResponse(com.example.hotcinemas_be.models.Showtime showtime) {
        if (showtime == null) {
            return null;
        }
        return ShowtimeResponse.builder()
                .id(showtime.getId())
                .movieTitle(showtime.getMovie().getTitle())
                .cinemaName(showtime.getRoom().getCinema().getName())
                .roomName(showtime.getRoom().getName())
                .showDate(showtime.getDate())
                .startTime(showtime.getStartTime())
                .endTime(showtime.getEndTime())
                .price(showtime.getTicketPrice())
                .movieFormat(showtime.getMovieFormat())
                .movieFormatLabel(showtime.getMovieFormat() != null ? showtime.getMovieFormat().getLabel() : null)
                .status(showtime.getStatus())
                .totalSeats(showtime.getRoom() != null ? showtime.getRoom().getTotalSeats() : 0)
                .seatsBooked(showtime.getTickets() != null ? showtime.getTickets().size() : 0)
                .build();
    }

    public ShowtimeInfo mapToShowtimeInfo(Showtime showtime){
        if(showtime == null){
            return null;
        }
        return ShowtimeInfo.builder()
                .showtimeId(showtime.getId())
                .startTime(showtime.getStartTime())
                .endTime(showtime.getEndTime())
                .roomId(showtime.getRoom().getId())
                .roomName(showtime.getRoom().getName())
                .price(showtime.getTicketPrice())
                .status(showtime.getStatus())
                .build();
    }

    public List<FormatWithShowtimes> mapFormats(List<Showtime> showtimes){
        return showtimes.stream()
                .collect(Collectors.groupingBy(Showtime::getMovieFormat))
                .entrySet().stream()
                .map(entry -> {
                    String formatLabel = entry.getKey() != null ? entry.getKey().getLabel() : "Unknown";
                    List<ShowtimeInfo> showtimeInfos = entry.getValue().stream()
                            .map(this::mapToShowtimeInfo)
                            .collect(Collectors.toList());
                    return FormatWithShowtimes.builder()
                            .formatType(formatLabel)
                            .showtimes(showtimeInfos)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<CinemaWithShowtimes> groupShowtimesByCinema(
            List<com.example.hotcinemas_be.models.Showtime> showtimes) {
        // Group by cinema
        return showtimes.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        s -> s.getRoom().getCinema(),
                        java.util.stream.Collectors.toList()
                ))
                .entrySet()
                .stream()
                .map(cinemaEntry -> {
                    Cinema cinema = cinemaEntry.getKey();
                    List<Showtime> listByCinemas = cinemaEntry.getValue();
                    return CinemaWithShowtimes.builder()
                            .cinemaId(cinema.getId())
                            .cinemaName(cinema.getName())
                            .address(cinema.getAddress())
                            .cityId(cinema.getCity() != null ? cinema.getCity().getId() : null)
                            .cityName(cinema.getCity() != null ? cinema.getCity().getName() : null)
                            .latitude(cinema.getLatitude())
                            .longitude(cinema.getLongitude())
                            .formats(mapFormats(listByCinemas))
                            .build();
                })
                .collect(java.util.stream.Collectors.toList());
    }

    public List<MovieWithShowtimes> groupShowtimesByMovie(
            List<com.example.hotcinemas_be.models.Showtime> showtimes) {
        // Group by movie
        return showtimes.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        Showtime::getMovie,
                        java.util.stream.Collectors.toList()
                ))
                .entrySet()
                .stream()
                .map(movieEntry -> {
                    com.example.hotcinemas_be.models.Movie movie = movieEntry.getKey();
                    List<Showtime> listByMovies = movieEntry.getValue();
                    return MovieWithShowtimes.builder()
                            .movieId(movie.getId())
                            .movieTitle(movie.getTitle())
                            .posterPath(movie.getPosterPath())
                            .formats(mapFormats(listByMovies))
                            .build();
                })
                .collect(java.util.stream.Collectors.toList());
    }
}
