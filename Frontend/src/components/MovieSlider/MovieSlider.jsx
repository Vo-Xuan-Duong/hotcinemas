import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import MovieCard from '../MovieCard/MovieCard';
import TrailerModal from '../Trailer/TrailerModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import './MovieSlider.css';

const MovieSlider = ({ movies, title, showMoreButton = false, onShowMore }) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const handleSwiperInit = (swiper) => {
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSwiperUpdate = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handlePrevClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (swiperInstance && !isBeginning) {
      swiperInstance.slidePrev();
    }
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (swiperInstance && !isEnd) {
      swiperInstance.slideNext();
    }
  };

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
        {title && (
          <div className="section-header">
            <h2>{title}</h2>
            <div className="section-decoration"></div>
          </div>
        )}

        <div className="movies-slider-wrapper">
          <button
            className={`movies-slider-nav prev ${isBeginning ? 'disabled' : ''}`}
            onClick={handlePrevClick}
            disabled={isBeginning}
            aria-label="Previous movies"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 19L8.5 12L15.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="movies-slider">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              spaceBetween={20}
              slidesPerView={1}
              speed={800}
              grabCursor={true}
              centeredSlides={false}
              loop={movies.length > 4}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              effect="slide"
              onSwiper={handleSwiperInit}
              onSlideChange={handleSwiperUpdate}
              onReachBeginning={() => setIsBeginning(true)}
              onReachEnd={() => setIsEnd(true)}
              onFromEdge={() => {
                setIsBeginning(false);
                setIsEnd(false);
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                900: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1200: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1400: {
                  slidesPerView: 5,
                  spaceBetween: 25,
                }
              }}
              className="swiper-container"
            >
              {movies.map((movie) => (
                <SwiperSlide key={movie.id} className="swiper-slide-item">
                  <MovieCard
                    movie={movie}
                    onTrailerClick={handleTrailerClick}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button
            className={`movies-slider-nav next ${isEnd ? 'disabled' : ''}`}
            onClick={handleNextClick}
            disabled={isEnd}
            aria-label="Next movies"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 5L15.5 12L8.5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {showMoreButton && (
          <div className="movies-show-more-wrapper">
            <button className="movies-show-more-btn" onClick={onShowMore}>
              <span>Xem thêm</span>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
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