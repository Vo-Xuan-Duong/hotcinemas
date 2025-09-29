import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    Row,
    Col,
    Tag,
    Space,
    Card,
    Tabs,
    Input,
    message,
    Rate,
    Progress,
    Statistic,
    Avatar,
    Divider,
    Tooltip,
    Badge,
    Breadcrumb,
    Select,
    DatePicker,
    List,
    Modal,
    Empty
} from 'antd';
import {
    HeartOutlined,
    HeartFilled,
    StarFilled,
    PlayCircleOutlined,
    CarryOutOutlined,
    ShareAltOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    UserOutlined,
    EyeOutlined,
    LikeOutlined,
    MessageOutlined,
    EnvironmentOutlined,
    ThunderboltOutlined,
    FireOutlined,
    TrophyOutlined,
    HomeOutlined,
    RightOutlined,
    DownOutlined,
    CloseOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    TagOutlined
} from '@ant-design/icons';
import { useTheme } from '../../../context/ThemeContext';
import moviesData from '../../../data/movies.json';
import cinemasData from '../../../data/cinemas.json';
import showtimesData from '../../../data/showtimes.json';
import LocationSelectModal from '../../../components/LocationSelectModal';
import './MovieDetailImage.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const MovieDetailImage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [activeTab, setActiveTab] = useState('1');
    const [selectedCity, setSelectedCity] = useState('Tp. Hồ Chí Minh');
    const [selectedDate, setSelectedDate] = useState(null);
    const [expandedCinema, setExpandedCinema] = useState(null);
    const [selectedChain, setSelectedChain] = useState('bhd');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [seatModalVisible, setSeatModalVisible] = useState(false);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [bookingInfo, setBookingInfo] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [expandedLocation, setExpandedLocation] = useState(null);
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const [chains, setChains] = useState([]);
    const [locationsByChain, setLocationsByChain] = useState({});

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const movieData = moviesData.find(m => m.id === parseInt(id));
                if (movieData) {
                    setMovie(movieData);
                } else {
                    message.error('Không tìm thấy phim!');
                    navigate('/movies');
                }
            } catch (error) {
                console.error('Error fetching movie:', error);
                message.error('Có lỗi xảy ra khi tải thông tin phim!');
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id, navigate]);

    // Handle wheel zoom
    const handleWheel = useCallback((e) => {
        // Check if mouse is over seat-container-wrapper or seat grid
        const seatContainer = e.target.closest('.seat-container-wrapper, .seat-grid, .cinema-seat-area');
        if (seatContainer) {
            e.preventDefault();
            e.stopPropagation();

            // More sensitive zoom with smaller increments for smooth experience
            const delta = e.deltaY > 0 ? -0.05 : 0.05; // Smaller increments for smoother zoom
            const newZoom = Math.min(3, Math.max(0.3, zoomLevel + delta)); // Wider zoom range
            setZoomLevel(newZoom);
        }
    }, [zoomLevel]);

    // Add wheel event listener when seat modal is open
    useEffect(() => {
        if (seatModalVisible) {
            document.addEventListener('wheel', handleWheel, { passive: false });

            return () => {
                document.removeEventListener('wheel', handleWheel);
            };
        }
    }, [seatModalVisible, handleWheel]);

    // -------------------------------------------------------------
    // Showtime / Cinema chain dynamic data helpers (moved above early return
    // to keep hook order stable across renders and avoid React hook mismatch)
    // -------------------------------------------------------------

    // Data-driven cinema chains and locations helpers
    const getLocationsForChain = () => {
        if (selectedChain === 'all') {
            return Object.values(locationsByChain).flat();
        }
        return locationsByChain[selectedChain] || [];
    };

    const handleToggleLocation = (locId) => {
        setExpandedLocation(prev => (prev === locId ? null : locId));
    };

    // Utility: format selected date index -> yyyy-mm-dd (demo mapping)
    const getSelectedDateISO = () => {
        const base = new Date();
        const offset = selectedDate ?? 0; // if null assume first (today)
        const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset);
        return d.toISOString().slice(0, 10);
    };

    // Effect to derive chains & locations from showtimes (must be before early return)
    useEffect(() => {
        if (!movie) return; // wait until movie loaded
        const dateISO = getSelectedDateISO();
        const filteredShowtimes = showtimesData.filter(st => st.movieId === movie.id && st.date === dateISO);
        const cinemasMap = {};
        filteredShowtimes.forEach(st => {
            if (!cinemasMap[st.cinemaId]) {
                const cinema = cinemasData.find(c => c.id === st.cinemaId);
                if (!cinema) return;
                cinemasMap[st.cinemaId] = { cinema, showtimes: [] };
            }
            cinemasMap[st.cinemaId].showtimes.push(st);
        });
        const cinemaEntries = Object.values(cinemasMap);
        const chainId = 'hot';
        const chainName = 'HotCinemas';
        const chainsList = cinemaEntries.length ? [{ id: chainId, name: chainName, color: '#ff6b35', logo: 'HC' }] : [];
        setChains(chainsList);
        setLocationsByChain({
            [chainId]: cinemaEntries.map(entry => ({
                id: 'cinema-' + entry.cinema.id,
                name: entry.cinema.name,
                address: entry.cinema.address,
                map: '#',
                showtimes: entry.showtimes.map(st => st.time)
            }))
        });
        if (chainsList.length && !chainsList.find(c => c.id === selectedChain)) {
            setSelectedChain(chainId);
        }
    }, [movie, selectedDate]);

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        message.success(isFavorite ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích');
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
            message.success('Đã sao chép link phim!');
        }
    };

    const handleRating = (value) => {
        setUserRating(value);
        message.success(`Bạn đã đánh giá ${value} sao!`);
    };

    const handleCinemaClick = (cinemaIndex) => {
        setExpandedCinema(expandedCinema === cinemaIndex ? null : cinemaIndex);
        setSelectedLocation(null);
    };

    const handleLocationClick = (location) => {
        setSelectedLocation(location);
        message.info(`Đã chọn rạp: ${location}`);
    };

    const handleDateClick = (dateInfo, index) => {
        setSelectedDate(index);
        message.info(`Đã chọn ngày: ${dateInfo.date} ${dateInfo.day}`);
    };

    const handleShowtimeClick = (time, location) => {
        setSelectedShowtime({ time, location });
        setSeatModalVisible(true);
    };

    const handleSeatClick = (seatId) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId);
            } else {
                return [...prev, seatId];
            }
        });
    };

    const handleConfirmBooking = () => {
        if (selectedSeats.length === 0) {
            message.warning('Vui lòng chọn ít nhất một ghế!');
            return;
        }

        // Tạo thông tin booking
        const booking = {
            movieTitle: movie.title,
            showtime: selectedShowtime,
            seats: selectedSeats,
            cinema: selectedShowtime?.location || 'Beta Quang Trung',
            date: '28/09/2025',
            room: 'P1',
            format: '2D Phụ đề',
            totalAmount: selectedSeats.length * 50000,
            bookingId: 'C18'
        };

        setBookingInfo(booking);
        setSeatModalVisible(false);
        setPaymentModalVisible(true);
    };

    const handlePaymentComplete = () => {
        message.success(`Đặt vé thành công! Ghế: ${selectedSeats.join(', ')}`);
        setPaymentModalVisible(false);
        setSelectedSeats([]);
        setBookingInfo(null);
    };

    // Component SeatLayout
    const SeatLayout = () => {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'];
        const seatsPerRow = 10;

        const seatStatuses = {
            available: 'available',
            occupied: 'occupied',
            selected: 'selected',
            vip: 'vip'
        };

        // Seat layout matching the new image exactly
        const occupiedSeats = ['G7', 'H7', 'H6']; // Gray seats (Đã đặt)
        const selectedSeats_demo = ['K8', 'K7', 'K4']; // Pink seats (Ghế bạn chọn)
        const vipSeats = ['D', 'E', 'F', 'G', 'H', 'J', 'L']; // Red seats (Ghế VIP)
        const regularSeats = ['A', 'B', 'C']; // Purple seats (Ghế thường)

        const getSeatStatus = (rowIndex, seatIndex) => {
            const seatId = `${rows[rowIndex]}${seatIndex + 1}`;
            if (selectedSeats.includes(seatId) || selectedSeats_demo.includes(seatId)) return seatStatuses.selected;
            if (occupiedSeats.includes(seatId)) return seatStatuses.occupied;
            if (vipSeats.includes(rows[rowIndex])) return seatStatuses.vip;
            return seatStatuses.available;
        };

        const getSeatPrice = (status) => {
            switch (status) {
                case 'vip': return 200000;
                default: return 150000;
            }
        };

        return (
            <div className="cinema-seat-layout">
                {/* Cinema Screen */}
                <div className="cinema-screen-simple">
                    <div className="screen-line"></div>
                    <div className="screen-text">MÀN HÌNH</div>
                </div>

                {/* Draggable Seat Container */}
                <div
                    className="seat-container-wrapper"
                >
                    <div
                        className="seat-grid"
                        style={{
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: 'center center',
                            cursor: 'grab'
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            const startX = e.clientX;
                            const startY = e.clientY;
                            const container = e.currentTarget;
                            const initialTransform = container.style.transform;

                            const handleMouseMove = (moveEvent) => {
                                const deltaX = moveEvent.clientX - startX;
                                const deltaY = moveEvent.clientY - startY;
                                container.style.transform = `${initialTransform} translate(${deltaX}px, ${deltaY}px)`;
                                container.style.cursor = 'grabbing';
                            };

                            const handleMouseUp = () => {
                                container.style.cursor = 'grab';
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                            };

                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                        }}
                        onTouchStart={(e) => {
                            const touch = e.touches[0];
                            const startX = touch.clientX;
                            const startY = touch.clientY;
                            const container = e.currentTarget;
                            const initialTransform = container.style.transform;

                            const handleTouchMove = (moveEvent) => {
                                moveEvent.preventDefault();
                                const touch = moveEvent.touches[0];
                                const deltaX = touch.clientX - startX;
                                const deltaY = touch.clientY - startY;
                                container.style.transform = `${initialTransform} translate(${deltaX}px, ${deltaY}px)`;
                            };

                            const handleTouchEnd = () => {
                                document.removeEventListener('touchmove', handleTouchMove);
                                document.removeEventListener('touchend', handleTouchEnd);
                            };

                            document.addEventListener('touchmove', handleTouchMove, { passive: false });
                            document.addEventListener('touchend', handleTouchEnd);
                        }}
                    >
                        {rows.map((row, rowIndex) => (
                            <div key={row} className="cinema-seat-row">
                                {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                                    const seatId = `${row}${seatIndex + 1}`;
                                    const status = getSeatStatus(rowIndex, seatIndex);

                                    return (
                                        <div
                                            key={seatId}
                                            className={`cinema-seat ${status}`}
                                            onClick={() => {
                                                if (status !== seatStatuses.occupied) {
                                                    handleSeatClick(seatId);
                                                }
                                            }}
                                        >
                                            {seatId}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="cinema-legend">
                    <div className="legend-row">
                        <div className="legend-item">
                            <div className="legend-seat occupied"></div>
                            <span>Đã đặt</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat selected"></div>
                            <span>Ghế bạn chọn</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat available"></div>
                            <span>Ghế thường</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat center"></div>
                            <span>Vùng trung tâm</span>
                        </div>
                    </div>
                    <div className="legend-row">
                        <div className="legend-item">
                            <div className="legend-seat vip"></div>
                            <span>Ghế VIP</span>
                        </div>
                    </div>
                    <div className="legend-note">
                        <span>Xem chi tiết hình ảnh và thông tin ghế</span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading || !movie) {
        return (
            <div className="movie-detail-loading">
                <Card>
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <div className="loading-spinner"></div>
                        <Text style={{ marginTop: '16px', display: 'block' }}>Đang tải thông tin phim...</Text>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="movie-detail-image-layout">
            {/* Breadcrumb Navigation */}
            <div className="breadcrumb-container">
                <div className="container">
                    <Breadcrumb
                        className="movie-breadcrumb"
                        items={[
                            {
                                href: '/',
                                title: (
                                    <span>
                                        <HomeOutlined />
                                        <span>Trang chủ</span>
                                    </span>
                                ),
                            },
                            {
                                href: '/movies',
                                title: 'Phim',
                            },
                            {
                                title: movie?.title || 'Chi tiết phim',
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Hero Banner Section */}
            <div className="hero-banner-section" style={{ backgroundImage: `url(${movie.poster})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="container">
                        <Row gutter={[40, 40]} align="middle">
                            {/* Left - Movie Poster */}
                            <Col xs={24} lg={6}>
                                <div className="movie-poster-container">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="movie-poster-main"
                                    />
                                </div>
                            </Col>

                            {/* Center - Movie Information */}
                            <Col xs={24} lg={12}>
                                <div className="movie-info-section">
                                    {/* Title */}
                                    <Title level={1} className="movie-title-main">
                                        {movie.title}
                                    </Title>

                                    <Text className="movie-subtitle-main">
                                        {movie.originalTitle || "My Daughter Is a Zombie - Comedy, Drama"}
                                    </Text>

                                    {/* Action Buttons Row */}
                                    <div className="action-buttons-row">
                                        <Space wrap size="middle">
                                            <Button
                                                icon={<HeartOutlined />}
                                                className="action-btn-hero"
                                                onClick={handleFavorite}
                                            >
                                                Thích
                                            </Button>
                                            <Button
                                                icon={<StarFilled />}
                                                className="action-btn-hero"
                                            >
                                                Đánh giá
                                            </Button>
                                            <Button
                                                icon={<PlayCircleOutlined />}
                                                className="action-btn-hero trailer-btn"
                                            >
                                                Trailer
                                            </Button>
                                            <Button
                                                type="primary"
                                                icon={<CarryOutOutlined />}
                                                className="action-btn-hero buy-ticket-btn"
                                            >
                                                Mua vé
                                            </Button>
                                        </Space>
                                    </div>

                                    {/* Movie Description */}
                                    <div className="movie-description-main">
                                        <Typography.Paragraph className="description-text">
                                            Cho Jung Seok hóa thân thành Lee Jung Hwan, một huấn luyện viên động vật đầy nhiệt huyết quyết tâm bảo vệ có con gái tuổi teen bị nhiễm virus zombie bằng cách "thuần hóa" cô bé.
                                        </Typography.Paragraph>
                                    </div>

                                    {/* Meta Information */}
                                    <div className="movie-meta-row">
                                        <Space wrap size="large">
                                            <div className="meta-info-item">
                                                <div className="meta-content">
                                                    <div className="meta-label">Hài lòng</div>
                                                    <div className="meta-value">100%</div>
                                                </div>
                                            </div>
                                            <div className="meta-info-item">
                                                <div className="meta-content">
                                                    <div className="meta-label">Khởi chiếu</div>
                                                    <div className="meta-value">08/08/2025</div>
                                                </div>
                                            </div>
                                            <div className="meta-info-item">
                                                <div className="meta-content">
                                                    <div className="meta-label">Thời lượng</div>
                                                    <div className="meta-value">107 phút</div>
                                                </div>
                                            </div>
                                            <div className="meta-info-item">
                                                <div className="meta-content">
                                                    <div className="meta-label">Giới hạn tuổi</div>
                                                    <div className="meta-value">T13</div>
                                                </div>
                                            </div>
                                        </Space>
                                    </div>
                                </div>
                            </Col>

                            {/* Right - Cast Info */}
                            <Col xs={24} lg={6}>
                                <div className="cast-info-sidebar">
                                    <div className="cast-section">
                                        <Typography.Title level={5} className="cast-title">Diễn viên</Typography.Title>
                                        <div className="cast-list">
                                            <div className="cast-member">Cho Jung-seok</div>
                                            <div className="cast-member">Lee Jung-eun</div>
                                            <div className="cast-member">Cho Yeo-jeong</div>
                                            <div className="cast-member">Yoon Kyung-ho</div>
                                            <div className="cast-member">Choi Yu-ri</div>
                                        </div>
                                    </div>

                                    <div className="director-section">
                                        <Typography.Title level={5} className="director-title">Đạo diễn</Typography.Title>
                                        <div className="director-name">Pil Gam-seong</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="tabs-section">
                <div className="container">
                    <Tabs defaultActiveKey="1" className="movie-tabs">
                        <TabPane tab="Thông tin phim" key="1">
                            <div className="movie-info-tab-content">
                                <Row gutter={[32, 32]}>
                                    {/* Left Column - Movie Details */}
                                    <Col xs={24} md={16}>
                                        <div className="movie-details-section">
                                            {/* Synopsis */}
                                            <div className="synopsis-section">
                                                <Title level={4} className="section-title">
                                                    <span className="title-icon">📖</span>
                                                    Nội dung phim
                                                </Title>
                                                <div className="synopsis-content">
                                                    <Paragraph className="synopsis-text">
                                                        Cho Jung Seok hóa thân thành Lee Jung Hwan, một huấn luyện viên động vật đầy nhiệt huyết
                                                        quyết tâm bảo vệ có con gái tuổi teen bị nhiễm virus zombie bằng cách "thuần hóa" cô bé.
                                                        Trong một thế giới hậu tận thế, tình cha con trở thành ánh sáng cuối cùng của hy vọng.
                                                    </Paragraph>
                                                    <Paragraph className="synopsis-text">
                                                        Phim khám phá chủ đề tình yêu thương gia đình vượt qua mọi rào cản, kể cả cái chết.
                                                        Với sự kết hợp độc đáo giữa yếu tố kinh dị zombie và cảm xúc gia đình, tác phẩm mang
                                                        đến góc nhìn mới mẻ và sâu sắc về mối quan hệ cha con.
                                                    </Paragraph>
                                                </div>
                                            </div>

                                            {/* Cast & Crew */}
                                            <div className="cast-crew-section">
                                                <Title level={4} className="section-title">
                                                    <span className="title-icon">🎭</span>
                                                    Diễn viên & Đoàn phim
                                                </Title>
                                                <Row gutter={[16, 16]}>
                                                    <Col xs={24} md={12}>
                                                        <div className="crew-info">
                                                            <Text className="crew-label">Đạo diễn:</Text>
                                                            <Text className="crew-value">Pil Gam-seong</Text>
                                                        </div>
                                                        <div className="crew-info">
                                                            <Text className="crew-label">Biên kịch:</Text>
                                                            <Text className="crew-value">Park Jae-beom</Text>
                                                        </div>
                                                        <div className="crew-info">
                                                            <Text className="crew-label">Nhà sản xuất:</Text>
                                                            <Text className="crew-value">Kim Min-ho</Text>
                                                        </div>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <div className="cast-info">
                                                            <Text className="crew-label">Diễn viên chính:</Text>
                                                            <div className="cast-list-detail">
                                                                <div className="cast-item">Cho Jung-seok</div>
                                                                <div className="cast-item">Lee Jung-eun</div>
                                                                <div className="cast-item">Cho Yeo-jeong</div>
                                                                <div className="cast-item">Yoon Kyung-ho</div>
                                                                <div className="cast-item">Choi Yu-ri</div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>

                                            {/* Technical Info */}
                                            <div className="technical-section">
                                                <Title level={4} className="section-title">
                                                    <span className="title-icon">⚙️</span>
                                                    Thông tin kỹ thuật
                                                </Title>
                                                <Row gutter={[24, 16]}>
                                                    <Col xs={12} md={8}>
                                                        <div className="tech-info-item">
                                                            <div className="tech-label">Định dạng</div>
                                                            <div className="tech-value">2D, IMAX</div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} md={8}>
                                                        <div className="tech-info-item">
                                                            <div className="tech-label">Âm thanh</div>
                                                            <div className="tech-value">Dolby Atmos</div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} md={8}>
                                                        <div className="tech-info-item">
                                                            <div className="tech-label">Phụ đề</div>
                                                            <div className="tech-value">Tiếng Việt</div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} md={8}>
                                                        <div className="tech-info-item">
                                                            <div className="tech-label">Quốc gia</div>
                                                            <div className="tech-value">Hàn Quốc</div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} md={8}>
                                                        <div className="tech-info-item">
                                                            <div className="tech-label">Năm sản xuất</div>
                                                            <div className="tech-value">2024</div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} md={8}>
                                                        <div className="tech-info-item">
                                                            <div className="tech-label">Hãng phim</div>
                                                            <div className="tech-value">CJ Entertainment</div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Right Column - Additional Info */}
                                    <Col xs={24} md={8}>
                                        <div className="movie-sidebar-info">
                                            {/* Movie Stats */}
                                            <div className="movie-stats-card gradient-animated">
                                                <Title level={5} className="stats-title">
                                                    <span className="title-icon">📊</span>
                                                    Thống kê
                                                </Title>
                                                <div className="stats-grid">
                                                    <div className="stat-item">
                                                        <div className="stat-number">9.2</div>
                                                        <div className="stat-label">Đánh giá</div>
                                                    </div>
                                                    <div className="stat-item">
                                                        <div className="stat-number">12K</div>
                                                        <div className="stat-label">Lượt xem</div>
                                                    </div>
                                                    <div className="stat-item">
                                                        <div className="stat-number">98%</div>
                                                        <div className="stat-label">Hài lòng</div>
                                                    </div>
                                                    <div className="stat-item">
                                                        <div className="stat-number">TOP 5</div>
                                                        <div className="stat-label">Tuần này</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Genre Tags */}
                                            <div className="genre-tags-card">
                                                <Title level={5} className="tags-title">
                                                    <span className="title-icon">🏷️</span>
                                                    Thể loại
                                                </Title>
                                                <div className="genre-tags">
                                                    <Tag color="orange" className="genre-tag">Hài kịch</Tag>
                                                    <Tag color="red" className="genre-tag">Kinh dị</Tag>
                                                    <Tag color="blue" className="genre-tag">Gia đình</Tag>
                                                    <Tag color="green" className="genre-tag">Tâm lý</Tag>
                                                </div>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="quick-actions-card">
                                                <Title level={5} className="actions-title">
                                                    <span className="title-icon">⚡</span>
                                                    Hành động nhanh
                                                </Title>
                                                <div className="quick-actions">
                                                    <Button
                                                        type="primary"
                                                        block
                                                        size="large"
                                                        icon={<CarryOutOutlined />}
                                                        className="action-button primary-action"
                                                    >
                                                        Đặt vé ngay
                                                    </Button>
                                                    <Row gutter={8} style={{ marginTop: 12 }}>
                                                        <Col span={12}>
                                                            <Button
                                                                block
                                                                icon={<PlayCircleOutlined />}
                                                                className="action-button"
                                                            >
                                                                Trailer
                                                            </Button>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Button
                                                                block
                                                                icon={<ShareAltOutlined />}
                                                                className="action-button"
                                                            >
                                                                Chia sẻ
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </TabPane>
                        <TabPane tab="Lịch chiếu" key="2">
                            <div className="schedule-section-modern">
                                {/* Header with stats */}
                                <div className="schedule-header-modern">
                                    <Title level={3} className="schedule-main-title">
                                        <CalendarOutlined style={{ marginRight: 8 }} />
                                        Lịch chiếu phim
                                    </Title>
                                </div>

                                {/* Filters Row */}
                                <div className="schedule-filters">
                                    <Row gutter={[16, 16]} className="schedule-filter-row">
                                        <Col xs={24} sm={12} md={8} className="schedule-filter-col">
                                            <Text className="schedule-filter-label">
                                                <EnvironmentOutlined style={{ marginRight: 6 }} />
                                                Thành phố
                                            </Text>
                                            <div className="schedule-city-selector">
                                                <Button
                                                    block
                                                    className="city-open-modal-btn"
                                                    onClick={() => setLocationModalOpen(true)}
                                                    style={{ height: '48px', fontWeight: 600 }}
                                                >
                                                    {selectedCity || 'Chọn địa điểm'}
                                                </Button>
                                            </div>
                                        </Col>

                                        <Col xs={24} sm={12} md={16} className="schedule-filter-col">
                                            <Text className="schedule-filter-label">
                                                <CalendarOutlined style={{ marginRight: 6 }} />
                                                Chọn ngày chiếu
                                            </Text>
                                            <div className="date-selector-modern">
                                                {[
                                                    { date: '29/9', day: 'HÔM NAY', active: true },
                                                    { date: '30/9', day: 'TH 2', active: false },
                                                    { date: '1/10', day: 'TH 3', active: false },
                                                    { date: '2/10', day: 'TH 4', active: false },
                                                    { date: '3/10', day: 'TH 5', active: false },
                                                    { date: '4/10', day: 'TH 6', active: false },
                                                    { date: '5/10', day: 'TH 7', active: false }
                                                ].map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className={`date-card-modern ${selectedDate === index || (selectedDate === null && item.active) ? 'active' : ''}`}
                                                        onClick={() => handleDateClick(item, index)}
                                                    >
                                                        <div className="date-day">{item.day}</div>
                                                        <div className="date-number">{item.date}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Cinema Chain Selector */}
                                <div className="cinema-chain-selector">
                                    <div className="cinema-logos-row">
                                        {chains.length === 0 && (
                                            <Text type="secondary" style={{ padding: '8px 4px' }}>Không có suất chiếu cho ngày này.</Text>
                                        )}
                                        {chains.map(chain => (
                                            <div
                                                key={chain.id}
                                                className={`cinema-logo-card ${selectedChain === chain.id ? 'active' : ''}`}
                                                onClick={() => { setSelectedChain(chain.id); setExpandedLocation(null); }}
                                            >
                                                <div className="logo-content" style={{ backgroundColor: chain.color }}>
                                                    {chain.logo}
                                                </div>
                                                <Text className="chain-name">{chain.name}</Text>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Cinema Locations List */}
                                <div className="cinema-locations-list">
                                    {(() => {
                                        const locations = getLocationsForChain();
                                        if (!locations.length && selectedChain !== 'bhd') {
                                            return (
                                                <div className="empty-state">
                                                    <Empty
                                                        description={`Không có lịch chiếu cho ${selectedChain === 'all' ? 'tất cả rạp' : selectedChain.toUpperCase()} trong ngày đã chọn`}
                                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    />
                                                </div>
                                            );
                                        }
                                        return locations.map(loc => {
                                            const isExpanded = expandedLocation === loc.id || (loc.id === 'bhd-lvv' && expandedLocation === null);
                                            const hasShowtimes = loc.showtimes && loc.showtimes.length > 0;
                                            return (
                                                <div key={loc.id} className={`cinema-location-item ${isExpanded && hasShowtimes ? 'expanded' : ''}`}>
                                                    <div className="location-header-info" onClick={() => hasShowtimes && handleToggleLocation(loc.id)}>
                                                        <div className={`cinema-brand-icon ${loc.id.startsWith('cgv') ? 'cgv-icon' : ''}`}>
                                                            {loc.id.startsWith('cgv') ? 'CGV' : <StarFilled style={{ color: '#722ed1' }} />}
                                                        </div>
                                                        <div className="location-details">
                                                            <Title level={5} className="location-title">{loc.name}</Title>
                                                            <Text className="location-address">
                                                                {loc.address} |
                                                                <a href={loc.map} className="map-link"> Bản đồ</a>
                                                            </Text>
                                                        </div>
                                                        <div className="expand-toggle">
                                                            {hasShowtimes ? (
                                                                isExpanded ? <DownOutlined className="expand-arrow active" /> : <RightOutlined className="expand-arrow" />
                                                            ) : (
                                                                <RightOutlined className="expand-arrow" style={{ opacity: 0.3 }} />
                                                            )}
                                                        </div>
                                                    </div>
                                                    {hasShowtimes && isExpanded && (
                                                        <div className="showtimes-section">
                                                            <div className="format-label">
                                                                <Text strong>2D Phụ đề</Text>
                                                            </div>
                                                            <div className="showtimes-row">
                                                                {loc.showtimes.map(time => (
                                                                    <Button key={time} className="showtime-button" onClick={() => handleShowtimeClick(time)}>
                                                                        {time}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Đánh giá" key="3">
                            <div className="rating-section">
                                {/* Compact Rating Layout */}
                                <Row gutter={24}>
                                    {/* Left Column - Community Content */}
                                    <Col xs={24} lg={16}>
                                        {/* Community Section */}
                                        <div className="community-section">
                                            <div className="community-header">
                                                <Title level={4} className="community-title">
                                                    Cộng đồng <span className="community-count">(1)</span>
                                                </Title>
                                            </div>

                                            {/* User Review */}
                                            <div className="user-review">
                                                <div className="review-header">
                                                    <div className="user-info">
                                                        <Avatar size={40} className="user-avatar">
                                                            X
                                                        </Avatar>
                                                        <div className="user-details">
                                                            <div className="username">
                                                                <Text strong>Xuangai</Text>
                                                                <span className="user-rating">⭐ 10</span>
                                                            </div>
                                                            <div className="review-time">
                                                                <Text type="secondary">7 ngày trước</Text>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="review-content">
                                                    <Text>Vừa xem lúc chiều, phim hay lắm luôn</Text>
                                                </div>

                                                <div className="review-actions">
                                                    <div className="action-buttons">
                                                        <Button size="small" className="like-button">
                                                            <span className="like-count">+1</span>
                                                            👍
                                                        </Button>
                                                        <Button size="small" className="dislike-button">
                                                            👎
                                                        </Button>
                                                    </div>
                                                    <Button size="small" className="share-button" icon={<ShareAltOutlined />}>
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Load More Button */}
                                            <div className="load-more-section">
                                                <Button type="default" className="load-more-button">
                                                    Xem thêm
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Write Review Section */}
                                        <div className="write-review-section">
                                            <Title level={5}>Viết đánh giá của bạn</Title>
                                            <div className="write-review-form">
                                                <div className="rating-input">
                                                    <Text>Đánh giá: </Text>
                                                    <Rate
                                                        allowHalf
                                                        value={userRating}
                                                        onChange={handleRating}
                                                        style={{ marginLeft: 8 }}
                                                    />
                                                </div>
                                                <Input.TextArea
                                                    placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                                                    rows={4}
                                                    className="review-textarea"
                                                    style={{ marginTop: 12 }}
                                                />
                                                <div className="submit-review">
                                                    <Button
                                                        type="primary"
                                                        className="submit-button"
                                                        onClick={() => message.success('Đánh giá của bạn đã được gửi!')}
                                                    >
                                                        Gửi đánh giá
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Right Column - Rating Overview */}
                                    <Col xs={24} lg={8}>
                                        <div className="rating-overview-sidebar">
                                            <div className="rating-score-block-compact">
                                                <div className="rating-number-compact">100</div>
                                                <div className="rating-percentage-compact">%</div>
                                                <div className="rating-progress-compact">
                                                    <div className="progress-bar-compact">
                                                        <div className="progress-fill-compact" style={{ width: '100%' }}></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rating-details-compact">
                                                <div className="movie-rating-info-compact">
                                                    <Text className="movie-title-rating-compact">
                                                        <Text strong>Zombie Cùng Của Ba</Text> nhận được{' '}
                                                        <Text className="rating-count" strong>7 lượt đánh giá</Text>{' '}
                                                        <Text className="positive-rating">được xác thực</Text> với số điểm trung bình{' '}
                                                        <Text className="average-score" strong>9.29</Text>.
                                                    </Text>
                                                </div>
                                                <div className="rating-summary-compact">
                                                    <Text>Đa số người xem đánh giá tích cực về bộ phim.</Text>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </TabPane>
                        <TabPane tab="Tin tức" key="4">
                            <div className="news-section">
                                <div className="news-header">
                                    <Title level={4} className="news-title">
                                        <span className="title-icon">📰</span>
                                        Tin tức & Sự kiện
                                    </Title>
                                    <Text className="news-subtitle">
                                        Cập nhật những tin tức mới nhất về bộ phim và nghệ sĩ
                                    </Text>
                                </div>

                                <Row gutter={[24, 24]} className="news-content">
                                    {/* Left Column - Featured News */}
                                    <Col xs={24} lg={16}>
                                        <div className="featured-news-section">
                                            <Title level={5} className="section-title">
                                                <span className="title-icon">🔥</span>
                                                Tin nổi bật
                                            </Title>

                                            {/* Featured Article */}
                                            <div className="featured-article">
                                                <div className="article-image">
                                                    <img
                                                        src={movie.poster}
                                                        alt="Featured news"
                                                        className="news-image"
                                                    />
                                                    <div className="article-badge">
                                                        <Tag color="red" className="hot-badge">HOT</Tag>
                                                    </div>
                                                </div>
                                                <div className="article-content">
                                                    <div className="article-meta">
                                                        <span className="article-date">
                                                            <CalendarOutlined /> 2 giờ trước
                                                        </span>
                                                        <span className="article-category">
                                                            <Tag color="blue">Phỏng vấn</Tag>
                                                        </span>
                                                    </div>
                                                    <Title level={4} className="article-title">
                                                        Đạo diễn Pil Gam-seong chia sẻ về quá trình sản xuất "Zombie Cùng Của Ba"
                                                    </Title>
                                                    <Paragraph className="article-excerpt">
                                                        Trong cuộc phỏng vấn độc quyền, đạo diễn tiết lộ những khó khăn khi quay phim zombie
                                                        với diễn viên nhí và cách tạo ra những cảnh hành động ấn tượng mà vẫn giữ được tính
                                                        cảm động của câu chuyện gia đình...
                                                    </Paragraph>
                                                    <div className="article-actions">
                                                        <Button type="primary" className="read-more-btn">
                                                            Đọc tiếp <RightOutlined />
                                                        </Button>
                                                        <div className="article-stats">
                                                            <span><EyeOutlined /> 12.5K</span>
                                                            <span><LikeOutlined /> 892</span>
                                                            <span><MessageOutlined /> 156</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* News List */}
                                            <div className="news-list">
                                                <List
                                                    dataSource={[
                                                        {
                                                            id: 1,
                                                            title: "Cho Jung-seok thể hiện diễn xuất đỉnh cao trong vai cha đơn thân",
                                                            excerpt: "Nam diễn viên chia sẻ về việc vào vai một người cha phải đối mặt với con gái zombie...",
                                                            date: "5 giờ trước",
                                                            category: "Diễn viên",
                                                            views: "8.2K",
                                                            image: movie.poster
                                                        },
                                                        {
                                                            id: 2,
                                                            title: "Hậu trường quay phim: Những thử thách khi làm phim zombie gia đình",
                                                            excerpt: "Đoàn phim tiết lộ những khó khăn và giải pháp sáng tạo trong quá trình sản xuất...",
                                                            date: "1 ngày trước",
                                                            category: "Hậu trường",
                                                            views: "15.7K",
                                                            image: movie.poster
                                                        },
                                                        {
                                                            id: 3,
                                                            title: "Phản ứng của khán giả sau buổi công chiếu đầu tiên",
                                                            excerpt: "Khán giả bày tỏ sự xúc động và bất ngờ với cách tiếp cận mới lạ của thể loại zombie...",
                                                            date: "3 ngày trước",
                                                            category: "Review",
                                                            views: "22.1K",
                                                            image: movie.poster
                                                        }
                                                    ]}
                                                    renderItem={(item) => (
                                                        <div className="news-item">
                                                            <Row gutter={16} align="middle">
                                                                <Col xs={6} sm={4}>
                                                                    <div className="news-item-image">
                                                                        <img src={item.image} alt={item.title} />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={18} sm={20}>
                                                                    <div className="news-item-content">
                                                                        <div className="news-item-meta">
                                                                            <span className="news-date">
                                                                                <ClockCircleOutlined /> {item.date}
                                                                            </span>
                                                                            <Tag color="geekblue" size="small">{item.category}</Tag>
                                                                        </div>
                                                                        <Title level={5} className="news-item-title">
                                                                            {item.title}
                                                                        </Title>
                                                                        <Paragraph className="news-item-excerpt">
                                                                            {item.excerpt}
                                                                        </Paragraph>
                                                                        <div className="news-item-stats">
                                                                            <span><EyeOutlined /> {item.views}</span>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Right Column - Sidebar */}
                                    <Col xs={24} lg={8}>
                                        <div className="news-sidebar">
                                            {/* Trending Topics */}
                                            <div className="trending-section">
                                                <Title level={5} className="sidebar-title">
                                                    <span className="title-icon">🔥</span>
                                                    Chủ đề hot
                                                </Title>
                                                <div className="trending-tags">
                                                    <Tag color="volcano" className="trending-tag">#ZombieMovie</Tag>
                                                    <Tag color="orange" className="trending-tag">#ChoJungSeok</Tag>
                                                    <Tag color="gold" className="trending-tag">#FamilyDrama</Tag>
                                                    <Tag color="lime" className="trending-tag">#KoreanCinema</Tag>
                                                    <Tag color="green" className="trending-tag">#EmotionalStory</Tag>
                                                    <Tag color="cyan" className="trending-tag">#ZombieComedy</Tag>
                                                </div>
                                            </div>

                                            {/* Quick News */}
                                            <div className="quick-news-section">
                                                <Title level={5} className="sidebar-title">
                                                    <span className="title-icon">⚡</span>
                                                    Tin nhanh
                                                </Title>
                                                <List
                                                    size="small"
                                                    dataSource={[
                                                        "Phim đạt rating 9.2/10 trên IMDB",
                                                        "Đạo diễn được đề cử giải thưởng quốc tế",
                                                        "Doanh thu tuần đầu vượt 50 tỷ won",
                                                        "Sắp ra mắt phần 2 của series",
                                                        "Soundtrack được phát hành trên Spotify"
                                                    ]}
                                                    renderItem={(item, index) => (
                                                        <List.Item className="quick-news-item">
                                                            <div className="quick-news-content">
                                                                <span className="quick-news-number">{index + 1}</span>
                                                                <Text className="quick-news-text">{item}</Text>
                                                            </div>
                                                        </List.Item>
                                                    )}
                                                />
                                            </div>

                                            {/* Social Media */}
                                            <div className="social-section">
                                                <Title level={5} className="sidebar-title">
                                                    <span className="title-icon">📱</span>
                                                    Mạng xã hội
                                                </Title>
                                                <div className="social-buttons">
                                                    <Button block className="social-btn facebook">
                                                        <span className="social-icon">📘</span>
                                                        Facebook
                                                    </Button>
                                                    <Button block className="social-btn twitter">
                                                        <span className="social-icon">🐦</span>
                                                        Twitter
                                                    </Button>
                                                    <Button block className="social-btn instagram">
                                                        <span className="social-icon">📷</span>
                                                        Instagram
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Newsletter */}
                                            <div className="newsletter-section">
                                                <Title level={5} className="sidebar-title">
                                                    <span className="title-icon">📧</span>
                                                    Đăng ký tin tức
                                                </Title>
                                                <Text className="newsletter-desc">
                                                    Nhận thông báo về tin tức mới nhất
                                                </Text>
                                                <div className="newsletter-form">
                                                    <Input
                                                        placeholder="Email của bạn"
                                                        className="newsletter-input"
                                                    />
                                                    <Button
                                                        type="primary"
                                                        block
                                                        className="newsletter-btn"
                                                        style={{ marginTop: 8 }}
                                                    >
                                                        Đăng ký
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>

            {/* Cinema Style Seat Selection Modal */}
            <Modal
                title={null}
                open={seatModalVisible}
                onCancel={() => setSeatModalVisible(false)}
                width="85vw"
                style={{
                    maxWidth: '900px',
                    top: 'calc(5vh)',
                    height: 'auto',
                    maxHeight: 'calc(90vh - 10px)'
                }}
                bodyStyle={{
                    padding: '0px',
                    height: 'auto',
                    overflow: 'hidden'
                }}
                footer={null}
                className="cinema-seat-modal-compact"
                closable={false}
            >
                <div className="cinema-modal-content">
                    {/* Header with Back Button */}
                    <div className="cinema-modal-header">
                        <Button
                            type="text"
                            icon={<RightOutlined />}
                            onClick={() => setSeatModalVisible(false)}
                            className="back-button"
                        />
                        <h3 className="modal-title">Mua vé xem phim</h3>
                    </div>

                    {/* Main Seat Layout Area */}
                    <div className="cinema-seat-area">
                        <SeatLayout />
                    </div>

                    {/* Bottom Panel with Movie Info and Seat Summary */}
                    <div className="cinema-bottom-panel">
                        <div className="movie-info-bar">
                            <div className="movie-tag">
                                <span className="tag-label">CB</span>
                                <span className="movie-title">{movie.title}</span>
                            </div>
                            <div className="showtime-info-bottom">
                                <span>16:30 ~ 18:34 • Hôm nay, 28/09 • Phòng chiếu Cine & Suite 9 • 2D Phụ đề</span>
                            </div>
                        </div>

                        <div className="seat-summary">
                            <div className="seat-info">
                                <span className="seat-label">Chỗ ngồi</span>
                                <div className="selected-seats-display">
                                    {selectedSeats.length > 0 ? (
                                        selectedSeats.map((seat, index) => (
                                            <span key={index} className="seat-badge">
                                                {seat}
                                                <button
                                                    className="remove-seat"
                                                    onClick={() => handleSeatClick(seat)}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))
                                    ) : (
                                        <span className="no-seat-selected">Chưa chọn ghế</span>
                                    )}
                                </div>
                            </div>

                            <div className="price-info">
                                <span className="price-label">Tạm tính</span>
                                <span className="price-value">
                                    {selectedSeats.length > 0
                                        ? `${selectedSeats.reduce((total, seat) => {
                                            const price = seat.startsWith('D') || seat.startsWith('E') || seat.startsWith('F') ||
                                                seat.startsWith('G') || seat.startsWith('H') || seat.startsWith('J') ||
                                                seat.startsWith('L') ? 200000 : 150000;
                                            return total + price;
                                        }, 0).toLocaleString('vi-VN')}đ`
                                        : '0đ'
                                    }
                                </span>
                            </div>

                            <Button
                                type="primary"
                                className="buy-ticket-btn"
                                onClick={handleConfirmBooking}
                                disabled={selectedSeats.length === 0}
                            >
                                Mua vé
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Payment Modal */}
            <Modal
                open={paymentModalVisible}
                onCancel={() => setPaymentModalVisible(false)}
                width={800}
                footer={null}
                className="payment-modal"
                closable={false}
            >
                <div className="payment-container">
                    {/* Left Side - Booking Details */}
                    <div className="booking-details">
                        <div className="booking-header-simple">
                            <Tag className="booking-id-yellow">C13</Tag>
                            <Title level={4} className="booking-title-simple">Mua Đồ</Title>
                        </div>

                        <div className="booking-form">
                            <div className="form-row">
                                <div className="form-section">
                                    <Text className="form-label">THỜI GIAN</Text>
                                    <Text className="form-value">14:00 ~ 16:04</Text>
                                </div>
                                <div className="form-section">
                                    <Text className="form-label">NGÀY CHIẾU</Text>
                                    <Text className="form-value">28/09/2025</Text>
                                </div>
                            </div>

                            <div className="form-section">
                                <Text className="form-label">RẠP</Text>
                                <Text className="form-value">CGV Hùng Vương Plaza</Text>
                                <Text className="form-address">
                                    Tầng 7 | Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh
                                </Text>
                            </div>

                            <div className="form-row">
                                <div className="form-section">
                                    <Text className="form-label">PHÒNG CHIẾU</Text>
                                    <Text className="form-value">Cine & Suite 9</Text>
                                </div>
                                <div className="form-section">
                                    <Text className="form-label">ĐỊNH DẠNG</Text>
                                    <Text className="form-value">2D Phụ đề</Text>
                                </div>
                            </div>

                            <div className="seat-section-form">
                                <Text className="form-label">GHẾ</Text>
                                <div className="seat-price-row">
                                    <Text className="form-value">E5</Text>
                                    <Text className="seat-price-form">141.500đ</Text>
                                </div>
                            </div>

                            <div className="total-section-form">
                                <div className="total-row-form">
                                    <Text className="total-label-form">Tạm tính</Text>
                                    <Text className="total-amount-form">141.500đ</Text>
                                </div>
                                <Text className="payment-note-form">
                                    Ưu đãi (nếu có) sẽ được áp dụng ở bước thanh toán.
                                </Text>
                            </div>
                        </div>
                    </div>                    {/* Right Side - QR Payment */}
                    <div className="qr-payment-section">
                        <div className="qr-header">
                            <div className="payment-method-header">
                                <div className="momo-brand">
                                    <div className="momo-logo-header">
                                        <span className="momo-logo-circle">M</span>
                                        <div className="momo-brand-text">
                                            <span className="momo-title">MoMo</span>
                                            <span className="momo-subtitle">Ví điện tử số 1 Việt Nam</span>
                                        </div>
                                    </div>
                                </div>
                                <Title level={4} className="qr-title">
                                    Quét mã QR bằng MoMo để thanh toán
                                </Title>
                            </div>
                        </div>

                        <div className="qr-section">
                            <div className="qr-code-container">
                                <div className="qr-frame">
                                    <div className="frame-corner top-left"></div>
                                    <div className="frame-corner top-right"></div>
                                    <div className="frame-corner bottom-left"></div>
                                    <div className="frame-corner bottom-right"></div>

                                    <div className="qr-code">
                                        <svg width="200" height="200" viewBox="0 0 200 200" className="qr-pattern">
                                            {/* Corner detection patterns */}
                                            <rect x="15" y="15" width="50" height="50" fill="#000" />
                                            <rect x="20" y="20" width="40" height="40" fill="#fff" />
                                            <rect x="30" y="30" width="20" height="20" fill="#000" />

                                            <rect x="135" y="15" width="50" height="50" fill="#000" />
                                            <rect x="140" y="20" width="40" height="40" fill="#fff" />
                                            <rect x="150" y="30" width="20" height="20" fill="#000" />

                                            <rect x="15" y="135" width="50" height="50" fill="#000" />
                                            <rect x="20" y="140" width="40" height="40" fill="#fff" />
                                            <rect x="30" y="150" width="20" height="20" fill="#000" />

                                            {/* Dense QR pattern */}
                                            {Array.from({ length: 600 }, (_, i) => {
                                                const x = 15 + (i % 25) * 7;
                                                const y = 15 + Math.floor(i / 25) * 7;

                                                // Skip corner areas and center
                                                if ((x < 70 && y < 70) ||
                                                    (x > 130 && y < 70) ||
                                                    (x < 70 && y > 130) ||
                                                    (x > 85 && x < 115 && y > 85 && y < 115)) {
                                                    return null;
                                                }

                                                const shouldFill = (x + y + i) % 3 !== 0;
                                                return shouldFill ? (
                                                    <rect key={`dot-${i}`} x={x} y={y} width="5" height="5" fill="#000" />
                                                ) : null;
                                            })}
                                        </svg>

                                        <div className="momo-center-logo-real">
                                            <div className="momo-logo-bg">
                                                <span className="momo-text">mo</span>
                                                <span className="momo-text">mo</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="qr-instructions-simple">
                                <Text className="qr-instruction-text-simple">
                                    Sử dụng App MoMo hoặc<br />
                                    ứng dụng Camera hỗ trợ QR code để quét mã.
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Location Select Modal */}
            <LocationSelectModal
                open={locationModalOpen}
                value={selectedCity}
                onClose={() => setLocationModalOpen(false)}
                onSelect={(province) => { setSelectedCity(province); setLocationModalOpen(false); }}
            />
        </div>
    );
};

export default MovieDetailImage;