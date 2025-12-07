package com.example.hotcinemas_be.models;

import com.example.hotcinemas_be.enums.MovieStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "movies")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ====== Basic ======
    @NotBlank
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "original_title", length = 200)
    private String originalTitle;

    @Column(name = "tagline", length = 300)
    private String tagline;

    @Column(name = "overview", columnDefinition = "TEXT")
    private String overview;

    @Positive
    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "original_language", length = 50)
    private String originalLanguage;

    @Column(name = "format", length = 100)
    private String format; // 2D, 3D, IMAX, 4DX, ...

    @Column(name = "age_rating", length = 100)
    private String ageRating;

    // ====== Flags / status / metrics ======
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private MovieStatus status;

    @DecimalMin("0.0") @DecimalMax("10.0")
    @Column(name = "vote_average", precision = 4, scale = 3)
    private BigDecimal voteAverage;

    @Column(name = "vote_count")
    private Integer voteCount;

    // ====== Media (lưu URL hoặc path) ======
    @Column(name = "trailer_url", length = 500)
    private String trailerUrl;
    // Nếu bạn muốn lưu "path" từ TMDB để tự build URL ở FE:
    @Column(name = "poster_path", length = 300)
    private String posterPath;

    @Column(name = "backdrop_path", length = 300)
    private String backdropPath;

    // ====== Relationships ======
    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "movie_genres",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private List<Genre> genres = new ArrayList<>();

    // Quốc gia nguồn (origin_country[] từ payload)
    @Builder.Default
    @Column(name = "country_code", length = 10)
    private List<String> originCountry = new ArrayList<>();

    // Dàn diễn viên đơn giản (nếu cần name + role + order => làm entity riêng)
    @Builder.Default
    @Column(name = "cast_name", length = 150)
    private List<String> casts = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    // ====== Status ======
    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
