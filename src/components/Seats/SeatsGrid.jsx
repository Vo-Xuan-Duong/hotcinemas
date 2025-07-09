import React from 'react';
import './SeatsGrid.css';

const SeatsGrid = ({ seats, selectedSeats = [], onSelect }) => {
  const maxCols = seats.reduce((max, seat) => seat.number > max ? seat.number : max, 0);
  return (
    <div className="seats-grid" style={{ gridTemplateColumns: `repeat(${maxCols}, 36px)` }}>
      {seats.map(seat => {
        const isSelected = selectedSeats.includes(seat.id);
        const label = seat.label || `${seat.row}${seat.number}`;
        return (
          <button
            key={seat.id}
            className={`seat-btn seat-${seat.status} seat-${seat.type} ${isSelected ? 'seat-selected' : ''}`}
            disabled={seat.status === 'booked'}
            onClick={() => onSelect && onSelect(seat.id)}
            title={label}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default SeatsGrid; 