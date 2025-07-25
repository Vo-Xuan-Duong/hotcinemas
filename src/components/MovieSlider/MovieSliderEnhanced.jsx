import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import MovieCard from '../MovieCard/MovieCard';
import TrailerModal from '../Trailer/TrailerModal';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './MovieSliderEnhanced.css';

const MovieSliderEnhanced = ({
    movies,
    title,
    showMoreButton = false,
    onShowMore,
    isLoading = false
}) => {
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [trailerMovie, setTrailerMovie] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(4);
    const [isSliderReady, setIsSliderReady] = useState(false);
    const sliderRef = useRef(null);

    useEffect(() => {
        // Delay để slider render hoàn chỉnh
        const timer = setTimeout(() => {
            setIsSliderReady(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Cấu hình slider với enhanced settings
    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 600,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        lazyLoad: 'ondemand',
        swipeToSlide: true,
        touchThreshold: 10,
        beforeChange: (oldIndex, newIndex) => {
            setCurrentSlide(newIndex);
        },
        afterChange: (currentSlide) => {
            setCurrentSlide(currentSlide);
        },
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    afterChange: (currentSlide) => {
                        setCurrentSlide(currentSlide);
                        setSlidesToShow(3);
                    }
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    afterChange: (currentSlide) => {
                        setCurrentSlide(currentSlide);
                        setSlidesToShow(2);
                    }
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true,
                    centerPadding: '20px',
                    afterChange: (currentSlide) => {
                        setCurrentSlide(currentSlide);
                        setSlidesToShow(1);
                    }
                }
            }
        ]
    };

    // Tính toán trạng thái disabled cho navigation buttons
    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide >= movies.length - slidesToShow;

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

    if (isLoading) {
        return (
            <section className="movies-section-enhanced">
                <div className="container">
                    <div className="loading-skeleton">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-slider">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="skeleton-card"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="movies-section-enhanced">
            <div className="container">
                {title && (
                    <div className="section-header-enhanced">
                        <h2>{title}</h2>
                        <div className="section-decoration"></div>
                    </div>
                )}
                <div className={`movies-slider-wrapper-enhanced ${!isSliderReady ? 'loading' : ''}`}>
                    <button
                        className="movies-slider-nav-enhanced prev"
                        onClick={() => sliderRef.current?.slickPrev()}
                        disabled={isFirstSlide}
                        aria-label="Previous movies"
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.5 19L8.5 12L15.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <div className="movies-slider-enhanced">
                        <Slider ref={sliderRef} {...sliderSettings}>
                            {movies.map((movie, index) => (
                                <div key={movie.id} className="slider-item-enhanced">
                                    <MovieCard
                                        movie={movie}
                                        onTrailerClick={handleTrailerClick}
                                        priority={index < 4} // Load first 4 images with priority
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>

                    <button
                        className="movies-slider-nav-enhanced next"
                        onClick={() => sliderRef.current?.slickNext()}
                        disabled={isLastSlide}
                        aria-label="Next movies"
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.5 5L15.5 12L8.5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Progress indicator */}
                <div className="slider-progress">
                    <div
                        className="slider-progress-bar"
                        style={{
                            width: `${((currentSlide + slidesToShow) / movies.length) * 100}%`
                        }}
                    ></div>
                </div>

                {showMoreButton && (
                    <div className="movies-show-more-wrapper-enhanced">
                        <button className="movies-show-more-btn-enhanced" onClick={onShowMore}>
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

export default MovieSliderEnhanced;
