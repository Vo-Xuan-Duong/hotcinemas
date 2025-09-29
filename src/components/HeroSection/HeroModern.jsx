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

  // Cinema experiences data - nội dung về trải nghiệm rạp chiếu
  const experiences = [
    {
      id: 1,
      title: "Giải Trí Cao Cấp",
      subtitle: "Không gian thư giãn đẳng cấp",
      description: "Rạp chiếu phim hiện đại với công nghệ âm thanh và hình ảnh tốt nhất",
      image: "https://images.unsplash.com/photo-1489599904653-b3b90f0c2e99?w=600&h=400",
      features: ["4K Digital", "Surround Sound", "Ghế Da Cao Cấp"],
      badge: "PREMIUM"
    },
    {
      id: 2,
      title: "Ẩm Thực Đặc Biệt",
      subtitle: "Combo bỏng ngô và đồ uống thơm ngon",
      description: "Thưởng thức phim cùng các món ăn nhẹ được chế biến tươi ngon",
      image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=600&h=400",
      features: ["Bỏng Ngô Tươi", "Nước Ngọt Lạnh", "Snack Đa Dạng"],
      badge: "COMBO HOT"
    },
    {
      id: 3,
      title: "Dịch Vụ Tiện Ích",
      subtitle: "Booking online nhanh chóng, tiện lợi",
      description: "Đặt vé trực tuyến, chọn chỗ ngồi và thanh toán dễ dàng chỉ vài click",
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=400",
      features: ["Đặt Vé Online", "Chọn Ghế", "Thanh Toán Nhanh"],
      badge: "TIỆN LỢI"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % experiences.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentItem = experiences[currentIndex];

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

            {/* Features */}
            <div className="features-list">
              {currentItem.features.map((feature, index) => (
                <span key={index} className="feature-tag">
                  ✓ {feature}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="action-buttons">
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                className="primary-button"
              >
                Trải Nghiệm Ngay
              </Button>
              <Button
                size="large"
                className="secondary-button"
              >
                <Link to="/movies">Xem Phim</Link>
              </Button>
            </div>
          </div>

          {/* Side Image */}
          <div className="hero-image">
            <div className="image-container">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="main-image"
              />
              <div className="image-overlay">
                <div className="rating-badge">
                  <StarFilled />
                  <span>4.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="indicators">
          {experiences.map((_, index) => (
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