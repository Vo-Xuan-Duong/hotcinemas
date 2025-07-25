import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import MovieCard from '../MovieCard/MovieCard';
import TrailerModal from '../Trailer/TrailerModal';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './MovieSliderAdvanced.css';

const MovieSliderAdvanced = ({
    movies,
    title,
    showMoreButton = false,
    onShowMore,
    autoplay = false,
    autoplaySpeed = 3000,
    showDots = false,
    infinite = false
}) => {
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [trailerMovie, setTrailerMovie] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(4);
    const sliderRef = useRef(null);

    // Cấu hình slider nâng cao
    const sliderSettings = {
        dots: showDots,
        infinite: infinite,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        autoplay: autoplay,
        autoplaySpeed: autoplaySpeed,
        pauseOnHover: true,
        beforeChange: (oldIndex, newIndex) => {
            setCurrentSlide(newIndex);
        },
        afterChange: (currentSlide) => {
            setCurrentSlide(currentSlide);
        },
        responsive: [
            {
                breakpoint: 1024,
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
                    afterChange: (currentSlide) => {
                        setCurrentSlide(currentSlide);
                        setSlidesToShow(1);
                    }
                }
            }
        ]
    };

    // Tính toán trạng thái disabled cho navigation buttons
    const isFirstSlide = currentSlide === 0 && !infinite;
    const isLastSlide = currentSlide >= movies.length - slidesToShow && !infinite;

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
        <section className="movies-section-advanced">
            <div className="container">
                {title && <div className="section-header"><h2>{title}</h2></div>}
                <div className="movies-slider-wrapper-advanced">
                    <button
                        className="movies-slider-nav prev"
                        onClick={() => sliderRef.current?.slickPrev()}
                        disabled={isFirstSlide}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.5 19L8.5 12L15.5 5" stroke="#222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <div className="movies-slider-advanced">
                        <Slider ref={sliderRef} {...sliderSettings}>
                            {movies.map(movie => (
                                <div key={movie.id} className="slider-item-advanced">
                                    <MovieCard movie={movie} onTrailerClick={handleTrailerClick} />
                                </div>
                            ))}
                        </Slider>
                    </div>

                    <button
                        className="movies-slider-nav next"
                        onClick={() => sliderRef.current?.slickNext()}
                        disabled={isLastSlide}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.5 5L15.5 12L8.5 19" stroke="#222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Custom indicator dots */}
                {showDots && (
                    <div className="custom-dots">
                        {Array.from({ length: Math.ceil(movies.length / slidesToShow) }).map((_, index) => (
                            <button
                                key={index}
                                className={`custom-dot ${currentSlide === index ? 'active' : ''}`}
                                onClick={() => sliderRef.current?.slickGoTo(index)}
                            />
                        ))}
                    </div>
                )}

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

export default MovieSliderAdvanced;
