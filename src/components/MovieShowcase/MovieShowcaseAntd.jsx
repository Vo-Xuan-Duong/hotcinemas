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
  Skeleton
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
import { Link } from 'react-router-dom';
import './MovieShowcaseAntd.css';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const MovieShowcaseAntd = ({ movies = [], title = "Phim đặc sắc", loading = false, maxItems = 12, showFilters = true, enableSlider = true }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [likedMovies, setLikedMovies] = useState(new Set());
  const [bookmarkedMovies, setBookmarkedMovies] = useState(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = React.useRef(null);

  const categories = [
    {
      id: 'all',
      name: 'Tất cả',
      icon: <FireOutlined />,
      color: 'volcano',
      count: movies.length
    },
    {
      id: 'action',
      name: 'Hành động',
      icon: <ThunderboltOutlined />,
      color: 'red',
      count: 15
    },
    {
      id: 'drama',
      name: 'Tâm lý',
      icon: <SmileOutlined />,
      color: 'blue',
      count: 12
    },
    {
      id: 'comedy',
      name: 'Hài kịch',
      icon: <SmileOutlined />,
      color: 'orange',
      count: 8
    },
    {
      id: 'horror',
      name: 'Kinh dị',
      icon: <MehOutlined />,
      color: 'purple',
      count: 6
    },
    {
      id: 'romance',
      name: 'Lãng mạn',
      icon: <HeartOutlined />,
      color: 'magenta',
      count: 10
    }
  ];

  // Filter movies based on category
  const filteredMovies = activeCategory === 'all'
    ? movies.slice(0, maxItems)
    : movies.filter(movie =>
      movie.genre?.toLowerCase().includes(activeCategory) ||
      movie.category?.toLowerCase().includes(activeCategory)
    ).slice(0, maxItems);

  const handleTrailerClick = (movie, event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Playing trailer for:', movie.title);
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
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [filteredMovies]);

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

        {/* Category Filters */}
        {/* {showFilters && (
          <div className="category-filters">
            <Space size="middle" wrap>
              {categories.map(category => (
                <Badge
                  key={category.id}
                  count={category.count}
                  size="small"
                  color={category.color}
                  showZero={false}
                >
                  <Button
                    type={activeCategory === category.id ? 'primary' : 'default'}
                    icon={category.icon}
                    className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                    style={{
                      borderColor: activeCategory === category.id ? '#ff6b35' : undefined,
                      backgroundColor: activeCategory === category.id ? '#ff6b35' : undefined
                    }}
                  >
                    {category.name}
                  </Button>
                </Badge>
              ))}
            </Space>
          </div>
        )} */}

        {/* Movies Grid/Slider */}
        {filteredMovies.length > 0 ? (
          <div className="movies-container">
            {enableSlider && (
              <>
                <Button
                  type="text"
                  shape="circle"
                  size="large"
                  className={`nav-btn nav-btn-left ${!canScrollLeft ? 'disabled' : ''}`}
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>}
                />
                <Button
                  type="text"
                  shape="circle"
                  size="large"
                  className={`nav-btn nav-btn-right ${!canScrollRight ? 'disabled' : ''}`}
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>}
                />
              </>
            )}

            <div
              className={`movies-grid-container ${enableSlider ? 'slider-mode' : ''}`}
              ref={scrollContainerRef}
              onScroll={checkScrollButtons}
            >
              <Row gutter={[16, 24]} className="movies-grid" style={{ flexWrap: enableSlider ? 'nowrap' : 'wrap' }}>
                {filteredMovies.map((movie, index) => (
                  <Col
                    xs={enableSlider ? { flex: '0 0 calc(50% - 8px)' } : 12}
                    sm={enableSlider ? { flex: '0 0 calc(50% - 8px)' } : 12}
                    md={enableSlider ? { flex: '0 0 calc(33.333% - 10px)' } : 8}
                    lg={enableSlider ? { flex: '0 0 calc(20% - 12px)' } : 4}
                    xl={enableSlider ? { flex: '0 0 calc(20% - 12px)' } : 4}
                    key={movie.id || index}
                    className={`movie-col-custom ${enableSlider ? 'slider-col' : ''}`}
                  >
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

                            {/* Quick Actions */}
                            <div className="quick-actions-row">
                              <Tooltip title="Yêu thích">
                                <Button
                                  type="text"
                                  shape="circle"
                                  size="small"
                                  icon={
                                    <Heart
                                      size={14}
                                      fill={likedMovies.has(movie.id) ? "#ff4d4f" : "none"}
                                      color={likedMovies.has(movie.id) ? "#ff4d4f" : "#fff"}
                                    />
                                  }
                                  className="quick-action-btn"
                                  onClick={(e) => handleLike(movie.id, e)}
                                />
                              </Tooltip>

                              <Tooltip title="Lưu lại">
                                <Button
                                  type="text"
                                  shape="circle"
                                  size="small"
                                  icon={
                                    <Bookmark
                                      size={14}
                                      fill={bookmarkedMovies.has(movie.id) ? "#1890ff" : "none"}
                                      color={bookmarkedMovies.has(movie.id) ? "#1890ff" : "#fff"}
                                    />
                                  }
                                  className="quick-action-btn"
                                  onClick={(e) => handleBookmark(movie.id, e)}
                                />
                              </Tooltip>

                              <Tooltip title="Chia sẻ">
                                <Button
                                  type="text"
                                  shape="circle"
                                  size="small"
                                  icon={<Share2 size={14} color="#fff" />}
                                  className="quick-action-btn"
                                  onClick={(e) => handleShare(movie, e)}
                                />
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Movie Info Section */}
                      <div className="movie-info-section">
                        {/* Movie Title */}
                        <div className="movie-title">
                          <Link to={`/movies/${movie.id}`} className="title-link">
                            <Text strong ellipsis={{ tooltip: movie.title }}>
                              {movie.title}
                            </Text>
                          </Link>
                        </div>

                        {/* Genre Tag */}
                        <div className="movie-genre">
                          <Tag color="blue" size="small">
                            {movie.genre ?
                              (movie.genre.length > 15 ?
                                movie.genre.split(',')[0].trim() :
                                movie.genre
                              ) : 'Phim hay'}
                          </Tag>
                        </div>

                        {/* Movie Details */}
                        <div className="movie-details">
                          <Space size={4}>
                            {movie.duration && (
                              <>
                                
                                <Text type="secondary" className="movie-duration">
                                  {movie.duration}p
                                </Text>
                              </>
                            )}
                            <Text type="secondary">--</Text>
                            <Text type="secondary" className="movie-year">
                              {movie.releaseDate ?
                                (new Date(movie.releaseDate).getFullYear()) :
                                (movie.releaseYear || '2024')
                              }
                            </Text>
                          </Space>
                        </div>

                        {/* Action Buttons */}
                        <div className="movie-actions">
                          <Space size={6}>
                            <Button
                              type="primary"
                              size="small"
                              icon={<Ticket size={12} />}
                              className="btn-primary"
                            >
                              Đặt vé
                            </Button>
                            <Button
                              size="small"
                              icon={<Calendar size={12} />}
                              className="btn-secondary"
                            >
                              Lịch chiếu
                            </Button>
                          </Space>
                        </div>
                      </div>
                    </Card>
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
                <Text>Không có phim nào thuộc thể loại này</Text>
                <Button
                  type="primary"
                  onClick={() => setActiveCategory('all')}
                >
                  Xem tất cả phim
                </Button>
              </Space>
            }
            className="empty-state"
          />
        )}

        {/* Load More Section */}
        {filteredMovies.length > 0 && (
          <div className="load-more-section">
            <Space direction="vertical" align="center" size="middle">
              <Button
                type="primary"
                size="large"
                // icon={<RightOutlined />}
                className="load-more-btn">
                Xem thêm phim hay
              </Button>
              {/* <Text type="secondary">
                Hiển thị {filteredMovies.length} / {movies.length} phim
              </Text> */}
            </Space>
          </div>
        )}
      </div>
    </section >
  );
};

export default MovieShowcaseAntd;
