import React from 'react';
import './Admin.css';

const mockCinemas = [
  { id: 1, name: 'CGV Vincom Đồng Khởi', city: 'Hồ Chí Minh' },
  { id: 2, name: 'Lotte Cinema Gò Vấp', city: 'Hồ Chí Minh' },
  { id: 3, name: 'BHD Star Bitexco', city: 'Hồ Chí Minh' },
  { id: 4, name: 'CGV Aeon Hà Đông', city: 'Hà Nội' }
];

const AdminCinemas = () => {
  return (
    <div className="admin-page">
      <h2>Quản lý rạp</h2>
      <button className="admin-add-btn">+ Thêm rạp</button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên rạp</th>
            <th>Thành phố</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {mockCinemas.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.city}</td>
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

export default AdminCinemas; 