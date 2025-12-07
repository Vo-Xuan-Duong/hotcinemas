package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.dtos.common.ResponseData;
import com.example.hotcinemas_be.dtos.district.request.CreateDistrictRequest;
import com.example.hotcinemas_be.dtos.district.request.UpdateDistrictRequest;
import com.example.hotcinemas_be.services.DistrictService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/districts")
@Tag(name = "District Management", description = "APIs for managing districts/quận/huyện in the cinema system")
public class DistrictController {

    private final DistrictService districtService;

    public DistrictController(DistrictService districtService) {
        this.districtService = districtService;
    }

    @Operation(summary = "Get all districts", description = "Retrieves all districts with pagination.")
    @GetMapping
    public ResponseEntity<?> getAllDistricts(@PageableDefault(size = 10, page = 0) Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Districts retrieved successfully")
                .data(districtService.getAllDistricts(pageable))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get all active districts", description = "Retrieves all active districts without pagination.")
    @GetMapping("/active")
    public ResponseEntity<?> getActiveDistricts() {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Active districts retrieved successfully")
                .data(districtService.getActiveDistricts())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get districts by city", description = "Retrieves all active districts for a specific city.")
    @GetMapping("/city/{cityId}")
    public ResponseEntity<?> getDistrictsByCity(@PathVariable Long cityId) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Districts retrieved successfully")
                .data(districtService.getDistrictsByCity(cityId))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get all districts by city", description = "Retrieves all districts (including inactive) for a specific city.")
    @GetMapping("/city/{cityId}/all")
    public ResponseEntity<?> getAllDistrictsByCity(@PathVariable Long cityId) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("All districts retrieved successfully")
                .data(districtService.getAllDistrictsByCity(cityId))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get districts by city ordered by name", description = "Retrieves active districts for a city, sorted alphabetically.")
    @GetMapping("/city/{cityId}/ordered")
    public ResponseEntity<?> getDistrictsByCityOrderedByName(@PathVariable Long cityId) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Districts retrieved successfully")
                .data(districtService.getDistrictsByCityOrderedByName(cityId))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Search districts by name", description = "Search districts by name (case insensitive).")
    @GetMapping("/search")
    public ResponseEntity<?> searchDistricts(@RequestParam String name) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Districts found successfully")
                .data(districtService.searchDistrictsByName(name))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Search districts by name and city", description = "Search districts by name within a specific city (case insensitive).")
    @GetMapping("/search/city/{cityId}")
    public ResponseEntity<?> searchDistrictsByNameAndCity(@PathVariable Long cityId, @RequestParam String name) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Districts found successfully")
                .data(districtService.searchDistrictsByNameAndCity(cityId, name))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get district by ID", description = "Retrieves a district by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<?> getDistrictById(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("District retrieved successfully")
                .data(districtService.getDistrictById(id))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Count active districts by city", description = "Get count of active districts in a city.")
    @GetMapping("/city/{cityId}/count")
    public ResponseEntity<?> countActiveDistrictsByCity(@PathVariable Long cityId) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("District count retrieved successfully")
                .data(districtService.countActiveDistrictsByCity(cityId))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Create new district", description = "Create a new district.")
    @PostMapping
    public ResponseEntity<?> createDistrict(@Valid @RequestBody CreateDistrictRequest request) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("District created successfully")
                .data(districtService.createDistrict(request))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
    }

    @Operation(summary = "Update district", description = "Update an existing district.")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDistrict(@PathVariable Long id, @Valid @RequestBody UpdateDistrictRequest request) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("District updated successfully")
                .data(districtService.updateDistrict(id, request))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Delete district", description = "Delete a district by its ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDistrict(@PathVariable Long id) {
        districtService.deleteDistrict(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("District deleted successfully")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Activate district", description = "Activate a district by its ID.")
    @PostMapping("/{id}/activate")
    public ResponseEntity<?> activateDistrict(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("District activated successfully")
                .data(districtService.activateDistrict(id))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Deactivate district", description = "Deactivate a district by its ID.")
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateDistrict(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("District deactivated successfully")
                .data(districtService.deactivateDistrict(id))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }
}

