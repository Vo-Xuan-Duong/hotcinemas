import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Spin, message, Empty, Button, Tag, Row, Col } from 'antd';
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  WifiOutlined,
  CoffeeOutlined,
  CarOutlined,
  FireOutlined
} from '@ant-design/icons';
import cinemaService from '../../../services/cinemaService';
import showtimeService from '../../../services/showtimeService';
import './CinemaDetail.css';

const CinemaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cinema, setCinema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showtimesLoading, setShowtimesLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [dates, setDates] = useState([]);
  const [activeDate, setActiveDate] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    // Generate upcoming dates
    const upcomingDates = showtimeService.getUpcomingDates(7);
    setDates(upcomingDates);
    setActiveDate(upcomingDates[0]?.value);
  }, []);

  useEffect(() => {
    if (id) {
      fetchCinemaDetail();
    }
  }, [id]);

  useEffect(() => {
    if (id && activeDate) {
      setPage(0);
      setMovies([]);
      setShowtimesLoading(true);
      fetchShowtimes(0).finally(() => setShowtimesLoading(false));
    }
  }, [id, activeDate]);

  const fetchCinemaDetail = async () => {
    setLoading(true);
    try {
      const response = await cinemaService.getCinemaById(id);
      const data = response.data || response;
      setCinema(data);
    } catch (error) {
      console.error('Error fetching cinema detail:', error);
      message.error('Không thể tải thông tin rạp!');
    } finally {
      setLoading(false);
    }
  };

  const fetchShowtimes = async (pageNum = 0) => {
    try {
      const response = await showtimeService.getShowtimesByDateAndCinema(activeDate, id, {
        page: pageNum,
        size: 5
      });
      const showtimesData = response.data?.content || response.data || response;
      const totalPagesFromApi = response.data?.totalPages || 1;
      const currentPage = response.data?.number || 0;

      console.log('Showtimes Data:', showtimesData);
      console.log('Current Page:', currentPage, 'Total Pages:', totalPagesFromApi);

      // Transform API data to movie format
      const moviesArray = [];

      if (Array.isArray(showtimesData)) {
        showtimesData.forEach(movieData => {
          const allShowtimes = [];

          // Collect all showtimes from all formats
          if (Array.isArray(movieData.formats)) {
            movieData.formats.forEach(format => {
              if (Array.isArray(format.showtimes)) {
                format.showtimes.forEach(showtime => {
                  allShowtimes.push({
                    id: showtime.showtimeId,
                    time: showtime.startTime,
                    roomName: showtime.roomName || 'Phòng',
                    screeningFormat: format.formatType,
                    status: showtime.status,
                    price: showtime.price
                  });
                });
              }
            });
          }

          // Sort showtimes by time
          allShowtimes.sort((a, b) => a.time.localeCompare(b.time));

          moviesArray.push({
            id: movieData.movieId,
            title: movieData.movieTitle,
            genre: 'Phim', // Genre not provided in new format
            duration: 'N/A', // Duration not provided in new format
            ageRating: movieData.formats?.[0]?.formatType || '2D',
            poster: movieData.posterPath || 'https://via.placeholder.com/200x280/333/fff?text=Movie',
            showtimes: allShowtimes
          });
        });
      }

      // Append or replace movies based on page number
      if (pageNum === 0) {
        setMovies(moviesArray);
      } else {
        setMovies(prev => [...prev, ...moviesArray]);
      }

      setPage(currentPage);
      setTotalPages(totalPagesFromApi);
      setHasMore(currentPage < totalPagesFromApi - 1);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      message.error('Không thể tải lịch chiếu!');
      if (pageNum === 0) {
        setMovies([]);
      }
    }
  };

  const handleLoadMore = () => {
    if (!showtimesLoading && hasMore) {
      setShowtimesLoading(true);
      fetchShowtimes(page + 1).finally(() => setShowtimesLoading(false));
    }
  };

  // Demo cinema images
  const cinemaImages = [
    'https://via.placeholder.com/400x250/1a1a1a/ffffff?text=Cinema+Lobby',
    'https://via.placeholder.com/400x250/8B0000/ffffff?text=Theater+Room',
    'https://via.placeholder.com/400x250/FFA500/ffffff?text=Concession+Stand',
    'https://via.placeholder.com/400x250/2F4F4F/ffffff?text=Seating+Area'
  ];

  // Demo amenities
  const amenities = [
    { icon: <WifiOutlined />, label: 'Phòng VIP', color: '#722ed1' },
    { icon: <FireOutlined />, label: 'Quầy ăn uống', color: '#fa541c' },
    { icon: <CoffeeOutlined />, label: 'Chỗ đậu xe', color: '#13c2c2' },
    { icon: <CarOutlined />, label: 'Wifi miễn phí', color: '#1890ff' }
  ];

  if (loading) {
    return (
      <div className="cinema-detail-loading">
        <Spin size="large" />
        <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
          Đang tải thông tin rạp...
        </p>
      </div>
    );
  }

  if (!cinema) {
    return (
      <div className="cinema-detail-empty container">
        <Empty
          description={
            <span style={{ fontSize: '1.1rem', color: '#666' }}>
              Không tìm thấy thông tin rạp chiếu
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className="cinema-detail-new">
      {/* Header Section */}
      <div className="cinema-detail-header">
        <Link to="/cinemas" className="btn-back">
          ← Quay lại danh sách rạp
        </Link>
        <div className="cinema-header-content">
          <button className="location-badge">
            <CheckCircleOutlined /> Chỉ đường
          </button>
          <h1 className="cinema-title">{cinema.name || 'CGV Vincom Center'}</h1>
          <p className="cinema-address">
            <EnvironmentOutlined />
            {cinema.address || 'Tầng 5, Vincom Center, 72 Lê Thánh Tôn, P. Bến Nghé, Quận 1, TPHCM'}
          </p>
        </div>
      </div>

      <div className="container">
        {/* Image Gallery */}
        <div className="cinema-gallery">
          {cinemaImages.map((img, index) => (
            <div key={index} className="gallery-item">
              <img src={img} alt={`Cinema ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="cinema-main-content">
          {/* Left Column - Movies Section */}
          <div className="cinema-movies-section">
            <div className="section-header">
              <h2>Phim đang chiếu</h2>
              <div className="date-boxes">
                {dates.slice(0, 6).map((date, index) => (
                  <button
                    key={date.value}
                    type="button"
                    className={`date-box ${activeDate === date.value ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveDate(date.value);
                    }}
                  >
                    {date.isToday ? 'Hôm nay' : date.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="movies-list">
              {showtimesLoading && movies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Spin size="large" />
                  <p style={{ marginTop: '16px', color: '#666' }}>Đang tải lịch chiếu...</p>
                </div>
              ) : movies.length > 0 ? (
                movies.map(movie => (
                  <div key={movie.id} className="movie-card-detail">
                    <div className="movie-poster-wrapper">
                      <img src={movie.poster} alt={movie.title} className="movie-poster" />
                      <span className="age-rating-badge">{movie.ageRating}</span>
                    </div>

                    <div className="movie-content-wrapper">
                      <div className="movie-info-section">
                        <h3 className="movie-title" onClick={() => navigate(`/movies/${movie.id}`)} style={{ cursor: 'pointer' }}>{movie.title}</h3>
                        <div className="movie-meta">
                          <span>{movie.genre}</span>
                          <span>•</span>
                          <span>{movie.duration}</span>
                        </div>
                        <span className="age-rating-label">{movie.ageRating}</span>
                      </div>

                      <div className="movie-showtimes-wrapper">
                        {movie.showtimes.map((showtime) => (
                          <button
                            key={showtime.id}
                            className="showtime-btn"
                            onClick={() => navigate(`/booking/${showtime.id}`)}
                          >
                            {showtime.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Empty
                  description="Không có lịch chiếu cho ngày này"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}

              {/* Load More Button */}
              {hasMore && !showtimesLoading && movies.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <Button
                    type="default"
                    onClick={handleLoadMore}
                  >
                    Xem thêm
                  </Button>
                </div>
              )}

              {/* Loading indicator for load more */}
              {showtimesLoading && movies.length > 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Spin />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="cinema-sidebar">
            {/* Amenities Section */}
            <div className="cinema-amenities-section">
              <h2>Tiện ích rạp</h2>
              <div className="amenities-grid">
                {amenities.map((item, index) => (
                  <div key={index} className="amenity-item" style={{ color: item.color }}>
                    <div className="amenity-icon">{item.icon}</div>
                    <span className="amenity-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps */}
            <div className="cinema-map-section">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(cinema.address || 'Vincom Center, Ho Chi Minh City')}`}
                allowFullScreen
                title="Cinema Location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaDetail; 