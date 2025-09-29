import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = ({ movies = [] }) => {
  // Lấy phim đầu tiên để làm featured movie hoặc sử dụng dữ liệu mẫu
  const featuredMovie = movies[0] || {
    id: 1,
    title: "Phim Đặc Sắc",
    overview: "Khám phá những bộ phim hay nhất với chất lượng hình ảnh và âm thanh tuyệt vời.",
    rating: 8.5,
    genre: "Hành động, Phiêu lưu"
  };

  const recentMovies = movies.slice(0, 6) || [];

  return (
    <div className="hero-section">
      <div className="hero-container">
        {/* Left side - Featured content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span>🎬</span>
            <span>Đang chiếu</span>
          </div>
          
          <h1 className="hero-title">
            Rạp Chiếu Phim
            <span className="hero-highlight"> HotCinemas</span>
          </h1>
          
          <p className="hero-description">
            Trải nghiệm điện ảnh đỉnh cao với hệ thống rạp chiếu hiện đại, 
            âm thanh sống động và màn hình chất lượng cao. Đặt vé ngay hôm nay!
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Phim hay</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Rạp chiếu</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99%</span>
              <span className="stat-label">Hài lòng</span>
            </div>
          </div>

          <div className="hero-actions">
            <Link to="/movies" className="btn-primary">
              Xem phim ngay
            </Link>
            <Link to="/schedule" className="btn-secondary">
              Lịch chiếu
            </Link>
          </div>
        </div>

        {/* Right side - Movie grid */}
        <div className="hero-movies">
          <div className="movies-grid">
            {recentMovies.map((movie, index) => (
              <div key={movie.id || index} className="movie-item">
                <div className="movie-poster-mini">
                  <img 
                    src={movie.poster || "/api/placeholder/120/180"} 
                    alt={movie.title}
                    loading="lazy"
                  />
                  <div className="movie-overlay">
                    <span className="play-icon">▶</span>
                  </div>
                </div>
                <div className="movie-info-mini">
                  <h4>{movie.title}</h4>
                  <div className="movie-rating-mini">
                    <span>⭐</span>
                    <span>{movie.rating || '8.0'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
