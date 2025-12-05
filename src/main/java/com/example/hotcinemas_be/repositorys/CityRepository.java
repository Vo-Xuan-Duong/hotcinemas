package com.example.hotcinemas_be.repositorys;

import com.example.hotcinemas_be.models.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {

    Optional<City> findByName(String name);

    Optional<City> findByCode(String code);

    List<City> findByIsActiveTrue();

    List<City> findByCountry(String country);

    @Query("SELECT c FROM City c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) AND c.isActive = true")
    List<City> findByNameContainingIgnoreCase(@Param("name") String name);

    @Query("SELECT c FROM City c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(c.code) LIKE LOWER(CONCAT('%', :name, '%')) AND c.isActive = true")
    List<City> findByNameOrCodeContainingIgnoreCase(@Param("name") String name);

    boolean existsByName(String name);

    boolean existsByCode(String code);
}
