import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Modal,
    Badge
} from 'antd';
import {
    CalendarOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    StarOutlined,
    PlayCircleOutlined,
    HeartOutlined,
    WarningOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import './ScheduleModern.css';

const { Title, Text } = Typography;

dayjs.locale('vi');

const ScheduleModern = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedArea, setSelectedArea] = useState('Tp. Hồ Chí Minh');
    const [selectedCinema, setSelectedCinema] = useState('Beta Ung Văn Khiêm');
    const [previewMovie, setPreviewMovie] = useState(null);

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

    const mockMovies = [
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
            <div className="schedule-modern">
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Spin size="large" />
                    <Title level={4} style={{ marginTop: 16, color: 'var(--text-primary)' }}>
                        Đang tải lịch chiếu...
                    </Title>
                </div>
            </div>
        );
    }

    // Mock data (removed duplicate declaration)
    /* 
    const mockMovies = [
        {
            id: 1,
            title: "Spider-Man: No Way Home",
            poster: "https://picsum.photos/300/450?random=1",
            genre: "Hành động",
            duration: 148,
            rating: 8.4,
            ageLabel: "13+",
            overview: "Peter Parker cùng Doctor Strange mở ra đa vũ trụ, đối mặt với những kẻ thù từ các chiều không gian khác."
        },
        {
            id: 2,
            title: "Top Gun: Maverick",
            poster: "https://picsum.photos/300/450?random=2",
            genre: "Hành động",
            duration: 131,
            rating: 8.7,
            ageLabel: "16+",
            overview: "Maverick trở lại với nhiệm vụ huấn luyện thế hệ phi công mới trong một nhiệm vụ nguy hiểm."
        },
        {
            id: 3,
            title: "Avatar: The Way of Water",
            poster: "https://picsum.photos/300/450?random=3",
            genre: "Khoa học viễn tưởng",
            duration: 192,
            rating: 7.9,
            ageLabel: "13+",
            overview: "Jake Sully và gia đình tiếp tục cuộc phiêu lưu trên hành tinh Pandora với những thử thách mới."
        },
        {
            id: 4,
            title: "Black Panther: Wakanda Forever",
            poster: "https://picsum.photos/300/450?random=4",
            genre: "Hành động",
            duration: 161,
            rating: 7.3,
            ageLabel: "13+",
            overview: "Wakanda đối mặt với những thách thức mới sau sự ra đi của vua T'Challa."
        },
        {
            id: 5,
            title: "The Batman",
            poster: "https://picsum.photos/300/450?random=5",
            genre: "Hành động",
            duration: 176,
            rating: 7.8,
            ageLabel: "16+",
            overview: "Bruce Wayne trong những năm đầu làm Batman, đối mặt với tội phạm Riddler."
        },
        {
            id: 6,
            title: "Minions: The Rise of Gru",
            poster: "https://picsum.photos/300/450?random=6",
            genre: "Hoạt hình",
            duration: 87,
            rating: 6.5,
            ageLabel: "P",
            overview: "Gru và các Minions trong cuộc phiêu lưu mới đầy hài hước và ngọt ngào."
        }
    ];
    */

    const mockCinemas = [
        {
            id: 1,
            name: "HotCinemas Vincom",
            rooms: [
                { id: 1, name: "Phòng 1", type: "Standard" },
                { id: 2, name: "Phòng 2", type: "VIP" },
                { id: 3, name: "Phòng 3", type: "IMAX" }
            ]
        },
        {
            id: 2,
            name: "HotCinemas Landmark",
            rooms: [
                { id: 4, name: "Phòng 1", type: "Standard" },
                { id: 5, name: "Phòng 2", type: "VIP" },
                { id: 6, name: "Phòng 3", type: "4DX" }
            ]
        },
        {
            id: 3,
            name: "HotCinemas Crescent Mall",
            rooms: [
                { id: 7, name: "Phòng 1", type: "Standard" },
                { id: 8, name: "Phòng 2", type: "VIP" }
            ]
        }
    ];

    const generateMockSchedules = () => {
        const schedules = [];
        let scheduleId = 1;

        // Generate schedules for next 7 days
        for (let day = 0; day < 7; day++) {
            const date = dayjs().add(day, 'day').format('YYYY-MM-DD');

            mockMovies.forEach(movie => {
                mockCinemas.forEach(cinema => {
                    // Generate 3-5 showtimes per movie per cinema per day
                    const showtimesCount = Math.floor(Math.random() * 3) + 3;
                    const baseHours = [9, 12, 15, 18, 21];

                    for (let i = 0; i < showtimesCount; i++) {
                        const hour = baseHours[i] || (22 + Math.floor(Math.random() * 2));
                        const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
                        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

                        const randomRoom = cinema.rooms[Math.floor(Math.random() * cinema.rooms.length)];

                        schedules.push({
                            id: scheduleId++,
                            movieId: movie.id,
                            cinemaId: cinema.id,
                            roomId: randomRoom.id,
                            date: date,
                            time: time
                        });
                    }
                });
            });
        }

        return schedules;
    };

    const mockSchedules = generateMockSchedules();

    // Generate next 14 days for quick selection
    const getQuickDates = () => {
        const dates = [];
        for (let i = 0; i < 14; i++) {
            const date = dayjs().add(i, 'day');
            dates.push({
                value: date,
                label: date.format('ddd, DD/MM'),
                fullLabel: date.format('dddd, DD MMMM YYYY'),
                isToday: i === 0,
                isWeekend: date.day() === 0 || date.day() === 6
            });
        }
        return dates;
    };

    const [quickDates] = useState(getQuickDates());

    // Get unique genres from movies
    const getGenres = () => {
        const genres = [...new Set(movies.map(movie => movie.genre).filter(Boolean))];
        return genres;
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterSchedules();
    }, [schedules, selectedDate, selectedCinema, selectedGenre]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Simulate API loading time
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSchedules(mockSchedules);
            setMovies(mockMovies);
            setCinemas(mockCinemas);
        } catch (error) {
            console.error('Error fetching data:', error);
            notification.error({
                message: 'Lỗi tải dữ liệu',
                description: 'Không thể tải thông tin lịch chiếu. Vui lòng thử lại.',
            });
        } finally {
            setLoading(false);
        }
    };

    const filterSchedules = () => {
        let filtered = schedules.filter(schedule => {
            const dateMatch = !selectedDate || schedule.date === selectedDate.format('YYYY-MM-DD');
            const cinemaMatch = !selectedCinema || schedule.cinemaId === parseInt(selectedCinema);

            let genreMatch = true;
            if (selectedGenre) {
                const movie = movies.find(m => m.id === schedule.movieId);
                genreMatch = movie?.genre === selectedGenre;
            }

            return dateMatch && cinemaMatch && genreMatch;
        });

        // Group by movie
        const groupedByMovie = filtered.reduce((acc, schedule) => {
            const movieId = schedule.movieId;
            if (!acc[movieId]) {
                const movie = movies.find(m => m.id === movieId);
                acc[movieId] = {
                    movie,
                    showtimes: []
                };
            }

            const cinema = cinemas.find(c => c.id === schedule.cinemaId);
            const room = cinema?.rooms?.find(r => r.id === schedule.roomId);

            acc[movieId].showtimes.push({
                ...schedule,
                cinema,
                room
            });

            return acc;
        }, {});

        // Sort showtimes by time and add pricing info
        Object.values(groupedByMovie).forEach(group => {
            group.showtimes.sort((a, b) => a.time.localeCompare(b.time));

            // Add dynamic pricing based on time and room type
            group.showtimes.forEach(showtime => {
                const hour = parseInt(showtime.time.split(':')[0]);
                const isWeekend = selectedDate.day() === 0 || selectedDate.day() === 6;
                let basePrice = 80000;

                // Time-based pricing
                if (hour >= 18) basePrice += 20000; // Evening premium
                if (hour >= 22) basePrice += 30000; // Late night premium

                // Weekend premium
                if (isWeekend) basePrice += 15000;

                // Room type premium
                if (showtime.room?.type === 'VIP') basePrice += 50000;
                if (showtime.room?.type === 'IMAX') basePrice += 70000;
                if (showtime.room?.type === '4DX') basePrice += 100000;

                showtime.price = basePrice;
            });
        });

        setFilteredSchedules(Object.values(groupedByMovie).filter(group => group.movie));
    };

    // Removed duplicate handleBooking function
    /*
    const handleBooking = (showtime, movie) => {
        navigate('/booking', {
            state: {
                showtime,
                movie,
                cinema: showtime.cinema,
                room: showtime.room
            }
        });
    };
    */

    const handleLikeMovie = (movieId) => {
        const newLiked = new Set(likedMovies);
        if (newLiked.has(movieId)) {
            newLiked.delete(movieId);
            notification.info({
                message: 'Đã bỏ yêu thích',
                description: 'Phim đã được xóa khỏi danh sách yêu thích.',
            });
        } else {
            newLiked.add(movieId);
            notification.success({
                message: 'Đã thêm yêu thích',
                description: 'Phim đã được thêm vào danh sách yêu thích.',
            });
        }
        setLikedMovies(newLiked);
    };

    const handlePreviewMovie = (movie) => {
        setPreviewMovie(movie);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getRoomTypeIcon = (type) => {
        switch (type) {
            case 'VIP': return <CrownOutlined />;
            case 'IMAX': return <ThunderboltOutlined />;
            case '4DX': return <StarOutlined />;
            default: return <UserOutlined />;
        }
    };

    const getRoomTypeColor = (type) => {
        switch (type) {
            case 'VIP': return 'gold';
            case 'IMAX': return 'purple';
            case '4DX': return 'red';
            default: return 'blue';
        }
    };

    if (loading) {
        return (
            <div className="schedule-modern">
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
        <div className="schedule-modern">
            <div className="container">
                {/* Header Section */}
                <div className="schedule-header">
                    <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                        <div>
                            <Avatar size={64} icon={<CalendarOutlined />} style={{ backgroundColor: '#ff6b35' }} />
                            <Title level={1} style={{ color: 'var(--text-primary)', marginTop: 16, marginBottom: 8 }}>
                                Lịch Chiếu Phim
                            </Title>
                            <Text style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                                Khám phá và đặt vé cho những bộ phim hay nhất
                            </Text>
                        </div>
                    </Space>
                </div>

                {/* Quick Date Selector */}
                <Card className="quick-dates-card" bodyStyle={{ padding: '16px' }}>
                    <Title level={5} style={{ marginBottom: 16, color: 'var(--text-primary)' }}>
                        <CalendarOutlined /> Chọn nhanh ngày chiếu
                    </Title>
                    <div className="quick-dates">
                        {quickDates.slice(0, 7).map(date => (
                            <Button
                                key={date.value.format('YYYY-MM-DD')}
                                type={selectedDate.isSame(date.value, 'day') ? 'primary' : 'default'}
                                className={`date-btn ${date.isToday ? 'today' : ''} ${date.isWeekend ? 'weekend' : ''}`}
                                onClick={() => setSelectedDate(date.value)}
                            >
                                <div>
                                    <div className="date-label">{date.label}</div>
                                    {date.isToday && <Badge count="Hôm nay" style={{ backgroundColor: '#52c41a' }} />}
                                </div>
                            </Button>
                        ))}
                    </div>
                </Card>

                {/* Advanced Filters */}
                <Card className="filters-card" bodyStyle={{ padding: '20px' }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={8} md={6}>
                            <Space>
                                <FilterOutlined />
                                <Text strong style={{ color: 'var(--text-primary)' }}>Bộ lọc:</Text>
                            </Space>
                        </Col>
                        <Col xs={24} sm={16} md={6}>
                            <DatePicker
                                value={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                placeholder="Chọn ngày chiếu"
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Select
                                placeholder="Chọn rạp chiếu"
                                value={selectedCinema}
                                onChange={setSelectedCinema}
                                style={{ width: '100%' }}
                                allowClear
                            >
                                {cinemas.map(cinema => (
                                    <Option key={cinema.id} value={cinema.id}>
                                        <EnvironmentOutlined /> {cinema.name}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Select
                                placeholder="Chọn thể loại"
                                value={selectedGenre}
                                onChange={setSelectedGenre}
                                style={{ width: '100%' }}
                                allowClear
                            >
                                {getGenres().map(genre => (
                                    <Option key={genre} value={genre}>
                                        {genre}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </Card>

                {/* Selected Date Display */}
                <div className="selected-date-display">
                    <Title level={3} style={{ color: 'var(--text-primary)', textAlign: 'center' }}>
                        <CalendarOutlined /> Lịch chiếu ngày: {selectedDate.format('dddd, DD MMMM YYYY')}
                    </Title>
                </div>

                {/* Movies Schedule Grid */}
                <div className="schedules-container">
                    {filteredSchedules.length === 0 ? (
                        <Card>
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div>
                                        <Title level={4}>Không có lịch chiếu</Title>
                                        <Text>Không tìm thấy suất chiếu nào cho ngày và bộ lọc đã chọn.</Text>
                                    </div>
                                }
                            >
                                <Button type="primary" icon={<ReloadOutlined />} onClick={fetchData}>
                                    Tải lại
                                </Button>
                            </Empty>
                        </Card>
                    ) : (
                        <Row gutter={[24, 24]}>
                            {filteredSchedules.map(({ movie, showtimes }) => (
                                <Col xs={24} key={movie.id}>
                                    <Card className="movie-schedule-card" hoverable>
                                        <Row gutter={[24, 16]}>
                                            {/* Movie Info */}
                                            <Col xs={24} md={8}>
                                                <div className="movie-info-section">
                                                    <div className="movie-poster-container">
                                                        <img
                                                            src={movie.poster || `https://picsum.photos/300/450?random=${movie.id}`}
                                                            alt={movie.title}
                                                            className="movie-poster"
                                                            onClick={() => handlePreviewMovie(movie)}
                                                        />
                                                        <div className="movie-overlay">
                                                            <Button
                                                                shape="circle"
                                                                icon={<PlayCircleOutlined />}
                                                                size="large"
                                                                onClick={() => handlePreviewMovie(movie)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="movie-details">
                                                        <Title level={4} style={{ marginBottom: 8 }}>
                                                            {movie.title}
                                                        </Title>
                                                        <Space direction="vertical" size="small">
                                                            <Space>
                                                                <Rate disabled defaultValue={movie.rating / 2} />
                                                                <Text strong>{movie.rating}/10</Text>
                                                            </Space>
                                                            <Space wrap>
                                                                <Tag color="blue">{movie.genre}</Tag>
                                                                <Tag color="orange">{movie.duration} phút</Tag>
                                                                <Tag color="red">{movie.ageLabel}</Tag>
                                                            </Space>
                                                            <div className="movie-actions">
                                                                <Button
                                                                    type="text"
                                                                    icon={<HeartOutlined />}
                                                                    className={likedMovies.has(movie.id) ? 'liked' : ''}
                                                                    onClick={() => handleLikeMovie(movie.id)}
                                                                >
                                                                    Yêu thích
                                                                </Button>
                                                                <Button type="text" icon={<ShareAltOutlined />}>
                                                                    Chia sẻ
                                                                </Button>
                                                            </div>
                                                        </Space>
                                                    </div>
                                                </div>
                                            </Col>

                                            {/* Showtimes */}
                                            <Col xs={24} md={16}>
                                                <div className="showtimes-section">
                                                    <Title level={5} style={{ marginBottom: 16 }}>
                                                        <ClockCircleOutlined /> Suất chiếu ({showtimes.length} suất)
                                                    </Title>
                                                    <Row gutter={[12, 12]}>
                                                        {showtimes.map(showtime => (
                                                            <Col xs={24} sm={12} lg={8} key={showtime.id}>
                                                                <Card className="showtime-card" size="small" hoverable>
                                                                    <div className="showtime-header">
                                                                        <Space>
                                                                            <ClockCircleOutlined />
                                                                            <Text strong className="showtime">{showtime.time}</Text>
                                                                        </Space>
                                                                        <Tag
                                                                            color={getRoomTypeColor(showtime.room?.type)}
                                                                            icon={getRoomTypeIcon(showtime.room?.type)}
                                                                        >
                                                                            {showtime.room?.type || 'Standard'}
                                                                        </Tag>
                                                                    </div>

                                                                    <Divider style={{ margin: '8px 0' }} />

                                                                    <div className="showtime-details">
                                                                        <div className="cinema-info">
                                                                            <Text type="secondary">
                                                                                <EnvironmentOutlined /> {showtime.cinema?.name}
                                                                            </Text>
                                                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                                Phòng: {showtime.room?.name}
                                                                            </Text>
                                                                        </div>

                                                                        <div className="price-section">
                                                                            <Text strong style={{ color: '#ff6b35', fontSize: '14px' }}>
                                                                                {formatPrice(showtime.price)}
                                                                            </Text>
                                                                        </div>
                                                                    </div>

                                                                    <Button
                                                                        type="primary"
                                                                        block
                                                                        style={{ marginTop: 12 }}
                                                                        onClick={() => handleBooking(showtime, movie)}
                                                                    >
                                                                        Đặt vé ngay
                                                                    </Button>
                                                                </Card>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>

                {/* Movie Preview Modal */}
                <Modal
                    title={previewMovie?.title}
                    open={!!previewMovie}
                    onCancel={() => setPreviewMovie(null)}
                    footer={[
                        <Button key="close" onClick={() => setPreviewMovie(null)}>
                            Đóng
                        </Button>,
                        <Button
                            key="booking"
                            type="primary"
                            onClick={() => {
                                setPreviewMovie(null);
                                // Navigate to movie detail or booking
                            }}
                        >
                            Xem chi tiết
                        </Button>
                    ]}
                    width={800}
                >
                    {previewMovie && (
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <img
                                    src={previewMovie.poster}
                                    alt={previewMovie.title}
                                    style={{ width: '100%', borderRadius: '8px' }}
                                />
                            </Col>
                            <Col xs={24} md={16}>
                                <Space direction="vertical" size="middle">
                                    <div>
                                        <Title level={4}>{previewMovie.title}</Title>
                                        <Space>
                                            <Rate disabled defaultValue={previewMovie.rating / 2} />
                                            <Text>{previewMovie.rating}/10</Text>
                                        </Space>
                                    </div>
                                    <Space wrap>
                                        <Tag color="blue">{previewMovie.genre}</Tag>
                                        <Tag color="orange">{previewMovie.duration} phút</Tag>
                                        <Tag color="red">{previewMovie.ageLabel}</Tag>
                                    </Space>
                                    <Text>{previewMovie.overview || 'Đang cập nhật thông tin phim...'}</Text>
                                </Space>
                            </Col>
                        </Row>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default ScheduleModern;
