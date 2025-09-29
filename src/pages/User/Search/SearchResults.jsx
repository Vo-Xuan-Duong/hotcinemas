import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Input, Select, Empty, Spin, Typography, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import movieService from '../../../services/movieService';
import cinemaService from '../../../services/cinemaService';
import MovieCard from '../../../components/MovieCard/MovieCard';
import './SearchResults.css';

const { Title, Text } = Typography;
const { Option } = Select;

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [searchType, setSearchType] = useState(searchParams.get('type') || 'all');
    const [results, setResults] = useState({
        movies: [],
        cinemas: [],
        total: 0
    });

    useEffect(() => {
        const query = searchParams.get('q');
        const type = searchParams.get('type') || 'all';
        if (query) {
            setSearchQuery(query);
            setSearchType(type);
            performSearch(query, type);
        }
    }, [searchParams]);

    const performSearch = async (query, type) => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const allMovies = await movieService.getAllMovies();
            const allCinemas = await cinemaService.getAllCinemas();

            let movieResults = [];
            let cinemaResults = [];

            if (type === 'all' || type === 'movies') {
                movieResults = allMovies.filter(movie =>
                    movie.title.toLowerCase().includes(query.toLowerCase()) ||
                    movie.genre.toLowerCase().includes(query.toLowerCase()) ||
                    movie.director.toLowerCase().includes(query.toLowerCase()) ||
                    (movie.cast && movie.cast.some(actor =>
                        actor.toLowerCase().includes(query.toLowerCase())
                    ))
                );
            }

            if (type === 'all' || type === 'cinemas') {
                cinemaResults = allCinemas.filter(cinema =>
                    cinema.name.toLowerCase().includes(query.toLowerCase()) ||
                    cinema.address.toLowerCase().includes(query.toLowerCase()) ||
                    cinema.district.toLowerCase().includes(query.toLowerCase())
                );
            }

            setResults({
                movies: movieResults,
                cinemas: cinemaResults,
                total: movieResults.length + cinemaResults.length
            });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        if (!value.trim()) return;

        setSearchParams({ q: value, type: searchType });
    };

    const handleTypeChange = (newType) => {
        setSearchType(newType);
        if (searchQuery) {
            setSearchParams({ q: searchQuery, type: newType });
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    const handleCinemaClick = (cinemaId) => {
        navigate(`/cinemas/${cinemaId}`);
    };

    return (
        <div className="search-results-page">
            <div className="search-header">
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={16}>
                        <Input.Search
                            placeholder="Tìm kiếm phim, rạp chiếu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onSearch={handleSearch}
                            size="large"
                            enterButton={<SearchOutlined />}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Select
                            value={searchType}
                            onChange={handleTypeChange}
                            size="large"
                            style={{ width: '100%' }}
                        >
                            <Option value="all">Tất cả</Option>
                            <Option value="movies">Phim</Option>
                            <Option value="cinemas">Rạp chiếu</Option>
                        </Select>
                    </Col>
                </Row>
            </div>

            {loading ? (
                <div className="search-loading">
                    <Spin size="large" />
                    <Text>Đang tìm kiếm...</Text>
                </div>
            ) : (
                <div className="search-content">
                    {searchQuery && (
                        <div className="search-info">
                            <Title level={3}>
                                Kết quả tìm kiếm cho "{searchQuery}"
                            </Title>
                            <Text type="secondary">
                                Tìm thấy {results.total} kết quả
                            </Text>
                        </div>
                    )}

                    {results.total === 0 && searchQuery ? (
                        <Empty
                            description="Không tìm thấy kết quả nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <>
                            {/* Movie Results */}
                            {results.movies.length > 0 && (
                                <div className="search-section">
                                    <Title level={4}>
                                        Phim ({results.movies.length})
                                    </Title>
                                    <Row gutter={[16, 16]}>
                                        {results.movies.map(movie => (
                                            <Col key={movie.id} xs={24} sm={12} md={8} lg={6}>
                                                <MovieCard
                                                    movie={movie}
                                                    onClick={() => handleMovieClick(movie.id)}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}

                            {/* Cinema Results */}
                            {results.cinemas.length > 0 && (
                                <div className="search-section">
                                    <Title level={4}>
                                        Rạp chiếu ({results.cinemas.length})
                                    </Title>
                                    <Row gutter={[16, 16]}>
                                        {results.cinemas.map(cinema => (
                                            <Col key={cinema.id} xs={24} sm={12} md={8}>
                                                <Card
                                                    hoverable
                                                    className="cinema-search-card"
                                                    onClick={() => handleCinemaClick(cinema.id)}
                                                >
                                                    <Card.Meta
                                                        title={cinema.name}
                                                        description={
                                                            <div>
                                                                <div>{cinema.address}</div>
                                                                <div>{cinema.district}</div>
                                                                <div>
                                                                    {cinema.rooms?.length || 0} phòng chiếu
                                                                </div>
                                                            </div>
                                                        }
                                                    />
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
