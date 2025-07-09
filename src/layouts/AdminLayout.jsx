import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <nav>
          <ul>
            <li><Link to="/admin/movies">Quản lý phim</Link></li>
            <li><Link to="/admin/cinemas">Quản lý rạp</Link></li>
            <li><Link to="/admin/schedules">Quản lý suất chiếu</Link></li>
            <li><Link to="/admin/users">Quản lý người dùng</Link></li>
            <li><Link to="/admin/bookings">Quản lý đặt vé</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 