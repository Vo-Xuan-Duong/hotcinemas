import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Card,
    Row,
    Col,
    Button,
    Space,
    Typography,
    Tag,
    Divider,
    Empty,
    Spin,
    notification,
    Badge,
    Breadcrumb
} from 'antd';
import {
    CalendarOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    StarOutlined,
    PlayCircleOutlined,
    WarningOutlined,
    HomeOutlined,
    ScheduleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import './ScheduleModernNew.css';

const { Title, Text } = Typography;

dayjs.locale('vi');

const ScheduleModernNew = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedArea, setSelectedArea] = useState('Tp. Hồ Chí Minh');
    const [selectedCinema, setSelectedCinema] = useState('Beta Ung Văn Khiêm');

    // Mock data theo thiết kế
    const areas = [
        { name: 'Tp. Hồ Chí Minh', count: 69 },
        { name: 'Bắc Giang', count: 2 },
        { name: 'Đồng Nai', count: 5 },
        { name: 'Bình Dương', count: 10 },
        { name: 'Đắk Lắk', count: 3 },
        { name: 'Cần Thơ', count: 6 },
        { name: 'Đà Nẵng', count: 9 },
        { name: 'Quảng Ninh', count: 4 },
        { name: 'Hà Nội', count: 52 },
        { name: 'Hải Phòng', count: 8 },
        { name: 'Thừa Thiên - Huế', count: 4 },
        { name: 'Khánh Hòa', count: 7 },
        { name: 'Bình Thuận', count: 5 },
        { name: 'Bình Định', count: 4 }
    ];

    const cinemaChains = [
        {
            name: 'Beta Cinemas',
            icon: '🎬',
            locations: ['Beta Quang Trung', 'Beta Trần Quang Khải', 'Beta Ung Văn Khiêm']
        },
        {
            name: 'Cinestar',
            icon: '⭐',
            locations: ['Cinestar Hai Bà Trưng', 'Cinestar Quốc Thanh', 'Cinestar Satra Quận 6']
        },
        {
            name: 'Dcine',
            icon: '🎭',
            locations: ['DCINE Bến Thành']
        },
        {
            name: 'Mega GS Cinemas',
            icon: '🏢',
            locations: ['Mega GS Cao Thắng', 'Mega GS Lý Chính Thắng']
        },
        {
            name: 'BHD Star Cineplex',
            icon: '🌟',
            locations: ['BHD Star 3/2', 'BHD Star Lê Văn Việt']
        }
    ];

    const movies = [
        {
            id: 1,
            title: "Thanh Gươm Diệt Quỷ: Vô Hạn Thành",
            originalTitle: "Demon Slayer - Kimetsu no Yaiba - The Movie: Infinity Castle",
            poster: "https://picsum.photos/150/220?random=1",
            duration: "T16",
            age: "2h35",
            genre: "Action, Thriller, Animation, Fantasy",
            format: "2D Phụ Đề Việt",
            showtimes: [
                { time: "00:20", type: "80K", available: true },
                { time: "00:40", type: "80K", available: true },
                { time: "08:15", type: "90K", available: true },
                { time: "09:00", type: "90K", available: true },
                { time: "09:30", type: "90K", available: true },
                { time: "10:10", type: "90K", available: true },
                { time: "11:00", type: "90K", available: true },
                { time: "11:40", type: "80K", available: true },
                { time: "12:20", type: "80K", available: true },
                { time: "13:00", type: "80K", available: true },
                { time: "13:50", type: "80K", available: true },
                { time: "14:30", type: "90K", available: true },
                { time: "15:10", type: "90K", available: true },
                { time: "15:50", type: "90K", available: true },
                { time: "16:40", type: "80K", available: true },
                { time: "17:20", type: "80K", available: true },
                { time: "18:00", type: "80K", available: true },
                { time: "18:20", type: "90K", available: true },
                { time: "18:40", type: "100K", available: true },
                { time: "19:00", type: "80K", available: true },
                { time: "19:30", type: "80K", available: true },
                { time: "20:10", type: "80K", available: true },
                { time: "20:50", type: "80K", available: true },
                { time: "21:10", type: "80K", available: true },
                { time: "21:30", type: "90K", available: true },
                { time: "21:50", type: "90K", available: true },
                { time: "22:20", type: "80K", available: true },
                { time: "23:00", type: "80K", available: true },
                { time: "23:40", type: "80K", available: true }
            ]
        },
        {
            id: 2,
            title: "Phim Shin Cậu Bé Bút Chì: Nóng Bỏng Tay! Những Vũ Công Kasukabe",
            originalTitle: "Crayon Shin-chan the Movie: Super Hot! The Spicy Kasukabe Dancers",
            poster: "https://picsum.photos/150/220?random=2",
            duration: "P",
            age: "1h43",
            genre: "Animation",
            format: "2D Lồng Tiếng",
            showtimes: [
                { time: "08:30", type: "70K", available: true },
                { time: "10:15", type: "70K", available: true },
                { time: "14:20", type: "70K", available: true },
                { time: "16:00", type: "70K", available: true },
                { time: "17:45", type: "70K", available: true },
                { time: "19:30", type: "70K", available: true }
            ]
        }
    ];

    // Generate dates for next 7 days
    const getNext7Days = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = dayjs().add(i, 'day');
            dates.push({
                date: date.format('DD/M'),
                day: date.format('ddd').toUpperCase(),
                dayNumber: date.format('DD'),
                month: date.format('MM'),
                fullDate: date,
                isToday: i === 0
            });
        }
        return dates;
    };

    const [availableDates] = useState(getNext7Days());

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleBooking = (movie, showtime) => {
        notification.success({
            message: 'Đặt vé thành công',
            description: `Đã đặt vé phim "${movie.title}" suất ${showtime.time}`,
        });
    };

    const handleCinemaSelect = (cinema) => {
        setSelectedCinema(cinema);
    };

    if (loading) {
        return (
            <div className="schedule-layout">
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Spin size="large" />
                    <Title level={4} style={{ marginTop: 16, color: 'var(--text-primary)' }}>
                        Đang tải lịch chiếu...
                    </Title>
                </div>
            </div>
        );
    }

    return (
        <div className="schedule-layout">
            {/* Breadcrumb */}
            <div className="breadcrumb-section">
                <div className="container">
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/">
                                <HomeOutlined /> Trang chủ
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <ScheduleOutlined /> Lịch chiếu
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            {/* Modern Header với gradient */}
            <div className="schedule-header-modern">
                <div className="header-content">
                    <div className="header-text">
                        <Title level={1} className="header-title">
                            Lịch chiếu phim
                        </Title>
                        <Text className="header-subtitle">
                            Khám phá và đặt vé cho những bộ phim hot nhất
                        </Text>
                    </div>

                    {/* Quick Date Filter */}
                    <div className="quick-date-filter">
                        <div className="date-tabs">
                            {[0, 1, 2, 3, 4, 5, 6].map(day => {
                                const date = dayjs().add(day, 'day');
                                const isSelected = selectedDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
                                return (
                                    <div
                                        key={day}
                                        className={`date-tab ${isSelected ? 'active' : ''}`}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        <div className="day-name">
                                            {day === 0 ? 'Hôm nay' : date.format('ddd')}
                                        </div>
                                        <div className="day-number">{date.format('DD/MM')}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="schedule-container">
                <Row gutter={[24, 16]}>
                    {/* Sidebar */}
                    <Col xs={24} lg={6}>
                        <div className="schedule-sidebar">
                            {/* Location & Cinema Filter Card */}
                            <Card className="filter-card" title={
                                <Space>
                                    <EnvironmentOutlined style={{ color: '#1890ff' }} />
                                    <span>Lọc theo vị trí</span>
                                </Space>
                            }>
                                {/* Khu vực */}
                                <div className="filter-section">
                                    <Text strong className="filter-label">Khu vực</Text>
                                    <div className="area-list">
                                        {areas.map((area, index) => (
                                            <div
                                                key={index}
                                                className={`area-item ${selectedArea === area.name ? 'active' : ''}`}
                                                onClick={() => setSelectedArea(area.name)}
                                            >
                                                <span className="area-name">{area.name}</span>
                                                <Badge count={area.count} className="area-count" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Rạp chiếu */}
                                <div className="filter-section">
                                    <Text strong className="filter-label">Rạp chiếu</Text>
                                    <div className="cinema-list">
                                        {cinemaChains.map((chain, index) => (
                                            <div key={index} className="cinema-chain">
                                                <div className="chain-header">
                                                    <span className="chain-icon">{chain.icon}</span>
                                                    <span className="chain-name">{chain.name}</span>
                                                </div>
                                                <div className="chain-locations">
                                                    {chain.locations.map((location, locIndex) => (
                                                        <div
                                                            key={locIndex}
                                                            className={`location-item ${selectedCinema === location ? 'active' : ''}`}
                                                            onClick={() => handleCinemaSelect(location)}
                                                        >
                                                            {location}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>

                    {/* Main content */}
                    <Col xs={24} lg={18}>
                        <div className="schedule-main">
                            {/* Cinema Info Header */}
                            <Card className="cinema-info-modern">
                                <div className="cinema-header">
                                    <div className="cinema-info">
                                        <div className="cinema-name">
                                            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                                <EnvironmentOutlined style={{ marginRight: 8 }} />
                                                {selectedCinema}
                                            </Title>
                                            <Tag color="blue">{selectedDate.format('dddd, DD/MM/YYYY')}</Tag>
                                        </div>
                                        <Text className="cinema-address">
                                            Tầng 1, Rạp chiếu PAX SKY, 26 Ung Văn Khiêm, phường 25, Quận Bình Thạnh
                                        </Text>
                                    </div>
                                    <div className="cinema-actions">
                                        <Button type="link" size="small">
                                            <EnvironmentOutlined /> Xem bản đồ
                                        </Button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="cinema-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">{movies.length}</span>
                                        <span className="stat-label">Phim đang chiếu</span>
                                    </div>
                                    <Divider type="vertical" />
                                    <div className="stat-item">
                                        <span className="stat-number">
                                            {movies.reduce((total, movie) => total + movie.showtimes.length, 0)}
                                        </span>
                                        <span className="stat-label">Suất chiếu</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Notice */}
                            <div className="schedule-notice">
                                <div className="notice-content">
                                    <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
                                    <Text>Click vào suất chiếu để mua vé • Thời gian có thể thay đổi</Text>
                                </div>
                            </div>

                            {/* Movies Grid */}
                            <div className="movies-grid">
                                {movies.map((movie) => (
                                    <Card key={movie.id} className="movie-card-modern" hoverable>
                                        <div className="movie-content">
                                            {/* Movie Header */}
                                            <div className="movie-header-section">
                                                <div className="movie-poster-thumb">
                                                    <img src={movie.poster} alt={movie.title} />
                                                    <div className="poster-overlay">
                                                        <PlayCircleOutlined className="play-icon" />
                                                    </div>
                                                </div>

                                                <div className="movie-info">
                                                    <Title level={4} className="movie-title" ellipsis>
                                                        {movie.title}
                                                    </Title>
                                                    <Text className="movie-subtitle" type="secondary">
                                                        {movie.originalTitle}
                                                    </Text>

                                                    <div className="movie-meta">
                                                        <Space size={8} wrap>
                                                            <Tag color="blue">{movie.format}</Tag>
                                                            <Tag color="green">{movie.duration}</Tag>
                                                            <Tag color="orange">{movie.age}</Tag>
                                                            <Tag>{movie.genre}</Tag>
                                                        </Space>
                                                    </div>
                                                </div>

                                                <div className="movie-actions">
                                                    <Button type="link" size="small" icon={<PlayCircleOutlined />}>
                                                        Trailer
                                                    </Button>
                                                    <Button type="link" size="small" icon={<StarOutlined />}>
                                                        Đánh giá
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Showtimes Section */}
                                            <div className="showtimes-section">
                                                <div className="showtimes-header">
                                                    <Text strong>
                                                        <ClockCircleOutlined style={{ marginRight: 6 }} />
                                                        Suất chiếu ({movie.showtimes.length})
                                                    </Text>
                                                </div>

                                                <div className="showtimes-grid-modern">
                                                    {movie.showtimes.map((showtime, index) => (
                                                        <div
                                                            key={index}
                                                            className={`showtime-item ${!showtime.available ? 'disabled' : ''}`}
                                                            onClick={() => showtime.available && handleBooking(movie, showtime)}
                                                        >
                                                            <div className="showtime-time">{showtime.time}</div>
                                                            <div className="showtime-price">{showtime.type}</div>
                                                            <div className="showtime-seats">còn chỗ</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ScheduleModernNew;
