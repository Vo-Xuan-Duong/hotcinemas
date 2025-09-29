import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import movieService from '../../../services/movieService';
import cinemaService from '../../../services/cinemaService';
import { scheduleService } from '../../../services/scheduleService';
import MovieCard from '../../../components/MovieCard/MovieCard';
import Loading from '../../../components/Loading';
import './Schedule.css';

const Schedule = () => {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [movies, setMovies] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedCinema, setSelectedCinema] = useState('');
    const [filteredSchedules, setFilteredSchedules] = useState([]);

    // Generate next 7 days for date selection
    const getNext7Days = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push({
                value: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit'
                }),
                isToday: i === 0
            });
        }
        return days;
    };

    const [availableDates] = useState(getNext7Days());

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterSchedules();
    }, [schedules, selectedDate, selectedCinema]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [schedulesData, moviesData, cinemasData] = await Promise.all([
                scheduleService.getAllSchedules(),
                movieService.getAllMovies(),
                cinemaService.getAllCinemas()
            ]);

            setSchedules(schedulesData);
            setMovies(moviesData);
            setCinemas(cinemasData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterSchedules = () => {
        let filtered = schedules.filter(schedule => {
            const dateMatch = !selectedDate || schedule.date === selectedDate;
            const cinemaMatch = !selectedCinema || schedule.cinemaId === parseInt(selectedCinema);
            return dateMatch && cinemaMatch;
        });

        // Group by movie
        const groupedByMovie = filtered.reduce((acc, schedule) => {
            const movieId = schedule.movieId;
            if (!acc[movieId]) {
                acc[movieId] = {
                    movie: movies.find(m => m.id === movieId),
                    showtimes: []
                };
            }

            const cinema = cinemas.find(c => c.id === schedule.cinemaId);
            const room = cinema?.rooms.find(r => r.id === schedule.roomId);

            acc[movieId].showtimes.push({
                ...schedule,
                cinema: cinema,
                room: room
            });

            return acc;
        }, {});

        // Sort showtimes by time
        Object.values(groupedByMovie).forEach(group => {
            group.showtimes.sort((a, b) => a.time.localeCompare(b.time));
        });

        setFilteredSchedules(Object.values(groupedByMovie));
    };

    const formatTime = (timeString) => {
        return timeString;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleBooking = (showtime, movie) => {
        // Navigate to booking page with showtime details
        navigate('/booking', {
            state: {
                showtime,
                movie,
                cinema: showtime.cinema,
                room: showtime.room
            }
        });
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="schedule-page">
            <div className="container">
                {/* Header */}
                <div className="schedule-header">
                    <h1>
                        <span className="icon">🎬</span>
                        Lịch Chiếu Phim
                    </h1>
                    <p>Chọn ngày và rạp để xem lịch chiếu phim</p>
                </div>

                {/* Filters */}
                <div className="schedule-filters">
                    {/* Date Selection */}
                    <div className="filter-group">
                        <label>Chọn ngày:</label>
                        <div className="date-selector">
                            {availableDates.map(date => (
                                <button
                                    key={date.value}
                                    className={`date-btn ${selectedDate === date.value ? 'active' : ''} ${date.isToday ? 'today' : ''}`}
                                    onClick={() => setSelectedDate(date.value)}
                                >
                                    {date.label}
                                    {date.isToday && <span className="today-label">Hôm nay</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cinema Selection */}
                    <div className="filter-group">
                        <label htmlFor="cinema-select">Chọn rạp:</label>
                        <select
                            id="cinema-select"
                            value={selectedCinema}
                            onChange={(e) => setSelectedCinema(e.target.value)}
                            className="cinema-select"
                        >
                            <option value="">Tất cả rạp</option>
                            {cinemas.map(cinema => (
                                <option key={cinema.id} value={cinema.id}>
                                    {cinema.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Selected Date Display */}
                {selectedDate && (
                    <div className="selected-date">
                        <h2>Lịch chiếu ngày: {formatDate(selectedDate)}</h2>
                    </div>
                )}

                {/* Schedules List */}
                <div className="schedules-list">
                    {filteredSchedules.length === 0 ? (
                        <div className="no-schedules">
                            <div className="no-schedules-icon">🎭</div>
                            <h3>Không có lịch chiếu</h3>
                            <p>Không tìm thấy suất chiếu nào cho ngày và rạp đã chọn.</p>
                        </div>
                    ) : (
                        filteredSchedules.map(({ movie, showtimes }) => (
                            <div key={movie.id} className="movie-schedule">
                                <div className="movie-info">
                                    <div className="movie-poster">
                                        <img src={movie.poster} alt={movie.title} />
                                    </div>
                                    <div className="movie-details">
                                        <h3>{movie.title}</h3>
                                        <div className="schedule-page movie-meta">
                                            <span className="duration">⏱️ {movie.duration} phút</span>
                                            <span className="rating">⭐ {movie.rating}</span>
                                            <span className="age-label">{movie.ageLabel}</span>
                                            <span className="format">{movie.format}</span>
                                        </div>
                                        <p className="movie-genre">{movie.genre}</p>
                                    </div>
                                </div>

                                <div className="showtimes-grid">
                                    {showtimes.map(showtime => (
                                        <div key={showtime.id} className="showtime-card">
                                            <div className="showtime-header">
                                                <span className="time">{formatTime(showtime.time)}</span>
                                                <span className="room-type">{showtime.room?.type}</span>
                                            </div>
                                            <div className="showtime-details">
                                                <div className="cinema-name">{showtime.cinema?.name}</div>
                                                <div className="room-name">{showtime.room?.name}</div>
                                            </div>
                                            <button
                                                className="book-btn"
                                                onClick={() => handleBooking(showtime, movie)}
                                            >
                                                Đặt vé
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Schedule;
