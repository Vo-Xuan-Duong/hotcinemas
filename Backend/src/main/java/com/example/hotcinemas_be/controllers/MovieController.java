package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.dtos.common.ResponseData;
import com.example.hotcinemas_be.dtos.movie.requests.MovieRequest;
import com.example.hotcinemas_be.dtos.movie.requests.MovieSearchRequest;
import com.example.hotcinemas_be.enums.MovieStatus;
import com.example.hotcinemas_be.services.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/movies")
@Tag(name = "Movie Management", description = "APIs for managing movies in the cinema system")
public class MovieController {
    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @Operation(summary = "Get all movies", description = "Retrieve a list of all movies in the cinema system")
    @GetMapping
    public ResponseEntity<?> getAllMovies(
            @PageableDefault(size = 10, page = 0, sort = "releaseDate") Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully retrieved all movies in the cinema system")
                .data(movieService.getAllMovies(pageable))
                .build();
        return ResponseEntity.status(200).body(responseData);
    }

    @Operation(summary = "Get movie by ID", description = "Retrieve a specific movie by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully retrieved movie with ID: " + id)
                .data(movieService.getMovieById(id))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get movies by genre", description = "Retrieve all movies associated with a specific genre")
    @GetMapping("/genre/{genre}")
    public ResponseEntity<?> getMoviesByGenre(@PathVariable String genre, Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully retrieved movies for genre: " + genre)
                .data(movieService.getMoviesByGenre(genre, pageable))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get movies coming soon", description = "Retrieve a list of movies that are coming soon to the cinema")
    @GetMapping("/coming-soon")
    public ResponseEntity<?> getComingSoonMovies(
            @PageableDefault(size = 10, page = 0, sort = "releaseDate") Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully retrieved coming soon movies")
                .data(movieService.getComingSoonMovies(pageable))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get movies now showing", description = "Retrieve a list of movies that are currently showing in the cinema")
    @GetMapping("/now-showing")
    public ResponseEntity<?> getNowShowingMovies(
            @PageableDefault(size = 10, page = 0, sort = "releaseDate") Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully retrieved now showing movies")
                .data(movieService.getNowShowingMovies(pageable))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get top rated movies", description = "Retrieve a list of the highest rated movies")
    @GetMapping("/top-rated")
    public ResponseEntity<?> getTopRatedMovies(
            @PageableDefault(size = 10, page = 0, sort = "releaseDate") Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully retrieved top rated movies")
                .data(movieService.getTopRatedMovies(pageable))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Search movies", description = "Search for movies by keyword, genre, language, or country")
    @GetMapping("/search")
    public ResponseEntity<?> searchMovies(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<Long> genre,
            @RequestParam(required = false) MovieStatus status,
            @RequestParam(required = false) String releaseYear,
            Pageable pageable) {
        MovieSearchRequest searchRequest = MovieSearchRequest.builder()
                .keyword(keyword)
                .genre(genre)
                .status(status)
                .releaseYear(releaseYear != null ? Integer.parseInt(releaseYear) : null)
                .build();

        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully retrieved search results")
                .data(movieService.searchMovies(searchRequest, pageable))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Create a new movie", description = "Allows an admin to create a new movie in the cinema system")
    @PostMapping
    public ResponseEntity<?> createMovie(@RequestBody MovieRequest movieRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Movie has been successfully created")
                .data(movieService.createMovie(movieRequest))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(201).body(responseData);
    }

    @Operation(summary = "Update a movie", description = "Allows an admin to update an existing movie in the cinema system")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMovie(@PathVariable Long id, @RequestBody MovieRequest movieRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Movie has been successfully updated")
                .data(movieService.updateMovie(id, movieRequest))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Delete a movie", description = "Allows an admin to delete a movie from the cinema system")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Movie has been successfully deleted")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Delete all movies", description = "Allows an admin to delete all movies from the cinema system")
    @DeleteMapping
    public ResponseEntity<?> deleteAllMovies() {
        movieService.deleteAllMovies();
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("All movies have been successfully deleted")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Activate a movie", description = "Allows an admin to activate a movie, making it visible to users")
    @PatchMapping("/{id}/activate")
    public ResponseEntity<?> activateMovie(@PathVariable Long id) {
        movieService.activateMovie(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Movie has been successfully activated")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Deactivate a movie", description = "Allows an admin to deactivate a movie, making it invisible to users")
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateMovie(@PathVariable Long id) {
        movieService.deactivateMovie(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Movie has been successfully deactivated")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }
}
