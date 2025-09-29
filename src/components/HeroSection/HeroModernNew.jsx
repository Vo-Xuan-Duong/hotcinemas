import React, { useState, useEffect } from 'react';
import {
    Button,
    Rate,
    Tag
} from 'antd';
import {
    PlayCircleOutlined,
    CalendarOutlined,
    FireOutlined,
    ThunderboltOutlined,
    TrophyOutlined,
    EyeOutlined
} from '@ant-design/icons';
import {
    Play,
    Calendar,
    Clock,
    Star,
    Heart,
    Share2,
    Eye,
    Bell,
    BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './HeroModern.css';

const HeroModern = ({ movies = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Featured movies cho hero carousel
    const featuredMovies = movies.slice(0, 5).map((movie, index) => ({
        ...movie,
        id: movie.id || index + 1,
        backdrop: movie.backdrop || movie.poster || `https://picsum.photos/1400/800?random=${index}`,
        tagline: movie.tagline || "Trải nghiệm điện ảnh đỉnh cao",
        genre: movie.genre || "Phim hay",
        duration: movie.duration || Math.floor(Math.random() * 60 + 90),
        releaseYear: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 2024
    }));

    // Auto flip every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsFlipped(prev => !prev);

            // Change slide when flipping back to front
            setTimeout(() => {
                if (isFlipped) {
                    setCurrentSlide(prev => (prev + 1) % featuredMovies.length);
                }
            }, 600); // Half way through flip animation
        }, 4000);

        return () => clearInterval(interval);
    }, [featuredMovies.length, isFlipped]);

    const currentMovie = featuredMovies[currentSlide] || {
        title: "HotCinemas",
        overview: "Khám phá thế giới điện ảnh với chất lượng hình ảnh và âm thanh vượt trội",
        tagline: "Trải nghiệm điện ảnh đỉnh cao",
        rating: 9.5,
        genre: "Premium Cinema Experience",
        backdrop: "https://picsum.photos/1400/800?random=hero",
        poster: "https://picsum.photos/400/600?random=poster",
        duration: 120,
        releaseYear: 2024
    };

    // Next movie for back side
    const nextMovie = featuredMovies[(currentSlide + 1) % featuredMovies.length] || currentMovie;

    return (
        <div className="hero-modern">
            {/* Background with dynamic overlay */}
            <div className="hero-background-modern">
                <div
                    className="hero-backdrop-modern"
                    style={{
                        backgroundImage: `url(${isFlipped ? nextMovie.backdrop : currentMovie.backdrop})`,
                    }}
                />
                <div className="hero-gradient-overlay" />
                <div className="hero-pattern-overlay" />
            </div>

            <div className="hero-content-container">
                <div className={`hero-main-wrapper ${isFlipped ? 'flipped' : ''}`}>
                    {/* Front Side */}
                    <div className="flip-card-front">
                        {/* Left Section - Current Movie Info */}
                        <div className="hero-left-section">
                            {/* Badges */}
                            <div className="hero-badges-modern">
                                <span className="badge-hot">
                                    <FireOutlined />
                                    ĐANG HOT
                                </span>
                                <span className="badge-premium">
                                    <TrophyOutlined />
                                    PREMIUM
                                </span>
                            </div>

                            {/* Main Title */}
                            <div className="hero-title-modern">
                                <h1 className="movie-title">
                                    {currentMovie.title}
                                </h1>
                                <p className="movie-tagline">
                                    {currentMovie.tagline}
                                </p>
                            </div>

                            {/* Movie Meta */}
                            <div className="hero-meta-modern">
                                <div className="meta-left">
                                    <div className="rating-section">
                                        <Rate
                                            disabled
                                            defaultValue={Math.floor(parseFloat(currentMovie.rating) / 2)}
                                            style={{ fontSize: '16px' }}
                                        />
                                        <span className="rating-text">
                                            <strong>{currentMovie.rating}</strong> IMDb
                                        </span>
                                    </div>
                                </div>
                                <div className="meta-right">
                                    <div className="movie-details">
                                        <span className="detail-item">
                                            <ThunderboltOutlined />
                                            {currentMovie.genre}
                                        </span>
                                        <span className="detail-item">
                                            <Clock size={14} />
                                            {currentMovie.duration} phút
                                        </span>
                                        <span className="detail-item">
                                            <Calendar size={14} />
                                            {currentMovie.releaseYear}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="hero-description-modern">
                                <p>{currentMovie.overview}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="hero-actions-modern">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<Play size={18} />}
                                    className="btn-watch-trailer-modern"
                                >
                                    XEM TRAILER
                                </Button>

                                <Button
                                    size="large"
                                    className="btn-explore-modern"
                                >
                                    <Link to="/movies">KHÁM PHÁ PHIM</Link>
                                </Button>

                                <div className="quick-actions-modern">
                                    <Button
                                        shape="circle"
                                        icon={<Heart size={16} />}
                                        title="Yêu thích"
                                        className="quick-btn"
                                    />
                                    <Button
                                        shape="circle"
                                        icon={<Share2 size={16} />}
                                        title="Chia sẻ"
                                        className="quick-btn"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Movie Poster */}
                        <div className="hero-right-section">
                            <div className="poster-container-modern">
                                <div className="poster-image-container">
                                    <img
                                        src={currentMovie.poster || currentMovie.backdrop}
                                        alt={currentMovie.title}
                                        className="poster-image"
                                    />
                                    <div className="poster-overlay">
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            size="large"
                                            icon={<Play size={24} />}
                                            className="poster-play-btn"
                                        />
                                    </div>
                                    <div className="poster-rating-badge">
                                        <Star size={14} fill="#faad14" stroke="#faad14" />
                                        <span>{currentMovie.rating}</span>
                                    </div>
                                </div>

                                <div className="poster-info">
                                    <h4>{currentMovie.title}</h4>
                                    <div className="poster-meta">
                                        <Tag color="volcano">{currentMovie.genre}</Tag>
                                        <span className="duration">
                                            <Clock size={12} />
                                            {currentMovie.duration}p
                                        </span>
                                    </div>
                                    <Button
                                        type="primary"
                                        danger
                                        size="large"
                                        block
                                        className="btn-book-tickets"
                                    >
                                        ĐẶT VÉ NGAY
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back Side */}
                    <div className="flip-card-back">
                        {/* Left Section - Next Movie Preview */}
                        <div className="hero-left-section">
                            {/* Badges */}
                            <div className="hero-badges-modern">
                                <span className="badge-coming">
                                    <CalendarOutlined />
                                    SẮP CHIẾU
                                </span>
                                <span className="badge-preview">
                                    <EyeOutlined />
                                    PREVIEW
                                </span>
                            </div>

                            {/* Main Title */}
                            <div className="hero-title-modern">
                                <h1 className="movie-title">
                                    {nextMovie.title}
                                </h1>
                                <p className="movie-tagline">
                                    Đón chờ những tác phẩm đỉnh cao
                                </p>
                            </div>

                            {/* Movie Meta */}
                            <div className="hero-meta-modern">
                                <div className="meta-left">
                                    <div className="rating-section">
                                        <Rate
                                            disabled
                                            defaultValue={Math.floor(parseFloat(nextMovie.rating) / 2)}
                                            style={{ fontSize: '16px' }}
                                        />
                                        <span className="rating-text">
                                            <strong>{nextMovie.rating}</strong> Expected
                                        </span>
                                    </div>
                                </div>
                                <div className="meta-right">
                                    <div className="movie-details">
                                        <span className="detail-item">
                                            <ThunderboltOutlined />
                                            {nextMovie.genre}
                                        </span>
                                        <span className="detail-item">
                                            <Clock size={14} />
                                            {nextMovie.duration} phút
                                        </span>
                                        <span className="detail-item">
                                            <Calendar size={14} />
                                            {nextMovie.releaseYear}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="hero-description-modern">
                                <p>{nextMovie.overview}</p>
                                <p className="extra-info">Đặt vé trước để nhận ưu đãi đặc biệt!</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="hero-actions-modern">
                                <Button
                                    type="default"
                                    size="large"
                                    icon={<Eye size={18} />}
                                    className="btn-preview-modern"
                                >
                                    XEM TRƯỚC
                                </Button>

                                <Button
                                    type="primary"
                                    size="large"
                                    className="btn-book-advance-modern"
                                >
                                    ĐẶT VÉ TRƯỚC
                                </Button>

                                <div className="quick-actions-modern">
                                    <Button
                                        shape="circle"
                                        icon={<Bell size={16} />}
                                        title="Nhận thông báo"
                                        className="quick-btn"
                                    />
                                    <Button
                                        shape="circle"
                                        icon={<BookOpen size={16} />}
                                        title="Đọc thêm"
                                        className="quick-btn"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Next Movie Poster */}
                        <div className="hero-right-section">
                            <div className="poster-container-modern">
                                <div className="poster-image-container">
                                    <img
                                        src={nextMovie.poster || nextMovie.backdrop}
                                        alt={nextMovie.title}
                                        className="poster-image"
                                    />
                                    <div className="poster-overlay">
                                        <Button
                                            type="default"
                                            shape="circle"
                                            size="large"
                                            icon={<Eye size={24} />}
                                            className="poster-preview-btn"
                                        />
                                    </div>
                                    <div className="poster-rating-badge">
                                        <Star size={14} fill="#faad14" stroke="#faad14" />
                                        <span>{nextMovie.rating}</span>
                                    </div>
                                </div>

                                <div className="poster-info">
                                    <h4>{nextMovie.title}</h4>
                                    <div className="poster-meta">
                                        <Tag color="blue">{nextMovie.genre}</Tag>
                                        <span className="duration">
                                            <Clock size={12} />
                                            {nextMovie.duration}p
                                        </span>
                                    </div>
                                    <Button
                                        type="default"
                                        size="large"
                                        block
                                        className="btn-notify-me"
                                    >
                                        THÔNG BÁO KHI CHIẾU
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroModern;
