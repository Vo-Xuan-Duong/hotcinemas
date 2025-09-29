import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Card,
    Row,
    Col,
    Button,
    Tag,
    Typography,
    Breadcrumb,
    Space,
    Avatar,
    Divider,
    Alert,
    Image
} from 'antd';
import {
    HomeOutlined,
    ShopOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    PlayCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import './CinemaSchedule.css';

const { Title, Text, Paragraph } = Typography;

const CinemaSchedule = () => {
    const { cinemaId } = useParams();
    const [selectedDate, setSelectedDate] = useState('16/8');

    // Mock cinema data
    const cinema = {
        id: 1,
        name: 'Đồng Da',
        fullName: 'DDC Đồng Da',
        address: '890 Trần Hưng Đạo, Quận 5, Tp. Hồ Chí Minh',
        city: 'Tp. Hồ Chí Minh',
        chain: 'Đồng Da Cinema',
        logoText: 'DDC',
        color: '#ff6b35',
        bgColor: '#fff5f2',
        description: 'Lịch chiếu phim Đồng Da - Lịch chiếu rạp toàn quốc đầy đủ & tiện lợi nhất tại Moveek. Rạp Đồng Da là 1 trong những cụm rạp lâu đời nhất của Sài Gòn. Hiện Đồng Da đã được nâng cấp với tên gọi mới DDcinema với mong muốn mang đến những trải nghiệm điện ảnh tốt hơn với giá vé rất cạnh tranh.'
    };

    // Dates for the week
    const weekDates = [
        { date: '16/8', day: 'Th 7', isSelected: true },
        { date: '17/8', day: 'CN', isSelected: false },
        { date: '18/8', day: 'Th 2', isSelected: false },
        { date: '19/8', day: 'Th 3', isSelected: false },
        { date: '20/8', day: 'Th 4', isSelected: false },
        { date: '21/8', day: 'Th 5', isSelected: false }
    ];

    // Mock movie showtimes data
    const movies = [
        {
            id: 1,
            title: 'Thanh Gươm Diệt Quỷ: Vô Hạn Thành',
            englishTitle: 'Demon Slayer - Kimetsu no Yaiba - The Movie: Infinity Castle',
            rating: 'T16',
            duration: '2h35\'',
            genres: ['Action', 'Thriller', 'Animation', 'Fantasy'],
            subtitle: '2D Phụ Đề Việt',
            poster: 'https://via.placeholder.com/150x200/ff6b35/ffffff?text=DEMON+SLAYER',
            showtimes: [
                { time: '09:10', price: '65K', room: 'Phòng 1' },
                { time: '10:05', price: '65K', room: 'Phòng 2' },
                { time: '11:10', price: '65K', room: 'Phòng 1' },
                { time: '12:00', price: '65K', room: 'Phòng 3' },
                { time: '12:55', price: '65K', room: 'Phòng 2' },
                { time: '14:00', price: '65K', room: 'Phòng 1' },
                { time: '14:50', price: '65K', room: 'Phòng 4' },
                { time: '15:45', price: '65K', room: 'Phòng 2' },
                { time: '16:50', price: '65K', room: 'Phòng 3' },
                { time: '17:40', price: '75K', room: 'Phòng 1' },
                { time: '18:35', price: '75K', room: 'Phòng 2' },
                { time: '19:40', price: '75K', room: 'Phòng 4' },
                { time: '20:30', price: '75K', room: 'Phòng 3' },
                { time: '21:25', price: '75K', room: 'Phòng 1' }
            ]
        },
        {
            id: 2,
            title: 'Mang Mẹ Đi Bộ',
            englishTitle: 'Leaving Mom',
            rating: 'K',
            duration: '1h52\'',
            genres: ['Drama', 'Family'],
            subtitle: '2D Phụ Đề Anh',
            poster: 'https://via.placeholder.com/150x200/52c41a/ffffff?text=LEAVING+MOM',
            showtimes: [
                { time: '11:50', price: '65K', room: 'Phòng 5' },
                { time: '15:50', price: '65K', room: 'Phòng 5' },
                { time: '19:50', price: '75K', room: 'Phòng 5' },
                { time: '21:55', price: '75K', room: 'Phòng 5' }
            ]
        },
        {
            id: 3,
            title: 'Định Leo',
            englishTitle: 'Together',
            rating: 'T18',
            duration: '1h42\'',
            genres: ['Horror'],
            subtitle: '2D Phụ Đề Việt',
            poster: 'https://via.placeholder.com/150x200/f5222d/ffffff?text=TOGETHER',
            showtimes: [
                { time: '09:50', price: '65K', room: 'Phòng 6' },
                { time: '13:55', price: '65K', room: 'Phòng 6' },
                { time: '17:55', price: '75K', room: 'Phòng 6' },
                { time: '19:15', price: '75K', room: 'Phòng 6' },
                { time: '21:10', price: '75K', room: 'Phòng 6' }
            ]
        },
        {
            id: 4,
            title: 'Avengers: Secret Wars',
            englishTitle: 'Avengers: Secret Wars',
            rating: 'T13',
            duration: '2h48\'',
            genres: ['Action', 'Adventure', 'Sci-Fi'],
            subtitle: '2D Phụ Đề Việt',
            poster: 'https://via.placeholder.com/150x200/faad14/ffffff?text=AVENGERS',
            showtimes: [
                { time: '08:30', price: '65K', room: 'Phòng VIP 1' },
                { time: '11:45', price: '75K', room: 'Phòng VIP 1' },
                { time: '15:00', price: '75K', room: 'Phòng VIP 1' },
                { time: '18:15', price: '85K', room: 'Phòng VIP 1' },
                { time: '21:30', price: '85K', room: 'Phòng VIP 1' }
            ]
        },
        {
            id: 5,
            title: 'Coco 2: Hành Trình Mới',
            englishTitle: 'Coco 2: A New Journey',
            rating: 'K',
            duration: '1h45\'',
            genres: ['Animation', 'Family', 'Musical'],
            subtitle: '2D Lồng Tiếng Việt',
            poster: 'https://via.placeholder.com/150x200/722ed1/ffffff?text=COCO+2',
            showtimes: [
                { time: '09:00', price: '55K', room: 'Phòng 7' },
                { time: '10:30', price: '55K', room: 'Phòng 8' },
                { time: '14:15', price: '65K', room: 'Phòng 7' },
                { time: '16:00', price: '65K', room: 'Phòng 8' },
                { time: '18:30', price: '75K', room: 'Phòng 7' },
                { time: '20:15', price: '75K', room: 'Phòng 8' }
            ]
        },
        {
            id: 6,
            title: 'Fast & Furious 11',
            englishTitle: 'Fast & Furious 11: The Final Ride',
            rating: 'T16',
            duration: '2h25\'',
            genres: ['Action', 'Crime', 'Thriller'],
            subtitle: '2D Phụ Đề Việt',
            poster: 'https://via.placeholder.com/150x200/1890ff/ffffff?text=FAST+%26+FURIOUS',
            showtimes: [
                { time: '10:20', price: '70K', room: 'Phòng IMAX' },
                { time: '13:10', price: '70K', room: 'Phòng IMAX' },
                { time: '16:00', price: '80K', room: 'Phòng IMAX' },
                { time: '18:50', price: '80K', room: 'Phòng IMAX' },
                { time: '21:40', price: '80K', room: 'Phòng IMAX' }
            ]
        },
        {
            id: 7,
            title: 'Hoa Ảo Nguyệt Vô',
            englishTitle: 'Moonlight Fantasy',
            rating: 'T18',
            duration: '2h10\'',
            genres: ['Romance', 'Drama', 'Fantasy'],
            subtitle: '2D Phụ Đề Việt',
            poster: 'https://via.placeholder.com/150x200/eb2f96/ffffff?text=MOONLIGHT',
            showtimes: [
                { time: '12:30', price: '65K', room: 'Phòng 9' },
                { time: '15:20', price: '65K', room: 'Phòng 9' },
                { time: '18:10', price: '75K', room: 'Phòng 9' },
                { time: '21:00', price: '75K', room: 'Phòng 9' }
            ]
        },
        {
            id: 8,
            title: 'Ma Lai Quái',
            englishTitle: 'The Conjuring: Last Rites',
            rating: 'T18',
            duration: '1h58\'',
            genres: ['Horror', 'Supernatural', 'Thriller'],
            subtitle: '2D Phụ Đề Việt',
            poster: 'https://via.placeholder.com/150x200/262626/ffffff?text=CONJURING',
            showtimes: [
                { time: '11:00', price: '65K', room: 'Phòng 10' },
                { time: '14:30', price: '65K', room: 'Phòng 10' },
                { time: '17:00', price: '75K', room: 'Phòng 10' },
                { time: '19:30', price: '75K', room: 'Phòng 10' },
                { time: '22:00', price: '75K', room: 'Phòng 10' }
            ]
        },
        {
            id: 9,
            title: 'Doraemon: Nobita và Vũ Trụ Anh Hùng',
            englishTitle: 'Doraemon: Nobita\'s Space Heroes',
            rating: 'K',
            duration: '1h42\'',
            genres: ['Animation', 'Adventure', 'Family'],
            subtitle: '2D Lồng Tiếng Việt',
            poster: 'https://via.placeholder.com/150x200/13c2c2/ffffff?text=DORAEMON',
            showtimes: [
                { time: '08:45', price: '55K', room: 'Phòng 11' },
                { time: '10:45', price: '55K', room: 'Phòng 11' },
                { time: '13:00', price: '60K', room: 'Phòng 11' },
                { time: '15:15', price: '60K', room: 'Phòng 11' },
                { time: '17:30', price: '70K', room: 'Phòng 11' }
            ]
        },
        {
            id: 10,
            title: 'John Wick: Chapter 5',
            englishTitle: 'John Wick: Chapter 5 - Final Chapter',
            rating: 'T18',
            duration: '2h20\'',
            genres: ['Action', 'Crime', 'Thriller'],
            subtitle: '2D Phụ Đề Việt',
            poster: 'https://via.placeholder.com/150x200/000000/ffffff?text=JOHN+WICK',
            showtimes: [
                { time: '13:45', price: '70K', room: 'Phòng 4D' },
                { time: '16:30', price: '80K', room: 'Phòng 4D' },
                { time: '19:15', price: '80K', room: 'Phòng 4D' },
                { time: '22:00', price: '80K', room: 'Phòng 4D' }
            ]
        }
    ];

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const getRatingColor = (rating) => {
        switch (rating) {
            case 'K': return '#52c41a';
            case 'T13': return '#faad14';
            case 'T16': return '#fa8c16';
            case 'T18': return '#f5222d';
            default: return '#1890ff';
        }
    };

    return (
        <div className="cinema-schedule" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Breadcrumb */}
            <div className="breadcrumb-section" style={{ background: '#ffffff', padding: '16px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div className="container">
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/">
                                <HomeOutlined /> Trang chủ
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/cinemas">
                                <ShopOutlined /> Rạp chiếu
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {cinema.name}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            {/* Cinema Header */}
            <div className="cinema-header-section">
                <div className="container">
                    <div className="cinema-header-content">
                        <div className="cinema-logo">
                            <Avatar
                                size={80}
                                className="cinema-avatar"
                            >
                                {cinema.logoText}
                            </Avatar>
                        </div>
                        <div className="cinema-info">
                            <Title level={2} className="cinema-name">
                                {cinema.name}
                            </Title>
                            <div className="cinema-meta">
                                <Tag color="blue">{cinema.chain}</Tag>
                                <span className="cinema-location">
                                    <EnvironmentOutlined /> {cinema.address}
                                </span>
                                <span className="cinema-city">
                                    <EnvironmentOutlined /> {cinema.city}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Paragraph className="cinema-description">
                        {cinema.description}
                    </Paragraph>
                </div>
            </div>

            {/* Date Selection */}
            <div className="date-selection-section">
                <div className="container">
                    <div className="date-tabs">
                        {weekDates.map((dateItem) => (
                            <Button
                                key={dateItem.date}
                                type={selectedDate === dateItem.date ? 'primary' : 'default'}
                                className={`date-tab ${selectedDate === dateItem.date ? 'active' : ''}`}
                                onClick={() => handleDateSelect(dateItem.date)}
                            >
                                <div className="date-info">
                                    <div className="date">{dateItem.date}</div>
                                    <div className="day">{dateItem.day}</div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notice */}
            <div className="container">
                <Alert
                    message="Nhận vào suất chiếu để tiến hành mua vé"
                    type="warning"
                    showIcon
                    icon={<InfoCircleOutlined />}
                    style={{ marginBottom: 24 }}
                />

                {/* Debug info */}
                <div style={{
                    background: '#f0f8ff',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    border: '2px solid #1890ff'
                }}>
                    <Text strong style={{ color: '#1890ff' }}>
                        🎬 Đang hiển thị {movies.length} phim cho ngày {selectedDate}
                    </Text>
                </div>
            </div>

            {/* Movie Showtimes */}
            {/* Movies and Showtimes */}
            <div className="showtimes-section">
                <div className="container">
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            {movies.map((movie) => (
                                <Card
                                    key={movie.id}
                                    className="movie-showtime-card"
                                    bordered={false}
                                >
                                    <div className="movie-content">
                                        <div className="movie-poster">
                                            <Image
                                                width={120}
                                                height={160}
                                                src={movie.poster}
                                                alt={movie.title}
                                                preview={false}
                                            />
                                        </div>
                                        <div className="movie-info">
                                            <div className="movie-header">
                                                <Title level={4} className="movie-title">
                                                    {movie.title}
                                                </Title>
                                                <div className="movie-meta">
                                                    <Text type="secondary" className="movie-english-title">
                                                        {movie.englishTitle}
                                                    </Text>
                                                    <Space size="small">
                                                        <Tag color={getRatingColor(movie.rating)}>
                                                            {movie.rating}
                                                        </Tag>
                                                        <Text type="secondary">{movie.duration}</Text>
                                                        <Button type="link" size="small">
                                                            <PlayCircleOutlined /> Trailer
                                                        </Button>
                                                    </Space>
                                                </div>
                                                <div className="movie-genres">
                                                    <Text type="secondary">{movie.genres.join(', ')}</Text>
                                                </div>
                                                <div className="movie-format">
                                                    <Text><strong>{movie.subtitle}</strong></Text>
                                                </div>
                                            </div>

                                            <div className="showtimes-grid">
                                                {movie.showtimes.map((showtime, index) => (
                                                    <Button
                                                        key={index}
                                                        className="showtime-btn"
                                                        title={`${showtime.room} - ${showtime.time} - ${showtime.price}`}
                                                    >
                                                        <div className="showtime-info">
                                                            <div className="showtime-time">{showtime.time}</div>
                                                            <div className="showtime-price">{showtime.price}</div>
                                                            <div className="showtime-room">{showtime.room}</div>
                                                        </div>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default CinemaSchedule;
