import React, { useState } from 'react';
import './MovieInfo.css';
import TrailerModal from '../Trailer/TrailerModal';

const icons = {
  genre: <span className="icon">🎬</span>,
  duration: <span className="icon">⏱️</span>,
  format: <span className="icon">🎞️</span>,
  language: <span className="icon">💬</span>,
  age: <span className="icon">⚠️</span>,
  star: <span className="icon">⭐</span>,
  calendar: <span className="icon">📅</span>,
  director: <span className="icon">🎭</span>,
  cast: <span className="icon">👥</span>
};

const MovieInfo = ({ movie }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const maxChars = 120; // Số ký tự ước lượng cho 2 dòng, có thể điều chỉnh

  const handleTrailerClick = (e) => {
    e.preventDefault();
    setIsTrailerOpen(true);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  if (!movie) return null;

  // Xử lý chuyển đổi link YouTube sang dạng embed và tự động phát
  let trailerUrl = movie.trailer;
  if (trailerUrl && trailerUrl.includes('youtube.com/watch?v=')) {
    const videoId = trailerUrl.split('v=')[1]?.split('&')[0];
    trailerUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  // Mock rating data
  const rating = movie.rating || 8.5;
  const ratingCount = 1247;

  return (
    <>
      <div className="movie-info-container" style={{
        backgroundImage: movie.backgroundImage ? `url(${movie.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}>
        <div className="movie-info-bg-overlay"></div>
        <div className="movie-info-main">
          <div className="movie-poster-section">
            <div className="movie-poster-wrapper">
              <img
                className="movie-info-poster"
                src={movie.poster || '/default-poster.png'}
                alt={movie.title}
              />
              <div className="movie-tags">
                <span className="movie-tag format">{movie.format}</span>
                <span className={`movie-tag age age-${movie.ageLabel?.toLowerCase()}`}>
                  {movie.ageLabel}
                </span>
              </div>
            </div>

            <div className="movie-actions">
              <button
                className="trailer-btn primary"
                onClick={handleTrailerClick}
              >
                <span className="btn-icon">▶</span>
                Xem Trailer
              </button>

            </div>
          </div>

          <div className="movie-details-section">
            <div className="movie-header">
              <h2 className="movie-title">{movie.title}</h2>
              <div className="movie-rating">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= Math.round(rating) ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="rating-info">
                  <span className="rating-score">{rating}</span>
                  <span className="rating-count">({ratingCount} đánh giá)</span>
                </div>
              </div>
            </div>

            <div className="movie-meta-block">
              <h3 className="section-title">Thông tin phim</h3>
              <div className="movie-meta">
                <div className="meta-item">
                  <span className="meta-label">Thể loại:</span>
                  <span className="meta-value genre-value">{movie.genre}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Phụ đề/Thuyết minh:</span>
                  <span className="meta-value subtitle-value">{movie.audioOptions[0].type || 'Chưa cập nhật'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Thời lượng:</span>
                  <span className="meta-value duration-value">{movie.duration} phút</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Định dạng:</span>
                  <span className="meta-value format-value">{movie.format}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Khởi chiếu:</span>
                  <span className="meta-value date-value">{movie.releaseDate}</span>
                </div>
              </div>
            </div>

            <div className="movie-age-info">
              {icons.age}
              <span>Phim dành cho {movie.ageLabel} trở lên</span>
            </div>

            <div className="movie-description">
              <h3 className="section-title">Nội dung phim</h3>
              <div className="description-content">
                {!isDescriptionExpanded && movie.description && movie.description.length > maxChars ? (
                  <>
                    {movie.description.slice(0, maxChars)}...
                    <button
                      className="expand-btn inline"
                      onClick={toggleDescription}
                      style={{ display: 'inline', marginLeft: 0 }}
                    >
                      Xem thêm
                    </button>
                  </>
                ) : (
                  <>
                    {movie.description}
                    {movie.description && movie.description.length > maxChars && (
                      <button
                        className="expand-btn inline"
                        onClick={toggleDescription}
                        style={{ marginLeft: 8 }}
                      >
                        Thu gọn
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="movie-cast-block">
              <h3 className="section-title">Ekip sản xuất</h3>
              <div className="cast-grid">
                <div className="cast-item">
                  <div className="cast-info">
                    <span className="cast-label">Đạo diễn : </span>
                    <span className="cast-name">{movie.director || 'Chưa cập nhật'}</span>
                  </div>
                </div>
                <div className="cast-item">
                  <div className="cast-info">
                    <span className="cast-label">Diễn viên : </span>
                    <span className="cast-name">
                      {Array.isArray(movie.cast) ? (
                        <span className="actors-list no-avatar">
                          {movie.cast.map((actor, idx) => (
                            <span className="actor-name" key={idx}>
                              {actor.name}{idx < movie.cast.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </span>
                      ) : (
                        movie.cast || 'Chưa cập nhật'
                      )}
                    </span>
                  </div>
                </div>
                <div className="cast-item">
                  <div className="cast-info">
                    <span className="cast-label">Nhà sản xuất : </span>
                    <span className="cast-name">{movie.productionStudio || 'Chưa cập nhật'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={trailerUrl}
        movieTitle={movie.title}
      />
    </>
  );
};

export default MovieInfo; 