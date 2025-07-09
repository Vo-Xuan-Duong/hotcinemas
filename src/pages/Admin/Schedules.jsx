import React from 'react';
import './Admin.css';

const mockSchedules = [
  { id: 1, movie: 'Avengers: Endgame', cinema: 'CGV Vincom', time: '2024-06-10 19:00' },
  { id: 2, movie: 'The Batman', cinema: 'Lotte Gò Vấp', time: '2024-06-12 20:30' }
];

const AdminSchedules = () => {
  return (
    <div className="admin-page">
      <h2>Quản lý suất chiếu</h2>
      <button className="admin-add-btn">+ Thêm suất chiếu</button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Phim</th>
            <th>Rạp</th>
            <th>Thời gian</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {mockSchedules.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.movie}</td>
              <td>{s.cinema}</td>
              <td>{s.time}</td>
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

export default AdminSchedules; 