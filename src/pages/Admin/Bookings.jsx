import React from 'react';
import './Admin.css';

const mockBookings = [
  { id: 'B001', user: 'Nguyễn Văn A', movie: 'Avengers: Endgame', cinema: 'CGV Vincom', seat: 'A5, A6', time: '2024-06-10 19:00', status: 'Đã thanh toán' },
  { id: 'B002', user: 'Trần Thị B', movie: 'The Batman', cinema: 'Lotte Mart', seat: 'B1, B2', time: '2024-06-12 20:30', status: 'Đã thanh toán' }
];

const AdminBookings = () => {
  return (
    <div className="admin-page">
      <h2>Quản lý đặt vé</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Mã vé</th>
            <th>Khách hàng</th>
            <th>Phim</th>
            <th>Rạp</th>
            <th>Ghế</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {mockBookings.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.user}</td>
              <td>{b.movie}</td>
              <td>{b.cinema}</td>
              <td>{b.seat}</td>
              <td>{b.time}</td>
              <td>{b.status}</td>
              <td>
                <button className="admin-edit-btn">Sửa</button>
                <button className="admin-delete-btn">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings; 