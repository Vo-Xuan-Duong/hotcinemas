import React, { createContext, useContext, useState, useCallback } from 'react';
import TrailerModal from '../components/MovieDetail/TrailerModal';

const TrailerModalContext = createContext();

export const useTrailerModal = () => useContext(TrailerModalContext);

export const TrailerModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [movie, setMovie] = useState(null);

  const openTrailer = useCallback((movieData) => {
    setMovie(movieData);
    setIsOpen(true);
  }, []);

  const closeTrailer = useCallback(() => {
    setIsOpen(false);
    setMovie(null);
  }, []);

  // Xử lý chuyển đổi link YouTube sang embed và tự động phát
  let trailerUrl = '';
  if (movie && movie.trailer) {
    trailerUrl = movie.trailer;
    if (trailerUrl.includes('youtube.com/watch?v=')) {
      const videoId = trailerUrl.split('v=')[1]?.split('&')[0];
      trailerUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
  }

  return (
    <TrailerModalContext.Provider value={{ isOpen, movie, openTrailer, closeTrailer }}>
      {children}
      <TrailerModal
        isOpen={isOpen}
        onClose={closeTrailer}
        trailerUrl={trailerUrl}
        movieTitle={movie?.title || ''}
      />
    </TrailerModalContext.Provider>
  );
}; 