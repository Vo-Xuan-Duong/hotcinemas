package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.city.response.CityResponse;
import com.example.hotcinemas_be.exceptions.ErrorCode;
import com.example.hotcinemas_be.exceptions.ErrorException;
import com.example.hotcinemas_be.mappers.CityMapper;
import com.example.hotcinemas_be.models.City;
import com.example.hotcinemas_be.repositorys.CityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class CityService {

    private final CityRepository cityRepository;
    private final CityMapper cityMapper;

    public CityService(CityRepository cityRepository,
            CityMapper cityMapper) {
        this.cityRepository = cityRepository;
        this.cityMapper = cityMapper;
    }

    /**
     * Get all cities with pagination
     */
    @Transactional(readOnly = true)
    public Page<CityResponse> getAllCities(Pageable pageable) {
        Page<City> cities = cityRepository.findAll(pageable);

        return cities.map(cityMapper::mapToResponse);
    }

    /**
     * Get all active cities without pagination
     */
    @Transactional(readOnly = true)
    public List<CityResponse> getAllNoPage() {
        List<City> cities = cityRepository.findAll();
        return cities.stream().map(cityMapper::mapToResponse).toList();
    }

    /**
     * Search cities by name (case insensitive)
     */
    @Transactional(readOnly = true)
    public List<CityResponse> searchCitiesByName(String name) {
        List<City> cities = cityRepository.findByNameContainingIgnoreCase(name);

        return cities.stream().map(cityMapper::mapToResponse).toList();
    }

    /**
     * Search cities by name or code (case insensitive)
     */
    @Transactional(readOnly = true)
    public List<CityResponse> searchCitiesByNameOrCode(String searchTerm) {
        List<City> cities = cityRepository.findByNameOrCodeContainingIgnoreCase(searchTerm);

        return cities.stream().map(cityMapper::mapToResponse).toList();
    }

    /**
     * Get city by ID
     */
    @Transactional(readOnly = true)
    public CityResponse getCityById(Long id) {
        return cityMapper.mapToResponse(cityRepository.findById(id)
                .orElseThrow(() -> new ErrorException("City not found", ErrorCode.ERROR_MODEL_NOT_FOUND)));
    }

    /**
     * Get city by name
     */
    @Transactional(readOnly = true)
    public CityResponse getCityByName(String name) {
        return cityMapper.mapToResponse(cityRepository.findByName(name)
                .orElseThrow(() -> new ErrorException("City not found", ErrorCode.ERROR_MODEL_NOT_FOUND)));
    }

    /**
     * Get city by code
     */
    @Transactional(readOnly = true)
    public CityResponse getCityByCode(String code) {
        return cityMapper.mapToResponse(cityRepository.findByCode(code)
                .orElseThrow(() -> new ErrorException("City not found", ErrorCode.ERROR_MODEL_NOT_FOUND)));
    }

    /**
     * Get cities by country
     */
    @Transactional(readOnly = true)
    public List<CityResponse> getCitiesByCountry(String country) {
        List<City> cities = cityRepository.findByCountry(country);

        return cities.stream().map(cityMapper::mapToResponse).toList();
    }

    /**
     * Create a new city
     */
    public CityResponse createCity(City city) {
        // Validate city name uniqueness
        if (cityRepository.existsByName(city.getName())) {
            throw new ErrorException("City with name '" + city.getName() + "' already exists",
                    ErrorCode.ERROR_MODEL_ALREADY_EXISTS);
        }

        // Validate city code uniqueness if provided
        if (city.getCode() != null && cityRepository.existsByCode(city.getCode())) {
            throw new ErrorException("City with code '" + city.getCode() + "' already exists",
                    ErrorCode.ERROR_MODEL_ALREADY_EXISTS);
        }

        // Set default values
        if (city.getIsActive() == null) {
            city.setIsActive(true);
        }
        if (city.getCountry() == null) {
            city.setCountry("Vietnam");
        }

        return cityMapper.mapToResponse(cityRepository.save(city));
    }

    /**
     * Update an existing city
     */
    public CityResponse updateCity(Long id, City city) {
        City existingCity = cityRepository.findById(id)
                .orElseThrow(() -> new ErrorException("City not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        // Validate name uniqueness if changed
        if (!existingCity.getName().equals(city.getName()) &&
                cityRepository.existsByName(city.getName())) {
            throw new ErrorException("City with name '" + city.getName() + "' already exists",
                    ErrorCode.ERROR_MODEL_ALREADY_EXISTS);
        }

        // Validate code uniqueness if changed
        if (city.getCode() != null &&
                !city.getCode().equals(existingCity.getCode()) &&
                cityRepository.existsByCode(city.getCode())) {
            throw new ErrorException("City with code '" + city.getCode() + "' already exists",
                    ErrorCode.ERROR_MODEL_ALREADY_EXISTS);
        }

        // Update fields
        existingCity.setName(city.getName());
        existingCity.setCode(city.getCode());
        existingCity.setCountry(city.getCountry());
        existingCity.setIsActive(city.getIsActive());
        existingCity.setUpdatedAt(LocalDateTime.now());

        return cityMapper.mapToResponse(cityRepository.save(existingCity));
    }

    /**
     * Delete a city by ID
     */
    public void deleteCity(Long id) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new ErrorException("City not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        // Check if city has associated cinemas
        if (!city.getCinemas().isEmpty()) {
            throw new ErrorException("Cannot delete city with associated cinemas. Please deactivate instead.",
                    ErrorCode.ERROR_RESOURCE_CONFLICT);
        }

        cityRepository.delete(city);
    }

    /**
     * Activate a city
     */
    public CityResponse activateCity(Long id) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new ErrorException("City not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        city.setIsActive(true);
        city.setUpdatedAt(LocalDateTime.now());
        return cityMapper.mapToResponse(cityRepository.save(city));
    }

    /**
     * Deactivate a city
     */
    public CityResponse deactivateCity(Long id) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new ErrorException("City not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        city.setIsActive(false);
        city.setUpdatedAt(LocalDateTime.now());
        return cityMapper.mapToResponse(cityRepository.save(city));
    }

    /**
     * Check if city exists by name
     */
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return cityRepository.existsByName(name);
    }

    /**
     * Check if city exists by code
     */
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return cityRepository.existsByCode(code);
    }
}
