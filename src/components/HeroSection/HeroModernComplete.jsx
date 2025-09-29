import React, { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Space,
    Tag,
    Card
} from 'antd';
import {
    PlayCircleOutlined,
    StarFilled,
    CalendarOutlined,
    ClockCircleOutlined,
    FireOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './HeroModernNew.css';

const { Title, Text } = Typography;

const HeroModern = ({ movies = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Cinema showcase data - thông tin rạp chiếu và ưu đãi
    const cinemaShowcase = [
        {
            id: 1,
            title: "HotCinemas Premium",
            subtitle: "Trải nghiệm điện ảnh đẳng cấp thế giới",
            description: "Hệ thống âm thanh Dolby Atmos, màn hình IMAX, ghế massage cao cấp",
            image: "https://images.unsplash.com/photo-1489599904653-b3b90f0c2e99?w=800&h=600",
            features: ["IMAX", "Dolby Atmos", "4DX", "VIP Lounge"],
            rating: 4.9,
            promotion: "Giảm 50% vé cuối tuần"
        },
        {
            id: 2,
            title: "Phim Bom Tấn Tháng 8",
            subtitle: "Những bộ phim được mong chờ nhất năm",
            description: "Cập nhật liên tục các phim hot nhất từ Hollywood và Châu Á",
            image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=600",
            features: ["Hollywood", "Châu Á", "Thể loại đa dạng", "Phụ đề Việt"],
            rating: 4.8,
            promotion: "Đặt vé sớm giảm 30%"
        },
        {
            id: 3,
            title: "Combo Ưu Đãi Hot",
            subtitle: "Tiết kiệm chi phí với các gói combo hấp dẫn",
            description: "Vé phim + bỏng ngô + nước ngọt + quà tặng độc quyền",
            image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=800&h=600",
            features: ["Bỏng ngô", "Nước ngọt", "Quà tặng", "Miễn phí gửi xe"],
            rating: 4.7,
            promotion: "Mua 2 tặng 1"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cinemaShowcase.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentItem = cinemaShowcase[currentIndex];

    return (
        <div className="hero-showcase">
            {/* Background với hiệu ứng gradient động */}
            <div className="hero-bg-wrapper">
                <div
                    className="hero-bg-image"
                    style={{ backgroundImage: `url(${currentItem.image})` }}
                />
                <div className="hero-gradient-overlay" />
                <div className="hero-pattern-mesh" />
            </div>

            {/* Main Content */}
            <div className="hero-content-wrapper">
                <div className="hero-main-content">

                    {/* Left Side - Text Content */}
                    <div className="hero-text-section">
                        <div className="hero-badge-group">
                            <Tag color="volcano" icon={<FireOutlined />} className="hot-badge">
                                HOT TREND
                            </Tag>
                            <Tag color="gold" icon={<TrophyOutlined />} className="premium-badge">
                                PREMIUM
                            </Tag>
                        </div>

                        <div className="hero-title-group">
                            <Title level={1} className="hero-main-title">
                                {currentItem.title}
                            </Title>
                            <Text className="hero-subtitle">
                                {currentItem.subtitle}
                            </Text>
                        </div>

                        <div className="hero-description">
                            <Text className="description-text">
                                {currentItem.description}
                            </Text>
                        </div>

                        {/* Features Grid */}
                        <div className="hero-features-grid">
                            {currentItem.features.map((feature, index) => (
                                <div key={index} className="feature-item">
                                    <div className="feature-icon">✨</div>
                                    <span className="feature-text">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Rating & Promotion */}
                        <div className="hero-info-bar">
                            <div className="rating-section">
                                <StarFilled className="star-icon" />
                                <span className="rating-number">{currentItem.rating}</span>
                                <span className="rating-text">Đánh giá tuyệt vời</span>
                            </div>
                            <div className="promotion-section">
                                <Tag color="red" className="promo-tag">
                                    🎁 {currentItem.promotion}
                                </Tag>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="hero-action-buttons">
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlayCircleOutlined />}
                                className="primary-btn"
                            >
                                XEM NGAY
                            </Button>
                            <Button
                                size="large"
                                className="secondary-btn"
                            >
                                <Link to="/movies">KHÁM PHÁ THÊM</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Side - Visual Card */}
                    <div className="hero-visual-section">
                        <Card className="showcase-card" bordered={false}>
                            <div className="card-image-container">
                                <img
                                    src={currentItem.image}
                                    alt={currentItem.title}
                                    className="showcase-image"
                                />
                                <div className="card-overlay">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        size="large"
                                        icon={<PlayCircleOutlined />}
                                        className="play-button"
                                    />
                                </div>
                                <div className="rating-badge">
                                    <StarFilled />
                                    <span>{currentItem.rating}</span>
                                </div>
                            </div>

                            <div className="card-content">
                                <Title level={4} className="card-title">
                                    {currentItem.title}
                                </Title>
                                <Text className="card-subtitle">
                                    {currentItem.subtitle}
                                </Text>
                                <Button
                                    type="primary"
                                    danger
                                    size="large"
                                    block
                                    className="book-btn"
                                >
                                    ĐẶT VÉ NGAY
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Indicators */}
                <div className="hero-indicators">
                    {cinemaShowcase.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${currentIndex === index ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroModern;
