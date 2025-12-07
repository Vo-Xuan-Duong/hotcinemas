package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.dtos.common.ResponseData;
import com.example.hotcinemas_be.services.CityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/cities")
@Tag(name = "City Management", description = "APIs for managing cities in the cinema system")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @Operation(summary = "Get all cities", description = "Retrieves all cities with pagination.")
    @GetMapping
    public ResponseEntity<?> getAllCities(@PageableDefault(size = 10, page = 0) Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Cities retrieved successfully")
                .data(cityService.getAllCities(pageable))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get all active cities", description = "Retrieves all active cities without pagination.")
    @GetMapping("/all-no-page")
    public ResponseEntity<?> getAllNoPage() {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Active cities retrieved successfully")
                .data(cityService.getAllNoPage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Search cities by name", description = "Search cities by name (case insensitive).")
    @GetMapping("/search")
    public ResponseEntity<?> searchCities(@RequestParam String name) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Cities found successfully")
                .data(cityService.searchCitiesByName(name))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get city by ID", description = "Retrieves a city by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<?> getCityById(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("City retrieved successfully")
                .data(cityService.getCityById(id))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Search cities by name or code", description = "Search cities by name or code (case insensitive).")
    @GetMapping("/search/advanced")
    public ResponseEntity<?> searchCitiesAdvanced(@RequestParam String searchTerm) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Cities found successfully")
                .data(cityService.searchCitiesByNameOrCode(searchTerm))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get cities by country", description = "Get all cities in a specific country.")
    @GetMapping("/country/{country}")
    public ResponseEntity<?> getCitiesByCountry(@PathVariable String country) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Cities retrieved successfully")
                .data(cityService.getCitiesByCountry(country))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Activate city", description = "Activate a city by its ID.")
    @PostMapping("/{id}/activate")
    public ResponseEntity<?> activateCity(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("City activated successfully")
                .data(cityService.activateCity(id))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Deactivate city", description = "Deactivate a city by its ID.")
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateCity(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("City deactivated successfully")
                .data(cityService.deactivateCity(id))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }
}
