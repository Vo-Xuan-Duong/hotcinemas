import React from 'react';
import ReactDOM from 'react-dom';
import SeatsGrid from './SeatsGrid';
import './SeatsModal.css';

const seatLegend = [
  { className: 'seat-booked', label: 'Đã đặt' },
  { className: 'seat-selected', label: 'Ghế bạn chọn' },
  { className: 'seat-available', label: 'Ghế thường' },
  { className: 'seat-vip', label: 'Ghế VIP' },
  { className: 'seat-couple', label: 'Ghế đôi' },
];

const SeatsModal = ({ isOpen, onClose, seats, selectedSeats, onSelectSeat, showtimeInfo }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="seats-modal-overlay" onClick={onClose}>
      <div className="seats-modal-content" onClick={e => e.stopPropagation()}>
        <div className="seats-modal-header">
          <button className="seats-modal-close" onClick={onClose}>&times;</button>
          <h2>Mua vé xem phim</h2>
        </div>
        <div className="seats-modal-screen">MÀN HÌNH</div>
        <SeatsGrid seats={seats} selectedSeats={selectedSeats} onSelect={onSelectSeat} />
        <div className="seats-modal-legend">
          {seatLegend.map(item => (
            <span key={item.className} className={`legend-item ${item.className}`}>{item.label}</span>
          ))}
        </div>
        <div className="seats-modal-info">
          <div className="showtime-info">
            <b>{showtimeInfo?.cinema}</b> | {showtimeInfo?.room} | {showtimeInfo?.date} {showtimeInfo?.time}
          </div>
          <div className="selected-seats">
            Chỗ ngồi: <b>{selectedSeats.map(id => seats.find(s => s.id === id)?.label).filter(Boolean).join(', ') || 'Chưa chọn'}</b>
          </div>
          <div className="seats-modal-actions">
            <button className="buy-ticket-btn" disabled={selectedSeats.length === 0}>Mua vé</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SeatsModal; 