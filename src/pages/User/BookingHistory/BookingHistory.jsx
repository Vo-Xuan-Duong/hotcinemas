import React from 'react';
import useAuth from '../../context/useAuth';

const mockBookings = [
  {
    id: 'B001',
    movie: 'Avengers: Endgame',
    cinema: 'CGV Vincom',
    seat: 'A5, A6',
    time: '2024-06-10 19:00',
    status: 'Đã thanh toán',
  },
  {
    id: 'B002',
    movie: 'The Batman',
    cinema: 'Lotte Mart',
    seat: 'B1, B2',
    time: '2024-06-12 20:30',
    status: 'Đã thanh toán',
  },
];

const BookingHistory = () => {
  const { user } = useAuth();

  if (!user) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Bạn chưa đăng nhập.</div>;

  return (
    <div className="container" style={{ maxWidth: 700, margin: '2rem auto', background: 'white', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', padding: '2rem' }}>
      <h2 style={{ color: '#667eea', marginBottom: 24 }}>Lịch sử đặt vé</h2>
      {mockBookings.length === 0 ? (
        <div>Bạn chưa có vé nào.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th>Mã vé</th>
              <th>Phim</th>
              <th>Rạp</th>
              <th>Ghế</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {mockBookings.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{b.id}</td>
                <td>{b.movie}</td>
                <td>{b.cinema}</td>
                <td>{b.seat}</td>
                <td>{b.time}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingHistory; 