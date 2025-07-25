import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const SimpleHeader = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/"><h1>🎬 HotCinemas</h1></Link>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li><Link to="/" className="nav-link">Trang chủ</Link></li>
            <li><Link to="/movies" className="nav-link">Phim</Link></li>
            <li><Link to="/cinemas" className="nav-link">Rạp chiếu</Link></li>
            <li><Link to="/auth-demo" className="nav-link">Demo Auth</Link></li>
            <li><Link to="/header-demo" className="nav-link">Demo Header</Link></li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="search-btn" aria-label="Search">🔍</button>
          <div className="auth-buttons">
            <button className="register-btn">Đăng ký</button>
            <button className="login-btn">Đăng nhập</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
