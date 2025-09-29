import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    Row,
    Col,
    Tag,
    Rate,
    Space,
    Breadcrumb,
    Card,
    Tabs,
    Avatar,
    Progress,
    Statistic,
    Modal,
    List,
    Input,
    Divider,
    Empty,
    message,
    Badge,
    Tooltip,
} from 'antd';
import {
    ArrowLeftOutlined,
    HomeOutlined,
    BookOutlined,
    CalendarOutlined,
    MessageOutlined,
    LikeOutlined,
    UserOutlined,
    EyeOutlined,
    HeartOutlined,
    HeartFilled,
    ShareAltOutlined,
    EnvironmentOutlined,
    VideoCameraOutlined,
    StarFilled,
    PlayCircleOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    SafetyOutlined,
    BulbOutlined,
    BulbFilled,
    CarryOutOutlined
} from '@ant-design/icons';
import { Play, Clock, Calendar, Star, Film, Users, Award } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import moviesData from '../../../data/movies.json';
import cinemasData from '../../../data/cinemas.json';
import moment from 'moment';
import './MovieDetailModern.css';
import './MovieDetailEnhanced.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const MovieDetailModern = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedDate, setSelectedDate] = useState(0);
    const [trailerVisible, setTrailerVisible] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Mock data
    const mockStats = {
        popularity: 85,
        criticism: 4.2,
        audience: 4.5,
        views: 125000,
        reviews: 8543
    };

    const mockCast = [
        { id: 1, name: 'Margot Robbie', character: 'Barbie', avatar: '/api/placeholder/60/60' },
        { id: 2, name: 'Ryan Gosling', character: 'Ken', avatar: '/api/placeholder/60/60' },
        { id: 3, name: 'America Ferrera', character: 'Gloria', avatar: '/api/placeholder/60/60' },
        { id: 4, name: 'Kate McKinnon', character: 'Barbie', avatar: '/api/placeholder/60/60' },
        { id: 5, name: 'Issa Rae', character: 'Barbie', avatar: '/api/placeholder/60/60' },
        { id: 6, name: 'Simu Liu', character: 'Ken', avatar: '/api/placeholder/60/60' }
    ];

    const mockComments = [
        {
            id: 1,
            user: 'Nguyễn Văn A',
            rating: 5,
            comment: 'Phim rất hay và ý nghĩa! Diễn xuất tuyệt vời.',
            date: '2024-01-15',
            likes: 12
        },
        {
            id: 2,
            user: 'Trần Thị B',
            rating: 4,
            comment: 'Cốt truyện thú vị, hình ảnh đẹp mắt.',
            date: '2024-01-14',
            likes: 8
        }
    ];

    useEffect(() => {
        const movieData = moviesData.find(m => m.id === parseInt(id));
        if (movieData) {
            setMovie(movieData);
        }
        setLoading(false);
    }, [id]);

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        message.success(isFavorite ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        message.success('Đã sao chép link phim!');
    };

    const handleTrailer = () => {
        setTrailerVisible(true);
    };

    const handleBooking = () => {
        setShowBookingModal(true);
    };

    const handleRating = (value) => {
        setUserRating(value);
        setShowReviewModal(true);
    };

    const submitReview = () => {
        if (userRating === 0) {
            message.error('Vui lòng chọn số sao đánh giá!');
            return;
        }

        message.success('Cảm ơn bạn đã đánh giá phim!');
        setShowReviewModal(false);
        setReviewText('');
        setUserRating(0);
    };

    if (loading) {
        return (
            <div className="movie-detail-loading">
                <Card loading style={{ minHeight: '60vh' }} />
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="movie-detail-error">
                <Empty description="Không tìm thấy phim" />
            </div>
        );
    }

    const dates = [
        { label: 'Hôm nay', value: moment().format('DD/MM') },
        { label: 'Ngày mai', value: moment().add(1, 'day').format('DD/MM') },
        { label: moment().add(2, 'days').format('dddd'), value: moment().add(2, 'days').format('DD/MM') },
    ];

    return (
        <div className={`movie-detail-modern ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
            {/* Breadcrumb */}
            <div className="movie-breadcrumb">
                <div className="container">
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <HomeOutlined />
                            <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Trang chủ</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <span onClick={() => navigate('/movies')} style={{ cursor: 'pointer' }}>Phim</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{movie.title}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            {/* Hero Section */}
            <div className="movie-hero-section">
                <div className="container">
                    <Row gutter={[32, 32]} align="middle">
                        <Col xs={24} sm={8} md={6} className="poster-column">
                            <div className="movie-poster-container">
                                <div className="poster-wrapper">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="movie-poster-main"
                                    />
                                    <div className="poster-overlay">
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<Play size={20} />}
                                            className="trailer-btn-hero"
                                            onClick={handleTrailer}
                                        >
                                            Xem Trailer
                                        </Button>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="quick-actions">
                                    <Button
                                        size="large"
                                        type="primary"
                                        className="book-ticket-btn"
                                        onClick={() => setBookingModalVisible(true)}
                                        icon={<CarryOutOutlined />}
                                    >
                                        Đặt vé ngay
                                    </Button>
                                    <div className="action-buttons">
                                        <Button
                                            icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                                            onClick={handleFavorite}
                                            className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                                            size="large"
                                        />
                                        <Button
                                            icon={<ShareAltOutlined />}
                                            onClick={handleShare}
                                            className="share-btn"
                                            size="large"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={16} md={18} className="info-column">
                            <div className="movie-info-hero">
                                <div className="movie-header">
                                    <Space className="movie-actions-top" wrap>
                                        <Button
                                            icon={<ArrowLeftOutlined />}
                                            onClick={() => navigate('/movies')}
                                            className="back-btn"
                                        >
                                            Quay lại
                                        </Button>
                                        <Tooltip title={`Chuyển sang ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
                                            <Button
                                                icon={theme === 'light' ? <BulbFilled /> : <BulbOutlined />}
                                                onClick={toggleTheme}
                                                className="theme-toggle-btn"
                                            />
                                        </Tooltip>
                                    </Space>

                                    <Title level={1} className="movie-title-hero">
                                        {movie.title}
                                        <div className="title-subtitle">
                                            <Text type="secondary" className="original-title">
                                                {movie.originalTitle || "My Daughter Is a Zombie - Comedy, Drama"}
                                            </Text>
                                        </div>
                                    </Title>
                                </div>

                                <div className="movie-rating-section">
                                    <div className="rating-display">
                                        <div className="rating-circle">
                                            <Progress
                                                type="circle"
                                                percent={movie.rating * 10}
                                                size={80}
                                                strokeColor={{
                                                    '0%': '#87d068',
                                                    '100%': '#108ee9',
                                                }}
                                                format={() => (
                                                    <div className="rating-content">
                                                        <div className="rating-number">{movie.rating}</div>
                                                        <div className="rating-max">/10</div>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        <div className="rating-details">
                                            <Text strong className="rating-title">Đánh giá IMDb</Text>
                                            <Rate disabled defaultValue={Math.round(movie.rating / 2)} />
                                            <Text type="secondary">({mockStats.reviews.toLocaleString()} đánh giá)</Text>
                                        </div>
                                    </div>
                                </div>

                                <div className="movie-meta-grid">
                                    <div className="meta-item">
                                        <Clock size={18} className="meta-icon" />
                                        <div className="meta-content">
                                            <Text strong>Thời lượng</Text>
                                            <Text>{movie.duration} phút</Text>
                                        </div>
                                    </div>
                                    <div className="meta-item">
                                        <Calendar size={18} className="meta-icon" />
                                        <div className="meta-content">
                                            <Text strong>Khởi chiếu</Text>
                                            <Text>{movie.releaseDate}</Text>
                                        </div>
                                    </div>
                                    <div className="meta-item">
                                        <EyeOutlined className="meta-icon" />
                                        <div className="meta-content">
                                            <Text strong>Lượt xem</Text>
                                            <Text>{mockStats.views.toLocaleString()}</Text>
                                        </div>
                                    </div>
                                    <div className="meta-item">
                                        <UserOutlined className="meta-icon" />
                                        <div className="meta-content">
                                            <Text strong>Giới hạn tuổi</Text>
                                            <Tag color="orange">T13</Tag>
                                        </div>
                                    </div>
                                </div>

                                <div className="movie-genres">
                                    {movie.genre?.split(', ').map((genre, index) => (
                                        <Tag key={index} className="genre-tag-hero" color="blue">
                                            {genre}
                                        </Tag>
                                    ))}
                                </div>

                                {/* Cast and Director Info */}
                                <div className="cast-director-quick">
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <div className="info-section">
                                                <Text strong className="section-title">Diễn viên</Text>
                                                <div className="names-list">
                                                    <Text>Cho Jung-seok</Text>
                                                    <Text>Lee Jung-eun</Text>
                                                    <Text>Cho Yeo-jeong</Text>
                                                    <Text>Yoon Kyung-ho</Text>
                                                    <Text>Choi Yu-ri</Text>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="info-section">
                                                <Text strong className="section-title">Đạo diễn</Text>
                                                <div className="names-list">
                                                    <Text>Pit Gam-seong</Text>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={16} md={18}>
                            <div className="movie-info-hero">
                                <Space className="movie-actions-top" wrap>
                                    <Button
                                        icon={<ArrowLeftOutlined />}
                                        onClick={() => navigate('/movies')}
                                        className="back-btn"
                                    >
                                        Quay lại
                                    </Button>
                                    <Button
                                        icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                                        onClick={handleFavorite}
                                        className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                                    />
                                    <Button
                                        icon={<ShareAltOutlined />}
                                        onClick={handleShare}
                                        className="share-btn"
                                    />
                                    <Tooltip title={`Chuyển sang ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
                                        <Button
                                            icon={theme === 'light' ? <BulbFilled /> : <BulbOutlined />}
                                            onClick={toggleTheme}
                                            className="theme-toggle-btn"
                                        />
                                    </Tooltip>
                                </Space>

                                <Title level={1} className="movie-title-hero">
                                    {movie.title}
                                </Title>

                                <Space size={16} wrap className="movie-meta-info">
                                    <Space>
                                        <Star size={16} fill="#faad14" color="#faad14" />
                                        <Text strong className="rating-text">{movie.rating}/10</Text>
                                    </Space>
                                    <Space>
                                        <Clock size={16} className="meta-icon" />
                                        <Text>{movie.duration} phút</Text>
                                    </Space>
                                    <Space>
                                        <Calendar size={16} className="meta-icon" />
                                        <Text>{movie.releaseDate}</Text>
                                    </Space>
                                    <Space>
                                        <EyeOutlined className="meta-icon" />
                                        <Text>{mockStats.views.toLocaleString()} lượt xem</Text>
                                    </Space>
                                </Space>

                                <div className="movie-genres">
                                    {movie.genre?.split(', ').map((genre, index) => (
                                        <Tag key={index} className="genre-tag-hero" color="blue">
                                            {genre}
                                        </Tag>
                                    ))}
                                </div>

                                <Paragraph className="movie-overview">
                                    {movie.description}
                                </Paragraph>

                                <Row gutter={16} className="movie-stats">
                                    <Col span={6}>
                                        <div className="stat-item">
                                            <Statistic
                                                title="Độ phổ biến"
                                                value={mockStats.popularity}
                                                suffix="%"
                                                valueStyle={{ color: '#52c41a' }}
                                            />
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <div className="stat-item">
                                            <Statistic
                                                title="Đánh giá"
                                                value={mockStats.criticism}
                                                precision={1}
                                                suffix="/5"
                                                valueStyle={{ color: '#faad14' }}
                                            />
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <div className="stat-item">
                                            <Statistic
                                                title="Khán giả"
                                                value={mockStats.audience}
                                                precision={1}
                                                suffix="/5"
                                                valueStyle={{ color: '#1890ff' }}
                                            />
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <div className="stat-item">
                                            <Statistic
                                                title="Lượt xem"
                                                value={mockStats.views}
                                                valueStyle={{ color: '#722ed1' }}
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                <div className="movie-actions-main">
                                    <Space size="middle" wrap>
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<BookOutlined />}
                                            onClick={handleBooking}
                                            className="book-ticket-btn"
                                        >
                                            Đặt vé ngay
                                        </Button>
                                        <Button
                                            size="large"
                                            icon={<PlayCircleOutlined />}
                                            onClick={handleTrailer}
                                            className="trailer-btn"
                                        >
                                            Xem Trailer
                                        </Button>
                                        <Tooltip title="Đánh giá phim">
                                            <Rate
                                                allowHalf
                                                value={userRating}
                                                onChange={handleRating}
                                                className="rating-stars"
                                            />
                                        </Tooltip>
                                    </Space>
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    className="book-ticket-btn-hero"
                                    icon={<BookOutlined />}
                                    onClick={() => navigate(`/booking/${movie.id}`)}
                                >
                                    Đặt vé ngay
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Content Section */}
            <div className="movie-content-section">
                <div className="container">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        className="movie-tabs"
                        items={[
                            {
                                key: 'overview',
                                label: (
                                    <Space>
                                        <Film size={16} />
                                        Tổng quan
                                    </Space>
                                ),
                                children: (
                                    <Row gutter={[24, 24]}>
                                        <Col xs={24} md={8}>
                                            <Card title="Chi tiết phim" className="movie-details-card">
                                                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                                    <div>
                                                        <Text type="secondary">Đạo diễn:</Text>
                                                        <Text style={{ marginLeft: 8 }}>{movie.director || 'Đang cập nhật'}</Text>
                                                    </div>
                                                    <div>
                                                        <Text type="secondary">Thể loại:</Text>
                                                        <Text style={{ marginLeft: 8 }}>{movie.genre}</Text>
                                                    </div>
                                                    <div>
                                                        <Text type="secondary">Thời lượng:</Text>
                                                        <Text style={{ marginLeft: 8 }}>{movie.duration} phút</Text>
                                                    </div>
                                                    <div>
                                                        <Text type="secondary">Ngày khởi chiếu:</Text>
                                                        <Text style={{ marginLeft: 8 }}>{movie.releaseDate}</Text>
                                                    </div>
                                                    <div>
                                                        <Text type="secondary">Ngôn ngữ:</Text>
                                                        <Text style={{ marginLeft: 8 }}>Tiếng Việt - Phụ đề</Text>
                                                    </div>
                                                    <div>
                                                        <Text type="secondary">Độ tuổi:</Text>
                                                        <Tag color="orange">{movie.ageRating || 'T16'}</Tag>
                                                    </div>
                                                </Space>
                                            </Card>
                                        </Col>

                                        <Col xs={24} md={8}>
                                            <Card title="Diễn viên" className="movie-cast-card">
                                                <Row gutter={[16, 16]}>
                                                    {mockCast.map(actor => (
                                                        <Col span={8} key={actor.id}>
                                                            <div className="cast-member">
                                                                <Avatar
                                                                    size={60}
                                                                    src={actor.avatar}
                                                                    icon={<UserOutlined />}
                                                                />
                                                                <div className="cast-info">
                                                                    <Text className="cast-name">{actor.name}</Text>
                                                                    <Text className="cast-character">{actor.character}</Text>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Card>
                                        </Col>

                                        <Col xs={24} md={8}>
                                            <Card title="Đánh giá" className="movie-ratings-card">
                                                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                                                    <div>
                                                        <Text type="secondary">Đánh giá chung</Text>
                                                        <Rate disabled defaultValue={4.5} style={{ display: 'block', marginTop: 8 }} />
                                                        <Text strong style={{ color: '#faad14' }}>4.5/5 (1,234 đánh giá)</Text>
                                                    </div>
                                                    <div>
                                                        <Text type="secondary">Phân bố đánh giá</Text>
                                                        <div style={{ marginTop: 8 }}>
                                                            {[5, 4, 3, 2, 1].map(star => (
                                                                <div key={star} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                                                    <Text style={{ width: 20 }}>{star}</Text>
                                                                    <StarFilled style={{ color: '#faad14', margin: '0 8px' }} />
                                                                    <Progress
                                                                        percent={star === 5 ? 65 : star === 4 ? 25 : star === 3 ? 8 : 2}
                                                                        size="small"
                                                                        showInfo={false}
                                                                        style={{ flex: 1 }}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Space>
                                            </Card>
                                        </Col>
                                    </Row>
                                )
                            },
                            {
                                key: 'showtimes',
                                label: (
                                    <Space>
                                        <CalendarOutlined />
                                        Lịch chiếu
                                    </Space>
                                ),
                                children: (
                                    <Card title="Lịch chiếu phim" className="showtimes-card">
                                        <div className="date-selector">
                                            <Space wrap>
                                                {dates.map((date, index) => (
                                                    <Button
                                                        key={index}
                                                        type={selectedDate === index ? 'primary' : 'default'}
                                                        className="date-btn"
                                                        onClick={() => setSelectedDate(index)}
                                                    >
                                                        <div>
                                                            <div>{date.label}</div>
                                                            <div style={{ fontSize: '12px', opacity: 0.8 }}>{date.value}</div>
                                                        </div>
                                                    </Button>
                                                ))}
                                            </Space>
                                        </div>

                                        <Row gutter={[16, 16]}>
                                            {cinemasData.slice(0, 3).map(cinema => (
                                                <Col span={24} key={cinema.id}>
                                                    <Card size="small" className="cinema-card">
                                                        <Row justify="space-between" align="middle">
                                                            <Col>
                                                                <Title level={5} style={{ margin: 0, color: 'inherit' }}>
                                                                    {cinema.name}
                                                                </Title>
                                                                <Text type="secondary">
                                                                    <EnvironmentOutlined /> {cinema.address}
                                                                </Text>
                                                            </Col>
                                                            <Col>
                                                                <Space wrap>
                                                                    {['14:30', '17:00', '19:30', '22:00'].map(time => (
                                                                        <Button
                                                                            key={time}
                                                                            size="small"
                                                                            className="showtime-btn"
                                                                            onClick={() => navigate(`/booking/${movie.id}?cinema=${cinema.id}&time=${time}`)}
                                                                        >
                                                                            {time}
                                                                        </Button>
                                                                    ))}
                                                                </Space>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Card>
                                )
                            },
                            {
                                key: 'comments',
                                label: (
                                    <Space>
                                        <MessageOutlined />
                                        Bình luận ({mockComments.length})
                                    </Space>
                                ),
                                children: (
                                    <Card title="Bình luận và đánh giá" className="comments-card">
                                        <div className="add-comment">
                                            <Title level={5}>Viết bình luận</Title>
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <Rate />
                                                <TextArea
                                                    rows={4}
                                                    placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                                                    className="comment-input"
                                                />
                                                <Button type="primary" icon={<MessageOutlined />}>
                                                    Gửi bình luận
                                                </Button>
                                            </Space>
                                        </div>

                                        <List
                                            dataSource={mockComments}
                                            renderItem={comment => (
                                                <List.Item
                                                    actions={[
                                                        <Space key="like">
                                                            <Button type="text" icon={<LikeOutlined />} size="small">
                                                                {comment.likes}
                                                            </Button>
                                                        </Space>,
                                                        <Button key="reply" type="text" size="small">
                                                            Trả lời
                                                        </Button>
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        avatar={<Avatar icon={<UserOutlined />} />}
                                                        title={
                                                            <Space>
                                                                <Text strong>{comment.user}</Text>
                                                                <Rate disabled defaultValue={comment.rating} size="small" />
                                                            </Space>
                                                        }
                                                        description={
                                                            <div>
                                                                <Text>{comment.comment}</Text>
                                                                <br />
                                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                    {moment(comment.date).format('DD/MM/YYYY')}
                                                                </Text>
                                                            </div>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                )
                            }
                        ]}
                    />
                </div>
            </div>

            {/* Trailer Modal */}
            <Modal
                open={trailerVisible}
                title={`Trailer - ${movie.title}`}
                onCancel={() => setTrailerVisible(false)}
                footer={null}
                width={800}
                centered
            >
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <VideoCameraOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                    <Text>Trailer sẽ được cập nhật sớm</Text>
                </div>
            </Modal>

            {/* Booking Modal */}
            <Modal
                open={showBookingModal}
                title={
                    <Space>
                        <BookOutlined />
                        Đặt vé xem phim - {movie.title}
                    </Space>
                }
                onCancel={() => setShowBookingModal(false)}
                onOk={() => {
                    message.success('Đặt vé thành công! Vui lòng thanh toán trong 15 phút.');
                    setShowBookingModal(false);
                }}
                okText="Xác nhận đặt vé"
                cancelText="Hủy"
                width={600}
            >
                <div style={{ padding: '20px 0' }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                            <Text strong>Chọn ngày chiếu:</Text>
                            <div style={{ marginTop: 8 }}>
                                {dates.map((date, index) => (
                                    <Button
                                        key={index}
                                        type={selectedDate === index ? 'primary' : 'default'}
                                        onClick={() => setSelectedDate(index)}
                                        style={{ marginRight: 8, marginBottom: 8 }}
                                    >
                                        {date.label} - {date.value}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Text strong>Chọn suất chiếu:</Text>
                            <div style={{ marginTop: 8 }}>
                                <Space wrap>
                                    <Button type="default">08:30</Button>
                                    <Button type="default">10:45</Button>
                                    <Button type="default">13:15</Button>
                                    <Button type="default">15:30</Button>
                                    <Button type="default">18:00</Button>
                                    <Button type="default">20:30</Button>
                                    <Button type="default">22:45</Button>
                                </Space>
                            </div>
                        </div>

                        <div>
                            <Text strong>Rạp chiếu:</Text>
                            <div style={{ marginTop: 8 }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Button type="default" block style={{ textAlign: 'left' }}>
                                        <Space>
                                            <EnvironmentOutlined />
                                            CGV Vincom Đồng Khởi
                                        </Space>
                                    </Button>
                                    <Button type="default" block style={{ textAlign: 'left' }}>
                                        <Space>
                                            <EnvironmentOutlined />
                                            Galaxy Nguyễn Du
                                        </Space>
                                    </Button>
                                    <Button type="default" block style={{ textAlign: 'left' }}>
                                        <Space>
                                            <EnvironmentOutlined />
                                            Lotte Cinema Cantavil
                                        </Space>
                                    </Button>
                                </Space>
                            </div>
                        </div>
                    </Space>
                </div>
            </Modal>

            {/* Review Modal */}
            <Modal
                open={showReviewModal}
                title={
                    <Space>
                        <StarFilled style={{ color: '#faad14' }} />
                        Đánh giá phim - {movie.title}
                    </Space>
                }
                onCancel={() => setShowReviewModal(false)}
                onOk={submitReview}
                okText="Gửi đánh giá"
                cancelText="Hủy"
                width={500}
            >
                <div style={{ padding: '20px 0' }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: 16 }}>
                                Bạn đánh giá phim này bao nhiêu sao?
                            </Text>
                            <Rate
                                allowHalf
                                value={userRating}
                                onChange={setUserRating}
                                style={{ fontSize: '32px' }}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">
                                    {userRating === 0 && 'Chọn số sao đánh giá'}
                                    {userRating > 0 && userRating <= 1 && 'Rất tệ'}
                                    {userRating > 1 && userRating <= 2 && 'Tệ'}
                                    {userRating > 2 && userRating <= 3 && 'Trung bình'}
                                    {userRating > 3 && userRating <= 4 && 'Tốt'}
                                    {userRating > 4 && 'Tuyệt vời'}
                                </Text>
                            </div>
                        </div>

                        <div>
                            <Text strong>Chia sẻ cảm nhận của bạn (tùy chọn):</Text>
                            <TextArea
                                rows={4}
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Viết đánh giá của bạn về bộ phim này..."
                                style={{ marginTop: 8 }}
                                maxLength={500}
                                showCount
                            />
                        </div>
                    </Space>
                </div>
            </Modal>
        </div >
    );
};

export default MovieDetailModern;