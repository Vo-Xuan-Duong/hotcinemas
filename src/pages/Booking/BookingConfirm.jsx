import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './BookingConfirm.css';

const BookingConfirm = () => {
  const { state } = useLocation();
  if (!state) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Không có thông tin đặt vé.</div>;
  const { movie, cinema, showtime, seats } = state;

  return (
    <div className="booking-confirm container">
      <div className="booking-confirm-box">
        <h2>Đặt vé thành công!</h2>
        <div className="booking-confirm-info">
          <div><b>Phim:</b> {movie?.title}</div>
          <div><b>Rạp:</b> {cinema?.name}</div>
          <div><b>Suất chiếu:</b> {showtime?.time}</div>
          <div><b>Ghế:</b> {seats?.join(', ')}</div>
        </div>
        <div className="booking-confirm-actions">
          <Link to="/" className="booking-confirm-btn">Về trang chủ</Link>
          <Link to="/history" className="booking-confirm-btn">Xem lịch sử đặt vé</Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm; 