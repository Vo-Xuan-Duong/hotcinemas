import React, { useState, useEffect } from 'react';
import './ShowtimesSection.css';
import SeatsModal from '../Seats/SeatsModal';
import seatData from '../../data/seatData.json';
import Loading from '../Loading';

const mockSeats = seatData.seats;

const icons = {
  calendar: <span className="icon">📅</span>,
  clock: <span className="icon">🕐</span>,
  cinema: <span className="icon">🎬</span>,
  imax: <span className="icon">🎭</span>,
  normal: <span className="icon">🎪</span>,
  location: <span className="icon">📍</span>,
  ticket: <span className="icon">🎫</span>,
  time: <span className="icon">⏰</span>
};

const ShowtimesSection = ({ showtimes }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isSeatsModalOpen, setIsSeatsModalOpen] = useState(false);
  const [hoveredTime, setHoveredTime] = useState(null);
  const [expandedCinema, setExpandedCinema] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showtimes || showtimes.length === 0) return;
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600); // giả lập loading
    return () => clearTimeout(timer);
  }, [showtimes]);

  if (!showtimes || showtimes.length === 0) {
    return (
      <div className="showtimes-section">
        <div className="showtimes-header">
          <h2 className="showtimes-title">
            {icons.calendar} Lịch chiếu
          </h2>
        </div>
        <div className="no-showtimes">
          <div className="no-showtimes-icon">🎬</div>
          <h3>Chưa có lịch chiếu</h3>
          <p>Lịch chiếu cho phim này sẽ được cập nhật sớm nhất</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading text="Đang tải lịch chiếu..." />;
  }

  const handleTimeClick = (dayIdx, cinemaIdx, roomIdx, time) => {
    setSelectedShowtime({
      dayIdx,
      cinemaIdx,
      roomIdx,
      time,
      date: showtimes[dayIdx].date,
      cinema: showtimes[dayIdx].cinemas[cinemaIdx].name,
      room: showtimes[dayIdx].cinemas[cinemaIdx].rooms[roomIdx].name
    });
    setSelectedSeats([]);
    setIsSeatsModalOpen(true);
  };

  const handleSelectSeat = (seatId) => {
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleCloseModal = () => {
    setIsSeatsModalOpen(false);
  };

  const formatTime = (time) => {
    return time;
  };

  // const getRoomIcon = (type) => {
  //   return type === 'imax' ? icons.imax : icons.normal;
  // };

  const getRoomColor = (type) => {
    return type === 'imax' ? 'imax' : 'normal';
  };

  return (
    <div className="showtimes-section">
      <div className="showtimes-header">
        <h2 className="showtimes-title">
          {icons.calendar} Lịch chiếu
        </h2>
        <div className="showtimes-subtitle">
          Chọn ngày và suất chiếu phù hợp với bạn
        </div>
      </div>

      <div className="showtimes-tabs">
        {showtimes.map((day, dayIdx) => (
          <button
            key={dayIdx}
            className={`showtime-tab ${selectedDay === dayIdx ? 'active' : ''}`}
            onClick={() => { 
              setSelectedDay(dayIdx); 
              setSelectedShowtime(null); 
              setIsSeatsModalOpen(false); 
            }}
          >
            <div className="tab-day">{day.dayName}</div>
            <div className="tab-date">{day.date}</div>
            {selectedDay === dayIdx && <div className="tab-indicator"></div>}
          </button>
        ))}
      </div>

      <div className="showtimes-content">
        <div className="selected-day-info">
          <div className="day-header">
            <h3 className="day-name">{showtimes[selectedDay].dayName}</h3>
            <div className="day-date">{showtimes[selectedDay].date}</div>
          </div>
        </div>

        <div className="cinemas-list">
          {showtimes[selectedDay].cinemas.map((cinema, cinemaIdx) => (
            <div className="cinema-card" key={cinemaIdx}>
              <div className="cinema-header" style={{cursor: 'pointer'}} onClick={() => setExpandedCinema(expandedCinema === cinemaIdx ? null : cinemaIdx)}>
                {/* <div className="cinema-icon">{icons.location}</div> */}
                <div className="cinema-info">
                  <h4 className="cinema-name">{cinema.name}</h4>
                  <div className="cinema-meta">
                    <span className="room-count">{cinema.rooms.length} phòng chiếu</span>
                  </div>
                </div>
              </div>

              {expandedCinema === cinemaIdx && (
                <div className="rooms-list">
                  {cinema.rooms.map((room, roomIdx) => (
                    <div className="room-card" key={roomIdx}>
                      <div className={`room-header ${getRoomColor(room.type)}`}>
                        {/* <div className="room-icon">
                          {getRoomIcon(room.type)}
                        </div> */}
                        <div className="room-info">
                          <span className="room-name">{room.name}</span>
                          <span className="room-type">
                            {room.type === 'imax' ? 'IMAX' : 'Phòng thường'}
                          </span>
                        </div>
                      </div>

                      <div className="times-grid">
                        {room.times.map((time, timeIdx) => (
                          <button
                            key={timeIdx}
                            className={`time-btn ${hoveredTime === `${cinemaIdx}-${roomIdx}-${timeIdx}` ? 'hovered' : ''}`}
                            onClick={() => handleTimeClick(selectedDay, cinemaIdx, roomIdx, time)}
                            onMouseEnter={() => setHoveredTime(`${cinemaIdx}-${roomIdx}-${timeIdx}`)}
                            onMouseLeave={() => setHoveredTime(null)}
                          >
                            <span className="time-icon">{icons.time}</span>
                            <span className="time-text">{formatTime(time)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <SeatsModal
        isOpen={isSeatsModalOpen}
        onClose={handleCloseModal}
        seats={mockSeats}
        selectedSeats={selectedSeats}
        onSelectSeat={handleSelectSeat}
        showtimeInfo={selectedShowtime}
      />
    </div>
  );
};

export default ShowtimesSection; 