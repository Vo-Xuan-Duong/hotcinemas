package com.example.hotcinemas_be.dtos.cinema.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CinemaRequest {
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Address is required")
    private String address;
    @NotBlank(message = "Phone number is required")
    private String phone;
    @NotBlank(message = "Email is required")
    private String email;
    @NotBlank(message = "City is required")
    private Long cityId;
    private Double latitude;
    private Double longitude;

}

