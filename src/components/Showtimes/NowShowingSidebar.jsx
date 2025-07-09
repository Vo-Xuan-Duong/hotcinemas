import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NowShowingSidebar.css';
import Loading from '../Loading';

const icons = {
  movie: <span className="icon">🎬</span>,
  star: <span className="icon">⭐</span>,
  clock: <span className="icon">⏱️</span>
};

const NowShowingSidebar = ({ currentMovieId }) => {
  const [movies, setMovies] = useState([]);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load movies data
    const loadMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch('/src/data/movies.json');
        const data = await response.json();
        setMovies(data.slice(0, 8)); // Show first 8 movies
      } catch (error) {
        console.error('Error loading movies:', error);
        // Fallback data
        setMovies([
          {
            id: 1,
            title: "Avengers: Endgame",
            genre: "Hành động",
            rating: 9.2,
            duration: 181,
            poster: "https://image-worker.momocdn.net/img/80099757410724750-doemon.png?size=M&referer=cinema.momocdn.net"
          },
          {
            id: 2,
            title: "Ma Không Đầu",
            genre: "Kinh Dị, Hài",
            rating: 8.4,
            duration: 148,
            poster: "https://image-worker.momocdn.net/img/80099757410724750-doemon.png?size=M&referer=cinema.momocdn.net"
          },
          {
            id: 3,
            title: "Bí Kíp Luyện Rồng",
            genre: "Phiêu Lưu, Hành Động",
            rating: 9.6,
            duration: 176,
            poster: "https://image-worker.momocdn.net/img/80099757410724750-doemon.png?size=M&referer=cinema.momocdn.net"
          },
          {
            id: 4,
            title: "DAN DA DAN: Tà Nhân",
            genre: "Hoạt Hình, Phiêu Lưu",
            rating: 9.1,
            duration: 161,
            poster: "https://image-worker.momocdn.net/img/80099757410724750-doemon.png?size=M&referer=cinema.momocdn.net"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`star ${star <= fullStars ? 'filled' : star === fullStars + 1 && hasHalfStar ? 'half' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <aside className="now-showing-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">
          {icons.movie} Phim đang chiếu
        </h3>
        <p className="sidebar-subtitle">
          Khám phá những bộ phim mới nhất
        </p>
      </div>

      {loading ? (
        <Loading text="Đang tải phim..." />
      ) : (
        <div className="movies-list">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className={`movie-card ${currentMovieId === movie.id ? 'current' : ''} ${hoveredMovie === movie.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
            >
              <div className="movie-poster">
                <img src={movie.poster} alt={movie.title} />
                {currentMovieId === movie.id && (
                  <div className="current-indicator">
                    <span>Đang xem</span>
                  </div>
                )}
                <div className="movie-overlay">
                  <div className="overlay-content">
                    <span className="view-details">Xem chi tiết</span>
                  </div>
                </div>
              </div>
              
              <div className="movie-info">
                <h4 className="movie-title">{movie.title}</h4>
                
                <div className="movie-meta">
                  <span className="movie-genre">{movie.genre}</span>
                  <span className="movie-duration">
                    {icons.clock} {formatDuration(movie.duration)}
                  </span>
                </div>
                
                <div className="movie-rating">
                  {renderStars(movie.rating)}
                  <span className="rating-score">{movie.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
};

export default NowShowingSidebar; 