import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeroCinematic.css';

const HeroCinematic = ({ movies = [] }) => {
  const [currentMovie, setCurrentMovie] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Featured movies cho hero slideshow
  const featuredMovies = movies.slice(0, 5).map((movie, index) => ({
    ...movie,
    id: movie.id || index + 1,
    heroImage: movie.poster || `/api/placeholder/1920/1080`,
    backdrop: movie.backdrop || movie.poster || `/api/placeholder/1920/1080`,
    tagline: movie.tagline || "Trải nghiệm điện ảnh đỉnh cao",
  }));

  // Auto-slide functionality
  useEffect(() => {
    if (!isPlaying && featuredMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentMovie((prev) => (prev + 1) % featuredMovies.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, featuredMovies.length]);

  const currentFeaturedMovie = featuredMovies[currentMovie] || {
    title: "HotCinemas",
    overview: "Khám phá thế giới điện ảnh với chất lượng hình ảnh và âm thanh vượt trội",
    tagline: "Trải nghiệm điện ảnh đỉnh cao",
    rating: 9.5,
    genre: "Premium Cinema Experience",
    backdrop: "/api/placeholder/1920/1080"
  };

  const handlePlayTrailer = () => {
    setIsPlaying(true);
    // Logic để play trailer
    console.log('Playing trailer for:', currentFeaturedMovie.title);
  };

  return (
    <div className="hero-cinematic">
      {/* Background with parallax effect */}
      <div className="hero-background">
        <div 
          className="hero-backdrop"
          style={{ backgroundImage: `url(${currentFeaturedMovie.backdrop})` }}
        />
        <div className="hero-overlay" />
        <div className="hero-gradient" />
      </div>

      {/* Floating particles */}
      <div className="hero-particles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="particle" style={{
            animationDelay: `${i * 0.5}s`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      <div className="hero-content-wrapper">
        <div className="hero-container">
          {/* Main content */}
          <div className="hero-main-content">
            <div className="hero-text-content">
              {/* Category badge */}
              <div className="hero-badge">
                <span className="badge-icon">🎬</span>
                <span className="badge-text">Đang chiếu</span>
                <span className="badge-pulse"></span>
              </div>

              {/* Movie title */}
              <h1 className="hero-title">
                <span className="title-main">{currentFeaturedMovie.title}</span>
                {currentFeaturedMovie.tagline && (
                  <span className="title-tagline">{currentFeaturedMovie.tagline}</span>
                )}
              </h1>

              {/* Movie info */}
              <div className="hero-movie-info">
                <div className="movie-rating">
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`star ${i < Math.floor(currentFeaturedMovie.rating / 2) ? 'filled' : ''}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="rating-number">{currentFeaturedMovie.rating}</span>
                  <span className="rating-label">IMDb</span>
                </div>
                <span className="movie-genre">{currentFeaturedMovie.genre}</span>
              </div>

              {/* Description */}
              <p className="hero-description">
                {currentFeaturedMovie.overview}
              </p>

              {/* Action buttons */}
              <div className="hero-actions">
                <button 
                  className="btn-play-trailer"
                  onClick={handlePlayTrailer}
                >
                  <span className="play-icon">▶</span>
                  <span>Xem Trailer</span>
                  <div className="btn-glow"></div>
                </button>
                
                <Link to="/movies" className="btn-explore">
                  <span>Khám phá ngay</span>
                  <span className="arrow">→</span>
                </Link>

                <Link to="/schedule" className="btn-schedule">
                  <span className="schedule-icon">📅</span>
                  <span>Lịch chiếu</span>
                </Link>
              </div>

              {/* Quick stats */}
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Phim hot</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">25+</span>
                  <span className="stat-label">Rạp chiếu</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1M+</span>
                  <span className="stat-label">Khách hàng</span>
                </div>
              </div>
            </div>

            {/* Featured movie poster */}
            <div className="hero-movie-poster">
              <div className="poster-container">
                <img 
                  src={currentFeaturedMovie.poster || currentFeaturedMovie.backdrop} 
                  alt={currentFeaturedMovie.title}
                  className="poster-image"
                />
                <div className="poster-glow"></div>
                <button className="poster-play-btn" onClick={handlePlayTrailer}>
                  <span className="play-icon-large">▶</span>
                </button>
              </div>
            </div>
          </div>

          {/* Movie slider thumbnails */}
          <div className="hero-thumbnails">
            <div className="thumbnails-container">
              {featuredMovies.map((movie, index) => (
                <button
                  key={movie.id}
                  className={`thumbnail-item ${index === currentMovie ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentMovie(index);
                    setIsPlaying(false);
                  }}
                >
                  <img src={movie.poster} alt={movie.title} />
                  <div className="thumbnail-overlay">
                    <span className="thumbnail-title">{movie.title}</span>
                  </div>
                  <div className="thumbnail-progress">
                    <div 
                      className="progress-bar"
                      style={{
                        animationDuration: index === currentMovie ? '6s' : '0s',
                        animationPlayState: index === currentMovie && !isPlaying ? 'running' : 'paused'
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-arrow">↓</div>
        <span>Khám phá thêm</span>
      </div>
    </div>
  );
};

export default HeroCinematic;
