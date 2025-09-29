import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MovieShowcase.css';

const MovieShowcase = ({ movies = [], title = "Phim đặc sắc" }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredMovie, setHoveredMovie] = useState(null);

  const categories = [
    { id: 'all', name: 'Tất cả', icon: '🎬' },
    { id: 'action', name: 'Hành động', icon: '💥' },
    { id: 'drama', name: 'Tâm lý', icon: '🎭' },
    { id: 'comedy', name: 'Hài kịch', icon: '😄' },
    { id: 'horror', name: 'Kinh dị', icon: '👻' },
    { id: 'romance', name: 'Lãng mạn', icon: '💝' }
  ];

  // Filter movies based on category
  const filteredMovies = activeCategory === 'all' 
    ? movies.slice(0, 12)
    : movies.filter(movie => 
        movie.genre?.toLowerCase().includes(activeCategory) ||
        movie.category?.toLowerCase().includes(activeCategory)
      ).slice(0, 12);

  const handleTrailerClick = (movie, event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Playing trailer for:', movie.title);
    // Logic để mở trailer modal
  };

  return (
    <section className="movie-showcase">
      <div className="showcase-container">
        {/* Section header */}
        <div className="showcase-header">
          <div className="header-content">
            <h2 className="showcase-title">
              <span className="title-icon">🍿</span>
              {title}
            </h2>
            <p className="showcase-subtitle">
              Khám phá những bộ phim hay nhất đang chiếu tại HotCinemas
            </p>
          </div>
          
          <Link to="/movies" className="view-all-btn">
            <span>Xem tất cả</span>
            <span className="arrow-icon">→</span>
          </Link>
        </div>

        {/* Category filters */}
        <div className="category-filters">
          <div className="filters-wrapper">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="filter-icon">{category.icon}</span>
                <span className="filter-name">{category.name}</span>
                <div className="filter-bg"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Movies grid */}
        <div className="movies-grid">
          {filteredMovies.map((movie, index) => (
            <div 
              key={movie.id || index}
              className="movie-showcase-card"
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <Link to={`/movies/${movie.id}`} className="card-link">
                {/* Movie poster */}
                <div className="card-poster">
                  <img 
                    src={movie.poster || `/api/placeholder/300/450`} 
                    alt={movie.title}
                    loading="lazy"
                  />
                  
                  {/* Overlay effects */}
                  <div className="card-overlay">
                    <div className="overlay-gradient"></div>
                    
                    {/* Rating badge */}
                    <div className="rating-badge">
                      <span className="rating-star">⭐</span>
                      <span className="rating-value">{movie.rating || '8.5'}</span>
                    </div>
                    
                    {/* Age rating */}
                    {movie.ageLabel && (
                      <div className="age-badge">
                        {movie.ageLabel}
                      </div>
                    )}
                    
                    {/* Play button */}
                    <button 
                      className="play-trailer-btn"
                      onClick={(e) => handleTrailerClick(movie, e)}
                      aria-label="Xem trailer"
                    >
                      <span className="play-icon">▶</span>
                      <div className="play-ripple"></div>
                    </button>
                    
                    {/* Quick actions */}
                    <div className="quick-actions">
                      <button className="action-btn bookmark-btn" title="Thêm vào danh sách">
                        <span>🔖</span>
                      </button>
                      <button className="action-btn share-btn" title="Chia sẻ">
                        <span>📤</span>
                      </button>
                      <button className="action-btn info-btn" title="Thông tin">
                        <span>ℹ️</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Movie info */}
                <div className="card-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  
                  <div className="movie-meta">
                    <span className="movie-year">
                      {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '2024'}
                    </span>
                    <span className="meta-separator">•</span>
                    <span className="movie-genre">{movie.genre || 'Phim chiếu rạp'}</span>
                  </div>
                  
                  {movie.overview && (
                    <p className="movie-overview">
                      {movie.overview.length > 80 
                        ? `${movie.overview.substring(0, 80)}...`
                        : movie.overview
                      }
                    </p>
                  )}
                  
                  <div className="card-actions">
                    <button className="btn-book-now">
                      <span>🎫</span>
                      <span>Đặt vé ngay</span>
                    </button>
                    <button className="btn-showtimes">
                      <span>📅</span>
                      <span>Lịch chiếu</span>
                    </button>
                  </div>
                </div>

                {/* Hover effects */}
                <div className="card-glow"></div>
                <div className="card-shine"></div>
              </Link>
            </div>
          ))}
        </div>

        {/* Loading placeholder when no movies */}
        {filteredMovies.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>Không có phim nào</h3>
            <p>Hiện tại chưa có phim thuộc thể loại này</p>
          </div>
        )}

        {/* Show more button */}
        {filteredMovies.length > 0 && (
          <div className="show-more-section">
            <button className="show-more-btn">
              <span>Xem thêm phim hay</span>
              <div className="btn-background"></div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieShowcase;
