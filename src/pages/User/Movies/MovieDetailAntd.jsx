import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
    Space,
    Tag,
    Rate,
    Tabs,
    List,
    Avatar,
    Input,
    Modal,
    Form,
    message,
    Tooltip,
    Divider,
    Image,
    Badge,
    Carousel,
    Empty,
    Breadcrumb,
    Statistic,
    Progress
} from 'antd';
import {
    PlayCircleOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    StarFilled,
    ShareAltOutlined,
    HeartOutlined,
    HeartFilled,
    UserOutlined,
    LikeOutlined,
    DislikeOutlined,
    MessageOutlined,
    EnvironmentOutlined,
    VideoCameraOutlined,
    SoundOutlined,
    TeamOutlined,
    FireOutlined,
    EyeOutlined,
    ArrowLeftOutlined,
    BookOutlined,
    HomeOutlined
} from '@ant-design/icons';
import {
    Play,
    Heart,
    Share2,
    Star,
    Clock,
    Calendar,
    MapPin,
    Users,
    Film,
    Volume2,
    Award,
    TrendingUp
} from 'lucide-react';
import moment from 'moment';
import useAuth from '../../../context/useAuth';
import movies from '../../../data/movies.json';
import seatDataJson from '../../../data/seatData.json';
import showtimesData from '../../../data/showtimes.json';
import cinemasData from '../../../data/cinemas.json';
import './MovieDetailAntd.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const MovieDetailAntd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [trailerVisible, setTrailerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data for enhanced features
    const mockStats = {
        popularity: 85,
        criticism: 4.2,
        audience: 4.6,
        views: 1250000
    };

    const mockCast = [
        { id: 1, name: 'Ryan Gosling', character: 'Ken', avatar: '/api/placeholder/80/80' },
        { id: 2, name: 'Margot Robbie', character: 'Barbie', avatar: '/api/placeholder/80/80' },
        { id: 3, name: 'Will Ferrell', character: 'CEO', avatar: '/api/placeholder/80/80' },
    ];

    const mockComments = [
        {
            id: 1,
            user: 'Nguyễn Văn A',
            rating: 5,
            comment: 'Bộ phim tuyệt vời! Tôi rất thích',
            date: '2025-08-10',
            likes: 12
        },
        {
            id: 2,
            user: 'Trần Thị B',
            rating: 4,
            comment: 'Phim hay, diễn xuất tốt',
            date: '2025-08-09',
            likes: 8
        }
    ];

    useEffect(() => {
        const movieData = movies.find(m => m.id === parseInt(id));
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
        <div className="movie-detail-modern">
            {/* Breadcrumb */}
            <div className="container">
                <Breadcrumb className="movie-breadcrumb">
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

            {/* Hero Section */}
            <div className="movie-hero-section">
                <div className="movie-hero-background">
                    <img src={movie.poster} alt={movie.title} />
                    <div className="hero-overlay" />
                </div>

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
                                >
                                    Xem Trailer
                                </Button>
                            </div>
                        </Col>

                        <Col xs={24} sm={16} md={18}>
                            <div className="movie-info-hero">
                                <Space className="movie-actions-top">
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

                                <Space size={8} wrap className="movie-genres">
                                    {movie.genre.split(', ').map(genre => (
                                        <Tag key={genre} color="processing" className="genre-tag-hero">
                                            {genre}
                                        </Tag>
                                    ))}
                                </Space>

                                <Paragraph className="movie-overview">
                                    {movie.overview}
                                </Paragraph>

                                <Space size={16} className="movie-stats">
                                    <div className="stat-item">
                                        <Text type="secondary">Độ phổ biến</Text>
                                        <Progress
                                            percent={mockStats.popularity}
                                            size="small"
                                            strokeColor="#52c41a"
                                            showInfo={false}
                                        />
                                        <Text strong>{mockStats.popularity}%</Text>
                                    </div>
                                </Space>

                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<BookOutlined />}
                                    className="book-ticket-btn-hero"
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
            <div className="container movie-content-section">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    size="large"
                    className="movie-tabs"
                >
                    <Tabs.TabPane key="overview" tab={
                        <Space>
                            <Film size={16} />
                            Tổng quan
                        </Space>
                    }>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={16}>
                                <Card className="movie-details-card" title="Thông tin chi tiết">
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Space direction="vertical" size={4}>
                                                <Text type="secondary">Đạo diễn</Text>
                                                <Text strong>Greta Gerwig</Text>
                                            </Space>
                                        </Col>
                                        <Col span={12}>
                                            <Space direction="vertical" size={4}>
                                                <Text type="secondary">Quốc gia</Text>
                                                <Text strong>Hoa Kỳ</Text>
                                            </Space>
                                        </Col>
                                        <Col span={12}>
                                            <Space direction="vertical" size={4}>
                                                <Text type="secondary">Ngôn ngữ</Text>
                                                <Text strong>Tiếng Anh (Phụ đề Việt)</Text>
                                            </Space>
                                        </Col>
                                        <Col span={12}>
                                            <Space direction="vertical" size={4}>
                                                <Text type="secondary">Độ tuổi</Text>
                                                <Text strong>T13 - Phim dành cho khán giả từ đủ 13 tuổi trở lên</Text>
                                            </Space>
                                        </Col>
                                    </Row>
                                </Card>

                                <Card className="movie-cast-card" title="Diễn viên">
                                    <Row gutter={[16, 16]}>
                                        {mockCast.map(actor => (
                                            <Col key={actor.id} xs={8} sm={6} md={4}>
                                                <div className="cast-member">
                                                    <Avatar size={64} src={actor.avatar} />
                                                    <div className="cast-info">
                                                        <Text strong className="cast-name">{actor.name}</Text>
                                                        <Text type="secondary" className="cast-character">{actor.character}</Text>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card>
                            </Col>

                            <Col xs={24} lg={8}>
                                <Card className="movie-ratings-card" title="Đánh giá">
                                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                                        <div className="rating-overview">
                                            <div className="main-rating">
                                                <Title level={2} style={{ margin: 0, color: '#faad14' }}>
                                                    {movie.rating}
                                                </Title>
                                                <Rate disabled value={movie.rating / 2} allowHalf />
                                                <Text type="secondary">từ {Math.floor(Math.random() * 1000 + 500)} đánh giá</Text>
                                            </div>
                                        </div>

                                        <Divider />

                                        <div className="rating-breakdown">
                                            <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                                <div className="rating-item">
                                                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                                        <Text>Phê bình</Text>
                                                        <Text strong>{mockStats.criticism}/5</Text>
                                                    </Space>
                                                    <Progress percent={mockStats.criticism * 20} size="small" showInfo={false} />
                                                </div>
                                                <div className="rating-item">
                                                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                                        <Text>Khán giả</Text>
                                                        <Text strong>{mockStats.audience}/5</Text>
                                                    </Space>
                                                    <Progress percent={mockStats.audience * 20} size="small" showInfo={false} strokeColor="#52c41a" />
                                                </div>
                                            </Space>
                                        </div>
                                    </Space>
                                </Card>

                                <Card className="movie-stats-card" title="Thống kê">
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Statistic
                                                title="Lượt xem"
                                                value={mockStats.views}
                                                prefix={<EyeOutlined />}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic
                                                title="Yêu thích"
                                                value={Math.floor(mockStats.views * 0.15)}
                                                prefix={<HeartOutlined />}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Tabs.TabPane>

                    <Tabs.TabPane key="showtimes" tab={
                        <Space>
                            <CalendarOutlined />
                            Lịch chiếu
                        </Space>
                    }>
                        <Card className="showtimes-card">
                            <Space direction="vertical" size={24} style={{ width: '100%' }}>
                                <div className="date-selector">
                                    <Space size={8}>
                                        {dates.map((date, index) => (
                                            <Button
                                                key={index}
                                                type={selectedDate === index ? 'primary' : 'default'}
                                                onClick={() => setSelectedDate(index)}
                                                className="date-btn"
                                            >
                                                <div>
                                                    <div>{date.label}</div>
                                                    <div style={{ fontSize: '12px' }}>{date.value}</div>
                                                </div>
                                            </Button>
                                        ))}
                                    </Space>
                                </div>

                                <div className="cinema-showtimes">
                                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                                        {cinemasData.slice(0, 3).map(cinema => (
                                            <Card key={cinema.id} size="small" className="cinema-card">
                                                <Row align="middle">
                                                    <Col xs={24} sm={8}>
                                                        <Space>
                                                            <EnvironmentOutlined />
                                                            <div>
                                                                <Text strong>{cinema.name}</Text>
                                                                <br />
                                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                    {cinema.address}
                                                                </Text>
                                                            </div>
                                                        </Space>
                                                    </Col>
                                                    <Col xs={24} sm={16}>
                                                        <Space wrap>
                                                            {['14:30', '17:00', '19:30', '22:00'].map(time => (
                                                                <Button
                                                                    key={time}
                                                                    onClick={() => navigate(`/booking/${movie.id}?time=${time}&cinema=${cinema.id}`)}
                                                                    className="showtime-btn"
                                                                >
                                                                    {time}
                                                                </Button>
                                                            ))}
                                                        </Space>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}
                                    </Space>
                                </div>
                            </Space>
                        </Card>
                    </Tabs.TabPane>

                    <Tabs.TabPane key="comments" tab={
                        <Space>
                            <MessageOutlined />
                            Bình luận ({mockComments.length})
                        </Space>
                    }>
                        <Card className="comments-card">
                            <Space direction="vertical" size={16} style={{ width: '100%' }}>
                                <div className="add-comment">
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                                        className="comment-input"
                                    />
                                    <div style={{ textAlign: 'right', marginTop: 8 }}>
                                        <Space>
                                            <Rate allowHalf defaultValue={5} />
                                            <Button type="primary">Gửi bình luận</Button>
                                        </Space>
                                    </div>
                                </div>

                                <Divider />

                                <List
                                    itemLayout="vertical"
                                    dataSource={mockComments}
                                    renderItem={comment => (
                                        <List.Item
                                            actions={[
                                                <Button type="text" icon={<LikeOutlined />} size="small">
                                                    {comment.likes}
                                                </Button>,
                                                <Button type="text" icon={<MessageOutlined />} size="small">
                                                    Trả lời
                                                </Button>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar icon={<UserOutlined />} />}
                                                title={
                                                    <Space>
                                                        <Text strong>{comment.user}</Text>
                                                        <Rate disabled value={comment.rating} size="small" />
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                            {comment.date}
                                                        </Text>
                                                    </Space>
                                                }
                                                description={comment.comment}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Space>
                        </Card>
                    </Tabs.TabPane>
                </Tabs>
            </div>

            {/* Trailer Modal */}
            <Modal
                title="Trailer - " + movie.title
            open={trailerVisible}
            onCancel={() => setTrailerVisible(false)}
            footer={null}
            width={800}
            centered
            >
            <div style={{ width: '100%', height: '400px', background: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff' }}>Video player would be here</Text>
            </div>
        </Modal>
        </div >
    );
};

// Group by room
const groupedByRoom = {};
cinemaShowtimes.forEach(showtime => {
    if (!groupedByRoom[showtime.roomId]) {
        groupedByRoom[showtime.roomId] = [];
    }
    groupedByRoom[showtime.roomId].push({
        time: showtime.time,
        availableSeats: showtime.availableSeats || 50
    });
});

const rooms = Object.keys(groupedByRoom).map(roomId => {
    const room = cinema.rooms.find(r => r.id === roomId);
    return {
        id: roomId,
        name: room?.name || `Phòng ${roomId}`,
        type: room?.type?.toLowerCase() === 'imax' ? 'imax' : 'standard',
        times: groupedByRoom[roomId].sort((a, b) => a.time.localeCompare(b.time)),
        price: room?.type?.toLowerCase() === 'imax' ? 120000 : 80000,
        features: room?.type?.toLowerCase() === 'imax' ? ['subtitles', '3d'] : ['subtitles']
    };
});

return {
    id: parseInt(cinemaId),
    name: cinema?.name || `Rạp ${cinemaId}`,
    address: cinema?.address || 'Địa chỉ không xác định',
    rooms: rooms
};
            });

// Format date display
const formatDate = (dateStr) => {
    const today = moment().format('YYYY-MM-DD');
    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');

    if (dateStr === today) return 'Hôm nay';
    if (dateStr === tomorrow) return 'Ngày mai';

    // For other dates, return Vietnamese day name
    const momentDate = moment(dateStr);
    const dayNames = {
        'Monday': 'Thứ Hai',
        'Tuesday': 'Thứ Ba',
        'Wednesday': 'Thứ Tư',
        'Thursday': 'Thứ Năm',
        'Friday': 'Thứ Sáu',
        'Saturday': 'Thứ Bảy',
        'Sunday': 'Chủ Nhật'
    };

    const englishDay = momentDate.format('dddd');
    return dayNames[englishDay] || momentDate.format('DD/MM');
};

return {
    date: date,
    dayName: formatDate(date),
    cinemas: cinemas
};
        });

return result.sort((a, b) => moment(a.date).diff(moment(b.date)));
    };

const showtimes = generateShowtimesFromData();

// Debug log
console.log('Generated showtimes for movie', id, ':', showtimes);

// Fallback showtimes if no data found
const displayShowtimes = showtimes.length > 0 ? showtimes : [
    {
        date: moment().format('YYYY-MM-DD'),
        dayName: 'Hôm nay',
        cinemas: [
            {
                id: 1,
                name: 'HotCinemas Landmark',
                address: 'Landmark 81, Bình Thạnh, TP.HCM',
                rooms: [
                    {
                        id: 'P4',
                        name: 'Phòng chiếu 4',
                        type: 'standard',
                        times: [
                            { time: '21:00', availableSeats: 50 }
                        ],
                        price: 80000,
                        features: ['subtitles']
                    }
                ]
            }
        ]
    },
    {
        date: moment().add(1, 'day').format('YYYY-MM-DD'),
        dayName: 'Ngày mai',
        cinemas: [
            {
                id: 1,
                name: 'HotCinemas Landmark',
                address: 'Landmark 81, Bình Thạnh, TP.HCM',
                rooms: [
                    {
                        id: 'P4',
                        name: 'Phòng chiếu 4',
                        type: 'standard',
                        times: [
                            { time: '14:00', availableSeats: 45 },
                            { time: '19:00', availableSeats: 20 },
                            { time: '22:00', availableSeats: 35 }
                        ],
                        price: 80000,
                        features: ['subtitles']
                    }
                ]
            }
        ]
    },
    {
        date: moment().add(2, 'day').format('YYYY-MM-DD'),
        dayName: (() => {
            const momentDate = moment().add(2, 'day');
            const dayNames = {
                'Monday': 'Thứ Hai',
                'Tuesday': 'Thứ Ba',
                'Wednesday': 'Thứ Tư',
                'Thursday': 'Thứ Năm',
                'Friday': 'Thứ Sáu',
                'Saturday': 'Thứ Bảy',
                'Sunday': 'Chủ Nhật'
            };
            const englishDay = momentDate.format('dddd');
            return dayNames[englishDay] || momentDate.format('DD/MM');
        })(),
        cinemas: [
            {
                id: 1,
                name: 'HotCinemas Landmark',
                address: 'Landmark 81, Bình Thạnh, TP.HCM',
                rooms: [
                    {
                        id: 'P4',
                        name: 'Phòng chiếu 4',
                        type: 'standard',
                        times: [
                            { time: '16:00', availableSeats: 42 },
                            { time: '20:30', availableSeats: 28 }
                        ],
                        price: 80000,
                        features: ['subtitles']
                    }
                ]
            }
        ]
    }
];

// Mock comments
const comments = [
    {
        id: 1,
        user: {
            name: 'Nguyễn Văn A',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        rating: 5,
        title: 'Phim hay tuyệt vời!',
        content: 'Cốt truyện hấp dẫn, diễn xuất tốt, hiệu ứng đẹp. Đáng xem!',
        createdAt: '2024-01-20 14:30',
        likes: 15,
        dislikes: 1
    }
];

// Related movies
const relatedMovies = movies.slice(0, 5).map(m => ({
    ...m,
    id: m.id !== parseInt(id) ? m.id : m.id + 1
}));

useEffect(() => {
    console.log('MovieDetailAntd - ID from params:', id);
    console.log('MovieDetailAntd - Parsed ID:', parseInt(id));
    console.log('MovieDetailAntd - Total movies count:', movies.length);
    const foundMovie = movies.find(m => m.id === parseInt(id));
    console.log('MovieDetailAntd - Found movie:', foundMovie);
    if (foundMovie) {
        setMovie(foundMovie);
    }
    setLoading(false);
}, [id]);

const handleToggleFavorite = () => {
    if (!mockUser) {
        message.warning('Vui lòng đăng nhập để thêm vào yêu thích');
        return;
    }
    setIsFavorite(!isFavorite);
    message.success(isFavorite ? 'Đã bỏ khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
};

const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Đã sao chép link phim!');
};

const handleBooking = (cinemaId, roomId, time) => {
    if (!mockUser) {
        message.warning('Vui lòng đăng nhập để đặt vé');
        return;
    }

    // Find cinema and room info
    const cinema = displayShowtimes[selectedDate].cinemas.find(c => c.id === cinemaId);
    const room = cinema.rooms.find(r => r.id === roomId);

    setBookingInfo({
        movieId: movie.id,
        movieTitle: movie.title,
        cinemaId,
        cinemaName: cinema.name,
        cinemaAddress: cinema.address,
        roomId,
        roomName: room.name,
        roomType: room.type,
        showtime: time,
        date: displayShowtimes[selectedDate].date,
        dayName: displayShowtimes[selectedDate].dayName
    });
    setSeatModalVisible(true);
};

const handleSeatSelect = (seatId) => {
    if (selectedSeats.includes(seatId)) {
        setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
        if (selectedSeats.length < 8) { // Max 8 seats
            setSelectedSeats([...selectedSeats, seatId]);
        } else {
            message.warning('Tối đa 8 ghế cho một lần đặt');
        }
    }
};

const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
        const seat = seatData.find(s => s.id === seatId);
        return total + (seat ? seat.price : 0);
    }, 0);
};

const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
        message.warning('Vui lòng chọn ít nhất một ghế');
        return;
    }

    const totalPrice = calculateTotalPrice();
    Modal.confirm({
        title: 'Xác nhận đặt vé',
        content: (
            <div>
                <p><strong>Phim:</strong> {bookingInfo?.movieTitle}</p>
                <p><strong>Rạp:</strong> {bookingInfo?.cinemaName}</p>
                <p><strong>Phòng:</strong> {bookingInfo?.roomName}</p>
                <p><strong>Suất chiếu:</strong> {bookingInfo?.showtime} - {bookingInfo?.dayName}</p>
                <p><strong>Ghế:</strong> {selectedSeats.join(', ')}</p>
                <p><strong>Tổng tiền:</strong> {totalPrice.toLocaleString('vi-VN')} VNĐ</p>
            </div>
        ),
        onOk() {
            message.success('Đặt vé thành công! Vui lòng thanh toán để hoàn tất.');
            setSeatModalVisible(false);
            setSelectedSeats([]);
            setBookingInfo(null);
        },
        okText: 'Xác nhận',
        cancelText: 'Hủy'
    });
};

const handleCommentSubmit = (values) => {
    if (!mockUser) {
        message.warning('Vui lòng đăng nhập để bình luận');
        return;
    }
    console.log('Comment:', values);
    message.success('Bình luận đã được gửi!');
    setCommentModalVisible(false);
    commentForm.resetFields();
};

const getRoomTypeColor = (type) => {
    const colors = {
        standard: 'blue',
        imax: 'red',
        vip: 'gold',
        premium: 'purple',
        '4dx': 'magenta',
        dolby: 'cyan'
    };
    return colors[type] || 'blue';
};

const getRoomTypeName = (type) => {
    const names = {
        standard: 'Thường',
        imax: 'IMAX',
        vip: 'VIP',
        premium: 'Premium',
        '4dx': '4DX',
        dolby: 'Dolby Atmos'
    };
    return names[type] || type;
};

if (loading) {
    return (
        <div className="movie-detail-antd">
            <div className="container">
                <Card loading={true} style={{ height: 400 }} />
            </div>
        </div>
    );
}

if (!movie) {
    return (
        <div className="movie-detail-antd">
            <div className="container">
                <Empty description="Không tìm thấy phim" />
            </div>
        </div>
    );
}

return (
    <div className="movie-detail-antd">
        <div className="container">
            {/* Hero Section - Enhanced Layout */}
            <div className="hero-section">
                <Card className="hero-card">
                    <Row gutter={[24, 20]} align="top">
                        <Col xs={24} sm={8} md={7} lg={6}>
                            <div className="poster-section">
                                <div className="poster-wrapper">
                                    <Image
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="poster-image"
                                        preview={false}
                                    />
                                    <div className="movie-badges">
                                        {movie.format && (
                                            <Tag className="format-badge">{movie.format}</Tag>
                                        )}
                                        <Tag className="age-badge" color="orange">
                                            {movie.ageLabel || 'T18'}
                                        </Tag>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={16} md={17} lg={18}>
                            <div className="movie-info-section">
                                <div className="movie-header">
                                    <Title level={1} className="movie-title">
                                        {movie.title}
                                    </Title>
                                    <Text className="movie-subtitle" type="secondary">
                                        {movie.originalTitle && movie.originalTitle !== movie.title ? movie.originalTitle : ''}
                                    </Text>
                                </div>

                                <div className="rating-overview">
                                    <div className="rating-main">
                                        <div className="rating-score-large">
                                            <span className="score-number">{movie.rating}</span>
                                            <span className="score-max">/5</span>
                                        </div>
                                        <div className="rating-details">
                                            <Rate
                                                disabled
                                                value={movie.rating}
                                                className="rating-stars"
                                            />
                                            <Text type="secondary" className="rating-count">
                                                ({comments.length} đánh giá)
                                            </Text>
                                        </div>
                                    </div>
                                </div>

                                <div className="movie-details-grid">
                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <ClockCircleOutlined className="detail-icon" />
                                            <div className="detail-content">
                                                <Text className="detail-value">{movie.duration} phút</Text>
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <CalendarOutlined className="detail-icon" />
                                            <div className="detail-content">
                                                <Text className="detail-value">{movie.releaseDate}</Text>
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <VideoCameraOutlined className="detail-icon" />
                                            <div className="detail-content">
                                                <Text className="detail-value">{movie.director}</Text>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="genre-section">
                                    <Text className="section-label">Thể loại</Text>
                                    <Space wrap className="genre-tags">
                                        {movie.genre?.split(', ').map(genre => (
                                            <Tag key={genre} color="blue" className="genre-tag">
                                                {genre}
                                            </Tag>
                                        ))}
                                    </Space>
                                </div>

                                <div className="action-buttons-section">
                                    <Space size="middle" wrap className="action-buttons">
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<PlayCircleOutlined />}
                                            onClick={() => setTrailerVisible(true)}
                                            className="primary-btn"
                                        >
                                            Xem Trailer
                                        </Button>
                                        <Button
                                            size="large"
                                            icon={<CalendarOutlined />}
                                            onClick={() => {
                                                if (!mockUser) {
                                                    message.warning('Vui lòng đăng nhập để đặt vé');
                                                    return;
                                                }
                                                setBookingInfo({
                                                    movieId: movie.id,
                                                    movieTitle: movie.title,
                                                    cinemaId: 1,
                                                    cinemaName: 'HotCinemas Vincom',
                                                    cinemaAddress: '72 Lê Thánh Tôn, Quận 1, TP.HCM',
                                                    roomId: 1,
                                                    roomName: 'Phòng thường',
                                                    roomType: 'standard',
                                                    showtime: '19:00',
                                                    date: '2024-01-25',
                                                    dayName: 'Hôm nay'
                                                });
                                                setSeatModalVisible(true);
                                            }}
                                            className="booking-test-btn"
                                            style={{ background: '#1890ff', borderColor: '#1890ff', color: '#fff' }}
                                        >
                                            Đặt Vé
                                        </Button>
                                        <Button
                                            size="large"
                                            icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                                            onClick={handleToggleFavorite}
                                            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                                        >
                                            {isFavorite ? '❤️' : '🤍'}
                                        </Button>
                                    </Space>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* Movie Description */}
            <Card className="description-card">
                <Title level={4} className="section-title">
                    <FireOutlined /> Nội dung phim
                </Title>
                <Paragraph className="description-text">
                    {movie.description}
                </Paragraph>
                {movie.cast && movie.cast.length > 0 && (
                    <>
                        <Title level={5} className="sub-title">
                            <TeamOutlined /> Diễn viên chính
                        </Title>
                        <Text className="cast-text">
                            {movie.cast.map(actor => actor.name).join(', ')}
                        </Text>
                    </>
                )}
            </Card>

            {/* Main Content */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={18}>
                    <Card className="content-card">
                        <Tabs defaultActiveKey="showtimes" className="content-tabs">
                            <TabPane
                                tab={
                                    <span>
                                        <CalendarOutlined />
                                        Lịch chiếu
                                    </span>
                                }
                                key="showtimes"
                            >
                                <div className="showtimes-section">

                                    {/* Enhanced Cinema List */}
                                    <div className="cinema-list-enhanced">
                                        {/* Date Selector for Multiple Days */}
                                        {displayShowtimes.length > 1 && (
                                            <div className="multi-date-selector">
                                                <div className="date-selector-header">
                                                    <Title level={5} style={{ color: '#fff', margin: 0, fontSize: '16px' }}>
                                                        <CalendarOutlined style={{ marginRight: 8, color: '#e50914' }} />
                                                        Chọn ngày chiếu
                                                    </Title>
                                                    <Text type="secondary" style={{ fontSize: '13px' }}>
                                                        {displayShowtimes.length} ngày có suất chiếu
                                                    </Text>
                                                </div>
                                                <div className="date-tabs-container">
                                                    {displayShowtimes.map((day, index) => {
                                                        const isToday = day.dayName === 'Hôm nay';
                                                        const isTomorrow = day.dayName === 'Ngày mai';
                                                        const isSelected = selectedDate === index;
                                                        const totalCinemas = day.cinemas.length;
                                                        const totalShowtimes = day.cinemas.reduce((total, cinema) =>
                                                            total + cinema.rooms.reduce((roomTotal, room) =>
                                                                roomTotal + room.times.length, 0), 0);

                                                        return (
                                                            <div
                                                                key={day.date}
                                                                className={`date-tab ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                                                onClick={() => setSelectedDate(index)}
                                                            >
                                                                <div className="date-tab-header">
                                                                    {isToday && <span className="date-badge today">Hôm nay</span>}
                                                                    {isTomorrow && <span className="date-badge tomorrow">Ngày mai</span>}
                                                                </div>
                                                                <div className="date-tab-content">
                                                                    <div className="day-name">
                                                                        {isToday || isTomorrow ? day.dayName : moment(day.date).format('dddd')}
                                                                    </div>
                                                                    <div className="date-number">
                                                                        {moment(day.date).format('DD/MM')}
                                                                    </div>
                                                                    <div className="date-stats">
                                                                        <span className="stat">{totalCinemas} rạp</span>
                                                                        <span className="stat">{totalShowtimes} suất</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <div className="cinema-list-header">
                                            <div className="header-left">
                                                <Title level={5} style={{ color: '#fff', margin: 0, fontSize: '16px' }}>
                                                    <EnvironmentOutlined style={{ marginRight: 8, color: '#e50914' }} />
                                                    Rạp chiếu phim
                                                </Title>
                                                <Text type="secondary" style={{ fontSize: '13px' }}>
                                                    {displayShowtimes[selectedDate]?.dayName} • {displayShowtimes[selectedDate]?.cinemas.length} rạp có suất chiếu
                                                </Text>
                                            </div>
                                            <div className="header-right">
                                                <div className="date-badge">
                                                    {displayShowtimes[selectedDate]?.dayName}
                                                </div>
                                            </div>
                                        </div>

                                        {displayShowtimes[selectedDate]?.cinemas.map((cinema, cinemaIndex) => (
                                            <Card
                                                key={cinema.id}
                                                className="cinema-card-enhanced"
                                                style={{ marginBottom: 24 }}
                                            >
                                                {/* Cinema Header */}
                                                <div className="cinema-header-enhanced">
                                                    <div className="cinema-main-info">
                                                        <div className="cinema-name-section">
                                                            <Title level={4} className="cinema-name">
                                                                <EnvironmentOutlined style={{ color: '#e50914', marginRight: 8 }} />
                                                                {cinema.name}
                                                            </Title>
                                                            <div className="cinema-badges">
                                                                <Tag color="blue" className="cinema-index-tag">
                                                                    Rạp #{cinemaIndex + 1}
                                                                </Tag>
                                                                {cinema.rooms.some(room => room.type === 'imax') && (
                                                                    <Tag color="red" className="premium-tag">
                                                                        <SoundOutlined /> IMAX
                                                                    </Tag>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Text type="secondary" className="cinema-address">
                                                            {cinema.address}
                                                        </Text>
                                                    </div>
                                                    <div className="cinema-summary">
                                                        <div className="summary-item">
                                                            <Text className="summary-number">{cinema.rooms.length}</Text>
                                                            <Text className="summary-label">Phòng chiếu</Text>
                                                        </div>
                                                        <div className="summary-item">
                                                            <Text className="summary-number">
                                                                {cinema.rooms.reduce((total, room) => total + room.times.length, 0)}
                                                            </Text>
                                                            <Text className="summary-label">Suất chiếu</Text>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Rooms */}
                                                <div className="rooms-container">
                                                    {cinema.rooms.map((room, roomIndex) => (
                                                        <div key={room.id} className="room-section-enhanced">
                                                            <div className="room-header">
                                                                <div className="room-info-left">
                                                                    <div className="room-title-section">
                                                                        <Tag
                                                                            color={getRoomTypeColor(room.type)}
                                                                            className="room-type-tag-enhanced"
                                                                            icon={room.type === 'imax' ? <SoundOutlined /> : <VideoCameraOutlined />}
                                                                        >
                                                                            {getRoomTypeName(room.type)}
                                                                        </Tag>
                                                                        <Text className="room-name-enhanced">{room.name}</Text>
                                                                    </div>
                                                                    <Space size="small" className="room-features-enhanced">
                                                                        {room.features?.includes('subtitles') && (
                                                                            <Tag size="small" color="cyan" className="feature-tag">
                                                                                <MessageOutlined style={{ fontSize: 10 }} /> Phụ đề
                                                                            </Tag>
                                                                        )}
                                                                        {room.features?.includes('3d') && (
                                                                            <Tag size="small" color="purple" className="feature-tag">
                                                                                <EyeOutlined style={{ fontSize: 10 }} /> 3D
                                                                            </Tag>
                                                                        )}
                                                                        {room.features?.includes('recliner') && (
                                                                            <Tag size="small" color="green" className="feature-tag">
                                                                                Ghế nằm
                                                                            </Tag>
                                                                        )}
                                                                    </Space>
                                                                </div>
                                                                <div className="room-info-right">
                                                                    <div className="price-section">
                                                                        <Text className="price-label">Giá vé từ</Text>
                                                                        <Text className="room-price-enhanced">
                                                                            {new Intl.NumberFormat('vi-VN').format(room.price)}₫
                                                                        </Text>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="time-slots-enhanced">
                                                                <div className="time-slots-header">
                                                                    <Text className="time-slots-title">
                                                                        Suất chiếu ({room.times.length} suất)
                                                                    </Text>
                                                                </div>
                                                                <div className="time-buttons-grid">
                                                                    {room.times.map((timeSlot, index) => {
                                                                        const time = typeof timeSlot === 'string' ? timeSlot : timeSlot.time;
                                                                        const availableSeats = typeof timeSlot === 'object' ? timeSlot.availableSeats : 50;

                                                                        const isPast = false;
                                                                        const isAlmostFull = availableSeats <= 15;
                                                                        const isSoldOut = availableSeats <= 5;

                                                                        return (
                                                                            <Tooltip
                                                                                key={time}
                                                                                title={
                                                                                    isPast ? 'Suất chiếu đã qua' :
                                                                                        isSoldOut ? `Sắp hết vé (còn ${availableSeats} ghế)` :
                                                                                            isAlmostFull ? `Sắp hết vé (còn ${availableSeats} ghế)` :
                                                                                                `Còn ${availableSeats} ghế trống`
                                                                                }
                                                                                placement="top"
                                                                            >
                                                                                <div
                                                                                    className={`time-btn-enhanced ${isPast ? 'past' :
                                                                                        isSoldOut ? 'sold-out' :
                                                                                            isAlmostFull ? 'almost-full' : 'available'
                                                                                        }`}
                                                                                    onClick={() => !isPast && !isSoldOut && handleBooking(cinema.id, room.id, time)}
                                                                                >
                                                                                    <div className="time-btn-content">
                                                                                        <span className="time-text-enhanced">{time}</span>
                                                                                        <span className="seats-text">
                                                                                            {isSoldOut ? 'Hết vé' :
                                                                                                isAlmostFull ? 'Sắp hết' :
                                                                                                    `${availableSeats} ghế`}
                                                                                        </span>
                                                                                    </div>
                                                                                    {!isPast && !isSoldOut && (
                                                                                        <div className="time-btn-overlay">
                                                                                            <PlayCircleOutlined className="play-icon" />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </Tooltip>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </TabPane>

                            <TabPane
                                tab={
                                    <span>
                                        <MessageOutlined />
                                        Bình luận ({comments.length})
                                    </span>
                                }
                                key="comments"
                            >
                                <div className="comments-section">
                                    <div className="comments-header">
                                        <Space>
                                            <Button
                                                type="primary"
                                                onClick={() => setCommentModalVisible(true)}
                                            >
                                                Viết bình luận
                                            </Button>
                                            <Text type="secondary">
                                                Chia sẻ cảm nghĩ của bạn về bộ phim
                                            </Text>
                                        </Space>
                                    </div>

                                    <List
                                        dataSource={comments}
                                        renderItem={comment => (
                                            <List.Item className="comment-item">
                                                <List.Item.Meta
                                                    avatar={<Avatar src={comment.user.avatar} />}
                                                    title={
                                                        <div className="comment-header">
                                                            <Text strong>{comment.user.name}</Text>
                                                            <Rate disabled defaultValue={comment.rating} size="small" />
                                                        </div>
                                                    }
                                                    description={
                                                        <div className="comment-content">
                                                            <Title level={5}>{comment.title}</Title>
                                                            <Paragraph>{comment.content}</Paragraph>
                                                            <Text type="secondary">
                                                                {moment(comment.createdAt).format('DD/MM/YYYY HH:mm')}
                                                            </Text>
                                                        </div>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </TabPane>

                            <TabPane
                                tab={
                                    <span>
                                        <EyeOutlined />
                                        Thư viện ảnh
                                    </span>
                                }
                                key="gallery"
                            >
                                <div className="gallery-section">
                                    <div className="gallery-header">
                                        <Space>
                                            <Text style={{ color: '#fff' }}>Chế độ xem:</Text>
                                            <Button.Group size="small">
                                                <Button
                                                    type={imageViewMode === 'contain' ? 'primary' : 'default'}
                                                    onClick={() => setImageViewMode('contain')}
                                                    className="view-mode-btn"
                                                >
                                                    Ảnh đầy đủ
                                                </Button>
                                                <Button
                                                    type={imageViewMode === 'cover' ? 'primary' : 'default'}
                                                    onClick={() => setImageViewMode('cover')}
                                                    className="view-mode-btn"
                                                >
                                                    Ảnh khít khung
                                                </Button>
                                            </Button.Group>
                                        </Space>
                                    </div>
                                    <div className="gallery-container">
                                        <Carousel autoplay dotPosition="bottom">
                                            <div className="gallery-item">
                                                <img
                                                    src={movie.poster}
                                                    alt="Movie Poster"
                                                    className={`gallery-image ${imageViewMode}`}
                                                />
                                            </div>
                                            <div className="gallery-item">
                                                <img
                                                    src={movie.backgroundImage || movie.poster}
                                                    alt="Movie Background"
                                                    className={`gallery-image ${imageViewMode}`}
                                                />
                                            </div>
                                            <div className="gallery-item">
                                                <img
                                                    src={movie.trailer ? `https://img.youtube.com/vi/${movie.trailer.split('/').pop()}/maxresdefault.jpg` : movie.poster}
                                                    alt="Movie Scene"
                                                    className={`gallery-image ${imageViewMode}`}
                                                />
                                            </div>
                                        </Carousel>
                                    </div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>

                <Col xs={24} lg={6}>
                    <div className="sidebar-section">
                        <Card className="sidebar-card"
                            title={
                                <Space>
                                    <FireOutlined style={{ color: '#e50914' }} />
                                    <span>Phim đề xuất</span>
                                </Space>
                            }>
                            <div className="related-movies-grid">
                                {relatedMovies.map((relatedMovie, index) => (
                                    <div key={relatedMovie.id} className="related-movie-card">
                                        <div className="related-movie-poster-container">
                                            <Image
                                                src={relatedMovie.poster}
                                                className="related-movie-poster"
                                                preview={false}
                                            />
                                            <div className="related-movie-overlay">
                                                <Button
                                                    type="primary"
                                                    icon={<PlayCircleOutlined />}
                                                    size="small"
                                                    onClick={() => navigate(`/movies/${relatedMovie.id}`)}
                                                    className="watch-btn"
                                                >
                                                    Xem
                                                </Button>
                                            </div>
                                            <div className="movie-rank">#{index + 1}</div>
                                        </div>
                                        <div className="related-movie-content">
                                            <Title
                                                level={5}
                                                className="related-movie-title"
                                                onClick={() => navigate(`/movies/${relatedMovie.id}`)}
                                            >
                                                {relatedMovie.title}
                                            </Title>
                                            <div className="related-movie-meta">
                                                <Space direction="vertical" size={4}>
                                                    <div className="movie-genre-rating">
                                                        <Tag size="small" color="blue">{relatedMovie.genre?.split(', ')[0]}</Tag>
                                                        <div className="rating-badge">
                                                            <StarFilled style={{ color: '#fadb14', fontSize: '12px' }} />
                                                            <span>{relatedMovie.rating}</span>
                                                        </div>
                                                    </div>
                                                    <Text type="secondary" className="movie-year">
                                                        {relatedMovie.releaseDate || '2024'}
                                                    </Text>
                                                </Space>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* Comment Modal */}
            <Modal
                title="Viết bình luận"
                open={commentModalVisible}
                onCancel={() => setCommentModalVisible(false)}
                footer={null}
                className="comment-modal"
            >
                <Form
                    form={commentForm}
                    layout="vertical"
                    onFinish={handleCommentSubmit}
                >
                    <Form.Item
                        label="Đánh giá"
                        name="rating"
                        rules={[{ required: true, message: 'Vui lòng chọn đánh giá!' }]}
                    >
                        <Rate />
                    </Form.Item>
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input placeholder="Nhập tiêu đề bình luận..." />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        name="content"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                    >
                        <TextArea rows={4} placeholder="Chia sẻ cảm nghĩ của bạn về bộ phim..." />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button onClick={() => setCommentModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Gửi bình luận
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Seat Selection Modal */}
            <Modal
                title={
                    <div>
                        <PlayCircleOutlined style={{ color: '#e50914', marginRight: 8 }} />
                        Chọn ghế - {bookingInfo?.movieTitle}
                    </div>
                }
                open={seatModalVisible}
                onCancel={() => {
                    setSeatModalVisible(false);
                    setSelectedSeats([]);
                    setBookingInfo(null);
                }}
                width={800}
                className="seat-modal"
                footer={[
                    <Button key="cancel" onClick={() => {
                        setSeatModalVisible(false);
                        setSelectedSeats([]);
                        setBookingInfo(null);
                    }}>
                        Hủy
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        onClick={handleConfirmBooking}
                        disabled={selectedSeats.length === 0}
                    >
                        Đặt vé ({calculateTotalPrice().toLocaleString('vi-VN')} VNĐ)
                    </Button>
                ]}
            >
                {bookingInfo && (
                    <div className="booking-info">
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <Text type="secondary">Rạp:</Text> <Text strong>{bookingInfo.cinemaName}</Text>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary">Phòng:</Text> <Text strong>{bookingInfo.roomName}</Text>
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginBottom: 20 }}>
                            <Col span={12}>
                                <Text type="secondary">Suất chiếu:</Text> <Text strong>{bookingInfo.showtime}</Text>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary">Ngày:</Text> <Text strong>{bookingInfo.dayName}</Text>
                            </Col>
                        </Row>
                    </div>
                )}

                {/* Screen */}
                <div className="screen-area">
                    <div className="screen">Màn hình</div>
                </div>

                {/* Seat Map */}
                <div className="seat-map">
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(row => (
                        <div key={row} className="seat-row">
                            <div className="row-label">{row}</div>
                            <div className="seats">
                                {row === 'F' ? (
                                    // Special handling for couple seats in row F
                                    Array.from({ length: 5 }, (_, i) => {
                                        const seatNumber = i + 1;
                                        const seatId = `${row}${seatNumber}`;
                                        const seat = seatData.find(s => s.id === seatId);
                                        const isSelected = selectedSeats.includes(seatId);
                                        const isOccupied = seat?.status === 'occupied';
                                        const isCouple = seat?.type === 'couple';

                                        return (
                                            <button
                                                key={seatId}
                                                className={`seat seat-couple ${isOccupied ? 'seat-occupied' :
                                                    isSelected ? 'seat-selected' : 'seat-available'
                                                    }`}
                                                onClick={() => !isOccupied && handleSeatSelect(seatId)}
                                                disabled={isOccupied}
                                                title={`${seatId} - Ghế đôi - ${seat?.price.toLocaleString('vi-VN')} VNĐ`}
                                                style={{ width: '64px' }} // Wider for couple seats
                                            >
                                                {seatNumber}
                                            </button>
                                        );
                                    })
                                ) : (
                                    // Regular seats for other rows
                                    Array.from({ length: 12 }, (_, i) => {
                                        const seatNumber = i + 1;
                                        const seatId = `${row}${seatNumber}`;
                                        const seat = seatData.find(s => s.id === seatId);
                                        const isSelected = selectedSeats.includes(seatId);
                                        const isOccupied = seat?.status === 'occupied';
                                        const isVip = seat?.type === 'vip';

                                        return (
                                            <button
                                                key={seatId}
                                                className={`seat ${isVip ? 'seat-vip' : 'seat-standard'} ${isOccupied ? 'seat-occupied' :
                                                    isSelected ? 'seat-selected' : 'seat-available'
                                                    }`}
                                                onClick={() => !isOccupied && handleSeatSelect(seatId)}
                                                disabled={isOccupied}
                                                title={`${seatId} - ${isVip ? 'VIP' : 'Thường'} - ${seat?.price.toLocaleString('vi-VN')} VNĐ`}
                                            >
                                                {seatNumber}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                            <div className="row-label">{row}</div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="seat-legend">
                    <div className="legend-item">
                        <div className="seat seat-available seat-standard"></div>
                        <Text>Ghế thường - 70,000 VNĐ</Text>
                    </div>
                    <div className="legend-item">
                        <div className="seat seat-available seat-vip"></div>
                        <Text>Ghế VIP - 90,000 VNĐ</Text>
                    </div>
                    <div className="legend-item">
                        <div className="seat seat-available seat-couple" style={{ width: '32px' }}></div>
                        <Text>Ghế đôi - 150,000 VNĐ</Text>
                    </div>
                    <div className="legend-item">
                        <div className="seat seat-selected"></div>
                        <Text>Đã chọn</Text>
                    </div>
                    <div className="legend-item">
                        <div className="seat seat-occupied"></div>
                        <Text>Đã đặt</Text>
                    </div>
                </div>

                {selectedSeats.length > 0 && (
                    <div className="selected-seats-info">
                        <Title level={5}>Ghế đã chọn:</Title>
                        <Space wrap>
                            {selectedSeats.map(seatId => {
                                const seat = seatData.find(s => s.id === seatId);
                                const seatTypeColor = seat?.type === 'vip' ? 'gold' :
                                    seat?.type === 'couple' ? 'magenta' : 'blue';
                                return (
                                    <Tag key={seatId} color={seatTypeColor}>
                                        {seatId} - {seat?.price.toLocaleString('vi-VN')} VNĐ
                                    </Tag>
                                );
                            })}
                        </Space>
                    </div>
                )}
            </Modal>

            {/* Trailer Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>Trailer - {movie.title}</span>
                    </div>
                }
                open={trailerVisible}
                onCancel={() => setTrailerVisible(false)}
                footer={null}
                width={920}
                centered
                className="trailer-modal"
                destroyOnClose
                maskClosable={true}
                closeIcon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                }
            >
                <div className="trailer-container">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube-nocookie.com/embed/${movie.trailerUrl || 'dQw4w9WgXcQ'}?autoplay=1&rel=0&modestbranding=1`}
                        title="Movie Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                    />
                </div>
            </Modal>
        </div>
    </div>
);
};

export default MovieDetailAntd;
