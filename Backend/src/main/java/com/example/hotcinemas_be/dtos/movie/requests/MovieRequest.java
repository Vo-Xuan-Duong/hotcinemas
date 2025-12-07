package com.example.hotcinemas_be.dtos.movie.requests;

import com.example.hotcinemas_be.enums.MovieStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieRequest {
    private String title;
    private String originalTitle;
    private String tagline;
    private String overview;
    private Integer durationMinutes;
    private BigDecimal voteAverage;
    private Integer voteCount;
    private LocalDate releaseDate;
    private String originalLanguage;
    private String format;
    private String ageRating;
    private String trailerUrl;
    private String posterPath;
    private String backdropPath;
    private MovieStatus status;
    private List<Long> genreIds;
    private List<String> originCountry;
    private List<String> casts;
}
