package com.example.hotcinemas_be.dtos.district.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DistrictResponse {
    private Long id;
    private String name;
    private String prefix;
    private Long cityId;
    private String cityName;
    private boolean isActive;
}

