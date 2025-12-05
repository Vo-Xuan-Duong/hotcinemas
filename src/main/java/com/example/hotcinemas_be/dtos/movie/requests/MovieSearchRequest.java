package com.example.hotcinemas_be.dtos.movie.requests;

import com.example.hotcinemas_be.enums.MovieStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MovieSearchRequest {
    private String keyword;
    private List<Long> genre;
    private MovieStatus status;
    private Integer releaseYear;
}
