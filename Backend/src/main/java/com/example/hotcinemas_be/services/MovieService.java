package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.movie.requests.MovieRequest;
import com.example.hotcinemas_be.dtos.movie.requests.MovieSearchRequest;
import com.example.hotcinemas_be.dtos.movie.responses.MovieResponse;
import com.example.hotcinemas_be.dtos.movie.responses.MovieListItemResponse;
import com.example.hotcinemas_be.enums.MovieStatus;
import com.example.hotcinemas_be.exceptions.ErrorCode;
import com.example.hotcinemas_be.exceptions.ErrorException;
import com.example.hotcinemas_be.mappers.MovieMapper;
import com.example.hotcinemas_be.models.Genre;
import com.example.hotcinemas_be.models.Movie;
import com.example.hotcinemas_be.repositorys.GenreRepository;
import com.example.hotcinemas_be.repositorys.MovieRepository;
import com.example.hotcinemas_be.specifications.MovieSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;
    private final GenreRepository genreRepository;
    private final MovieSpecification movieSpecification;

    public MovieResponse createMovie(MovieRequest movieRequest) {

        if(movieRepository.existsByTitle(movieRequest.getTitle())) {
            throw new ErrorException("Movie with title '" + movieRequest.getTitle() + "' already exists",
                    ErrorCode.ERROR_MOVIE_CONFLICT);
        }

        Movie movie = new Movie();
        movie.setTitle(movieRequest.getTitle());
        movie.setOriginalTitle(movieRequest.getOriginalTitle());
        movie.setTagline(movieRequest.getTagline());
        movie.setOverview(movieRequest.getOverview());
        movie.setPosterPath(movieRequest.getPosterPath());
        movie.setBackdropPath(movieRequest.getBackdropPath());
        movie.setTrailerUrl(movieRequest.getTrailerUrl());
        movie.setReleaseDate(movieRequest.getReleaseDate());
        movie.setDurationMinutes(movieRequest.getDurationMinutes());
        movie.setVoteAverage(movieRequest.getVoteAverage());
        movie.setVoteCount(movieRequest.getVoteCount());
        movie.setOriginalLanguage(movieRequest.getOriginalLanguage());
        movie.setCasts(movieRequest.getCasts());
        movie.setAgeRating(movieRequest.getAgeRating());
        movie.setFormat(movieRequest.getFormat());
        movie.setOriginCountry(movieRequest.getOriginCountry());
        Set<Genre> genres = new HashSet<>();
        if (movieRequest.getGenreIds() != null) {
            movieRequest.getGenreIds().forEach(genreId -> {
                genreRepository.findById(genreId).ifPresent(genres::add);
            });
        }
        movie.setGenres(genres.stream().toList());
        movie.setStatus(movieRequest.getStatus());
        return movieMapper.mapToResponse(movieRepository.save(movie));
    }

    public Movie getMovieByTitle(String title) {
        return movieRepository.findByTitle(title)
                .orElseThrow(() -> new ErrorException("Movie not found with title: " + title,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
    }

    public MovieResponse updateMovie(Long movieId, MovieRequest movieRequest) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ErrorException("Movie not found with id: " + movieId,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        movie.setTitle(movieRequest.getTitle());
        movie.setOriginalTitle(movieRequest.getOriginalTitle());
        movie.setTagline(movieRequest.getTagline());
        movie.setOverview(movieRequest.getOverview());
        movie.setPosterPath(movieRequest.getPosterPath());
        movie.setBackdropPath(movieRequest.getBackdropPath());
        movie.setTrailerUrl(movieRequest.getTrailerUrl());
        movie.setReleaseDate(movieRequest.getReleaseDate());
        movie.setVoteAverage(movieRequest.getVoteAverage());
        movie.setVoteCount(movieRequest.getVoteCount());
        movie.setDurationMinutes(movieRequest.getDurationMinutes());
        movie.setOriginalLanguage(movieRequest.getOriginalLanguage());
        movie.setCasts(movieRequest.getCasts());
        movie.setAgeRating(movieRequest.getAgeRating());
        movie.setFormat(movieRequest.getFormat());
        movie.setOriginCountry(movieRequest.getOriginCountry());
        Set<Genre> genres = new HashSet<>();
        if (movieRequest.getGenreIds() != null) {
            movieRequest.getGenreIds().forEach(genreId -> {
                genreRepository.findById(genreId).ifPresent(genres::add);
            });
        }
        movie.setGenres(genres.stream().toList());
        return movieMapper.mapToResponse(movieRepository.save(movie));
    }

    public MovieResponse getMovieById(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ErrorException("Movie not found with id: " + movieId,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        return movieMapper.mapToResponse(movie);
    }

    public void deleteMovie(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ErrorException("Movie not found with id: " + movieId,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        movieRepository.delete(movie);
    }

    public Page<MovieListItemResponse> getAllMovies(Pageable pageable) {
        Page<Movie> moviePage = movieRepository.findAll(pageable);
        if (moviePage.isEmpty()) {
            throw new ErrorException("No movies found", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return moviePage.map(movieMapper::mapToListItem);
    }

    public Page<MovieListItemResponse> getMoviesByGenre(String genre, Pageable pageable) {
        Page<Movie> moviePage = movieRepository.findByGenres_Name(genre, pageable);
        if (moviePage.isEmpty()) {
            throw new ErrorException("No movies found for genre: " + genre, ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return moviePage.map(movieMapper::mapToListItem);
    }

    public Page<MovieListItemResponse> getComingSoonMovies(Pageable pageable) {
        Page<Movie> moviePage = movieRepository.findMovieByStatus(MovieStatus.COMING_SOON, pageable);
        if (moviePage.isEmpty()) {
            throw new ErrorException("No coming soon movies found", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return moviePage.map(movieMapper::mapToListItem);
    }

    public Page<MovieListItemResponse> getNowShowingMovies(Pageable pageable) {
        Page<Movie> moviePage = movieRepository.findMovieByStatus(MovieStatus.NOW_SHOWING, pageable);
        if (moviePage.isEmpty()) {
            throw new ErrorException("No now showing movies found", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return moviePage.map(movieMapper::mapToListItem);
    }

    public Page<MovieListItemResponse> searchMovies(MovieSearchRequest request, Pageable pageable) {
        if (request == null) {
            throw new ErrorException("At least one search parameter is required", ErrorCode.ERROR_MOVIE_NOT_FOUND);
        }

        Specification<Movie> spec = movieSpecification.build(request);

        Page<Movie> moviePage = movieRepository.findAll(spec, pageable);

        if (moviePage.isEmpty()) {
            throw new ErrorException("No movies found matching the search criteria", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return moviePage.map(movieMapper::mapToListItem);
    }

    public void deleteAllMovies() {
        if (movieRepository.count() == 0) {
            throw new ErrorException("No movies to delete", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        movieRepository.deleteAll();
    }

    public Page<MovieListItemResponse> getTopRatedMovies(Pageable pageable) {
        Page<Movie> moviePage = movieRepository.findTopRated(pageable);
        if (moviePage.isEmpty()) {
            throw new ErrorException("No top rated movies found", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return moviePage.map(movieMapper::mapToListItem);
    }

    public void activateMovie(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ErrorException("Movie not found with id: " + movieId,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        movie.setIsActive(true);
        movieRepository.save(movie);

    }

    public void deactivateMovie(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ErrorException("Movie not found with id: " + movieId,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        movie.setIsActive(false);
        movieRepository.save(movie);
    }
}
