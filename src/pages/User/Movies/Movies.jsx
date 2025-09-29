import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Card, Typography, Spin, Empty, Tag, Button, Space } from 'antd';
import { SearchOutlined, FilterOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import MovieCard from '../../../components/MovieCard/MovieCard';
import { MOVIE_GENRES } from '../../../utils/constants';
import movies from '../../../data/movies.json';
import './Movies.css';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const Movies = () => {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [moviesList, setMoviesList] = useState([]);

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setMoviesList(movies);
      setLoading(false);
    }, 800);
  }, []);

  const filteredMovies = moviesList.filter(movie => {
    const matchTitle = movie.title.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre ? movie.genre.toLowerCase().includes(genre.toLowerCase()) : true;
    return matchTitle && matchGenre;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'releaseDate':
        return new Date(b.releaseDate || '2025-01-01') - new Date(a.releaseDate || '2025-01-01');
      case 'title':
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const genreStats = MOVIE_GENRES.map(g => ({
    genre: g,
    count: moviesList.filter(m => m.genre?.toLowerCase().includes(g.toLowerCase())).length
  })).filter(stat => stat.count > 0);

  return (
    <div className="movies-modern">
      <div className="container">
        {/* Filter and Search Section */}
        <Card className="movies-filter-card" bodyStyle={{ padding: '24px' }}>
          <div className="movies-header-compact">
            <Title level={2} className="movies-title-compact">
              🎬 Danh sách phim ({moviesList.length})
            </Title>
          </div>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} lg={8}>
              <Search
                placeholder="Tìm kiếm phim..."
                prefix={<SearchOutlined />}
                value={search}
                onChange={e => setSearch(e.target.value)}
                size="large"
                allowClear
              />
            </Col>
            <Col xs={24} sm={6} lg={4}>
              <Select
                placeholder="Thể loại"
                value={genre}
                onChange={setGenre}
                size="large"
                allowClear
                style={{ width: '100%' }}
                suffixIcon={<FilterOutlined />}
              >
                {MOVIE_GENRES.map(g => (
                  <Option key={g} value={g}>
                    {g} ({genreStats.find(stat => stat.genre === g)?.count || 0})
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={6} lg={4}>
              <Select
                placeholder="Sắp xếp"
                value={sortBy}
                onChange={setSortBy}
                size="large"
                style={{ width: '100%' }}
              >
                <Option value="title">Tên phim (A-Z)</Option>
                <Option value="rating">Đánh giá cao</Option>
                <Option value="releaseDate">Mới nhất</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="movies-controls">
                <Space>
                  <Text strong>Hiển thị:</Text>
                  <Button.Group>
                    <Button
                      icon={<AppstoreOutlined />}
                      type={viewMode === 'grid' ? 'primary' : 'default'}
                      onClick={() => setViewMode('grid')}
                    >
                      Lưới
                    </Button>
                    <Button
                      icon={<UnorderedListOutlined />}
                      type={viewMode === 'list' ? 'primary' : 'default'}
                      onClick={() => setViewMode('list')}
                    >
                      Danh sách
                    </Button>
                  </Button.Group>
                  <Text type="secondary">
                    {filteredMovies.length} phim
                  </Text>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Results Section */}
        {loading ? (
          <div className="movies-loading">
            <Spin size="large" />
            <Text style={{ marginTop: 16, display: 'block' }}>Đang tải danh sách phim...</Text>
          </div>
        ) : filteredMovies.length === 0 ? (
          <Card className="movies-empty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Text>Không tìm thấy phim phù hợp</Text>
                  <br />
                  <Text type="secondary">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</Text>
                </div>
              }
            />
          </Card>
        ) : (
          <div className={`movies-content ${viewMode === 'list' ? 'list-mode' : 'grid-mode'}`}>
            <Row gutter={[24, 24]}>
              {filteredMovies.map(movie => (
                <Col
                  key={movie.id}
                  xs={24}
                  sm={viewMode === 'list' ? 24 : 12}
                  md={viewMode === 'list' ? 24 : 8}
                  lg={viewMode === 'list' ? 24 : 6}
                  xl={viewMode === 'list' ? 24 : 4}
                >
                  <MovieCard movie={movie} viewMode={viewMode} />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Genre Tags Section */}
        {!loading && genreStats.length > 0 && (
          <Card title="🎭 Thể loại phim" className="movies-genres-card">
            <Space wrap>
              {genreStats.map(stat => (
                <Tag
                  key={stat.genre}
                  color={genre === stat.genre ? 'blue' : 'default'}
                  style={{ cursor: 'pointer', marginBottom: 8 }}
                  onClick={() => setGenre(genre === stat.genre ? '' : stat.genre)}
                >
                  {stat.genre} ({stat.count})
                </Tag>
              ))}
            </Space>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Movies; 