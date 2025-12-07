package com.example.hotcinemas_be.exceptions;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.hotcinemas_be.dtos.common.ResponseData;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.error("Validation exception at [{} {}] - errors: {}", request.getMethod(), request.getRequestURI(), errors);
        ResponseData<?> error = ResponseData.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed")
                .data(errors)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        log.error("Runtime exception at [{} {}]: {}", request.getMethod(), request.getRequestURI(), ex.getMessage(),
                ex);
        ResponseData<?> error = ResponseData.builder()
                .status(500)
                .message("An unexpected error occurred: " + ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
        // Return a generic error response
        return ResponseEntity.status(500).body(error);
    }

    @ExceptionHandler(ErrorException.class)
    public ResponseEntity<?> handleErrorException(ErrorException ex, HttpServletRequest request) {
        ErrorCode errorCode = ex.getErrorCode();
        log.error("ErrorException at [{} {}] code={} message={}", request.getMethod(), request.getRequestURI(),
                errorCode.getCode(), ex.getMessage(), ex);
        ResponseData<?> error = ResponseData.builder()
                .status(errorCode.getHttpStatus().value())
                .message(ex.getMessage() != null ? ex.getMessage() : errorCode.getMessage())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
        // Return the error response with the specific status code
        return ResponseEntity.status(errorCode.getHttpStatus()).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAnyException(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception at [{} {}]: {}", request.getMethod(), request.getRequestURI(), ex.getMessage(),
                ex);
        ResponseData<?> error = ResponseData.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("Internal server error")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
