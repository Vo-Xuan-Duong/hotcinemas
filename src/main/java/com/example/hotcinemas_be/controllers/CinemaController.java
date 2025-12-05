package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.dtos.common.ResponseData;
import com.example.hotcinemas_be.dtos.cinema.requests.CinemaRequest;
import com.example.hotcinemas_be.dtos.cinema.responses.CinemaResponse;
import com.example.hotcinemas_be.services.CinemaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/cinemas")
@Tag(name = "Cinemas", description = "API for managing cinemas")
public class CinemaController {
    private final CinemaService cinemaService;

    public CinemaController(CinemaService cinemaService) {
        this.cinemaService = cinemaService;
    }

    @Operation(summary = "Create a new cinema", description = "This endpoint allows an admin to create a new cinema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cinema created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "409", description = "Cinema with this name already exists")
    })
    @PostMapping
    public ResponseEntity<ResponseData<CinemaResponse>> createCinema(
            @Valid @RequestBody CinemaRequest cinemaRequest) {
        CinemaResponse cinemaResponse = cinemaService.createCinema(cinemaRequest);
        ResponseData<CinemaResponse> responseData = ResponseData.<CinemaResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Cinema has been successfully created")
                .data(cinemaResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
    }

    @Operation(summary = "Get all cinemas", description = "This endpoint retrieves all active cinemas with pagination.")
    @GetMapping
    public ResponseEntity<ResponseData<Page<CinemaResponse>>> getAllCinemas(
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        Page<CinemaResponse> cinemas = cinemaService.getAllCinemas(pageable);
        ResponseData<Page<CinemaResponse>> responseData = ResponseData.<Page<CinemaResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Cinemas retrieved successfully")
                .data(cinemas)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get a cinema by ID", description = "This endpoint retrieves a cinema by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cinema found"),
            @ApiResponse(responseCode = "404", description = "Cinema not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<CinemaResponse>> getCinemaById(
            @Parameter(description = "Cinema ID") @PathVariable Long id) {
        CinemaResponse cinema = cinemaService.getCinemaById(id);
        ResponseData<CinemaResponse> responseData = ResponseData.<CinemaResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cinema retrieved successfully")
                .data(cinema)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Update a cinema", description = "This endpoint allows an admin to update an existing cinema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cinema updated successfully"),
            @ApiResponse(responseCode = "404", description = "Cinema not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ResponseData<CinemaResponse>> updateCinema(
            @Parameter(description = "Cinema ID") @PathVariable Long id,
            @Valid @RequestBody CinemaRequest cinemaRequest) {
        CinemaResponse cinemaResponse = cinemaService.updateCinema(id, cinemaRequest);
        ResponseData<CinemaResponse> responseData = ResponseData.<CinemaResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cinema has been successfully updated")
                .data(cinemaResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Partially update a cinema", description = "This endpoint allows an admin to partially update an existing cinema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cinema partially updated successfully"),
            @ApiResponse(responseCode = "404", description = "Cinema not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PatchMapping("/{id}")
    public ResponseEntity<ResponseData<CinemaResponse>> partialUpdateCinema(
            @Parameter(description = "Cinema ID") @PathVariable Long id,
            @RequestBody CinemaRequest cinemaRequest) {
        CinemaResponse cinemaResponse = cinemaService.updateCinema(id, cinemaRequest);
        ResponseData<CinemaResponse> responseData = ResponseData.<CinemaResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cinema has been partially updated")
                .data(cinemaResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Delete a cinema", description = "This endpoint allows an admin to soft delete a cinema by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cinema deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Cinema not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseData<Void>> deleteCinema(
            @Parameter(description = "Cinema ID") @PathVariable Long id) {
        cinemaService.deleteCinema(id);
        ResponseData<Void> responseData = ResponseData.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Cinema has been successfully deleted")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get cinemas by city", description = "This endpoint retrieves all cinemas in a specific city.")
    @GetMapping("/city/{city}")
    public ResponseEntity<ResponseData<Page<CinemaResponse>>> getCinemasByCity(
            @Parameter(description = "City name") @PathVariable String city,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        Page<CinemaResponse> cinemas = cinemaService.getCinemasByCity(city, pageable);
        ResponseData<Page<CinemaResponse>> responseData = ResponseData.<Page<CinemaResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Cinemas in " + city + " retrieved successfully")
                .data(cinemas)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Search cinemas", description = "This endpoint searches cinemas by keyword.")
    @GetMapping("/search")
    public ResponseEntity<ResponseData<Page<CinemaResponse>>> searchCinemas(
            @Parameter(description = "Search keyword") @RequestParam String keyword,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        Page<CinemaResponse> cinemas = cinemaService.searchCinemas(keyword, pageable);
        ResponseData<Page<CinemaResponse>> responseData = ResponseData.<Page<CinemaResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Search results for '" + keyword + "' retrieved successfully")
                .data(cinemas)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }


    @GetMapping("/all-no-page")
    public ResponseEntity<ResponseData<java.util.List<CinemaResponse>>> getAllCinemasNoPagination() {
        java.util.List<CinemaResponse> cinemas = cinemaService.getAllCinemasNoPagination();
        ResponseData<java.util.List<CinemaResponse>> responseData = ResponseData.<java.util.List<CinemaResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Cinemas retrieved successfully")
                .data(cinemas)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }
}
