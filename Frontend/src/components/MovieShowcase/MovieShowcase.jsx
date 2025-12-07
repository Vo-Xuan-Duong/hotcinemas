import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  Rate,
  Avatar,
  Badge,
  Tooltip,
  Empty,
  Skeleton,
  Modal
} from 'antd';
import {
  PlayCircleOutlined,
  CalendarOutlined,
  FireOutlined,
  HeartOutlined,
  ShareAltOutlined,
  InfoCircleOutlined,
  RightOutlined,
  StarOutlined,
  ThunderboltOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined
} from '@ant-design/icons';
import {
  Play,
  Calendar,
  Heart,
  Share2,
  Info,
  Bookmark,
  Ticket,
  Star,
  Zap,
  Smile,
  Users
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './MovieShowcase.css';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const MovieShowcase = ({ movies = [], title = "Phim đặc sắc", loading = false, maxItems = 12, showFilters = true, enableSlider = true, category = 'all' }) => {
  const navigate = useNavigate();
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [likedMovies, setLikedMovies] = useState(new Set());
  const [bookmarkedMovies, setBookmarkedMovies] = useState(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = React.useRef(null);
  const [trailerModalVisible, setTrailerModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Movies are already filtered by parent component, just limit by maxItems
  const filteredMovies = movies.slice(0, maxItems);

  const handleTrailerClick = (movie, event) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedMovie(movie);
    setTrailerModalVisible(true);
  };

  const handleLike = (movieId, event) => {
    event.preventDefault();
    event.stopPropagation();
    const newLikedMovies = new Set(likedMovies);
    if (newLikedMovies.has(movieId)) {
      newLikedMovies.delete(movieId);
    } else {
      newLikedMovies.add(movieId);
    }
    setLikedMovies(newLikedMovies);
  };

  const handleBookmark = (movieId, event) => {
    event.preventDefault();
    event.stopPropagation();
    const newBookmarkedMovies = new Set(bookmarkedMovies);
    if (newBookmarkedMovies.has(movieId)) {
      newBookmarkedMovies.delete(movieId);
    } else {
      newBookmarkedMovies.add(movieId);
    }
    setBookmarkedMovies(newBookmarkedMovies);
  };

  const handleShare = (movie, event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Sharing movie:', movie.title);
  };

  // Slider navigation functions
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollAmount = containerWidth * 0.8; // Scroll 80% of container width
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollAmount = containerWidth * 0.8; // Scroll 80% of container width
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  React.useEffect(() => {
    // Force recheck after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      checkScrollButtons();
    }, 100);

    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);

    // Also check on scroll
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', checkScrollButtons);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', checkScrollButtons);
      }
    };
  }, [filteredMovies, enableSlider]);

  if (loading) {
    return (
      <div className="movie-showcase-antd">
        <div className="showcase-container">
          <Skeleton active paragraph={{ rows: 2 }} />
          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            {[...Array(Math.min(maxItems, 8))].map((_, index) => (
              <Col xs={12} sm={12} md={8} lg={4} xl={4} key={index} className="movie-col-custom">
                <Card loading className="movie-card-skeleton" />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    );
  }

  return (
    <section className="movie-showcase-antd">
      <div className="showcase-container">
        {/* Section Header */}
        <div className="showcase-header">
          <div className="header-content">
            <Space align="center" size="middle">
              <Avatar
                size="large"
                icon={<StarOutlined />}
                style={{ backgroundColor: '#ff6b35' }}
              />
              <div>
                <Title level={2} className="showcase-title">
                  {title}
                </Title>
                <Text type="secondary" className="showcase-subtitle">
                  Khám phá những bộ phim hay nhất đang chiếu tại HotCinemas
                </Text>
              </div>
            </Space>
          </div>
        </div>


        {/* Movies Grid/Slider */}
        {filteredMovies.length > 0 ? (
          <div className="movies-container">
            {enableSlider && (
              <>
                {canScrollLeft && (
                  <Button
                    type="text"
                    shape="circle"
                    size="large"
                    className="nav-btn nav-btn-left"
                    onClick={scrollLeft}
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>}
                  />
                )}
                {canScrollRight && (
                  <Button
                    type="text"
                    shape="circle"
                    size="large"
                    className="nav-btn nav-btn-right"
                    onClick={scrollRight}
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>}
                  />
                )}
              </>
            )}

            <div
              className={`movies-grid-container ${enableSlider ? 'slider-mode' : ''}`}
              ref={scrollContainerRef}
              onScroll={checkScrollButtons}
              key={`showcase-${category}-${filteredMovies.length}`}
            >
              <Row gutter={[12, 20]} className={`movies-grid ${enableSlider ? 'movies-grid-slider' : ''}`}>
                {filteredMovies.map((movie, index) => (
                  <Col
                    xs={12}
                    sm={12}
                    md={8}
                    lg={4}
                    xl={4}
                    key={movie.id || index}
                    className={`movie-col-custom ${enableSlider ? 'slider-col' : ''}`}
                  >
                    <Link to={`/movies/${movie.id}`} className="movie-card-link">
                      <Card
                        hoverable
                        className="movie-showcase-card"
                        bodyStyle={{ padding: 0 }}
                      >
                        {/* Movie Poster Container */}
                        <div
                          className="movie-poster-container"
                          onMouseEnter={() => setHoveredMovie(movie.id)}
                          onMouseLeave={() => setHoveredMovie(null)}
                        >
                          {/* Age Rating Badge */}
                          <div className="age-rating-badge">
                            {movie.ageLabel || "13+"}
                          </div>

                          {/* Rating Badge - Top Right */}
                          <div className="movie-rating-badge">
                            <Star size={12} fill="#faad14" color="#faad14" />
                            <span>{movie.rating || '8.5'}</span>
                          </div>

                          <img
                            src={movie.poster || `https://picsum.photos/300/450?random=${index}`}
                            alt={movie.title}
                            className="movie-poster"
                          />

                          {/* Hover Overlay */}
                          <div className={`movie-overlay ${hoveredMovie === movie.id ? 'active' : ''}`}>
                            <div className="overlay-content">
                              {/* Play Button */}
                              <Button
                                type="primary"
                                shape="circle"
                                size="large"
                                icon={<Play size={18} />}
                                className="play-button"
                                onClick={(e) => handleTrailerClick(movie, e)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Movie Info Section */}
                        <div className="movie-info-section">
                          {/* Movie Title */}
                          <div className="movie-title">
                            <Text strong ellipsis={{ tooltip: movie.title }}>
                              {movie.title}
                            </Text>
                          </div>

                          {/* Genre Tags */}
                          <div className="movie-genre">
                            {(() => {
                              // Handle both genres array and genre string
                              let genreList = [];
                              if (Array.isArray(movie.genres) && movie.genres.length > 0) {
                                // Handle array of objects {id, name} or array of strings
                                genreList = movie.genres.map(g => typeof g === 'object' ? g.name : g);
                              } else if (typeof movie.genre === 'string' && movie.genre) {
                                genreList = movie.genre.split(',').map(g => g.trim());
                              } else if (Array.isArray(movie.genre) && movie.genre.length > 0) {
                                genreList = movie.genre.map(g => typeof g === 'object' ? g.name : g);
                              } else {
                                genreList = ['Phim hay'];
                              }

                              // Display genres separated by commas
                              return genreList.slice(0, 3).join(', ');
                            })()}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" align="center">
                <Text>Không có phim nào để hiển thị</Text>
              </Space>
            }
            className="empty-state"
          />
        )}

        {/* Load More Section */}
        {filteredMovies.length > 0 && category !== 'top-rated' && (
          <div className="load-more-section">
            <Space direction="vertical" align="center" size="middle">
              <Button
                type="primary"
                size="large"
                // icon={<RightOutlined />}
                className="load-more-btn"
                onClick={() => {
                  // Navigate to movies page with different filter based on category
                  const filterMap = {
                    'upcoming': 'COMING_SOON',
                    'now-showing': 'NOW_SHOWING',
                    'top-rated': 'all', // Top rated không có status riêng, hiển thị tất cả
                    'all': 'all'
                  };
                  navigate('/movies', { state: { defaultFilter: filterMap[category] || 'all' } });
                }}>
                <span className="load-more-text-full">Xem thêm phim</span>
                <span className="load-more-text-short">Xem thêm</span>
              </Button>
              {/* <Text type="secondary">
                Hiển thị {filteredMovies.length} / {movies.length} phim
              </Text> */}
            </Space>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <Modal
        title={<span><PlayCircleOutlined /> Trailer - {selectedMovie?.title}</span>}
        open={trailerModalVisible}
        onCancel={() => {
          setTrailerModalVisible(false);
          setSelectedMovie(null);
        }}
        footer={null}
        width={900}
        centered
        destroyOnClose
      >
        {(selectedMovie?.trailerUrl || selectedMovie?.trailer) && (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '8px'
              }}
              src={`https://www.youtube.com/embed/${getYouTubeId(selectedMovie.trailerUrl || selectedMovie.trailer)}?autoplay=1`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Modal>
    </section >
  );
};

// Helper function to extract YouTube video ID
const getYouTubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
};

export default MovieShowcase;
