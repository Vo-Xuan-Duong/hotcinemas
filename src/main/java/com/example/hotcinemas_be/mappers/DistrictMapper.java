package com.example.hotcinemas_be.mappers;

import com.example.hotcinemas_be.dtos.district.request.CreateDistrictRequest;
import com.example.hotcinemas_be.dtos.district.request.UpdateDistrictRequest;
import com.example.hotcinemas_be.dtos.district.response.DistrictResponse;
import com.example.hotcinemas_be.models.City;
import com.example.hotcinemas_be.models.District;
import org.springframework.stereotype.Component;

@Component
public class DistrictMapper {

    public DistrictResponse mapToResponse(District district) {
        if (district == null) {
            return null;
        }

        return DistrictResponse.builder()
                .id(district.getId())
                .name(district.getName())
                .prefix(district.getPrefix())
                .cityId(district.getCity() != null ? district.getCity().getId() : null)
                .cityName(district.getCity() != null ? district.getCity().getName() : null)
                .isActive(district.getIsActive())
                .build();
    }

    public District mapToEntity(CreateDistrictRequest request, City city) {
        if (request == null) {
            return null;
        }

        return District.builder()
                .name(request.getName())
                .prefix(request.getPrefix())
                .city(city)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
    }

    public void updateEntityFromRequest(District district, UpdateDistrictRequest request, City city) {
        if (request.getName() != null) {
            district.setName(request.getName());
        }
        if (request.getPrefix() != null) {
            district.setPrefix(request.getPrefix());
        }
        if (city != null) {
            district.setCity(city);
        }
        if (request.getIsActive() != null) {
            district.setIsActive(request.getIsActive());
        }
    }
}

