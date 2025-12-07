import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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
import { useNavigate } from 'react-router-dom';
import movieService from '../../../services/movieService';
import genreService from '../../../services/genreService';
import './Movies.css';

const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const Movies = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState(location.state?.defaultFilter || 'all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalMovies, setTotalMovies] = useState(0);
    const [likedMovies, setLikedMovies] = useState(new Set());
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [genres, setGenres] = useState([]);

    // Load genres from API on mount
    useEffect(() => {
        const loadGenres = async () => {
            try {
                const genreList = await genreService.getAllGenres();
                setGenres(genreList);
            } catch (error) {
                console.error('Failed to load genres:', error);
            }
        };
        loadGenres();
    }, []);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchText]);

    // Load movies data from API with pagination
    useEffect(() => {
        loadMovies();
    }, [currentPage, pageSize, sortBy, sortOrder, debouncedSearch, selectedGenre, selectedYear]);

    // Filter movies when filters change (now handled by API)
    useEffect(() => {
        if (debouncedSearch || selectedGenre !== 'all' || selectedStatus !== 'all' || selectedYear !== 'all') {
            // Reset to first page when filters change
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                // If already on page 1, reload
                loadMovies();
            }
        }
    }, [debouncedSearch, selectedGenre, selectedStatus, selectedYear]);

    const loadMovies = async () => {
        setLoading(true);
        try {
            // Prepare search params with pagination and filters matching backend API
            const params = {
                page: currentPage - 1, // Backend 0-indexed
                size: pageSize,
                sort: `${sortBy},${sortOrder}`
            };

            // Add search keyword if exists
            if (debouncedSearch) {
                params.keyword = debouncedSearch;
            }

            // Add genre filter if selected
            if (selectedGenre !== 'all') {
                params.genre = selectedGenre;
            }

            // Add status filter if selected (NOW_SHOWING, COMING_SOON, ARCHIVED)
            if (selectedStatus !== 'all') {
                params.status = selectedStatus;
            }

            // Add releaseYear filter if selected
            if (selectedYear !== 'all') {
                params.releaseYear = selectedYear;
            }

            const response = await movieService.searchPage(params);

            // Handle response with data wrapper
            let data, total;

            // Check if response has data wrapper (your backend format)
            const actualData = response?.data || response;

            if (Array.isArray(actualData)) {
                data = actualData;
                total = actualData.length;
            } else if (actualData?.content) {
                // Spring Boot Page format
                data = actualData.content;
                total = actualData.totalElements || actualData.total || actualData.content.length;
            } else {
                data = [];
                total = 0;
            }

            const processed = data.map((m, index) => ({
                ...m,
                id: m.id ?? m._id ?? index + 1,
                poster: m.posterPath || m.posterUrl || '/vite.svg',
                backdrop: m.backdropPath || m.backdropUrl || m.poster || m.posterUrl || '/vite.svg',
                rating: parseFloat(m.rating ?? m.voteAverage ?? 0),
                overview: m.overview || m.description || '',
                genre: m.genre || m.genres || [],
                duration: m.duration || m.runtime || null,
                popularity: m.popularity ?? 0,
                views: m.views ?? 0,
            }));

            setMovies(processed);
            setFilteredMovies(processed);
            setTotalMovies(total);
            console.log('Loaded movies:', processed.length, 'Total:', total);
        } catch (err) {
            console.error('Failed to fetch movies', err);
            setMovies([]);
            setFilteredMovies([]);
            setTotalMovies(0);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortMovies = useCallback(() => {
        // Now filtering is handled by the API, so we just reload
        setCurrentPage(1);
        loadMovies();
    }, [debouncedSearch, selectedGenre, selectedStatus, selectedYear]);

    const getMovieStatus = (movie) => {
        if (!movie.releaseDate) return 'now-showing';
        const releaseYear = movie.releaseDate.includes('.')
            ? Number(movie.releaseDate.split('.')[2])
            : new Date(movie.releaseDate).getFullYear();
        const currentYear = new Date().getFullYear();
        return releaseYear > currentYear ? 'upcoming' : 'now-showing';
    };

    const getMovieYear = (movie) => {
        if (!movie.releaseDate) return 'unknown';
        if (movie.releaseDate.includes('.')) {
            return movie.releaseDate.split('.')[2];
        }
        return new Date(movie.releaseDate).getFullYear().toString();
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
        setSelectedYear('all');
        setSortBy('createdAt');
        setSortOrder('desc');
    };

    // Helper function to format genre display
    const formatGenre = (genre) => {
        if (!genre) return 'Chưa phân loại';

        // Nếu là string, loại bỏ từ "Phim" và chỉ lấy thể loại chính
        if (typeof genre === 'string') {
            const cleaned = genre.replace(/Phim\s+/g, '');
            const genres = cleaned.split(',').map(g => g.trim());
            return genres.length > 2 ? `${genres[0]}, ${genres[1]}...` : cleaned;
        }

        if (typeof genre === 'object' && genre.name) {
            const cleaned = genre.name.replace(/Phim\s+/g, '');
            return cleaned;
        }

        if (Array.isArray(genre)) {
            const cleanedGenres = genre
                .map(g => {
                    const name = typeof g === 'string' ? g : g?.name;
                    return name ? name.replace(/Phim\s+/g, '') : null;
                })
                .filter(Boolean);

            if (cleanedGenres.length === 0) return 'Chưa phân loại';
            if (cleanedGenres.length > 2) {
                return `${cleanedGenres[0]}, ${cleanedGenres[1]}...`;
            }
            return cleanedGenres.join(', ');
        }

        return 'Chưa phân loại';
    };

    // All filtering and pagination now handled by API
    const paginatedMovies = filteredMovies;

    const FilterSection = () => (
        <Card
            className="filter-section-modern"
            styles={{ body: { padding: '12px' } }}
        >
            <Row gutter={[10, 10]} align="middle">
                <Col xs={24} sm={24} md={8} lg={6}>
                    <Search
                        placeholder="Tìm kiếm phim..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size="large"
                        allowClear
                    />
                </Col>
                <Col xs={12} sm={12} md={8} lg={5}>
                    <Select
                        value={selectedGenre}
                        onChange={setSelectedGenre}
                        size="large"
                        style={{ width: '100%' }}
                        loading={genres.length === 0}
                    >
                        <Option value="all">Tất cả thể loại</Option>
                        {genres.map(genre => (
                            <Option key={genre.id} value={genre.name}>{genre.name}</Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={12} sm={12} md={8} lg={4}>
                    <Select
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        size="large"
                        style={{ width: '100%' }}
                    >
                        <Option value="all">Tất cả phim</Option>
                        <Option value="NOW_SHOWING">Đang chiếu</Option>
                        <Option value="COMING_SOON">Sắp chiếu</Option>
                        <Option value="ARCHIVED">Đã chiếu</Option>
                    </Select>
                </Col>
                <Col xs={12} sm={12} md={8} lg={4}>
                    <Select
                        value={selectedYear}
                        onChange={setSelectedYear}
                        size="large"
                        style={{ width: '100%' }}
                    >
                        <Option value="all">Tất cả năm</Option>
                        <Option value="2025">2025</Option>
                        <Option value="2024">2024</Option>
                        <Option value="2023">2023</Option>
                        <Option value="2022">2022</Option>
                        <Option value="2021">2021</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={8} lg={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={resetFilters} size="large" block>
                        Đặt lại
                    </Button>
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

                            
                        </div>
                    </div>
                }
                styles={{ body: { padding: '12px' } }}
                onClick={() => navigate(`/movies/${movie.id}`)}
            >
                <Meta
                    title={
                        <Tooltip title={movie.title} placement="top">
                            <Text
                                ellipsis={{ rows: 1 }}
                                className="movie-title-modern"
                                strong
                            >
                                {movie.title}
                            </Text>
                        </Tooltip>
                    }
                    description={
                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                            {/* Genre tag */}
                            <Tag color="blue" style={{ margin: 0, fontSize: '11px' }}>
                                {formatGenre(movie.genre)}
                            </Tag>

                            {/* Duration và Release Date */}
                            <Space size={12} style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Text type="secondary" style={{ fontSize: '11px' }}>
                                    <Clock size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                                    {movie.duration}p
                                </Text>
                                <Text type="secondary" style={{ fontSize: '11px' }}>
                                    <CalendarOutlined style={{ fontSize: '11px', marginRight: 3 }} />
                                    {movie.releaseDate}
                                </Text>
                            </Space>

                            {/* Empty placeholder to maintain spacing */}
                            <div style={{ height: '0px' }}></div>
                        </Space>
                    }
                />
                <Divider style={{ margin: '10px 0 8px 0' }} />
                <Button
                    type="primary"
                    size="small"
                    icon={<Ticket size={13} />}
                    block
                    style={{ fontSize: '12px', height: '32px' }}
                >
                    Đặt vé ngay
                </Button>
            </Card>
        </Badge.Ribbon>
    );

    const ListMovieCard = ({ movie }) => (
        <Card
            className="movie-list-card-modern"
            styles={{ body: { padding: '20px' } }}
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
                                <Tag color="processing">{formatGenre(movie.genre)}</Tag>
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
            <div className="container">
                {/* Filters */}
                <FilterSection />

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

                            {/* Pagination - Always show when there are movies */}
                            {filteredMovies.length > 0 && (
                                <div className="pagination-section">
                                    <Pagination
                                        current={currentPage}
                                        pageSize={pageSize}
                                        total={totalMovies}
                                        onChange={(page) => {
                                            setCurrentPage(page);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        onShowSizeChange={(current, size) => {
                                            setPageSize(size);
                                            setCurrentPage(1);
                                        }}
                                        showSizeChanger
                                        pageSizeOptions={['15', '30', '45', '60']}
                                        showQuickJumper
                                        showTotal={(total, range) =>
                                            `${range[0]}-${range[1]} của ${total} phim`
                                        }
                                        hideOnSinglePage={false}
                                        size="large"
                                        style={{ marginTop: '20px', textAlign: 'center' }}
                                    />
                                </div>
                            )}
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

export default Movies;
