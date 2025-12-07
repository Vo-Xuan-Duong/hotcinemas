import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Avatar,
  Statistic,
  Progress,
  Timeline,
  Badge,
  Tabs
} from 'antd';
import {
  TrophyOutlined,
  FireOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  StarOutlined,
  EyeOutlined,
  HeartOutlined,
  CommentOutlined,
  RightOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import {
  Trophy,
  Flame,
  Clock,
  Calendar,
  Star,
  Eye,
  Heart,
  MessageCircle,
  Ticket,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './FeaturedContent.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const FeaturedContent = ({ movies = [] }) => {
  const [activeTab, setActiveTab] = useState('trending');

  // Mock data for featured content
  const trendingMovies = movies.slice(0, 5).map((movie, index) => ({
    ...movie,
    rank: index + 1,
    views: Math.floor(Math.random() * 1000000) + 100000,
    likes: Math.floor(Math.random() * 50000) + 5000,
    comments: Math.floor(Math.random() * 1000) + 100,
    trendingScore: Math.floor(Math.random() * 100) + 70
  }));

  const upcomingMovies = movies.slice(5, 10).map((movie, index) => ({
    ...movie,
    releaseDate: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000),
    preorders: Math.floor(Math.random() * 10000) + 1000,
    anticipation: Math.floor(Math.random() * 100) + 60
  }));

  const topRatedMovies = movies.slice(10, 15).map((movie, index) => ({
    ...movie,
    rank: index + 1,
    criticsScore: Math.floor(Math.random() * 30) + 70,
    audienceScore: Math.floor(Math.random() * 30) + 70,
    reviews: Math.floor(Math.random() * 500) + 50
  }));

  const newsData = [
    {
      id: 1,
      title: "Premiere sắp tới: Blockbuster mùa hè 2024",
      content: "Những bộ phim được mong chờ nhất sẽ ra mắt trong tháng tới...",
      time: "2 giờ trước",
      category: "Tin tức",
      views: 15420
    },
    {
      id: 2,
      title: "Công nghệ chiếu phim mới tại HotCinemas",
      content: "Trải nghiệm âm thanh Dolby Atmos và hình ảnh 4K HDR...",
      time: "5 giờ trước",
      category: "Công nghệ",
      views: 8750
    },
    {
      id: 3,
      title: "Ưu đãi đặc biệt cuối tuần",
      content: "Giảm giá 30% cho tất cả suất chiếu từ thứ 6 đến chủ nhật...",
      time: "1 ngày trước",
      category: "Khuyến mãi",
      views: 23100
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTimeUntilRelease = (date) => {
    const now = new Date();
    const diffTime = Math.abs(date - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ngày`;
  };

  return (
    <section className="featured-content-antd">
      <div className="featured-container">
        {/* Section Header */}
        <div className="section-header">
          <Space align="center" size="middle">
            <Avatar
              size="large"
              icon={<TrophyOutlined />}
              style={{ backgroundColor: '#ff6b35' }}
            />
            <div>
              <Title level={2} className="section-title">
                Nội dung nổi bật
              </Title>
              <Text type="secondary" className="section-subtitle">
                Khám phá những điều thú vị nhất trong thế giới điện ảnh
              </Text>
            </div>
          </Space>
        </div>

        {/* Content Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="featured-tabs"
          size="large"
        >
          {/* Trending Tab */}
          <TabPane
            tab={
              <Space>
                <Flame size={16} />
                <span>Đang hot</span>
              </Space>
            }
            key="trending"
          >
            <Row gutter={[24, 24]}>
              {/* Trending List */}
              <Col xs={24} lg={14}>
                <Card
                  title={
                    <Space>
                      <TrendingUp size={20} />
                      <span>Top phim trending</span>
                    </Space>
                  }
                  className="trending-card"
                >
                  <div className="trending-list">
                    {trendingMovies.map((movie, index) => (
                      <div key={movie.id} className="trending-item">
                        <div className="rank-badge">
                          <Text strong className="rank-number">
                            #{movie.rank}
                          </Text>
                        </div>

                        <Avatar
                          src={movie.poster}
                          size={64}
                          className="movie-avatar"
                        />

                        <div className="movie-info">
                          <Title level={5} className="movie-title">
                            {movie.title}
                          </Title>
                          <Space size="middle">
                            <Space size={4}>
                              <Eye size={14} />
                              <Text type="secondary">
                                {formatNumber(movie.views)}
                              </Text>
                            </Space>
                            <Space size={4}>
                              <Heart size={14} />
                              <Text type="secondary">
                                {formatNumber(movie.likes)}
                              </Text>
                            </Space>
                            <Space size={4}>
                              <MessageCircle size={14} />
                              <Text type="secondary">
                                {formatNumber(movie.comments)}
                              </Text>
                            </Space>
                          </Space>
                        </div>

                        <div className="trending-score">
                          <Progress
                            type="circle"
                            percent={movie.trendingScore}
                            width={50}
                            strokeColor={{
                              '0%': '#ff6b35',
                              '100%': '#e55a28',
                            }}
                            format={() => (
                              <Text strong style={{ fontSize: '12px' }}>
                                {movie.trendingScore}
                              </Text>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>

              {/* Quick Stats */}
              <Col xs={24} lg={10}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card className="stats-card">
                      <Statistic
                        title="Lượt xem hôm nay"
                        value={2847521}
                        precision={0}
                        valueStyle={{ color: '#ff6b35' }}
                        prefix={<EyeOutlined />}
                        suffix="views"
                      />
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card className="stats-card">
                      <Statistic
                        title="Phim mới tuần này"
                        value={12}
                        valueStyle={{ color: '#4285f4' }}
                        prefix={<FireOutlined />}
                        suffix="phim"
                      />
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card className="stats-card">
                      <Statistic
                        title="Đánh giá trung bình"
                        value={8.7}
                        precision={1}
                        valueStyle={{ color: '#34d399' }}
                        prefix={<StarOutlined />}
                        suffix="/ 10"
                      />
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </TabPane>

          {/* Top Rated Tab */}
          <TabPane
            tab={
              <Space>
                <Star size={16} />
                <span>Đánh giá cao</span>
              </Space>
            }
            key="toprated"
          >
            <Row gutter={[16, 24]}>
              {topRatedMovies.map((movie, index) => (
                <Col xs={24} key={movie.id}>
                  <Card className="toprated-card" hoverable>
                    <Row gutter={16} align="middle">
                      <Col xs={4} sm={2}>
                        <div className="rank-circle">
                          <Text strong className="rank-text">
                            #{movie.rank}
                          </Text>
                        </div>
                      </Col>

                      <Col xs={6} sm={4}>
                        <Avatar
                          src={movie.poster}
                          size={80}
                          className="toprated-avatar"
                        />
                      </Col>

                      <Col xs={14} sm={12}>
                        <Space direction="vertical" size={4}>
                          <Title level={4} className="toprated-title">
                            {movie.title}
                          </Title>
                          <Text type="secondary">
                            {movie.genre} • {movie.releaseDate || '2024'}
                          </Text>
                          <Space size="large">
                            <Space size={4}>
                              <Award size={14} />
                              <Text>Critics: {movie.criticsScore}%</Text>
                            </Space>
                            <Space size={4}>
                              <Users size={14} />
                              <Text>Audience: {movie.audienceScore}%</Text>
                            </Space>
                          </Space>
                        </Space>
                      </Col>

                      <Col xs={24} sm={6}>
                        <Space direction="vertical" align="end" size={8}>
                          <div className="score-display">
                            <Text strong style={{ fontSize: '24px', color: '#ff6b35' }}>
                              {((movie.criticsScore + movie.audienceScore) / 20).toFixed(1)}
                            </Text>
                            <Text type="secondary">/10</Text>
                          </div>
                          <Text type="secondary">
                            {movie.reviews} đánh giá
                          </Text>
                          <Button size="small" type="primary">
                            Xem chi tiết
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          {/* News Tab */}
          <TabPane
            tab={
              <Space>
                <MessageCircle size={16} />
                <span>Tin tức</span>
              </Space>
            }
            key="news"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Timeline className="news-timeline">
                  {newsData.map((news, index) => (
                    <Timeline.Item
                      key={news.id}
                      dot={<ThunderboltOutlined style={{ fontSize: '16px' }} />}
                      color="#ff6b35"
                    >
                      <Card className="news-card" hoverable>
                        <div className="news-header">
                          <Space>
                            <Badge
                              color="#ff6b35"
                              text={news.category}
                              className="news-category"
                            />
                            <Text type="secondary">{news.time}</Text>
                          </Space>
                        </div>
                        <Title level={4} className="news-title">
                          {news.title}
                        </Title>
                        <Paragraph
                          type="secondary"
                          className="news-content"
                          ellipsis={{ rows: 2 }}
                        >
                          {news.content}
                        </Paragraph>
                        <div className="news-footer">
                          <Space>
                            <Eye size={14} />
                            <Text type="secondary">
                              {formatNumber(news.views)} lượt xem
                            </Text>
                          </Space>
                          <Button
                            type="link"
                            size="small"
                            icon={<RightOutlined />}
                          >
                            Đọc thêm
                          </Button>
                        </div>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Col>

              <Col xs={24} lg={8}>
                <Card title="Tin nổi bật" className="trending-news-card">
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {newsData.slice(0, 3).map((news, index) => (
                      <div key={news.id} className="trending-news-item">
                        <Text strong className="trending-news-title">
                          {news.title}
                        </Text>
                        <Space>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {news.time}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            • {formatNumber(news.views)} views
                          </Text>
                        </Space>
                      </div>
                    ))}
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturedContent;
