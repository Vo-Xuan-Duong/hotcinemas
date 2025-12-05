package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.dtos.booking.requests.BookingRequest;
import com.example.hotcinemas_be.dtos.booking.responses.BookingDetailResponse;
import com.example.hotcinemas_be.dtos.common.ResponseData;
import com.example.hotcinemas_be.enums.BookingStatus;
import com.example.hotcinemas_be.services.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Booking Management", description = "APIs for managing bookings in the cinema system")
public class BookingController {

    private final BookingService bookingService;

    @Operation(summary = "Create a new booking", description = "This endpoint allows users to create a new booking for a showtime.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Booking created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Showtime or seats not found"),
            @ApiResponse(responseCode = "409", description = "Seats already booked")
    })
    @PostMapping
    public ResponseEntity<ResponseData<BookingDetailResponse>> createBooking(
            @Valid @RequestBody BookingRequest bookingRequest) {

            log.info("Creating new booking for showtime: {} with seats: {}",
                    bookingRequest.getShowtimeId(), bookingRequest.getShowtimeId());
            BookingDetailResponse bookingDetailResponse = bookingService.createBooking(bookingRequest);

            ResponseData<BookingDetailResponse> responseData = ResponseData.<BookingDetailResponse>builder()
                    .status(HttpStatus.CREATED.value())
                    .message("Booking has been successfully created")
                    .data(bookingDetailResponse)
                    .timestamp(LocalDateTime.now())
                    .build();
            return ResponseEntity.status(HttpStatus.CREATED).body(responseData);

    }

    @Operation(summary = "Get booking by ID", description = "This endpoint retrieves a booking by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking found"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<BookingDetailResponse>> getBookingById(
            @Parameter(description = "Booking ID") @PathVariable Long id) {
        log.info("Retrieving booking with ID: {}", id);
        BookingDetailResponse booking = bookingService.getBookingById(id);

        ResponseData<BookingDetailResponse> responseData = ResponseData.<BookingDetailResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Booking retrieved successfully")
                .data(booking)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get booking by booking code", description = "This endpoint retrieves a booking by its booking code.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking found"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @GetMapping("/code/{bookingCode}")
    public ResponseEntity<ResponseData<BookingDetailResponse>> getBookingByCode(
            @Parameter(description = "Booking code") @PathVariable String bookingCode) {
        log.info("Retrieving booking with code: {}", bookingCode);
        BookingDetailResponse booking = bookingService.getBookingByCode(bookingCode);

        ResponseData<BookingDetailResponse> responseData = ResponseData.<BookingDetailResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Booking retrieved successfully")
                .data(booking)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get bookings by user ID", description = "This endpoint retrieves all bookings for a specific user.")
    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseData<List<BookingDetailResponse>>> getBookingsByUserId(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        log.info("Retrieving bookings for user ID: {}", userId);
        List<BookingDetailResponse> bookings = bookingService.getBookingsByUserId(userId);

        ResponseData<List<BookingDetailResponse>> responseData = ResponseData.<List<BookingDetailResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("User bookings retrieved successfully")
                .data(bookings)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get bookings by showtime ID", description = "This endpoint retrieves all bookings for a specific showtime.")
    @GetMapping("/showtime/{showtimeId}")
    public ResponseEntity<ResponseData<List<BookingDetailResponse>>> getBookingsByShowtimeId(
            @Parameter(description = "Showtime ID") @PathVariable Long showtimeId) {
        log.info("Retrieving bookings for showtime ID: {}", showtimeId);
        List<BookingDetailResponse> bookings = bookingService.getBookingsByShowtimeId(showtimeId);

        ResponseData<List<BookingDetailResponse>> responseData = ResponseData.<List<BookingDetailResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Showtime bookings retrieved successfully")
                .data(bookings)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get bookings by status", description = "This endpoint retrieves all bookings with a specific status.")
    @GetMapping("/status/{status}")
    public ResponseEntity<ResponseData<List<BookingDetailResponse>>> getBookingsByStatus(
            @Parameter(description = "Booking status") @PathVariable BookingStatus status) {
        log.info("Retrieving bookings with status: {}", status);
        List<BookingDetailResponse> bookings = bookingService.getBookingsByStatus(status);

        ResponseData<List<BookingDetailResponse>> responseData = ResponseData.<List<BookingDetailResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Bookings with status retrieved successfully")
                .data(bookings)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get all bookings with pagination", description = "This endpoint retrieves all bookings with pagination.")
    @GetMapping
    public ResponseEntity<ResponseData<Page<?>>> getAllBookings(
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        log.info("Retrieving all bookings with pagination");
        Page<BookingDetailResponse> bookings = bookingService.getAllBookings(pageable);

        ResponseData<Page<?>> responseData = ResponseData.<Page<?>>builder()
                .status(HttpStatus.OK.value())
                .message("Bookings retrieved successfully")
                .data(bookings)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Update booking status", description = "This endpoint allows updating the status of a booking.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Booking not found"),
            @ApiResponse(responseCode = "400", description = "Invalid status transition")
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<ResponseData<BookingDetailResponse>> updateBookingStatus(
            @Parameter(description = "Booking ID") @PathVariable Long id,
            @RequestParam BookingStatus status) {
        log.info("Updating booking {} status to {}", id, status);
        BookingDetailResponse booking = bookingService.updateBookingStatus(id, status);

        ResponseData<BookingDetailResponse> responseData = ResponseData.<BookingDetailResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Booking status updated successfully")
                .data(booking)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Delete booking", description = "This endpoint allows deleting a booking by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseData<Void>> deleteBooking(
            @Parameter(description = "Booking ID") @PathVariable Long id) {
        log.info("Deleting booking with ID: {}", id);
        bookingService.deleteBooking(id);

        ResponseData<Void> responseData = ResponseData.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Booking has been successfully deleted")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }


}
