import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Tag,
  Space
} from 'antd';
import {
  PlayCircleOutlined,
  StarFilled,
  FireOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './HeroModern.css';

const { Title, Text } = Typography;

const HeroModern = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Featured upcoming movies - Phim nổi bật sắp chiếu
  const featuredMovies = [
    {
      id: 1,
      title: "Ma Không Đầu",
      subtitle: "Kinh dị hài hước đầy bất ngờ",
      description: "Một câu chuyện rùng rợn về hồn ma không đầu ám ảnh ngôi làng cổ kính, gây ra những tình huống dở khóc dở cười",
      image: "https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      features: ["Kinh dị", "Hài hước", "Giật gân"],
      badge: "COMING SOON",
      releaseDate: "17.10.2025",
      rating: 8.4,
      duration: "148 phút"
    },
    {
      id: 2,
      title: "Doraemon: Nobita và Vùng Đất Mới",
      subtitle: "Phiêu lưu kỳ thú cùng Doraemon",
      description: "Nobita cùng bạn bè khám phá vùng đất mới đầy bí ẩn và thử thách trong một hành trình đáng nhớ",
      image: "https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      features: ["Hoạt hình", "Phiêu lưu", "Gia đình"],
      badge: "SẮP CHIẾU",
      releaseDate: "25.10.2025",
      rating: 9.0,
      duration: "112 phút"
    },
    {
      id: 3,
      title: "Dune: Part Two",
      subtitle: "Cuộc chiến hành tinh cát tiếp diễn",
      description: "Cuộc chiến giành quyền lực trên hành tinh cát tiếp tục với những pha hành động mãn nhãn và hình ảnh choáng ngợp",
      image: "https://image.tmdb.org/t/p/original/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg",
      poster: "https://image.tmdb.org/t/p/w500/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg",
      features: ["Sci-Fi", "Hành động", "Epic"],
      badge: "BLOCKBUSTER",
      releaseDate: "01.11.2025",
      rating: 9.2,
      duration: "166 phút"
    }
  ];

  // Nếu có movies từ props, ưu tiên sử dụng những phim sắp chiếu từ API
  const upcomingMovies = movies.filter(movie => {
    if (!movie.releaseDate) return false;
    const releaseYear = movie.releaseDate.includes('.')
      ? Number(movie.releaseDate.split('.')[2])
      : new Date(movie.releaseDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return releaseYear >= currentYear;
  }).slice(0, 3);

  // Sử dụng phim từ API nếu có, không thì dùng data mẫu
  const displayMovies = upcomingMovies.length > 0
    ? upcomingMovies.map(movie => {
      // Lấy thể loại từ API
      let genres = [];
      if (movie.genre && typeof movie.genre === 'string') {
        genres = movie.genre.split(',').slice(0, 3).map(g => g.trim());
      } else if (movie.genres && Array.isArray(movie.genres)) {
        genres = movie.genres.slice(0, 3).map(g => g.name || g);
      }

      // Nếu không có thể loại, dùng mặc định
      if (genres.length === 0) {
        genres = ["Hành động", "Phiêu lưu"];
      }

      // Xử lý URL hình ảnh
      const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `https://image.tmdb.org/t/p/original${path}`;
      };

      return {
        id: movie.id,
        title: movie.title,
        subtitle: movie.originalTitle || movie.original_title || movie.title,
        description: movie.overview || movie.description || "Thông tin chi tiết về phim sẽ được cập nhật sớm",
        image: getImageUrl(movie.backdropPath || movie.backdrop_path || movie.backgroundImage || movie.poster),
        poster: getImageUrl(movie.poster),
        features: genres,
        badge: movie.status === 'COMING_SOON' ? "SẮP CHIẾU" : "COMING SOON",
        releaseDate: movie.releaseDate || "Sắp công bố",
        rating: movie.rating || 8.0,
        duration: movie.duration ? `${movie.duration} phút` : "N/A"
      };
    })
    : featuredMovies;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayMovies.length);
    }, 5000); // Tăng thời gian để người xem đọc thông tin phim
    return () => clearInterval(interval);
  }, [displayMovies.length]);

  const currentItem = displayMovies[currentIndex];

  return (
    <div className="hero-compact">
      {/* Background */}
      <div className="hero-bg">
        <div
          className="bg-image"
          style={{ backgroundImage: `url(${currentItem.image})` }}
        />
        <div className="bg-overlay" />
      </div>

      {/* Content */}
      <div className="hero-container">
        <div className="hero-content">

          {/* Main Text */}
          <div className="hero-text">
            <div className="badge-area">
              <Tag color="red" className="main-badge">
                <FireOutlined /> {currentItem.badge}
              </Tag>
            </div>

            <Title level={2} className="main-title">
              {currentItem.title}
            </Title>

            <Text className="subtitle">
              {currentItem.subtitle}
            </Text>

            <Text className="description">
              {currentItem.description}
            </Text>

            {/* Movie Info */}
            <div className="movie-info-badges">
              <Space size="middle" wrap>
                <Tag icon={<ClockCircleOutlined />} color="blue">
                  {currentItem.duration}
                </Tag>
                <Tag icon={<StarFilled />} color="gold">
                  {currentItem.rating}/10
                </Tag>
                <Tag icon={<TrophyOutlined />} color="purple">
                  Khởi chiếu: {currentItem.releaseDate}
                </Tag>
              </Space>
            </div>

            {/* Features/Genres */}
            <div className="features-list">
              {currentItem.features.map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="action-buttons">
              <Link to={`/movies/${currentItem.id}`}>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  className="primary-button"
                >
                  Xem Chi Tiết
                </Button>
              </Link>
              <Link to="/movies?filter=upcoming">
                <Button
                  size="large"
                  className="secondary-button"
                >
                  Phim Sắp Chiếu
                </Button>
              </Link>
            </div>
          </div>

          {/* Side Image - Movie Poster */}
          <div className="hero-image">
            <div className="image-container">
              <img
                src={currentItem.poster || currentItem.image}
                alt={currentItem.title}
                className="main-image"
              />
              <div className="image-overlay">
                <div className="rating-badge">
                  <StarFilled />
                  <span>{currentItem.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="indicators">
          {displayMovies.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );

};

export default HeroModern;