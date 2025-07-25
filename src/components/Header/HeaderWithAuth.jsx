import React from 'react';
import Header from './Header';
import useAuth from '../../context/useAuth';

const HeaderWithAuth = () => {
  try {
    // Try to use useAuth
    const authContext = useAuth();
    return <Header />;
  } catch (error) {
    // If AuthProvider is not available, show simplified header
    return (
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <h1>🎬 HotCinemas</h1>
          </div>
          <nav className="nav">
            <ul className="nav-list">
              <li><a href="/" className="nav-link">Trang chủ</a></li>
              <li><a href="/movies" className="nav-link">Phim</a></li>
              <li><a href="/cinemas" className="nav-link">Rạp chiếu</a></li>
            </ul>
          </nav>
          <div className="header-actions">
            <button className="search-btn">🔍</button>
            <div className="auth-buttons">
              <button className="register-btn">Đăng ký</button>
              <button className="login-btn">Đăng nhập</button>
            </div>
          </div>
        </div>
      </header>
    );
  }
};

export default HeaderWithAuth;
