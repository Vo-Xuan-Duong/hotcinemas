import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie, onTrailerClick }) => {
  const {
    id,
    title,
    poster,
    rating,
    genre,
    releaseDate,
    ageLabel,
  } = movie;

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <Link to={`/movies/${id}`} className="movie-card-link">
          <img src={poster} alt={title} />
          <div className="movie-age-label">{ageLabel}</div>
          <div className="movie-release-date">{releaseDate}</div>
          <div className="movie-poster-overlay" />
        </Link>
        <button
          className="movie-play-btn"
          aria-label="Xem trailer"
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            if (onTrailerClick) onTrailerClick(movie);
          }}  
        >
          <span className="movie-play-icon">▶</span>
        </button>
        <div className="movie-rating">
          <span className="rating-star">⭐</span>
          <span className="rating-text">{rating}</span>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <div className="movie-meta">
          <span className="movie-genre">{genre}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard; 