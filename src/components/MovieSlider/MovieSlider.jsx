import React, { useState, useEffect } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import TrailerModal from '../Trailer/TrailerModal';
import './MovieSlider.css';

const getMoviesPerSlide = () => {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 900) return 2;
  return 4;
};

const MovieSlider = ({ movies, title, showMoreButton = false, onShowMore }) => {
  const [movieSlide, setMovieSlide] = useState(0);
  const [moviesPerSlide, setMoviesPerSlide] = useState(getMoviesPerSlide());
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerMovie, setTrailerMovie] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setMoviesPerSlide(getMoviesPerSlide());
      setMovieSlide(0); // reset về đầu khi đổi kích thước
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxSlide = Math.max(0, movies.length - moviesPerSlide);
  const visibleMovies = movies.slice(movieSlide, movieSlide + moviesPerSlide);

  // Xử lý mở trailer
  const handleTrailerClick = (movie) => {
    setTrailerMovie(movie);
    setIsTrailerOpen(true);
  };
  const handleCloseTrailer = () => {
    setIsTrailerOpen(false);
    setTrailerMovie(null);
  };

  // Xử lý chuyển đổi link YouTube sang embed và tự động phát
  let trailerUrl = '';
  if (trailerMovie && trailerMovie.trailer) {
    trailerUrl = trailerMovie.trailer;
    if (trailerUrl.includes('youtube.com/watch?v=')) {
      const videoId = trailerUrl.split('v=')[1]?.split('&')[0];
      trailerUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
  }

  return (
    <section className="movies-section">
      <div className="container">
        {title && <div className="section-header"><h2>{title}</h2></div>}
        <div className="movies-slider-wrapper">
          <button className="movies-slider-nav prev" onClick={() => setMovieSlide(s => Math.max(0, s - 1))} disabled={movieSlide === 0}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 19L8.5 12L15.5 5" stroke="#222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="movies-slider">
            {visibleMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} onTrailerClick={handleTrailerClick} />
            ))}
          </div>
          <button className="movies-slider-nav next" onClick={() => setMovieSlide(s => Math.min(maxSlide, s + 1))} disabled={movieSlide === maxSlide}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 5L15.5 12L8.5 19" stroke="#222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        {showMoreButton && (
          <div className="movies-show-more-wrapper">
            <button className="movies-show-more-btn" onClick={onShowMore}>Xem thêm</button>
          </div>
        )}
      </div>
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={handleCloseTrailer}
        trailerUrl={trailerUrl}
        movieTitle={trailerMovie?.title || ''}
      />
    </section>
  );
};

export default MovieSlider; 