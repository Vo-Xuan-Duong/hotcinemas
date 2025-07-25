import React, { useState } from 'react';
import useAuth from '../../context/useAuth';
import AuthModal from '../Auth/AuthModal';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleMenuToggle = () => setMenuOpen(open => !open);
  const handleNavClick = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/"><h1>🎬 HotCinemas</h1></a>
        </div>
        <button className="hamburger" onClick={handleMenuToggle} aria-label="Toggle menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li><a href="/" className="nav-link" onClick={handleNavClick}>Trang chủ</a></li>
            <li><a href="/movies" className="nav-link" onClick={handleNavClick}>Phim</a></li>
            <li><a href="/schedule" className="nav-link" onClick={handleNavClick}>Lịch chiếu</a></li>
            <li><a href="/cinemas" className="nav-link" onClick={handleNavClick}>Rạp chiếu</a></li>
            <li><a href="/about" className="nav-link" onClick={handleNavClick}>Giới thiệu</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="search-btn" aria-label="Tìm kiếm">🔍</button>

          {isAuthenticated ? (
            <div className="user-menu">
              <button
                className="user-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
              >
                <span className="user-name">{user?.name || 'User'}</span>
                <span className="avatar-icon">👤</span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <a href="/profile" className="dropdown-item">Hồ sơ</a>
                  <a href="/history" className="dropdown-item">Lịch sử đặt vé</a>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className="register-btn"
                onClick={() => openAuthModal('register')}
              >
                Đăng ký
              </button>
              <button
                className="login-btn"
                onClick={() => openAuthModal('login')}
              >
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </header>
  );
};

export default Header; 