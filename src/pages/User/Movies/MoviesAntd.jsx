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
    Typography
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    PlayCircleOutlined,
    CalendarOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moviesData from '../../../data/movies.json';
import './MoviesAntd.css';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { Meta } = Card;

const MoviesAntd = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    useEffect(() => {
        loadMovies();
    }, []);

    useEffect(() => {
        filterMovies();
    }, [movies, searchText, selectedGenre, selectedStatus]);

    const loadMovies = () => {
        setLoading(true);
        // Load movies immediately
        setMovies(moviesData);
        setLoading(false);
    };

    const filterMovies = () => {
        let filtered = [...movies];

        // Filter by search text
        if (searchText) {
            filtered = filtered.filter(movie =>
                movie.title.toLowerCase().includes(searchText.toLowerCase()) ||
                movie.description.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filter by genre
        if (selectedGenre !== 'all') {
            filtered = filtered.filter(movie =>
                movie.genres && movie.genres.includes(selectedGenre)
            );
        }

        // Filter by status
        if (selectedStatus !== 'all') {
            const currentYear = new Date().getFullYear();
            if (selectedStatus === 'now-playing') {
                filtered = filtered.filter(movie =>
                    Number(movie.releaseDate.split('.')[2]) <= currentYear
                );
            } else if (selectedStatus === 'coming-soon') {
                filtered = filtered.filter(movie =>
                    Number(movie.releaseDate.split('.')[2]) > currentYear
                );
            }
        }

        setFilteredMovies(filtered);
        setCurrentPage(1);
    };

    const handleMovieClick = (movieId) => {
        console.log('Clicking movie with ID:', movieId);
        console.log('Movie ID type:', typeof movieId);
        if (!movieId) {
            console.error('Movie ID is undefined!');
            return;
        }
        console.log('Navigating to:', `/movies/${movieId}`);
        navigate(`/movies/${movieId}`);
    };

    const handleBooking = (movieId, e) => {
        e.stopPropagation();
        navigate(`/booking?movie=${movieId}`);
    };

    const genres = [...new Set(movies.flatMap(movie => movie.genres || []))];

    const CustomMovieCard = ({ movie }) => (
        <Card
            className="movie-card-antd"
            onClick={(e) => {
                // Chỉ navigate khi click vào card, không phải button
                if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                    console.log('Card clicked, navigating to movie:', movie.id);
                    handleMovieClick(movie.id);
                }
            }}
            cover={
                <div className="movie-poster">
                    <img
                        alt={movie.title}
                        src={movie.poster}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                        }}
                    />
                    <div className="movie-overlay">
                        <Button
                            type="primary"
                            shape="circle"
                            size="large"
                            icon={<PlayCircleOutlined />}
                            className="play-btn"
                        />
                    </div>
                    <div className="movie-rating">
                        <Rate disabled defaultValue={movie.rating / 2} size="small" />
                        <span>{movie.rating}</span>
                    </div>
                </div>
            }
            actions={[
                <Button
                    type="primary"
                    onClick={(e) => handleBooking(movie.id, e)}
                >
                    Đặt vé
                </Button>,
                <Button onClick={(e) => {
                    e.stopPropagation();
                    handleMovieClick(movie.id);
                }}>
                    Chi tiết
                </Button>
            ]}
        >
            <Meta
                title={
                    <div className="movie-title">
                        {movie.title}
                        <div className="movie-tags">
                            {movie.genres?.slice(0, 2).map((genre, index) => (
                                <Tag key={index} size="small" color="red">
                                    {genre}
                                </Tag>
                            ))}
                        </div>
                    </div>
                }
                description={
                    <div className="movie-info">
                        <div className="movies-antd movie-meta">
                            <CalendarOutlined />
                            <span>{movie.releaseDate}</span>
                        </div>
                        <div className="movies-antd movie-meta">
                            <ClockCircleOutlined />
                            <span>{movie.duration} phút</span>
                        </div>
                        <p className="movie-description">
                            {movie.description?.substring(0, 100)}...
                        </p>
                    </div>
                }
            />
        </Card>
    );

    const paginatedMovies = filteredMovies.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="movies-page-antd">
            <div className="container">
                {/* Test Navigation Button */}
                <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0' }}>
                    <h3>Test Navigation:</h3>
                    <Button
                        type="primary"
                        onClick={() => navigate('/movies/1')}
                        style={{ marginRight: '10px' }}
                    >
                        Test Navigate to Movie 1
                    </Button>
                    <Button
                        onClick={() => console.log('Movies data:', movies)}
                    >
                        Log Movies Data
                    </Button>
                </div>

                <div className="page-header">
                    <Title level={2}>🎬 Danh sách phim</Title>
                    <Text type="secondary">
                        Khám phá những bộ phim đang hot và sắp ra mắt
                    </Text>
                </div>

                {/* Filters */}
                <Card className="filter-card">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} md={8}>
                            <Search
                                placeholder="Tìm kiếm phim..."
                                allowClear
                                size="large"
                                prefix={<SearchOutlined />}
                                onSearch={setSearchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col xs={12} sm={6} md={4}>
                            <Select
                                size="large"
                                style={{ width: '100%' }}
                                placeholder="Thể loại"
                                value={selectedGenre}
                                onChange={setSelectedGenre}
                            >
                                <Option value="all">Tất cả thể loại</Option>
                                {genres.map(genre => (
                                    <Option key={genre} value={genre}>{genre}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col xs={12} sm={6} md={4}>
                            <Select
                                size="large"
                                style={{ width: '100%' }}
                                placeholder="Trạng thái"
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                            >
                                <Option value="all">Tất cả</Option>
                                <Option value="now-playing">Đang chiếu</Option>
                                <Option value="coming-soon">Sắp chiếu</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Space>
                                <Text strong>
                                    Tìm thấy {filteredMovies.length} bộ phim
                                </Text>
                                <Button
                                    icon={<FilterOutlined />}
                                    onClick={() => {
                                        setSearchText('');
                                        setSelectedGenre('all');
                                        setSelectedStatus('all');
                                    }}
                                >
                                    Xóa bộ lọc
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Movies Grid */}
                {loading ? (
                    <Row gutter={[24, 24]} className="movies-grid">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                <Card
                                    cover={
                                        <Skeleton.Image
                                            active
                                            style={{ width: '100%', height: 300 }}
                                        />
                                    }
                                    actions={[
                                        <Skeleton.Button active size="small" />,
                                        <Skeleton.Button active size="small" />
                                    ]}
                                >
                                    <Skeleton active paragraph={{ rows: 2 }} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : filteredMovies.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Không tìm thấy phim nào"
                        style={{ margin: '60px 0' }}
                    >
                        <Button type="primary" onClick={() => {
                            setSearchText('');
                            setSelectedGenre('all');
                            setSelectedStatus('all');
                        }}>
                            Xóa bộ lọc
                        </Button>
                    </Empty>
                ) : (
                    <>
                        <Row gutter={[24, 24]} className="movies-grid">
                            {paginatedMovies.map((movie) => (
                                <Col key={movie.id} xs={24} sm={12} md={8} lg={6}>
                                    <CustomMovieCard movie={movie} />
                                </Col>
                            ))}
                        </Row>

                        {/* Pagination */}
                        {filteredMovies.length > pageSize && (
                            <div className="pagination-container">
                                <Pagination
                                    current={currentPage}
                                    total={filteredMovies.length}
                                    pageSize={pageSize}
                                    onChange={setCurrentPage}
                                    showSizeChanger={false}
                                    showQuickJumper
                                    showTotal={(total, range) =>
                                        `${range[0]}-${range[1]} của ${total} phim`
                                    }
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MoviesAntd;
