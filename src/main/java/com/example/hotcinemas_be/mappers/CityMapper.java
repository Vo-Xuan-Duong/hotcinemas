package com.example.hotcinemas_be.mappers;

import com.example.hotcinemas_be.dtos.city.response.CityResponse;
import com.example.hotcinemas_be.models.City;
import org.springframework.stereotype.Component;

@Component
public class CityMapper {
    public CityResponse mapToResponse(City city) {
        if (city == null) {
            return null;
        }
        return CityResponse.builder()
                .id(city.getId())
                .name(city.getName())
                .code(city.getCode())
                .country(city.getCountry())
                .isActive(city.getIsActive())
                .build();
    }
}
