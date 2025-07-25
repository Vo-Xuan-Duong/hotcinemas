import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthModal } from '../Auth';
import './Header.css';
import './HeaderEnhancements.css';

// Safe hook để handle trường hợp AuthProvider chưa ready
const useSafeAuth = () => {
  try {
    const useAuth = require('../../context/useAuth').default;
    return useAuth();
  } catch (error) {
    console.warn('AuthContext not available:', error.message);
    return {
      user: null,
      logout: () => { },
      isLoading: false,
      error: null,
      clearError: () => { }
    };
  }
};

const HeaderSafe = () => {
  const { user, logout } = useSafeAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleMenuToggle = () => setMenuOpen(open => !open);
  const handleNavClick = () => setMenuOpen(false);

  const handleUserMenuToggle = () => setUserMenuOpen(open => !open);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [userMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.nav') && !event.target.closest('.hamburger')) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/"><h1>🎬 HotCinemas</h1></Link>
        </div>
        <button className="hamburger" onClick={handleMenuToggle} aria-label="Toggle menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li><Link to="/" className="nav-link" onClick={handleNavClick}>Trang chủ</Link></li>
            <li><Link to="/movies" className="nav-link" onClick={handleNavClick}>Phim</Link></li>
            <li><Link to="/cinemas" className="nav-link" onClick={handleNavClick}>Rạp chiếu</Link></li>
            <li><Link to="/auth-demo" className="nav-link" onClick={handleNavClick}>Demo Auth</Link></li>
            <li><Link to="/header-demo" className="nav-link" onClick={handleNavClick}>Demo Header</Link></li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="search-btn" aria-label="Search">🔍</button>

          {user ? (
            <div className="user-menu" onClick={handleUserMenuToggle} ref={userMenuRef}>
              <div className="user-avatar">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="user-avatar-fallback" style={{ display: 'none' }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <span className="user-name">{user.name}</span>
              <span className="dropdown-arrow">▼</span>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <span className="dropdown-icon">👤</span>
                    Hồ sơ cá nhân
                  </Link>
                  <Link to="/history" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <span className="dropdown-icon">📋</span>
                    Lịch sử đặt vé
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="register-btn" onClick={() => openAuthModal('register')}>
                Đăng ký
              </button>
              <button className="login-btn" onClick={() => openAuthModal('login')}>
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

export default HeaderSafe;
