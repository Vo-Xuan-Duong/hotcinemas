package com.example.hotcinemas_be.repositorys;

import com.example.hotcinemas_be.dtos.movie.requests.MovieSearchRequest;
import com.example.hotcinemas_be.enums.MovieStatus;
import com.example.hotcinemas_be.models.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {
        Page<Movie> findByGenres_Name(String genre, Pageable pageable);

        Page<Movie> findMovieByStatus(MovieStatus status, Pageable pageable);

        @Query("SELECT m FROM Movie m WHERE m.isActive = true ORDER BY m.voteAverage DESC, m.voteCount DESC")
        Page<Movie> findTopRated(Pageable pageable);

    Optional<Movie> findByTitle(String title);

    boolean existsByTitle(String title);
}
