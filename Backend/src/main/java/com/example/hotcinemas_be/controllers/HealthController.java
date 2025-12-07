package com.example.hotcinemas_be.controllers;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotcinemas_be.dtos.common.ResponseData;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health Check", description = "API for health checking")
public class HealthController {

    @Operation(summary = "Health check", description = "Check if the API is running")
    @GetMapping
    public ResponseEntity<ResponseData<String>> healthCheck() {
        ResponseData<String> responseData = ResponseData.<String>builder()
                .status(HttpStatus.OK.value())
                .message("HotCinemas API is running successfully!")
                .data("Server is healthy")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "API version", description = "Get API version information")
    @GetMapping("/version")
    public ResponseEntity<ResponseData<String>> getVersion() {
        ResponseData<String> responseData = ResponseData.<String>builder()
                .status(HttpStatus.OK.value())
                .message("API Version Information")
                .data("v1.0.0")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(responseData);
    }
}
