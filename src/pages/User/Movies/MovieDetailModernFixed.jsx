import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card, Row, Col, Typography, Button, Space, Tag, Rate,
    Breadcrumb, Tabs, List, Avatar, Modal, Progress, Statistic,
    Input, message
} from 'antd';
import {
    ArrowLeftOutlined, StarFilled, PlayCircleOutlined,
    HeartOutlined, HeartFilled, ShareAltOutlined, MessageOutlined,
    CalendarOutlined, EnvironmentOutlined, UserOutlined,
    EyeOutlined, LikeOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import { Play, Star, Clock, Calendar, Film } from 'lucide-react';
import moment from 'moment';
import { useAuth } from '../../../context/useAuth';
import moviesData from '../../../data/movies.json';
import cinemasData from '../../../data/cinemas.json';
import './MovieDetailModern.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const MovieDetailModern = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [trailerVisible, setTrailerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    const mockStats = {
        popularity: 89,
        views: 125432,
        bookings: 8934
    };

    const mockCast = [
        { id: 1, name: 'Nguyễn Văn A', character: 'Nhân vật chính', avatar: '/api/placeholder/60/60' },
        { id: 2, name: 'Trần Thị B', character: 'Nữ chính', avatar: '/api/placeholder/60/60' },
        { id: 3, name: 'Lê Văn C', character: 'Phản diện', avatar: '/api/placeholder/60/60' },
        { id: 4, name: 'Phạm Thị D', character: 'Vai phụ', avatar: '/api/placeholder/60/60' },
        { id: 5, name: 'Hoàng Văn E', character: 'Vai phụ', avatar: '/api/placeholder/60/60' },
        { id: 6, name: 'Vũ Thị F', character: 'Vai phụ', avatar: '/api/placeholder/60/60' }
    ];

    const mockComments = [
        {
            id: 1,
            user: 'Nguyễn Văn A',
            rating: 5,
            comment: 'Phim hay, diễn viên diễn xuất tốt, cốt truyện hấp dẫn!',
            date: '2024-01-15',
            likes: 15
        },
        {
            id: 2,
            user: 'Trần Thị B',
            rating: 4,
            comment: 'Phim khá ổn, có một số cảnh hơi chậm nhưng tổng thể vẫn hay.',
            date: '2024-01-14',
            likes: 8
        },
        {
            id: 3,
            user: 'Lê Văn C',
            rating: 5,
            comment: 'Rất xuất sắc! Đáng để xem trong rạp với âm thanh và hình ảnh chất lượng cao.',
            date: '2024-01-13',
            likes: 23
        }
    ];

    const dates = [
        { label: 'Hôm nay', value: moment().format('DD/MM') },
        { label: 'Ngày mai', value: moment().add(1, 'day').format('DD/MM') },
        { label: moment().add(2, 'days').format('dddd'), value: moment().add(2, 'days').format('DD/MM') },
        { label: moment().add(3, 'days').format('dddd'), value: moment().add(3, 'days').format('DD/MM') },
        { label: moment().add(4, 'days').format('dddd'), value: moment().add(4, 'days').format('DD/MM') }
    ];

    useEffect(() => {
        const foundMovie = moviesData.find(m => m.id === parseInt(id));
        if (foundMovie) {
            setMovie(foundMovie);
        }
        setLoading(false);
    }, [id]);

    const handleTrailer = () => {
        setTrailerVisible(true);
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        message.success(isFavorite ? 'Đã bỏ khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: movie.title,
                text: movie.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            message.success('Đã copy link phim!');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Text>Đang tải...</Text>
            </div>
        );
    }

    if (!movie) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Title level={3}>Không tìm thấy phim</Title>
                <Button type="primary" onClick={() => navigate('/movies')}>
                    Quay lại danh sách phim
                </Button>
            </div>
        );
    }

    return (
        <div className="movie-detail-modern">
            <div className="breadcrumb-section">
                <div className="container">
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={() => navigate('/')}>Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item onClick={() => navigate('/movies')}>Phim</Breadcrumb.Item>
                        <Breadcrumb.Item>{movie.title}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <div className="movie-hero-section">
                <div className="container">
                    <Row gutter={[32, 32]} align="middle">
                        <Col xs={24} sm={8} md={6}>
                            <div className="movie-poster-container">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="movie-poster-main"
                                />
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<Play size={20} />}
                                    className="trailer-btn-hero"
                                    onClick={handleTrailer}
                                    block
                                    style={{ marginTop: 16 }}
                                >
                                    Xem Trailer
                                </Button>
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
                                        className="favorite-btn"
                                    />
                                    <Button
                                        icon={<ShareAltOutlined />}
                                        onClick={handleShare}
                                        className="share-btn"
                                    />
                                </Space>

                                <Title level={1} className="movie-title-hero">
                                    {movie.title}
                                </Title>

                                <Space size={16} wrap className="movie-meta-info">
                                    <Space>
                                        <Star size={16} fill="#faad14" color="#faad14" />
                                        <Text strong style={{ color: '#faad14' }}>{movie.rating}/10</Text>
                                    </Space>
                                    <Space>
                                        <Clock size={16} />
                                        <Text>{movie.duration} phút</Text>
                                    </Space>
                                    <Space>
                                        <Calendar size={16} />
                                        <Text>{movie.releaseDate}</Text>
                                    </Space>
                                    <Space>
                                        <EyeOutlined />
                                        <Text>{mockStats.views.toLocaleString()} lượt xem</Text>
                                    </Space>
                                </Space>

                                <div className="movie-genres">
                                    {movie.genre?.split(', ').map((genre, index) => (
                                        <Tag key={index} className="genre-tag-hero">
                                            {genre}
                                        </Tag>
                                    ))}
                                </div>

                                <Paragraph className="movie-overview">
                                    {movie.description}
                                </Paragraph>

                                <Row gutter={16} className="movie-stats">
                                    <Col span={6}>
                                        <Statistic
                                            title="Độ phổ biến"
                                            value={mockStats.popularity}
                                            suffix="%"
                                            className="stat-text"
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title="Đánh giá"
                                            value={movie.rating}
                                            suffix="/10"
                                            precision={1}
                                            className="stat-text"
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title="Lượt xem"
                                            value={mockStats.views}
                                            className="stat-text"
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title="Bình luận"
                                            value={mockComments.length}
                                            className="stat-text"
                                        />
                                    </Col>
                                </Row>

                                <Space size={16} style={{ marginTop: 24 }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="book-ticket-btn"
                                        onClick={() => navigate('/booking/' + movie.id)}
                                    >
                                        Đặt vé ngay
                                    </Button>
                                    <Button
                                        size="large"
                                        icon={<PlayCircleOutlined />}
                                        className="watch-trailer-btn"
                                        onClick={handleTrailer}
                                    >
                                        Xem Trailer
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

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
                                                                            onClick={() => navigate('/booking/' + movie.id + '?cinema=' + cinema.id + '&time=' + time)}
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
                                        {user && (
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
                                        )}

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

            <Modal
                open={trailerVisible}
                title={'Trailer - ' + movie.title}
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
        </div>
    );
};

export default MovieDetailModern;
