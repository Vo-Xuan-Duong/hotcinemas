import React, { useState, useEffect, useMemo } from 'react';
import { Button, Typography, Spin, notification, message, Pagination } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import './Schedule.css';
import cinemaService from '../../../services/cinemaService';
import cityService from '../../../services/cityService';
import showtimeService from '../../../services/showtimeService';

const { Title, Text } = Typography;

dayjs.locale('vi');

const Schedule = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedCinemaId, setSelectedCinemaId] = useState(null);

    // API Data
    const [cities, setCities] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [availableDates] = useState(getNext7Days());

    // Pagination for cinemas
    const [cinemaPage, setCinemaPage] = useState(0);
    const [totalCinemas, setTotalCinemas] = useState(0);

    // Pagination for showtimes
    const [showtimePage, setShowtimePage] = useState(0);
    const [totalShowtimes, setTotalShowtimes] = useState(0);

    // Generate dates for next 7 days
    function getNext7Days() {
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
    }

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);

            // Load cities
            console.log('Loading cities...');
            const citiesData = await cityService.getCitiesAllNoPage();
            console.log('Cities response:', citiesData);

            // Handle different response structures
            const citiesArray = Array.isArray(citiesData) ? citiesData :
                (citiesData?.data ? citiesData.data :
                    (citiesData?.content ? citiesData.content : []));

            setCities(citiesArray);
            console.log('Cities set:', citiesArray);

            // Set default city (first city or Tp. HCM)
            if (citiesArray && citiesArray.length > 0) {
                const defaultCity = citiesArray.find(c => c.name.includes('Hồ Chí Minh')) || citiesArray[0];
                setSelectedCity(defaultCity.id);
                console.log('Default city selected:', defaultCity);

                // Load cinemas for default city
                await loadCinemasForCity(defaultCity.id);
            } else {
                console.warn('No cities available');
                message.warning('Không có dữ liệu thành phố. Vui lòng kiểm tra kết nối backend.');
            }

        } catch (error) {
            console.error('Error loading initial data:', error);
            console.error('Error details:', error.response || error.message);
            message.error(`Không thể tải dữ liệu: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Load cinemas when city changes
    useEffect(() => {
        if (selectedCity) {
            loadCinemasForCity(selectedCity);
        }
    }, [selectedCity]);

    const loadCinemasForCity = async (cityId, page = 0) => {
        try {
            console.log('Loading cinemas for city:', cityId, 'page:', page);

            // Load all cinemas by city with pagination
            const cinemasData = await cinemaService.getCinemasByCity(cityId, { page, size: 20 });
            console.log('Cinemas by city response:', cinemasData);

            // Handle different response structures
            let cinemasArray;
            let totalItems = 0;

            if (Array.isArray(cinemasData)) {
                cinemasArray = cinemasData;
                totalItems = cinemasData.length;
            } else if (cinemasData?.data?.content) {
                // Paginated response: {data: {content: [...], total: 96, last: false}}
                cinemasArray = cinemasData.data.content;
                totalItems = cinemasData.data.totalElements || cinemasData.data.total || 0;
            } else if (cinemasData?.data) {
                // Direct array in data: {data: [...]}
                cinemasArray = Array.isArray(cinemasData.data) ? cinemasData.data : [];
                totalItems = cinemasArray.length;
            } else if (cinemasData?.content) {
                // Direct content: {content: [...]}
                cinemasArray = cinemasData.content;
                totalItems = cinemasData.totalElements || cinemasData.total || cinemasArray.length;
            } else {
                cinemasArray = [];
            }

            // Update pagination state
            setTotalCinemas(totalItems);
            setCinemaPage(page);

            // Replace cinemas for pagination (not append)
            setCinemas(cinemasArray);

            console.log('Cinemas set:', cinemasArray, 'Total:', totalItems, 'Page:', page);

            // Set default cinema (first cinema) only on initial load
            if (page === 0 && cinemasArray && cinemasArray.length > 0) {
                setSelectedCinemaId(cinemasArray[0].id);
                await loadShowtimes(cinemasArray[0].id, selectedDate.format('YYYY-MM-DD'));
            } else if (page === 0) {
                console.warn('No cinemas found for city:', cityId);
                setSelectedCinemaId(null);
                setShowtimes([]);
            }
        } catch (error) {
            console.error('Error loading cinemas:', error);
            console.error('Error details:', error.response || error.message);
            message.error(`Không thể tải danh sách rạp: ${error.message}`);
            if (page === 0) {
                setCinemas([]);
            }
        }
    };

    // Load showtimes when cinema or date changes
    useEffect(() => {
        if (selectedCinemaId && selectedDate) {
            setShowtimePage(0);
            loadShowtimes(selectedCinemaId, selectedDate.format('YYYY-MM-DD'), 0);
        }
    }, [selectedCinemaId, selectedDate]);

    const loadShowtimes = async (cinemaId, date, page = 0) => {
        try {
            console.log('Loading showtimes for cinema:', cinemaId, 'date:', date, 'page:', page);
            const showtimesData = await showtimeService.getShowtimesByDateAndCinema(date, cinemaId, {
                page,
                size: 20
            });
            console.log('Showtimes response:', showtimesData);

            // Handle different response structures
            let showtimesArray;
            let totalItems = 0;

            if (Array.isArray(showtimesData)) {
                showtimesArray = showtimesData;
                totalItems = showtimesData.length;
            } else if (showtimesData?.data?.content) {
                // Paginated response: {data: {content: [...], total: 96, last: false}}
                showtimesArray = showtimesData.data.content;
                totalItems = showtimesData.data.totalElements || showtimesData.data.total || 0;
            } else if (showtimesData?.data) {
                // Direct array in data: {data: [...]}
                showtimesArray = Array.isArray(showtimesData.data) ? showtimesData.data : [];
                totalItems = showtimesArray.length;
            } else if (showtimesData?.content) {
                // Direct content: {content: [...]}
                showtimesArray = showtimesData.content;
                totalItems = showtimesData.totalElements || showtimesData.total || showtimesArray.length;
            } else {
                showtimesArray = [];
            }

            // Update pagination state
            setTotalShowtimes(totalItems);
            setShowtimePage(page);

            // Transform new API format to component format
            const transformedShowtimes = showtimesArray.map(item => {
                // Flatten all showtimes from all formats
                const allShowtimes = [];
                if (item.formats && Array.isArray(item.formats)) {
                    item.formats.forEach(format => {
                        if (format.showtimes && Array.isArray(format.showtimes)) {
                            format.showtimes.forEach(showtime => {
                                allShowtimes.push({
                                    id: showtime.showtimeId,
                                    startTime: showtime.startTime,
                                    endTime: showtime.endTime,
                                    roomId: showtime.roomId,
                                    roomName: showtime.roomName,
                                    price: showtime.price,
                                    status: showtime.status,
                                    formatType: format.formatType
                                });
                            });
                        }
                    });
                }

                return {
                    movie: {
                        id: item.movieId,
                        title: item.movieTitle,
                        poster: item.posterPath || item.poster || item.moviePoster,
                        duration: item.duration || item.movieDuration,
                        genre: item.genre || item.movieGenre
                    },
                    showtimes: allShowtimes
                };
            });

            // Replace showtimes for pagination (not append)
            setShowtimes(transformedShowtimes);

            console.log('Showtimes transformed:', transformedShowtimes, 'Total:', totalItems, 'Page:', page);
        } catch (error) {
            console.error('Error loading showtimes:', error);
            console.error('Error details:', error.response || error.message);
            if (page === 0) {
                setShowtimes([]);
            }
        }
    };

    const handleCityChange = (cityId) => {
        setSelectedCity(parseInt(cityId));
        setSelectedCinemaId(null);
        setShowtimes([]);
        setCinemaPage(0);
    };

    const handleCinemaSelect = (cinemaId) => {
        setSelectedCinemaId(cinemaId);
    };



    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleBooking = (movieId, showtimeId, showtime) => {
        // Navigate to booking page with showtime info
        navigate(`/booking/seats/${showtimeId}`, {
            state: {
                movieId,
                showtimeId,
                cinemaId: selectedCinemaId,
                date: selectedDate.format('YYYY-MM-DD'),
                time: showtime.startTime
            }
        });
    };

    // Get selected cinema info
    const selectedCinema = Array.isArray(cinemas) ? cinemas.find(c => c.id === selectedCinemaId) : null;
    const selectedCityName = Array.isArray(cities) ? (cities.find(c => c.id === selectedCity)?.name || '') : '';

    if (loading) {
        return (
            <div className="schedule-layout" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="schedule-layout">
            <div className="schedule-panel">
                <div className="panel-inner">
                    <Title level={2} className="schedule-page-title center-title">Lịch chiếu phim</Title>

                    {/* Filter Bar */}
                    <div className="filter-bar-wide">
                        <div className="left-filters">
                            <label className="filter-label">Vị trí</label>
                            <select
                                className="location-select"
                                value={selectedCity || ''}
                                onChange={e => handleCityChange(e.target.value)}
                            >
                                <option value="">-- Chọn thành phố --</option>
                                {Array.isArray(cities) && cities.map(city => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            <button type="button" className="near-me-btn">Gần bạn</button>
                        </div>
                    </div>

                    <div className="schedule-two-col">
                        {/* Cinema List Panel */}
                        <div className="cinema-list-panel">
                            <div className="cinema-search-box">
                                <input placeholder="Tìm theo tên rạp ..." />
                            </div>
                            <div className="cinema-list-scroll">
                                {!Array.isArray(cinemas) || cinemas.length === 0 ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                        Không có rạp nào
                                    </div>
                                ) : (
                                    cinemas.map(cinema => (
                                        <div
                                            key={cinema.id}
                                            className={`cinema-list-item ${selectedCinemaId === cinema.id ? 'active' : ''}`}
                                            onClick={() => handleCinemaSelect(cinema.id)}
                                        >
                                            <span className="cinema-list-name">{cinema.name}</span>
                                            <span className="chevron">›</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            {totalCinemas > 20 && (
                                <div className="cinema-list-footer">
                                    <Pagination
                                        simple
                                        current={cinemaPage + 1}
                                        total={totalCinemas}
                                        pageSize={20}
                                        onChange={(page) => {
                                            loadCinemasForCity(selectedCity, page - 1);
                                        }}
                                        showSizeChanger={false}
                                        size="small"
                                        style={{ textAlign: 'center', marginTop: '12px' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Showtimes Panel */}
                        <div className="showtimes-panel">
                            {selectedCinema && (
                                <div className="selected-cinema-header">
                                    <div className="cinema-header-line">
                                        <span className="selected-cinema-name" title={`Lịch chiếu phim ${selectedCinema.name}`}>
                                            {selectedCinema.name}
                                        </span>
                                        <button className="map-link" type="button">
                                            Bản đồ
                                        </button>
                                    </div>
                                    <div className="cinema-address-line" title={selectedCinema.address || 'Địa chỉ đang cập nhật'}>
                                        {selectedCinema.address || 'Địa chỉ đang cập nhật'}
                                    </div>
                                </div>
                            )}

                            {/* Date Strip */}
                            <div className="date-strip">
                                {Array.isArray(availableDates) && availableDates.map((d, idx) => {
                                    const isSelected = selectedDate.format('DD/MM') === d.fullDate.format('DD/MM');
                                    return (
                                        <div
                                            key={idx}
                                            className={`date-pill ${isSelected ? 'active' : ''}`}
                                            onClick={() => handleDateChange(d.fullDate)}
                                        >
                                            <div className="date-num">{d.dayNumber}</div>
                                            <div className="date-label">
                                                {d.isToday ? 'Hôm nay' : d.fullDate.format('dd')}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Movies and Showtimes */}
                            <div className="movie-rows compact">
                                {showtimes.length === 0 ? (
                                    <div style={{
                                        padding: '40px 20px',
                                        textAlign: 'center',
                                        color: '#999'
                                    }}>
                                        <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                                            Không có suất chiếu
                                        </p>
                                        <p style={{ fontSize: '14px' }}>
                                            Vui lòng chọn ngày khác hoặc rạp khác
                                        </p>
                                    </div>
                                ) : (
                                    Array.isArray(showtimes) && showtimes.map((item, index) => {
                                        const movie = item.movie;
                                        if (!movie) return null;

                                        return (
                                            <div key={movie.id || index} className="movie-row alt">
                                                <div className="movie-row-poster">
                                                    <img
                                                        src={movie.poster || 'https://via.placeholder.com/150x220?text=No+Image'}
                                                        alt={movie.title}
                                                    />
                                                </div>
                                                <div className="movie-row-body">
                                                    <div className="movie-row-header">
                                                        <div className="movie-row-title">{movie.title}</div>
                                                        <div className="movie-row-sub">
                                                            {movie.duration || '120 phút'} • {movie.genre || 'Phim'}
                                                        </div>
                                                    </div>
                                                    <div className="showtime-pills wrap">
                                                        {Array.isArray(item.showtimes) && item.showtimes.map((showtime, idx) => (
                                                            <button
                                                                key={showtime.id || idx}
                                                                className="showtime-pill"
                                                                onClick={() => handleBooking(
                                                                    movie.id,
                                                                    showtime.id,
                                                                    showtime
                                                                )}
                                                                title={`${showtime.roomName} - ${showtime.formatType || ''} - ${showtime.price?.toLocaleString()}đ`}
                                                            >
                                                                <div>{showtime.startTime?.substring(0, 5)}</div>
                                                                {showtime.formatType && (
                                                                    <div style={{ fontSize: '10px', opacity: 0.8 }}>
                                                                        {showtime.formatType}
                                                                    </div>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Pagination for Showtimes */}
                            {totalShowtimes > 20 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: '32px',
                                    paddingBottom: '20px',
                                    borderTop: '1px solid var(--border-color)',
                                    paddingTop: '24px'
                                }}>
                                    <Pagination
                                        current={showtimePage + 1}
                                        total={totalShowtimes}
                                        pageSize={20}
                                        onChange={(page) => {
                                            loadShowtimes(selectedCinemaId, selectedDate.format('YYYY-MM-DD'), page - 1);
                                        }}
                                        showSizeChanger={false}
                                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} suất chiếu`}
                                        size="default"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
