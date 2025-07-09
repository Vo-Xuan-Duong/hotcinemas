import React from 'react';
import './Admin.css';

const mockUsers = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', role: 'customer' },
  { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', role: 'admin' },
  { id: 3, name: 'Lê Văn C', email: 'c@gmail.com', role: 'customer' }
];

const AdminUsers = () => {
  return (
    <div className="admin-page">
      <h2>Quản lý người dùng</h2>
      <button className="admin-add-btn">+ Thêm người dùng</button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
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

export default AdminUsers; 