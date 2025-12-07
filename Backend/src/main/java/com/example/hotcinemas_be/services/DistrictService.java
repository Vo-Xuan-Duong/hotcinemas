package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.district.request.CreateDistrictRequest;
import com.example.hotcinemas_be.dtos.district.request.UpdateDistrictRequest;
import com.example.hotcinemas_be.dtos.district.response.DistrictResponse;
import com.example.hotcinemas_be.exceptions.ErrorCode;
import com.example.hotcinemas_be.exceptions.ErrorException;
import com.example.hotcinemas_be.mappers.DistrictMapper;
import com.example.hotcinemas_be.models.City;
import com.example.hotcinemas_be.models.District;
import com.example.hotcinemas_be.repositorys.CityRepository;
import com.example.hotcinemas_be.repositorys.DistrictRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class DistrictService {

    private final DistrictRepository districtRepository;
    private final CityRepository cityRepository;
    private final DistrictMapper districtMapper;

    public DistrictService(DistrictRepository districtRepository,
                          CityRepository cityRepository,
                          DistrictMapper districtMapper) {
        this.districtRepository = districtRepository;
        this.cityRepository = cityRepository;
        this.districtMapper = districtMapper;
    }

    /**
     * Get all districts with pagination
     */
    @Transactional(readOnly = true)
    public Page<DistrictResponse> getAllDistricts(Pageable pageable) {
        Page<District> districts = districtRepository.findAll(pageable);
        return districts.map(districtMapper::mapToResponse);
    }

    /**
     * Get all active districts without pagination
     */
    @Transactional(readOnly = true)
    public List<DistrictResponse> getActiveDistricts() {
        List<District> districts = districtRepository.findByIsActiveTrue();
        return districts.stream().map(districtMapper::mapToResponse).toList();
    }

    /**
     * Get districts by city ID
     */
    @Transactional(readOnly = true)
    public List<DistrictResponse> getDistrictsByCity(Long cityId) {
        // Validate city exists
        if (!cityRepository.existsById(cityId)) {
            throw new ErrorException("City not found with id: " + cityId, ErrorCode.ERROR_MODEL_NOT_FOUND);
        }

        List<District> districts = districtRepository.findByCityIdAndIsActiveTrue(cityId);
        return districts.stream().map(districtMapper::mapToResponse).toList();
    }

    /**
     * Get all districts by city ID (including inactive)
     */
    @Transactional(readOnly = true)
    public List<DistrictResponse> getAllDistrictsByCity(Long cityId) {
        // Validate city exists
        if (!cityRepository.existsById(cityId)) {
            throw new ErrorException("City not found with id: " + cityId, ErrorCode.ERROR_MODEL_NOT_FOUND);
        }

        List<District> districts = districtRepository.findByCityId(cityId);
        return districts.stream().map(districtMapper::mapToResponse).toList();
    }

    /**
     * Get districts by city ID, ordered by name
     */
    @Transactional(readOnly = true)
    public List<DistrictResponse> getDistrictsByCityOrderedByName(Long cityId) {
        // Validate city exists
        if (!cityRepository.existsById(cityId)) {
            throw new ErrorException("City not found with id: " + cityId, ErrorCode.ERROR_MODEL_NOT_FOUND);
        }

        List<District> districts = districtRepository.findActiveByCityIdOrderByName(cityId);
        return districts.stream().map(districtMapper::mapToResponse).toList();
    }

    /**
     * Search districts by name (case insensitive)
     */
    @Transactional(readOnly = true)
    public List<DistrictResponse> searchDistrictsByName(String name) {
        List<District> districts = districtRepository.findByNameContainingIgnoreCase(name);
        return districts.stream().map(districtMapper::mapToResponse).toList();
    }

    /**
     * Search districts by name within a city (case insensitive)
     */
    @Transactional(readOnly = true)
    public List<DistrictResponse> searchDistrictsByNameAndCity(Long cityId, String name) {
        // Validate city exists
        if (!cityRepository.existsById(cityId)) {
            throw new ErrorException("City not found with id: " + cityId, ErrorCode.ERROR_MODEL_NOT_FOUND);
        }

        List<District> districts = districtRepository.findByCityIdAndNameContainingIgnoreCase(cityId, name);
        return districts.stream().map(districtMapper::mapToResponse).toList();
    }

    /**
     * Get district by ID
     */
    @Transactional(readOnly = true)
    public DistrictResponse getDistrictById(Long id) {
        District district = districtRepository.findById(id)
                .orElseThrow(() -> new ErrorException("District not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        return districtMapper.mapToResponse(district);
    }

    /**
     * Get district by name
     */
    @Transactional(readOnly = true)
    public DistrictResponse getDistrictByName(String name) {
        District district = districtRepository.findByName(name)
                .orElseThrow(() -> new ErrorException("District not found with name: " + name,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        return districtMapper.mapToResponse(district);
    }

    /**
     * Count active districts by city
     */
    @Transactional(readOnly = true)
    public long countActiveDistrictsByCity(Long cityId) {
        // Validate city exists
        if (!cityRepository.existsById(cityId)) {
            throw new ErrorException("City not found with id: " + cityId, ErrorCode.ERROR_MODEL_NOT_FOUND);
        }

        return districtRepository.countActiveByCityId(cityId);
    }

    /**
     * Create a new district
     */
    public DistrictResponse createDistrict(CreateDistrictRequest request) {
        // Validate city exists
        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new ErrorException("City not found with id: " + request.getCityId(),
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        // Validate district name uniqueness within the city
        if (districtRepository.existsByNameAndCityId(request.getName(), request.getCityId())) {
            throw new ErrorException("District with name '" + request.getName() +
                    "' already exists in city '" + city.getName() + "'",
                    ErrorCode.ERROR_MODEL_ALREADY_EXISTS);
        }

        // Create district
        District district = districtMapper.mapToEntity(request, city);
        District savedDistrict = districtRepository.save(district);

        return districtMapper.mapToResponse(savedDistrict);
    }

    /**
     * Update an existing district
     */
    public DistrictResponse updateDistrict(Long id, UpdateDistrictRequest request) {
        // Find existing district
        District existingDistrict = districtRepository.findById(id)
                .orElseThrow(() -> new ErrorException("District not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        // Validate city if provided
        City city = null;
        if (request.getCityId() != null) {
            city = cityRepository.findById(request.getCityId())
                    .orElseThrow(() -> new ErrorException("City not found with id: " + request.getCityId(),
                            ErrorCode.ERROR_MODEL_NOT_FOUND));
        }

        // Validate name uniqueness if changed
        if (request.getName() != null && !existingDistrict.getName().equals(request.getName())) {
            Long cityIdToCheck = city != null ? city.getId() : existingDistrict.getCity().getId();
            if (districtRepository.existsByNameAndCityId(request.getName(), cityIdToCheck)) {
                throw new ErrorException("District with name '" + request.getName() +
                        "' already exists in this city",
                        ErrorCode.ERROR_MODEL_ALREADY_EXISTS);
            }
        }

        // Update district
        districtMapper.updateEntityFromRequest(existingDistrict, request, city);
        existingDistrict.setUpdatedAt(LocalDateTime.now());

        District updatedDistrict = districtRepository.save(existingDistrict);
        return districtMapper.mapToResponse(updatedDistrict);
    }

    /**
     * Delete a district by ID
     */
    public void deleteDistrict(Long id) {
        District district = districtRepository.findById(id)
                .orElseThrow(() -> new ErrorException("District not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        // Check if district has associated cinemas
        if (!district.getCinemas().isEmpty()) {
            throw new ErrorException("Cannot delete district with associated cinemas. Please deactivate instead.",
                    ErrorCode.ERROR_RESOURCE_CONFLICT);
        }

        districtRepository.delete(district);
    }

    /**
     * Activate a district
     */
    public DistrictResponse activateDistrict(Long id) {
        District district = districtRepository.findById(id)
                .orElseThrow(() -> new ErrorException("District not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        district.setIsActive(true);
        district.setUpdatedAt(LocalDateTime.now());
        District updatedDistrict = districtRepository.save(district);

        return districtMapper.mapToResponse(updatedDistrict);
    }

    /**
     * Deactivate a district
     */
    public DistrictResponse deactivateDistrict(Long id) {
        District district = districtRepository.findById(id)
                .orElseThrow(() -> new ErrorException("District not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        district.setIsActive(false);
        district.setUpdatedAt(LocalDateTime.now());
        District updatedDistrict = districtRepository.save(district);

        return districtMapper.mapToResponse(updatedDistrict);
    }
}

