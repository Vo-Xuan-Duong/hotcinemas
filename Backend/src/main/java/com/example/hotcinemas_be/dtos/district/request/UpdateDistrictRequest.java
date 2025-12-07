package com.example.hotcinemas_be.dtos.district.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateDistrictRequest {

    @Size(max = 100, message = "District name must not exceed 100 characters")
    private String name;

    @Size(max = 20, message = "Prefix must not exceed 20 characters")
    private String prefix;

    private Long cityId;

    private Boolean isActive;
}

