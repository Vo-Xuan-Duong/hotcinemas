import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Card, Button, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    PlayCircleOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    StarFilled,
    LeftOutlined,
    RightOutlined,
    EyeOutlined
} from '@ant-design/icons';
import './MovieCarousel.css';

const { Meta } = Card;

const MovieCarousel = ({ movies = [], title = 'Movies', onMovieClick, loading = false }) => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Touch support for mobile swipe
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Memoize filtered movies for performance
    const validMovies = useMemo(() => {
        return movies.filter(movie => movie && movie.id);
    }, [movies]);

    // Handle movie card click to navigate to detail page
    const handleMovieClick = useCallback((movie) => {
        if (movie && movie.id) {
            // If there's a custom onMovieClick handler, call it first
            if (onMovieClick) {
                onMovieClick(movie);
            }
            // Navigate to movie detail page
            navigate(`/movies/${movie.id}`);
        }
    }, [navigate, onMovieClick]);

    const checkScrollButtons = useCallback(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollLeft = container.scrollLeft;
            const maxScrollLeft = container.scrollWidth - container.clientWidth;

            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < maxScrollLeft - 10);

            // Calculate scroll progress
            const progress = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * 100 : 0;
            setScrollProgress(progress);
        }
    }, []);

    const scroll = useCallback((direction) => {
        const container = scrollContainerRef.current;
        if (container && !isScrolling) {
            setIsScrolling(true);
            setHasInteracted(true);

            // Calculate scroll amount for 4 cards visible (1200px container)
            const cardWidth = 280;
            const gap = 24;
            const cardsToScroll = 2; // Scroll 2 cards at a time for smooth navigation
            const scrollAmount = (cardWidth + gap) * cardsToScroll;

            const newScrollLeft = direction === 'left'
                ? Math.max(0, container.scrollLeft - scrollAmount)
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });

            setTimeout(() => setIsScrolling(false), 500);
        }
    }, [isScrolling]);

    // Touch handlers for mobile swipe
    const handleTouchStart = useCallback((e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    }, []);

    const handleTouchMove = useCallback((e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && canScrollRight) {
            scroll('right');
        }
        if (isRightSwipe && canScrollLeft) {
            scroll('left');
        }
    }, [touchStart, touchEnd, canScrollLeft, canScrollRight, scroll]);

    const handleWheelScroll = useCallback((e) => {
        if (!hasInteracted) return;

        // Enhanced wheel scrolling for better UX
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
            e.preventDefault();
            const container = scrollContainerRef.current;
            if (container) {
                const scrollMultiplier = 2; // Smooth scrolling speed
                const scrollAmount = (e.deltaX || e.deltaY) * scrollMultiplier;

                // Smooth scrolling with bounds checking
                const maxScroll = container.scrollWidth - container.clientWidth;
                const newScrollLeft = Math.max(0, Math.min(maxScroll, container.scrollLeft + scrollAmount));

                container.scrollTo({
                    left: newScrollLeft,
                    behavior: 'smooth'
                });
            }
        } else if (Math.abs(e.deltaY) > 10) {
            // Vertical scroll can trigger horizontal scroll
            e.preventDefault();
            const container = scrollContainerRef.current;
            if (container) {
                const scrollAmount = e.deltaY * 1.5;
                container.scrollLeft += scrollAmount;
            }
        }
    }, [hasInteracted]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowLeft' && canScrollLeft) {
            e.preventDefault();
            scroll('left');
        } else if (e.key === 'ArrowRight' && canScrollRight) {
            e.preventDefault();
            scroll('right');
        }
    }, [canScrollLeft, canScrollRight, scroll]);

    useEffect(() => {
        checkScrollButtons();

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollButtons, { passive: true });
            container.addEventListener('wheel', handleWheelScroll, { passive: false });

            return () => {
                container.removeEventListener('scroll', checkScrollButtons);
                container.removeEventListener('wheel', handleWheelScroll);
            };
        }
    }, [checkScrollButtons, handleWheelScroll]);

    if (loading) {
        return (
            <div className="movie-carousel-container">
                <div className="carousel-header">
                    <div className="title-section">
                        <h2 className="carousel-title">{title}</h2>
                    </div>
                </div>
                <div className="loading-placeholder">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="loading-card" />
                    ))}
                </div>
            </div>
        );
    }

    if (!validMovies.length) {
        return (
            <div className="movie-carousel-container">
                <div className="carousel-header">
                    <div className="title-section">
                        <h2 className="carousel-title">{title}</h2>
                    </div>
                </div>
                <div className="empty-carousel">
                    <p>Không có phim nào để hiển thị</p>
                </div>
            </div>
        );
    }

    return (
        <div className="movie-carousel-container">
            <div className="carousel-header">
                <div className="title-section">
                    <h2 className="carousel-title">
                        {title}
                        <span className="movie-count">({validMovies.length})</span>
                    </h2>
                    {scrollProgress > 0 && (
                        <div className="scroll-progress" role="progressbar" aria-label="Tiến độ cuộn">
                            <div
                                className="progress-bar"
                                style={{ width: `${Math.max(10, scrollProgress)}%` }}
                            />
                        </div>
                    )}
                </div>
                <div className="carousel-controls">
                    <Button
                        type="link"
                        className="view-all-btn"
                        icon={<EyeOutlined />}
                        aria-label="Xem tất cả phim"
                    >
                        Xem tất cả
                    </Button>
                </div>
            </div>

            <div className="carousel-wrapper-with-nav">
                {/* Left Navigation Button */}
                <Button
                    type="text"
                    icon={<LeftOutlined />}
                    className={`nav-btn nav-btn-left ${!canScrollLeft || isScrolling ? 'disabled' : ''}`}
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft || isScrolling}
                    size="large"
                    aria-label="Xem phim trước"
                />

                <div
                    className={`movie-carousel-wrapper ${isScrolling ? 'scrolling' : ''}`}
                    ref={scrollContainerRef}
                    onWheel={handleWheelScroll}
                    onKeyDown={handleKeyDown}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    tabIndex={0}
                    role="list"
                    aria-label={`Danh sách ${title.toLowerCase()}`}
                >
                    <div className="movie-carousel-track">
                        {validMovies.map((movie, index) => (
                            <div
                                key={movie.id}
                                className="movie-carousel-item"
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                                role="listitem"
                            >
                                <Card
                                    hoverable
                                    className="movie-carousel-card"
                                    onClick={() => handleMovieClick(movie)}
                                    style={{ cursor: 'pointer' }}
                                    cover={
                                        <div className="movie-poster-wrapper">
                                            <img
                                                alt={`Poster phim ${movie.title}`}
                                                src={movie.poster}
                                                className="movie-poster-img"
                                                loading={index < 4 ? 'eager' : 'lazy'}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/280x420/1a1a1a/666?text=Không+có+poster';
                                                }}
                                            />
                                            <div className="movie-overlay">
                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    size="large"
                                                    icon={<PlayCircleOutlined />}
                                                    className="play-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent card click
                                                        onMovieClick?.(movie);
                                                    }}
                                                    aria-label={`Phát trailer phim ${movie.title}`}
                                                />
                                            </div>
                                            {movie.rating && (
                                                <div className="movie-rating-badge">
                                                    <StarFilled />
                                                    <span>{movie.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                    }
                                >
                                    <Meta
                                        title={
                                            <div className="movie-card-title" title={movie.title}>
                                                {movie.title}
                                            </div>
                                        }
                                        description={
                                            <div className="movie-card-info">
                                                {(movie.genres?.length > 0 || movie.genre) && (
                                                    <div className="movie-genres">
                                                        {movie.genres ? (
                                                            movie.genres.map((genre, index) => (
                                                                <Tag key={index} size="small" color="blue">
                                                                    {genre}
                                                                </Tag>
                                                            ))
                                                        ) : (
                                                            // Xử lý trường hợp genre là chuỗi dài
                                                            movie.genre.split(',').map((genre, index) => (
                                                                <Tag key={index} size="small" color="blue">
                                                                    {genre.trim()}
                                                                </Tag>
                                                            ))
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    />
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Navigation Button */}
                <Button
                    type="text"
                    icon={<RightOutlined />}
                    className={`nav-btn nav-btn-right ${!canScrollRight || isScrolling ? 'disabled' : ''}`}
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight || isScrolling}
                    size="large"
                    aria-label="Xem phim tiếp theo"
                />
            </div>
        </div>
    );
};

export default React.memo(MovieCarousel);
