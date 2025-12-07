package com.example.hotcinemas_be.repositorys;

import com.example.hotcinemas_be.models.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {

    Optional<District> findByName(String name);

    List<District> findByIsActiveTrue();

    List<District> findByCityId(Long cityId);

    List<District> findByCityIdAndIsActiveTrue(Long cityId);

    @Query("SELECT d FROM District d WHERE d.city.id = :cityId AND d.isActive = true ORDER BY d.name ASC")
    List<District> findActiveByCityIdOrderByName(@Param("cityId") Long cityId);

    @Query("SELECT d FROM District d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%')) AND d.isActive = true")
    List<District> findByNameContainingIgnoreCase(@Param("name") String name);

    @Query("SELECT d FROM District d WHERE d.city.id = :cityId AND LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%')) AND d.isActive = true")
    List<District> findByCityIdAndNameContainingIgnoreCase(@Param("cityId") Long cityId, @Param("name") String name);

    boolean existsByNameAndCityId(String name, Long cityId);

    @Query("SELECT COUNT(d) FROM District d WHERE d.city.id = :cityId AND d.isActive = true")
    long countActiveByCityId(@Param("cityId") Long cityId);
}

