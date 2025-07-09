import React, { useState } from 'react';
import Login from '../../pages/Auth/Login';
import Register from '../../pages/Auth/Register';
import './Header.css';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('login'); // 'login' hoặc 'register'
  const [menuOpen, setMenuOpen] = useState(false); // Thêm state cho mobile menu

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleMenuToggle = () => setMenuOpen(open => !open);
  const handleNavClick = () => setMenuOpen(false); // Đóng menu khi chọn link

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/"><h1>HotCinemas</h1></a>
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
          <button className="search-btn">🔍</button>
          <button className="login-btn" onClick={() => openModal('login')}>Đăng nhập</button>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            {modalType === 'login' ? (
              <>
                <Login onSwitchToRegister={() => setModalType('register')} />
              </>
            ) : (
              <>
                <Register onSwitchToLogin={() => setModalType('login')} />
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 