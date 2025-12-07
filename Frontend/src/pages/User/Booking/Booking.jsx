import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Booking.css';

const mockMovies = [
  { id: 1, title: 'Avengers: Endgame' },
  { id: 2, title: 'Spider-Man: No Way Home' },
  { id: 3, title: 'The Batman' },
  { id: 4, title: 'Black Panther: Wakanda Forever' }
];
const mockCinemas = [
  { id: 1, name: 'CGV Vincom Đồng Khởi' },
  { id: 2, name: 'Lotte Cinema Gò Vấp' },
  { id: 3, name: 'BHD Star Bitexco' }
];
const mockShowtimes = [
  { id: 1, time: '10:00' },
  { id: 2, time: '13:30' },
  { id: 3, time: '16:00' },
  { id: 4, time: '19:00' }
];
const mockSeats = Array.from({ length: 30 }, (_, i) => ({ code: `A${i + 1}`, booked: false }));

const Booking = () => {
  const [step, setStep] = useState(1);
  const [movie, setMovie] = useState('');
  const [cinema, setCinema] = useState('');
  const [showtime, setShowtime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  const handleSeatClick = (code) => {
    setSelectedSeats(seats => seats.includes(code)
      ? seats.filter(s => s !== code)
      : [...seats, code]
    );
  };

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleBooking = (e) => {
    e.preventDefault();
    // Giả lập đặt vé thành công
    navigate('/booking/confirm', {
      state: {
        movie: mockMovies.find(m => m.id === Number(movie)),
        cinema: mockCinemas.find(c => c.id === Number(cinema)),
        showtime: mockShowtimes.find(s => s.id === Number(showtime)),
        seats: selectedSeats
      }
    });
  };

  return (
    <div className="booking-page container">
      <h2 className="booking-title">Đặt vé xem phim</h2>
      <form className="booking-form" onSubmit={handleBooking}>
        {step === 1 && (
          <div className="booking-step">
            <label>Chọn phim:</label>
            <select value={movie} onChange={e => setMovie(e.target.value)} required>
              <option value="">-- Chọn phim --</option>
              {mockMovies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
            <button type="button" onClick={handleNext} disabled={!movie}>Tiếp tục</button>
          </div>
        )}
        {step === 2 && (
          <div className="booking-step">
            <label>Chọn rạp:</label>
            <select value={cinema} onChange={e => setCinema(e.target.value)} required>
              <option value="">-- Chọn rạp --</option>
              {mockCinemas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="booking-step-actions">
              <button type="button" onClick={handlePrev}>Quay lại</button>
              <button type="button" onClick={handleNext} disabled={!cinema}>Tiếp tục</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="booking-step">
            <label>Chọn suất chiếu:</label>
            <select value={showtime} onChange={e => setShowtime(e.target.value)} required>
              <option value="">-- Chọn suất chiếu --</option>
              {mockShowtimes.map(s => <option key={s.id} value={s.id}>{s.time}</option>)}
            </select>
            <div className="booking-step-actions">
              <button type="button" onClick={handlePrev}>Quay lại</button>
              <button type="button" onClick={handleNext} disabled={!showtime}>Tiếp tục</button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="booking-step">
            <label>Chọn ghế:</label>
            <div className="booking-seats">
              {mockSeats.map(seat => (
                <button
                  type="button"
                  key={seat.code}
                  className={`seat-btn${selectedSeats.includes(seat.code) ? ' selected' : ''}`}
                  onClick={() => handleSeatClick(seat.code)}
                  disabled={seat.booked}
                >
                  {seat.code}
                </button>
              ))}
            </div>
            <div className="booking-step-actions">
              <button type="button" onClick={handlePrev}>Quay lại</button>
              <button type="submit" disabled={selectedSeats.length === 0}>Xác nhận đặt vé</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Booking; 