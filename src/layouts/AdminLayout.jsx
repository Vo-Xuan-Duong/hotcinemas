import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/movies', icon: '🎬', label: 'Quản lý phim' },
    { path: '/admin/cinemas', icon: '🏢', label: 'Quản lý rạp' },
    { path: '/admin/schedules', icon: '📅', label: 'Lịch chiếu' },
    { path: '/admin/users', icon: '👥', label: 'Người dùng' },
    { path: '/admin/bookings', icon: '🎫', label: 'Đặt vé' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>🎬 Hot Cinemas</h2>
          <span className="admin-badge">Admin</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 