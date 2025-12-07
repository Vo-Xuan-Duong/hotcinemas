import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Typography,
    Button,
    Row,
    Col,
    Tag,
    Space,
    Card,
    Input,
    message,
    Rate,
    Progress,
    Statistic,
    Avatar,
    Divider,
    Tooltip,
    Badge,
    Select,
    DatePicker,
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
    CalendarOutlined,
    UserOutlined,
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
import { AimOutlined } from '@ant-design/icons';
import { useTheme } from '../../../context/ThemeContext';
import movieService from '../../../services/movieService';
import showtimeService from '../../../services/showtimeService';
import cityService from '../../../services/cityService';
import LocationSelectModal from '../../../components/LocationSelectModal';
import CommentsSection from '../../../components/Comments/CommentsSection';
import './MovieDetail.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [selectedCity, setSelectedCity] = useState('Tp. Hồ Chí Minh');
    const scheduleTabRef = useRef(null);
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
    const [locations, setLocations] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [trailerModalVisible, setTrailerModalVisible] = useState(false);
    const [cities, setCities] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Fetch cities from API
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const citiesData = await cityService.getCitiesAllNoPage();
                console.log('Cities data from API:', citiesData);

                // Handle if API returns array directly or wrapped in object
                const citiesArray = Array.isArray(citiesData.data) ? citiesData.data : (citiesData.content || []);
                console.log('Processed cities array:', citiesArray);

                setCities(citiesArray);

                // Set default city (Ho Chi Minh City)
                const defaultCity = citiesArray.find(city =>
                    city.name && (city.name.includes('Hồ Chí Minh') || city.name.includes('Ho Chi Minh'))
                );
                if (defaultCity) {
                    setSelectedCityId(defaultCity.id);
                    setSelectedCity(defaultCity.name);
                } else if (citiesArray.length > 0) {
                    setSelectedCityId(citiesArray[0].id);
                    setSelectedCity(citiesArray[0].name);
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
                message.error('Không thể tải danh sách thành phố');
            }
        };

        fetchCities();
    }, []);

    // Fetch movie data from API
    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const movieData = await movieService.getMovieById(id);
                if (movieData) {
                    console.log('Fetched movie data:', movieData);
                    setMovie(movieData);
                } else {
                    message.error('Không tìm thấy phim!');
                    navigate('/movies');
                }
            } catch (error) {
                console.error('Error fetching movie:', error);
                message.error('Có lỗi xảy ra khi tải thông tin phim!');
                navigate('/movies');
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id, navigate]);

    // Parse query param ?tab=schedule or hash #schedule to scroll to schedule section
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tabParam = params.get('tab') || (location.hash ? location.hash.replace('#', '') : null);
        if (tabParam === 'schedule' && movie?.isActive) {
            // scroll after render
            setTimeout(() => {
                if (scheduleTabRef.current) {
                    scheduleTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 200);
        }
    }, [location.search, location.hash, movie?.isActive]);

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

    // Data-driven locations helper - no need for chain selection

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

        const fetchSchedulesAndCinemas = async () => {
            try {
                const dateISO = getSelectedDateISO();

                // Use new API to get cinemas with showtimes for this movie and date
                const params = {
                    page: 0,
                    size: 5
                };

                // Add cityId filter if a city is selected (not "Gần bạn")
                if (selectedCityId && selectedCity !== 'Gần bạn') {
                    params.cityId = selectedCityId;
                }

                // Handle "Gần bạn" with geolocation
                if (selectedCity === 'Gần bạn' && userLocation) {
                    params.latitude = userLocation.latitude;
                    params.longitude = userLocation.longitude;
                    // Remove cityId when using location-based search
                    delete params.cityId;
                }

                console.log('Calling API with params:', { movieId: movie.id, date: dateISO, params });

                const response = await showtimeService.getCinemaShowtimesByMovieAndDate(
                    movie.id,
                    dateISO,
                    params
                );

                console.log('API response:', response);

                // Handle response structure - try both possible formats
                const responseData = response?.data || response;
                const cinemasWithShowtimes = responseData?.content || [];
                console.log('Cinemas with showtimes:', cinemasWithShowtimes);

                // Extract pagination info
                const totalPagesFromApi = responseData?.totalPages || 0;
                const currentPageFromApi = responseData?.number || 0;
                setTotalPages(totalPagesFromApi);
                setCurrentPage(currentPageFromApi);
                setHasMore(currentPageFromApi + 1 < totalPagesFromApi);

                // Build cinema map from the new response structure
                const cinemasMap = {};
                cinemasWithShowtimes.forEach(cinemaData => {
                    // New structure: cinemaId, cinemaName, address, formats[]
                    if (!cinemaData.cinemaId) return;

                    // Flatten all showtimes from all formats
                    const allShowtimes = [];
                    if (cinemaData.formats && Array.isArray(cinemaData.formats)) {
                        cinemaData.formats.forEach(format => {
                            if (format.showtimes && Array.isArray(format.showtimes)) {
                                format.showtimes.forEach(st => {
                                    allShowtimes.push({
                                        id: st.showtimeId,
                                        time: st.startTime,
                                        endTime: st.endTime,
                                        roomId: st.roomId,
                                        roomName: st.roomName,
                                        price: st.price,
                                        status: st.status,
                                        formatType: format.formatType,
                                        cinemaId: cinemaData.cinemaId
                                    });
                                });
                            }
                        });
                    }

                    cinemasMap[cinemaData.cinemaId] = {
                        cinema: {
                            id: cinemaData.cinemaId,
                            name: cinemaData.cinemaName,
                            address: cinemaData.address,
                            cityId: cinemaData.cityId,
                            cityName: cinemaData.cityName,
                            latitude: cinemaData.latitude,
                            longitude: cinemaData.longitude,
                            distance: cinemaData.distance
                        },
                        showtimes: allShowtimes
                    };
                });

                const cinemaEntries = Object.values(cinemasMap);

                // Set locations directly without chain grouping
                const newLocations = cinemaEntries.map(entry => ({
                    id: 'cinema-' + entry.cinema.id,
                    cinemaId: entry.cinema.id,
                    name: entry.cinema.name,
                    address: entry.cinema.address,
                    map: '#',
                    showtimes: entry.showtimes
                }));

                // If page 0, replace; otherwise append
                if (params.page === 0) {
                    setLocations(newLocations);
                } else {
                    setLocations(prev => [...prev, ...newLocations]);
                }
            } catch (error) {
                console.error('Error fetching schedules and cinemas:', error);
                message.error('Không thể tải lịch chiếu');
            }
        };

        // Reset page when filters change
        setCurrentPage(0);
        fetchSchedulesAndCinemas();
    }, [movie, selectedDate, selectedCityId]);

    // Auto-expand first cinema location when locations are loaded
    useEffect(() => {
        if (locations.length > 0 && expandedLocation === null) {
            const firstLocationWithShowtimes = locations.find(loc => loc.showtimes && loc.showtimes.length > 0);
            if (firstLocationWithShowtimes) {
                setExpandedLocation(firstLocationWithShowtimes.id);
            }
        }
    }, [locations]);

    const loadMoreCinemas = async () => {
        if (!hasMore || loadingMore || !movie) return;

        setLoadingMore(true);
        try {
            const dateISO = getSelectedDateISO();
            const nextPage = currentPage + 1;

            const params = {
                page: nextPage,
                size: 5
            };

            if (selectedCityId && selectedCity !== 'Gần bạn') {
                params.cityId = selectedCityId;
            }

            if (selectedCity === 'Gần bạn' && userLocation) {
                params.latitude = userLocation.latitude;
                params.longitude = userLocation.longitude;
                delete params.cityId;
            }

            const response = await showtimeService.getCinemaShowtimesByMovieAndDate(
                movie.id,
                dateISO,
                params
            );

            const responseData = response?.data || response;
            const cinemasWithShowtimes = responseData?.content || [];

            // Build cinema map
            const cinemasMap = {};
            cinemasWithShowtimes.forEach(cinemaData => {
                if (!cinemaData.cinemaId) return;

                const allShowtimes = [];
                if (cinemaData.formats && Array.isArray(cinemaData.formats)) {
                    cinemaData.formats.forEach(format => {
                        if (format.showtimes && Array.isArray(format.showtimes)) {
                            format.showtimes.forEach(st => {
                                allShowtimes.push({
                                    id: st.showtimeId,
                                    time: st.startTime,
                                    endTime: st.endTime,
                                    roomId: st.roomId,
                                    roomName: st.roomName,
                                    price: st.price,
                                    status: st.status,
                                    formatType: format.formatType,
                                    cinemaId: cinemaData.cinemaId
                                });
                            });
                        }
                    });
                }

                cinemasMap[cinemaData.cinemaId] = {
                    cinema: {
                        id: cinemaData.cinemaId,
                        name: cinemaData.cinemaName,
                        address: cinemaData.address,
                        cityId: cinemaData.cityId,
                        cityName: cinemaData.cityName,
                        latitude: cinemaData.latitude,
                        longitude: cinemaData.longitude,
                        distance: cinemaData.distance
                    },
                    showtimes: allShowtimes
                };
            });

            const cinemaEntries = Object.values(cinemasMap);
            const newLocations = cinemaEntries.map(entry => ({
                id: 'cinema-' + entry.cinema.id,
                cinemaId: entry.cinema.id,
                name: entry.cinema.name,
                address: entry.cinema.address,
                map: '#',
                showtimes: entry.showtimes
            }));

            setLocations(prev => [...prev, ...newLocations]);
            setCurrentPage(nextPage);
            setHasMore(nextPage + 1 < responseData?.totalPages);
        } catch (error) {
            console.error('Error loading more cinemas:', error);
            message.error('Không thể tải thêm rạp');
        } finally {
            setLoadingMore(false);
        }
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        message.success(isFavorite ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích');
    };

    const handleBuyTicket = () => {
        if (scheduleTabRef.current) {
            scheduleTabRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
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
        // Giữ modal chọn ghế vẫn mở theo yêu cầu UX mới
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

            {/* Hero Banner Section */}
            <div className="hero-banner-section" style={{ backgroundImage: `url(${movie.backdropPath || movie.posterPath})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="container">
                        <Row gutter={[40, 40]} align="middle">
                            {/* Left - Movie Poster */}
                            <Col xs={24} lg={6}>
                                <div className="movie-poster-container enlarge">
                                    <img
                                        src={movie.posterPath || movie.poster}
                                        alt={movie.title}
                                        className="movie-poster-main"
                                    />
                                </div>
                            </Col>

                            {/* Center - Movie Information */}
                            <Col xs={24} lg={18}>
                                <div className="movie-info-section">
                                    {/* Title */}
                                    <Title level={1} className="movie-title-main">
                                        {movie.title}
                                    </Title>

                                    <Text className="movie-subtitle-main">
                                        {movie.originalTitle || movie.tagline || ""}
                                    </Text>

                                    {/* Movie Quick Info Tags */}
                                    <div className="movie-quick-info-tags">
                                        {/* Duration, Age Rating and Release Date Row */}
                                        <Space wrap size="small" style={{ marginBottom: '8px' }}>
                                            <span className="info-tag">
                                                {movie.releaseDate
                                                    ? new Date(movie.releaseDate).toLocaleDateString('vi-VN')
                                                    : 'Đang cập nhật'}
                                            </span>
                                            <span className="info-tag">
                                                {movie.durationMinutes ? `${Math.floor(movie.durationMinutes / 60)} giờ ${movie.durationMinutes % 60} phút` :
                                                    movie.duration ? `${movie.duration} phút` : '1 giờ 55 phút'}
                                            </span>
                                            <span className="info-tag">{movie.ageRating || movie.ageLabel || 'PG-13'}</span>
                                        </Space>
                                        {/* Genres Row */}
                                        {movie.genres && movie.genres.length > 0 && (
                                            <Space wrap size="small">
                                                {movie.genres.map((genre, index) => (
                                                    <span key={index} className="info-tag">
                                                        {typeof genre === 'string' ? genre : genre?.name || 'Hành động'}
                                                    </span>
                                                ))}
                                            </Space>
                                        )}
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div className="action-buttons-row">
                                        <Space wrap size="middle">
                                            <Button
                                                type="primary"
                                                icon={<CarryOutOutlined />}
                                                className="action-btn-hero buy-ticket-btn-primary"
                                                onClick={handleBuyTicket}
                                            >
                                                Mua vé
                                            </Button>
                                            <Button
                                                icon={<PlayCircleOutlined />}
                                                className="action-btn-hero trailer-btn-secondary"
                                                onClick={() => setTrailerModalVisible(true)}
                                                disabled={!movie.trailerUrl && !movie.trailer}
                                            >
                                                Xem Trailer
                                            </Button>
                                        </Space>
                                    </div>
                                </div>
                            </Col>

                            {/* Cast / Director sidebar removed per request. If needed later, restore this Col block. */}
                        </Row>
                    </div>
                </div>
            </div>

            {/* Content Section - No Tabs */}
            <div className="content-section">
                <div className="container">
                    <div className="movie-info-tab-content">
                        <Row gutter={[32, 32]}>
                            {/* Left Column - Schedule, Cast & Rating */}
                            <Col xs={24} md={12} lg={14}>
                                <div className="movie-details-section">
                                    {/* Schedule Section */}
                                    {movie.isActive && (
                                        <div className="schedule-section-modern" ref={scheduleTabRef}>
                                            <Title level={4} className="section-title">
                                                <span className="title-icon">📅</span>
                                                Lịch chiếu
                                            </Title>
                                            {/* Filters Inline (Refactored) */}
                                            <div className="schedule-filters modern-inline">
                                                <div className="filters-bar">
                                                    <div className="filter-group city-group">
                                                        <Text className="schedule-filter-label inline">
                                                            <EnvironmentOutlined />
                                                            <span>Thành phố</span>
                                                        </Text>
                                                        <div className="schedule-city-selector city-button-group">
                                                            <Button
                                                                className="city-select-btn"
                                                                onClick={() => setLocationModalOpen(true)}
                                                            >
                                                                <EnvironmentOutlined />
                                                                <span>{selectedCity || 'Chọn thành phố'}</span>
                                                            </Button>
                                                            <Button
                                                                className="nearby-btn"
                                                                onClick={() => {
                                                                    setSelectedCity('Gần bạn');
                                                                    setSelectedCityId(null);

                                                                    // Get user's current location
                                                                    if (navigator.geolocation) {
                                                                        navigator.geolocation.getCurrentPosition(
                                                                            (position) => {
                                                                                setUserLocation({
                                                                                    latitude: position.coords.latitude,
                                                                                    longitude: position.coords.longitude
                                                                                });
                                                                                message.success('Đã lấy vị trí của bạn');
                                                                            },
                                                                            (error) => {
                                                                                console.error('Error getting location:', error);
                                                                                message.warning('Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí.');
                                                                            }
                                                                        );
                                                                    } else {
                                                                        message.error('Trình duyệt không hỗ trợ geolocation');
                                                                    }
                                                                }}
                                                            >
                                                                <AimOutlined />
                                                                <span>Gần bạn</span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="filter-group date-group">
                                                        <Text className="schedule-filter-label inline">
                                                            <CalendarOutlined />
                                                            <span>Chọn ngày chiếu</span>
                                                        </Text>
                                                        <div className="date-scroll-wrapper">
                                                            <div className="date-selector-modern compact">
                                                                {(() => {
                                                                    const dates = [];
                                                                    const today = new Date();
                                                                    const daysOfWeek = ['CN', 'TH 2', 'TH 3', 'TH 4', 'TH 5', 'TH 6', 'TH 7'];

                                                                    for (let i = 0; i < 7; i++) {
                                                                        const date = new Date(today);
                                                                        date.setDate(today.getDate() + i);

                                                                        const day = date.getDate();
                                                                        const month = date.getMonth() + 1;
                                                                        const dayOfWeek = daysOfWeek[date.getDay()];

                                                                        dates.push({
                                                                            date: `${day}/${month}`,
                                                                            day: i === 0 ? 'HÔM NAY' : dayOfWeek,
                                                                            active: i === 0
                                                                        });
                                                                    }

                                                                    return dates.map((item, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className={`date-card-modern ${selectedDate === index || (selectedDate === null && item.active) ? 'active' : ''}`}
                                                                            onClick={() => handleDateClick(item, index)}
                                                                        >
                                                                            <div className="date-day">{item.day}</div>
                                                                            <div className="date-number">{item.date}</div>
                                                                        </div>
                                                                    ));
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Cinema Locations List */}
                                            <div className="cinema-locations-list">
                                                {(() => {
                                                    if (!locations.length) {
                                                        return (
                                                            <div className="empty-state">
                                                                <Empty
                                                                    description="Không có lịch chiếu cho ngày đã chọn"
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
                                                                            {loc.address}
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
                                                                        {(() => {
                                                                            // Group showtimes by format type
                                                                            const showtimesByFormat = {};
                                                                            loc.showtimes.forEach(showtime => {
                                                                                const format = showtime.formatType || '2D Phụ đề';
                                                                                if (!showtimesByFormat[format]) {
                                                                                    showtimesByFormat[format] = [];
                                                                                }
                                                                                showtimesByFormat[format].push(showtime);
                                                                            });

                                                                            return Object.entries(showtimesByFormat).map(([format, showtimes]) => (
                                                                                <div key={format} style={{ marginBottom: '16px' }}>
                                                                                    <div className="format-label">
                                                                                        <Text strong>{format}</Text>
                                                                                    </div>
                                                                                    <div className="showtimes-row">
                                                                                        {showtimes.map(showtime => (
                                                                                            <Button
                                                                                                key={showtime.id}
                                                                                                className="showtime-button"
                                                                                                onClick={() => navigate(`/booking/seats/${showtime.id}`)}
                                                                                            >
                                                                                                {showtime.time}
                                                                                            </Button>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            ));
                                                                        })()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    });
                                                })()}

                                                {/* Load More Button */}
                                                {hasMore && (
                                                    <div style={{ padding: '16px', textAlign: 'center' }}>
                                                        <Button
                                                            type="link"
                                                            loading={loadingMore}
                                                            onClick={loadMoreCinemas}
                                                            style={{
                                                                fontSize: '14px',
                                                                fontWeight: 400
                                                            }}
                                                        >
                                                            {loadingMore ? 'Đang tải...' : 'Xem thêm'}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Cast & Crew */}
                                    <div className="cast-crew-section" style={{ marginTop: movie.isActive ? '48px' : '0' }}>
                                        <Title level={4} className="section-title">
                                            <span className="title-icon">🎭</span>
                                            Diễn viên & Đoàn làm phim
                                        </Title>
                                        {/* Cast Members with Photos */}
                                        <div className="cast-members-grid-enhanced">
                                            {movie.cast && movie.cast.length > 0 ? (
                                                movie.cast.slice(0, 4).map((actor, idx) => (
                                                    <div key={idx} className="cast-member-card">
                                                        <div className="cast-photo">
                                                            {actor.profilePath ? (
                                                                <img src={actor.profilePath} alt={actor.name} />
                                                            ) : (
                                                                <div className="cast-photo-placeholder">
                                                                    <UserOutlined style={{ fontSize: '32px' }} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="cast-name-card">{actor.name}</div>
                                                        <div className="cast-character">{actor.character || 'Diễn viên'}</div>
                                                    </div>
                                                ))
                                            ) : movie.casts && movie.casts.length > 0 ? (
                                                movie.casts.slice(0, 4).map((actor, idx) => (
                                                    <div key={idx} className="cast-member-card">
                                                        <div className="cast-photo">
                                                            <div className="cast-photo-placeholder">
                                                                <UserOutlined style={{ fontSize: '32px' }} />
                                                            </div>
                                                        </div>
                                                        <div className="cast-name-card">{actor}</div>
                                                        <div className="cast-character">Diễn viên</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <Text type="secondary">Thông tin diễn viên đang được cập nhật</Text>
                                            )}
                                        </div>
                                    </div>

                                    {/* Trailer Section - Only show if trailer exists */}
                                    {(movie.trailerUrl || movie.trailer) && (
                                        <div className="trailer-section" style={{ marginTop: '48px' }}>
                                            <Title level={4} className="section-title">
                                                <span className="title-icon">🎥</span>
                                                Trailer chính thức
                                            </Title>
                                            <div className="trailer-video-wrapper">
                                                <div className="trailer-container-embedded">
                                                    <iframe
                                                        className="trailer-iframe"
                                                        src={`https://www.youtube.com/embed/${getYouTubeId(movie.trailerUrl || movie.trailer)}`}
                                                        title="Movie Trailer"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>
                                                <div className="trailer-actions" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                                                    <Button
                                                        icon={<PlayCircleOutlined />}
                                                        onClick={() => setTrailerModalVisible(true)}
                                                        className="trailer-fullscreen-btn"
                                                    >
                                                        Xem toàn màn hình
                                                    </Button>
                                                    <Button
                                                        icon={<ShareAltOutlined />}
                                                        onClick={handleShare}
                                                        className="trailer-share-btn"
                                                    >
                                                        Chia sẻ
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Rating Section - Using CommentsSection Component */}
                                    {movie.isActive && (
                                        <div style={{ marginTop: '48px' }}>
                                            <CommentsSection movieId={movie.id} />
                                        </div>
                                    )}
                                </div>
                            </Col>

                            {/* Right Column - Synopsis & Additional Info */}
                            <Col xs={24} md={12} lg={10}>
                                <div className="movie-sidebar-info">
                                    {/* Synopsis */}
                                    <div className="synopsis-section">
                                        <Title level={4} className="section-title">
                                            <span className="title-icon">📖</span>
                                            Tóm tắt
                                        </Title>
                                        <div className="synopsis-content">
                                            <Paragraph className="synopsis-text">
                                                {movie.overview || movie.description || 'Nội dung phim đang được cập nhật...'}
                                            </Paragraph>
                                            {movie.tagline && (
                                                <Paragraph className="synopsis-text" style={{ fontStyle: 'italic', marginTop: '16px' }}>
                                                    "{movie.tagline}"
                                                </Paragraph>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
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
                cities={cities}
                onClose={() => setLocationModalOpen(false)}
                onSelect={(city) => {
                    setSelectedCity(city.name);
                    setSelectedCityId(city.id);
                    setLocationModalOpen(false);
                }}
            />

            {/* Trailer Modal */}
            <Modal
                title={<span><PlayCircleOutlined /> Trailer - {movie?.title}</span>}
                open={trailerModalVisible}
                onCancel={() => setTrailerModalVisible(false)}
                footer={null}
                width={900}
                centered
                destroyOnClose
            >
                {(movie?.trailerUrl || movie?.trailer) && (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                borderRadius: '8px'
                            }}
                            src={`https://www.youtube.com/embed/${getYouTubeId(movie.trailerUrl || movie.trailer)}?autoplay=1`}
                            title="Movie Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

// Helper function to extract YouTube video ID
const getYouTubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
};

export default MovieDetail;