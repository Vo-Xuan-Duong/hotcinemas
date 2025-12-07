package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.cinema.requests.CinemaRequest;
import com.example.hotcinemas_be.dtos.cinema.responses.CinemaResponse;
import com.example.hotcinemas_be.mappers.CinemaMapper;
import com.example.hotcinemas_be.models.City;
import com.example.hotcinemas_be.models.Cinema;
import com.example.hotcinemas_be.repositorys.CinemaRepository;
import com.example.hotcinemas_be.repositorys.CityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CinemaService {

    private final CinemaMapper cinemaMapper;
    private final CinemaRepository cinemaRepository;
    private final CityRepository cityRepository;

    public CinemaService(CinemaMapper cinemaMapper, CinemaRepository cinemaRepository,
            CityRepository cityRepository) {
        this.cinemaMapper = cinemaMapper;
        this.cinemaRepository = cinemaRepository;
        this.cityRepository = cityRepository;
    }

    public CinemaResponse createCinema(CinemaRequest cinemaRequest) {
        // Check if cinema with same name already exists
        if (cinemaRepository.findByName(cinemaRequest.getName()).isPresent()) {
            throw new RuntimeException("Cinema with name '" + cinemaRequest.getName() + "' already exists");
        }

        // Resolve City by name (CinemaRequest currently carries city name)
        City city = cityRepository.findById(cinemaRequest.getCityId())
                .orElseThrow(() -> new RuntimeException("City not found with name: " + cinemaRequest.getCityId()));

        Cinema cinema = Cinema.builder()
                .name(cinemaRequest.getName())
                .address(cinemaRequest.getAddress())
                .phone(cinemaRequest.getPhone())
                .email(cinemaRequest.getEmail())
                .city(city)
                .latitude(cinemaRequest.getLatitude())
                .longitude(cinemaRequest.getLongitude())
                .isActive(true)
                .build();

        Cinema savedCinema = cinemaRepository.save(cinema);
        return cinemaMapper.mapToResponse(savedCinema);
    }

    @Transactional(readOnly = true)
    public CinemaResponse getCinemaById(Long cinemaId) {
        Cinema cinema = cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new RuntimeException("Cinema not found with id: " + cinemaId));

        return cinemaMapper.mapToResponse(cinema);
    }

    public CinemaResponse updateCinema(Long cinemaId, CinemaRequest cinemaRequest) {
        Cinema cinema = cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new RuntimeException("Cinema not found with id: " + cinemaId));

        // Check if another cinema with same name exists (excluding current cinema)
        cinemaRepository.findByName(cinemaRequest.getName())
                .ifPresent(existingCinema -> {
                    if (!existingCinema.getId().equals(cinemaId)) {
                        throw new RuntimeException("Cinema with name '" + cinemaRequest.getName() + "' already exists");
                    }
                });

        cinema.setName(cinemaRequest.getName());
        cinema.setAddress(cinemaRequest.getAddress());
        cinema.setPhone(cinemaRequest.getPhone());
        cinema.setEmail(cinemaRequest.getEmail());
        cinema.setLatitude(cinemaRequest.getLatitude());
        cinema.setLongitude(cinemaRequest.getLongitude());
        City city = cityRepository.findById(cinemaRequest.getCityId())
                .orElseThrow(() -> new RuntimeException("City not found with name: " + cinemaRequest.getCityId()));
        cinema.setCity(city);

        Cinema updatedCinema = cinemaRepository.save(cinema);
        return cinemaMapper.mapToResponse(updatedCinema);
    }

    public void deleteCinema(Long cinemaId) {
        Cinema cinema = cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new RuntimeException("Cinema not found with id: " + cinemaId));

        // Soft delete by setting isActive to false
        cinema.setIsActive(false);
        cinemaRepository.save(cinema);
    }

    @Transactional(readOnly = true)
    public CinemaResponse getCinemaByName(String name) {
        Cinema cinema = cinemaRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Cinema not found with name: " + name));

        return cinemaMapper.mapToResponse(cinema);
    }

    @Transactional(readOnly = true)
    public Page<CinemaResponse> getAllCinemas(Pageable pageable) {
        Page<Cinema> cinemas = cinemaRepository.findByIsActiveTrue(pageable);
        return cinemas.map(cinemaMapper::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<CinemaResponse> searchCinemas(String keyword, Pageable pageable) {
        Page<Cinema> cinemas = cinemaRepository.searchCinemas(keyword, pageable);
        return cinemas.map(cinemaMapper::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<CinemaResponse> getCinemasByCity(String city, Pageable pageable) {
        Page<Cinema> cinemas = cinemaRepository.findByCity(cityRepository.findByName(city).get(), pageable);
        return cinemas.map(cinemaMapper::mapToResponse);
    }

    public List<CinemaResponse> getAllCinemasNoPagination() {
        return cinemaRepository.findAll().stream()
                .map(cinemaMapper::mapToResponse)
                .toList();
    }
}
