import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthModal } from '../Auth';
import './HeaderTest.css';

const HeaderTest = ({ user, onLogin, onLogout }) => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login');
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

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
        onLogout();
        setUserMenuOpen(false);
    };

    return (
        <header className="header-test">
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
                    </ul>
                </nav>

                <div className="header-actions">
                    <button className="search-btn" aria-label="Search">🔍</button>

                    {user ? (
                        <div className="user-menu" onClick={handleUserMenuToggle}>
                            <div className="user-avatar">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} />
                                ) : (
                                    <div className="user-avatar-fallback">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
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

export default HeaderTest;
