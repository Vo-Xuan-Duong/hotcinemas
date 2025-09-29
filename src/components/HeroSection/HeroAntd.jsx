import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Tag, 
  Rate, 
  Avatar,
  Statistic,
  Carousel,
  Badge
} from 'antd';
import {
  PlayCircleOutlined,
  CalendarOutlined,
  FireOutlined,
  StarOutlined,
  RightOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Play, Calendar, Film, Star, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HeroAntd.css';

const { Title, Paragraph, Text } = Typography;

const HeroAntd = ({ movies = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Featured movies cho hero carousel
  const featuredMovies = movies.slice(0, 5).map((movie, index) => ({
    ...movie,
    id: movie.id || index + 1,
    heroImage: movie.poster || `https://picsum.photos/800/600?random=${index}`,
    backdrop: movie.backdrop || movie.poster || `https://picsum.photos/1200/800?random=${index}`,
    tagline: movie.tagline || "Trải nghiệm điện ảnh đỉnh cao",
  }));

  const currentMovie = featuredMovies[currentSlide] || {
    title: "HotCinemas",
    overview: "Khám phá thế giới điện ảnh với chất lượng hình ảnh và âm thanh vượt trội",
    tagline: "Trải nghiệm điện ảnh đỉnh cao",
    rating: 9.5,
    genre: "Premium Cinema Experience",
    backdrop: "https://picsum.photos/1200/800?random=hero"
  };

  const statisticsData = [
    {
      title: '500+',
      value: 'Phim Hot',
      icon: <Film className="stat-icon" />,
      color: '#ff6b35'
    },
    {
      title: '25+',
      value: 'Rạp Chiếu',
      icon: <Award className="stat-icon" />,
      color: '#4285f4'
    },
    {
      title: '1M+',
      value: 'Khách Hàng',
      icon: <Users className="stat-icon" />,
      color: '#34d399'
    }
  ];

  return (
    <div className="hero-antd">
      {/* Background with overlay */}
      <div className="hero-background">
        <div 
          className="hero-backdrop"
          style={{ 
            backgroundImage: `url(${currentMovie.backdrop})`,
          }}
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <Row gutter={[32, 32]} align="middle" className="hero-row">
          {/* Left Column - Content */}
          <Col xs={24} lg={14} xl={16}>
            <div className="hero-text-content">
              {/* Badge */}
              <div className="hero-badge-container">
                <Badge.Ribbon 
                  text={
                    <Space>
                      <FireOutlined />
                      <span>Đang hot</span>
                    </Space>
                  }
                  color="volcano"
                  className="hero-badge"
                >
                  <Card className="invisible-card" />
                </Badge.Ribbon>
              </div>

              {/* Title */}
              <Title level={1} className="hero-title">
                <div className="title-main">{currentMovie.title}</div>
                {currentMovie.tagline && (
                  <Text className="title-tagline">{currentMovie.tagline}</Text>
                )}
              </Title>

              {/* Movie Rating & Genre */}
              <Space size="large" className="hero-meta">
                <div className="rating-container">
                  <Rate 
                    disabled 
                    defaultValue={Math.floor(currentMovie.rating / 2)} 
                    className="hero-rating"
                  />
                  <Text strong className="rating-number">
                    {currentMovie.rating} <Text type="secondary">IMDb</Text>
                  </Text>
                </div>
                <Tag 
                  icon={<ThunderboltOutlined />} 
                  color="processing"
                  className="genre-tag"
                >
                  {currentMovie.genre}
                </Tag>
              </Space>

              {/* Description */}
              <Paragraph className="hero-description">
                {currentMovie.overview}
              </Paragraph>

              {/* Action Buttons */}
              <Space size="middle" wrap className="hero-actions">
                <Button 
                  type="primary" 
                  size="large"
                  icon={<PlayCircleOutlined />}
                  className="btn-play-trailer"
                >
                  Xem Trailer
                </Button>
                
                <Button 
                  size="large"
                  icon={<RightOutlined />}
                  className="btn-explore"
                >
                  <Link to="/movies" style={{ color: 'inherit' }}>
                    Khám phá ngay
                  </Link>
                </Button>

                <Button 
                  size="large"
                  icon={<CalendarOutlined />}
                  type="dashed"
                  className="btn-schedule"
                >
                  <Link to="/schedule" style={{ color: 'inherit' }}>
                    Lịch chiếu
                  </Link>
                </Button>
              </Space>

              {/* Statistics */}
              <Row gutter={16} className="hero-stats">
                {statisticsData.map((stat, index) => (
                  <Col xs={8} key={index}>
                    <Card 
                      size="small" 
                      className="stat-card"
                      bodyStyle={{ padding: '16px 12px' }}
                    >
                      <Space direction="vertical" align="center" size={4}>
                        <div style={{ color: stat.color, fontSize: '24px' }}>
                          {stat.icon}
                        </div>
                        <Statistic 
                          value={stat.title} 
                          valueStyle={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold',
                            color: stat.color 
                          }}
                        />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {stat.value}
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>

          {/* Right Column - Featured Movie Poster */}
          <Col xs={24} lg={10} xl={8}>
            <div className="hero-poster-section">
              <Card 
                className="poster-card"
                cover={
                  <div className="poster-container">
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
                        icon={<Play size={20} />}
                        className="poster-play-btn"
                      />
                    </div>
                  </div>
                }
                bodyStyle={{ padding: '16px' }}
              >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Title level={4} className="poster-title">
                    {currentMovie.title}
                  </Title>
                  <Space>
                    <Avatar 
                      size="small" 
                      icon={<StarOutlined />} 
                      style={{ backgroundColor: '#faad14' }}
                    />
                    <Text strong>{currentMovie.rating}</Text>
                    <Text type="secondary">• {currentMovie.genre}</Text>
                  </Space>
                </Space>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Movie Thumbnails Carousel */}
        {featuredMovies.length > 1 && (
          <div className="hero-carousel-section">
            <Title level={4} className="carousel-title">
              <Space>
                <TrophyOutlined />
                Phim đặc sắc
              </Space>
            </Title>
            
            <Carousel 
              autoplay
              dots={{ className: 'custom-dots' }}
              slidesToShow={4}
              slidesToScroll={1}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: { slidesToShow: 3 }
                },
                {
                  breakpoint: 768,
                  settings: { slidesToShow: 2 }
                },
                {
                  breakpoint: 480,
                  settings: { slidesToShow: 1 }
                }
              ]}
              afterChange={setCurrentSlide}
              className="movies-carousel"
            >
              {featuredMovies.map((movie, index) => (
                <div key={movie.id} className="carousel-item">
                  <Card
                    hoverable
                    className={`thumbnail-card ${index === currentSlide ? 'active' : ''}`}
                    cover={
                      <div className="thumbnail-image-container">
                        <img 
                          src={movie.poster} 
                          alt={movie.title}
                          className="thumbnail-image"
                        />
                        <div className="thumbnail-overlay">
                          <Rate 
                            disabled 
                            defaultValue={Math.floor(movie.rating / 2)} 
                            size="small"
                          />
                        </div>
                      </div>
                    }
                    bodyStyle={{ padding: '12px' }}
                  >
                    <Title level={5} ellipsis className="thumbnail-title">
                      {movie.title}
                    </Title>
                    <Text type="secondary" className="thumbnail-genre">
                      {movie.genre || 'Phim chiếu rạp'}
                    </Text>
                  </Card>
                </div>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroAntd;
