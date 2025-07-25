import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import MovieCard from '../MovieCard/MovieCard';
import TrailerModal from '../Trailer/TrailerModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './MovieSlider.css';

const MovieSliderTest = ({ movies, title, showMoreButton = false, onShowMore }) => {
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [trailerMovie, setTrailerMovie] = useState(null);
    const [swiper, setSwiper] = useState(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (swiper) {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
        }
    }, [swiper]);

    // Dynamic button size based on screen width
    const getButtonSize = () => {
        if (windowWidth <= 320) return { size: 30, fontSize: '0.7rem' };
        if (windowWidth <= 375) return { size: 32, fontSize: '0.75rem' };
        if (windowWidth <= 480) return { size: 34, fontSize: '0.8rem' };
        if (windowWidth <= 600) return { size: 36, fontSize: '0.9rem' };
        if (windowWidth <= 768) return { size: 38, fontSize: '0.9rem' };
        if (windowWidth <= 900) return { size: 40, fontSize: '1rem' };
        return { size: 42, fontSize: '1.1rem' };
    };

    const buttonStyle = getButtonSize();

    // Dynamic margin based on screen width
    const getSliderMargin = () => {
        if (windowWidth <= 320) return '0 0.1rem';
        if (windowWidth <= 375) return '0 0.25rem';
        if (windowWidth <= 480) return '0 0.5rem';
        if (windowWidth <= 768) return '0 0.8rem';
        return '0 1rem';
    };

    const handleTrailerClick = (movie) => {
        setTrailerMovie(movie);
        setIsTrailerOpen(true);
    };

    const handleCloseTrailer = () => {
        setIsTrailerOpen(false);
        setTrailerMovie(null);
    };

    const handlePrevClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Prev clicked, swiper:', swiper);
        if (swiper && !isBeginning) {
            swiper.slidePrev();
        }
    };

    const handleNextClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Next clicked, swiper:', swiper);
        if (swiper && !isEnd) {
            swiper.slideNext();
        }
    };

    const onSwiperInit = (swiperInstance) => {
        console.log('Swiper initialized:', swiperInstance);
        setSwiper(swiperInstance);
        setIsBeginning(swiperInstance.isBeginning);
        setIsEnd(swiperInstance.isEnd);
    };

    const onSlideChange = (swiperInstance) => {
        setIsBeginning(swiperInstance.isBeginning);
        setIsEnd(swiperInstance.isEnd);
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
                        style={{
                            background: isBeginning ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: `${buttonStyle.size}px`,
                            height: `${buttonStyle.size}px`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isBeginning ? 'not-allowed' : 'pointer',
                            fontSize: buttonStyle.fontSize
                        }}
                    >
                        &#8249;
                    </button>

                    <div className="movies-slider" style={{
                        flex: 1,
                        margin: getSliderMargin()
                    }}>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={4}
                            speed={400}
                            grabCursor={true}
                            touchRatio={1}
                            touchAngle={45}
                            threshold={5}
                            longSwipesRatio={0.5}
                            longSwipesMs={300}
                            followFinger={true}
                            allowTouchMove={true}
                            simulateTouch={true}
                            onSwiper={onSwiperInit}
                            onSlideChange={onSlideChange}
                            breakpoints={{
                                240: {
                                    slidesPerView: 1,
                                    spaceBetween: 8,
                                    centeredSlides: false
                                },
                                320: {
                                    slidesPerView: 1,
                                    spaceBetween: 10,
                                    centeredSlides: false
                                },
                                480: {
                                    slidesPerView: 1.2,
                                    spaceBetween: 12,
                                    centeredSlides: false
                                },
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 15
                                },
                                768: {
                                    slidesPerView: 2.5,
                                    spaceBetween: 15
                                },
                                900: {
                                    slidesPerView: 3,
                                    spaceBetween: 18
                                },
                                1200: {
                                    slidesPerView: 4,
                                    spaceBetween: 20
                                }
                            }}
                        >
                            {movies.map((movie) => (
                                <SwiperSlide key={movie.id}>
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
                        style={{
                            background: isEnd ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: `${buttonStyle.size}px`,
                            height: `${buttonStyle.size}px`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isEnd ? 'not-allowed' : 'pointer',
                            fontSize: buttonStyle.fontSize
                        }}
                    >
                        &#8250;
                    </button>
                </div>

                {showMoreButton && (
                    <div className="movies-show-more-wrapper">
                        <button className="movies-show-more-btn" onClick={onShowMore}>
                            <span>Xem thêm</span>
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

export default MovieSliderTest;
