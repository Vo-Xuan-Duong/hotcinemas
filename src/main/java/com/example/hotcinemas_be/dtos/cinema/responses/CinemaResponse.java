package com.example.hotcinemas_be.dtos.cinema.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CinemaResponse {
    private Long id;
    private String iconUrl;
    private String name;
    private String address;
    private String phone;
    private String email;
    private String city;
    private Double latitude;
    private Double longitude;
    private Integer numberOfRooms;
    private String createdAt;
    private String updatedAt;
}

