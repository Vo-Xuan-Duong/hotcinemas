import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Input,
    Select,
    Button,
    Tag,
    Rate,
    Pagination,
    Skeleton,
    Empty,
    Space,
    Typography,
    Breadcrumb,
    Badge,
    Tooltip,
    Divider,
    Affix,
    BackTop,
    FloatButton
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    PlayCircleOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    StarOutlined,
    HeartOutlined,
    ShareAltOutlined,
    EyeOutlined,
    FireOutlined,
    ThunderboltOutlined,
    CrownOutlined,
    HomeOutlined,
    BookOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';
import {
    Play,
    Calendar,
    Clock,
    Star,
    Heart,
    Share2,
    Ticket,
    Filter,
    Grid,
    List,
    SortAsc,
    SortDesc
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import moviesData from '../../../data/movies.json';
import './MoviesModern.css';

const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const MoviesModern = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedRating, setSelectedRating] = useState('all');
    const [sortBy, setSortBy] = useState('popularity');
    const [sortOrder, setSortOrder] = useState('desc');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [likedMovies, setLikedMovies] = useState(new Set());
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const pageSize = 12;

    // Load movies data
    useEffect(() => {
        loadMovies();
    }, []);

    // Filter and sort movies
    useEffect(() => {
        filterAndSortMovies();
    }, [movies, searchText, selectedGenre, selectedStatus, selectedRating, sortBy, sortOrder]);

    const loadMovies = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const processedMovies = moviesData.map((movie, index) => ({
            ...movie,
            id: movie.id || index + 1,
            poster: movie.poster || `https://picsum.photos/300/450?random=${index}`,
            backdrop: movie.backdrop || movie.poster || `https://picsum.photos/1200/800?random=${index}`,
            rating: movie.rating || (Math.random() * 3 + 7).toFixed(1),
            overview: movie.overview || `Một bộ phim tuyệt vời với cốt truyện hấp dẫn và diễn xuất xuất sắc.`,
            genre: movie.genre || ['Hành động', 'Phiêu lưu', 'Hài kịch', 'Tâm lý', 'Kinh dị'][Math.floor(Math.random() * 5)],
            duration: movie.duration || Math.floor(Math.random() * 60 + 90),
            popularity: Math.floor(Math.random() * 100),
            views: Math.floor(Math.random() * 100000 + 10000),
        }));

        setMovies(processedMovies);
        setLoading(false);
    };

    const filterAndSortMovies = () => {
        let filtered = movies.filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(searchText.toLowerCase()) ||
                movie.overview?.toLowerCase().includes(searchText.toLowerCase());
            const matchesGenre = selectedGenre === 'all' || movie.genre?.includes(selectedGenre);
            const matchesStatus = selectedStatus === 'all' || getMovieStatus(movie) === selectedStatus;
            const matchesRating = selectedRating === 'all' || getRatingRange(movie.rating) === selectedRating;

            return matchesSearch && matchesGenre && matchesStatus && matchesRating;
        });

        // Sort movies
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'rating':
                    aValue = parseFloat(a.rating);
                    bValue = parseFloat(b.rating);
                    break;
                case 'releaseDate':
                    aValue = new Date(a.releaseDate || '2024-01-01');
                    bValue = new Date(b.releaseDate || '2024-01-01');
                    break;
                case 'popularity':
                    aValue = a.popularity;
                    bValue = b.popularity;
                    break;
                case 'views':
                    aValue = a.views;
                    bValue = b.views;
                    break;
                default:
                    aValue = a.popularity;
                    bValue = b.popularity;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredMovies(filtered);
        setCurrentPage(1);
    };

    const getMovieStatus = (movie) => {
        if (!movie.releaseDate) return 'now-showing';
        const releaseYear = movie.releaseDate.includes('.')
            ? Number(movie.releaseDate.split('.')[2])
            : new Date(movie.releaseDate).getFullYear();
        const currentYear = new Date().getFullYear();
        return releaseYear > currentYear ? 'upcoming' : 'now-showing';
    };

    const getRatingRange = (rating) => {
        const r = parseFloat(rating);
        if (r >= 8.5) return 'excellent';
        if (r >= 7.5) return 'good';
        if (r >= 6.0) return 'average';
        return 'below-average';
    };

    const handleLike = (movieId, event) => {
        event.preventDefault();
        event.stopPropagation();
        const newLikedMovies = new Set(likedMovies);
        if (newLikedMovies.has(movieId)) {
            newLikedMovies.delete(movieId);
        } else {
            newLikedMovies.add(movieId);
        }
        setLikedMovies(newLikedMovies);
    };

    const handleShare = (movie, event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('Sharing movie:', movie.title);
    };

    const handleTrailer = (movie, event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('Playing trailer for:', movie.title);
    };

    const resetFilters = () => {
        setSearchText('');
        setSelectedGenre('all');
        setSelectedStatus('all');
        setSelectedRating('all');
        setSortBy('popularity');
        setSortOrder('desc');
    };

    const genres = ['Hành động', 'Phiêu lưu', 'Hài kịch', 'Tâm lý', 'Kinh dị', 'Lãng mạn', 'Khoa học viễn tưởng', 'Hoạt hình'];
    const paginatedMovies = filteredMovies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const FilterSection = () => (
        <Card className="filter-section-modern" bodyStyle={{ padding: '20px' }}>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={6}>
                    <Search
                        placeholder="Tìm kiếm phim..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size="large"
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        value={selectedGenre}
                        onChange={setSelectedGenre}
                        size="large"
                        style={{ width: '100%' }}
                    >
                        <Option value="all">Tất cả thể loại</Option>
                        {genres.map(genre => (
                            <Option key={genre} value={genre}>{genre}</Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        size="large"
                        style={{ width: '100%' }}
                    >
                        <Option value="all">Tất cả trạng thái</Option>
                        <Option value="now-showing">Đang chiếu</Option>
                        <Option value="upcoming">Sắp chiếu</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={3}>
                    <Select
                        value={selectedRating}
                        onChange={setSelectedRating}
                        size="large"
                        style={{ width: '100%' }}
                    >
                        <Option value="all">Mọi đánh giá</Option>
                        <Option value="excellent">8.5+ sao</Option>
                        <Option value="good">7.5+ sao</Option>
                        <Option value="average">6.0+ sao</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={3}>
                    <Select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(value) => {
                            const [sort, order] = value.split('-');
                            setSortBy(sort);
                            setSortOrder(order);
                        }}
                        size="large"
                        style={{ width: '100%' }}
                    >
                        <Option value="popularity-desc">Phổ biến nhất</Option>
                        <Option value="rating-desc">Đánh giá cao</Option>
                        <Option value="releaseDate-desc">Mới nhất</Option>
                        <Option value="title-asc">Tên A-Z</Option>
                        <Option value="views-desc">Xem nhiều</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Space>
                        <Tooltip title={viewMode === 'grid' ? 'Chế độ danh sách' : 'Chế độ lưới'}>
                            <Button
                                icon={viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                size="large"
                            />
                        </Tooltip>
                        <Button onClick={resetFilters} size="large">
                            Đặt lại
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    );

    const MovieCard = ({ movie }) => (
        <Badge.Ribbon
            text={getMovieStatus(movie) === 'upcoming' ? 'Sắp chiếu' : 'Đang chiếu'}
            color={getMovieStatus(movie) === 'upcoming' ? 'blue' : 'volcano'}
        >
            <Card
                hoverable
                className="movie-card-modern"
                cover={
                    <div className="movie-cover-modern">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="movie-poster-modern"
                        />
                        <div className="movie-overlay-modern">
                            {/* Rating Badge - Top Right */}
                            <div className="rating-badge-modern">
                                <Star size={12} fill="#faad14" color="#faad14" />
                                <span>{movie.rating}</span>
                            </div>

                            {/* Center Play Button */}
                            <div className="overlay-center">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size="large"
                                    icon={<Play size={18} />}
                                    className="play-btn-modern"
                                    onClick={(e) => handleTrailer(movie, e)}
                                />
                            </div>

                            {/* Bottom Quick Actions */}
                            <div className="overlay-bottom">
                                <div className="quick-actions-modern">
                                    <Tooltip title="Yêu thích" placement="top">
                                        <Button
                                            type="text"
                                            shape="circle"
                                            size="small"
                                            icon={
                                                <Heart
                                                    size={14}
                                                    fill={likedMovies.has(movie.id) ? "#ff4d4f" : "none"}
                                                    color={likedMovies.has(movie.id) ? "#ff4d4f" : "#fff"}
                                                />
                                            }
                                            className="action-btn-heart"
                                            onClick={(e) => handleLike(movie.id, e)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Chia sẻ" placement="top">
                                        <Button
                                            type="text"
                                            shape="circle"
                                            size="small"
                                            icon={<Share2 size={14} color="#fff" />}
                                            className="action-btn-share"
                                            onClick={(e) => handleShare(movie, e)}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                bodyStyle={{ padding: '16px' }}
                onClick={() => navigate(`/movies/${movie.id}`)}
            >
                <Meta
                    title={
                        <Text ellipsis={{ tooltip: movie.title }} className="movie-title-modern">
                            {movie.title}
                        </Text>
                    }
                    description={
                        <Space direction="vertical" size={6} style={{ width: '100%' }}>
                            {/* Thông tin cơ bản - Genre, duration, views, date */}
                            <Space size={4} wrap>
                                <Tag color="processing">{movie.genre}</Tag>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    <Clock size={12} style={{ marginRight: 4 }} />
                                    {movie.duration} phút
                                </Text>
                            </Space>

                            {/* Mô tả phim */}
                            <Text
                                type="secondary"
                                ellipsis={{ rows: 2, tooltip: movie.overview }}
                                style={{ fontSize: '12px', lineHeight: '1.4' }}
                            >
                                {movie.overview}
                            </Text>

                            {/* Thống kê - views và release date */}
                            <Space size={4} style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Space size={4}>
                                    <EyeOutlined style={{ fontSize: '12px' }} />
                                    <Text style={{ fontSize: '11px' }}>{movie.views?.toLocaleString()}</Text>
                                </Space>
                                <Text style={{ fontSize: '11px' }} type="secondary">
                                    {movie.releaseDate}
                                </Text>
                            </Space>
                        </Space>
                    }
                />
                <Divider style={{ margin: '8px 0' }} />
                <Space size={8} style={{ width: '100%' }}>
                    <Button
                        type="primary"
                        size="small"
                        icon={<Ticket size={14} />}
                        style={{ flex: 1 }}
                    >
                        Đặt vé
                    </Button>
                    <Button
                        size="small"
                        icon={<Calendar size={14} />}
                    >
                        Lịch
                    </Button>
                </Space>
            </Card>
        </Badge.Ribbon>
    );

    const ListMovieCard = ({ movie }) => (
        <Card
            className="movie-list-card-modern"
            bodyStyle={{ padding: '20px' }}
            onClick={() => navigate(`/movies/${movie.id}`)}
        >
            <Row gutter={16} align="middle">
                <Col xs={6} sm={4} md={3}>
                    <div className="list-poster-container">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="list-poster"
                        />
                        <Badge
                            count={getMovieStatus(movie) === 'upcoming' ? 'Sắp chiếu' : 'Đang chiếu'}
                            color={getMovieStatus(movie) === 'upcoming' ? 'blue' : 'volcano'}
                            style={{ position: 'absolute', top: 5, right: 5 }}
                        />
                    </div>
                </Col>
                <Col xs={18} sm={20} md={21}>
                    <Row gutter={[16, 8]} align="middle">
                        <Col xs={24} md={12}>
                            <Title level={4} className="list-movie-title">
                                {movie.title}
                            </Title>
                            <Space wrap size={8}>
                                <Tag color="processing">{movie.genre}</Tag>
                                <Text type="secondary">
                                    <Clock size={12} style={{ marginRight: 4 }} />
                                    {movie.duration} phút
                                </Text>
                                <Text type="secondary">
                                    <Calendar size={12} style={{ marginRight: 4 }} />
                                    {movie.releaseDate}
                                </Text>
                            </Space>
                            <Paragraph
                                ellipsis={{ rows: 2 }}
                                style={{ marginTop: 8, marginBottom: 0 }}
                            >
                                {movie.overview}
                            </Paragraph>
                        </Col>
                        <Col xs={24} md={6}>
                            <Space direction="vertical" align="center">
                                <Space>
                                    <Star size={16} fill="#faad14" color="#faad14" />
                                    <Text strong style={{ fontSize: '16px' }}>{movie.rating}</Text>
                                </Space>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    <EyeOutlined /> {movie.views?.toLocaleString()} lượt xem
                                </Text>
                            </Space>
                        </Col>
                        <Col xs={24} md={6}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button
                                    type="primary"
                                    icon={<Ticket size={14} />}
                                    block
                                >
                                    Đặt vé
                                </Button>
                                <Space style={{ width: '100%' }}>
                                    <Button
                                        icon={<Play size={14} />}
                                        onClick={(e) => handleTrailer(movie, e)}
                                        style={{ flex: 1 }}
                                    >
                                        Trailer
                                    </Button>
                                    <Button
                                        icon={
                                            <Heart
                                                size={14}
                                                fill={likedMovies.has(movie.id) ? "#ff4d4f" : "none"}
                                                color={likedMovies.has(movie.id) ? "#ff4d4f" : undefined}
                                            />
                                        }
                                        onClick={(e) => handleLike(movie.id, e)}
                                    />
                                    <Button
                                        icon={<Share2 size={14} />}
                                        onClick={(e) => handleShare(movie, e)}
                                    />
                                </Space>
                            </Space>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    );

    if (loading) {
        return (
            <div className="movies-modern loading">
                <div className="container">
                    <Skeleton active paragraph={{ rows: 2 }} />
                    <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                        {[...Array(8)].map((_, index) => (
                            <Col xs={12} sm={8} md={6} lg={4} key={index}>
                                <Card loading />
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        );
    }

    return (
        <div className="movies-modern">
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
                            <BookOutlined /> Phim
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <div className="container">
                {/* Filters */}
                <Affix offsetTop={80}>
                    <FilterSection />
                </Affix>

                {/* Movies Grid/List */}
                <div className="movies-content">
                    {filteredMovies.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
                                <Row gutter={[16, 24]} className="movies-grid-modern">
                                    {paginatedMovies.map((movie) => (
                                        <Col
                                            xs={12}
                                            sm={8}
                                            md={6}
                                            lg={4}
                                            xl={4}
                                            xxl={4}
                                            key={movie.id}
                                            className="movie-col-desktop"
                                        >
                                            <MovieCard movie={movie} />
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <div className="movies-list-modern">
                                    {paginatedMovies.map((movie) => (
                                        <ListMovieCard key={movie.id} movie={movie} />
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            <div className="pagination-section">
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={filteredMovies.length}
                                    onChange={setCurrentPage}
                                    showSizeChanger={false}
                                    showQuickJumper
                                    showTotal={(total, range) =>
                                        `${range[0]}-${range[1]} của ${total} phim`
                                    }
                                    size="large"
                                />
                            </div>
                        </>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Space direction="vertical" align="center">
                                    <Text>Không tìm thấy phim nào phù hợp</Text>
                                    <Button
                                        type="primary"
                                        onClick={resetFilters}
                                    >
                                        Đặt lại bộ lọc
                                    </Button>
                                </Space>
                            }
                            className="empty-state-modern"
                        />
                    )}
                </div>
            </div>

            {/* Back to Top */}
            <BackTop
                style={{
                    height: 50,
                    width: 50,
                    backgroundColor: '#ff6b35',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                }}
            >
                <ArrowUpOutlined style={{ color: 'white', fontSize: '20px' }} />
            </BackTop>
        </div>
    );
};

export default MoviesModern;
