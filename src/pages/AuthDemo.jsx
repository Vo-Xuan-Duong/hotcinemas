import React, { useState } from 'react';
import { AuthModal, LoginForm, RegisterForm } from '../components/Auth';
import './AuthDemo.css';

const AuthDemo = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('login');
    const [viewMode, setViewMode] = useState('modal');

    const openModal = (mode) => {
        setModalMode(mode);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="auth-demo">
            <div className="demo-header">
                <h1>🎬 HotCinemas - Demo Đăng nhập</h1>
                <p>Trải nghiệm các component đăng nhập mới với thiết kế hiện đại</p>
            </div>

            <div className="demo-controls">
                <div className="view-selector">
                    <h3>Chế độ hiển thị:</h3>
                    <div className="button-group">
                        <button
                            className={viewMode === 'modal' ? 'active' : ''}
                            onClick={() => setViewMode('modal')}
                        >
                            Modal
                        </button>
                        <button
                            className={viewMode === 'inline-login' ? 'active' : ''}
                            onClick={() => setViewMode('inline-login')}
                        >
                            Inline Login
                        </button>
                        <button
                            className={viewMode === 'inline-register' ? 'active' : ''}
                            onClick={() => setViewMode('inline-register')}
                        >
                            Inline Register
                        </button>
                    </div>
                </div>

                {viewMode === 'modal' && (
                    <div className="modal-controls">
                        <h3>Mở Modal:</h3>
                        <div className="button-group">
                            <button onClick={() => openModal('login')}>
                                Đăng nhập Modal
                            </button>
                            <button onClick={() => openModal('register')}>
                                Đăng ký Modal
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="demo-content">
                {viewMode === 'modal' && (
                    <div className="modal-demo">
                        <h3>Modal Auth Demo</h3>
                        <p>Click vào các nút trên để mở modal đăng nhập/đăng ký</p>
                        <div className="features-list">
                            <h4>Tính năng Modal:</h4>
                            <ul>
                                <li>✅ Chuyển đổi mượt mà giữa Login và Register</li>
                                <li>✅ Backdrop blur effect</li>
                                <li>✅ Responsive design</li>
                                <li>✅ Keyboard navigation (ESC để đóng)</li>
                                <li>✅ Click outside để đóng</li>
                            </ul>
                        </div>
                    </div>
                )}

                {viewMode === 'inline-login' && (
                    <div className="inline-demo">
                        <h3>Inline Login Form</h3>
                        <LoginForm standalone={true} />
                    </div>
                )}

                {viewMode === 'inline-register' && (
                    <div className="inline-demo">
                        <h3>Inline Register Form</h3>
                        <RegisterForm standalone={true} />
                    </div>
                )}
            </div>

            <div className="features-section">
                <h2>🚀 Tính năng nổi bật</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>🔐 Bảo mật cao</h3>
                        <ul>
                            <li>Password strength indicator</li>
                            <li>Form validation thông minh</li>
                            <li>Remember me option</li>
                            <li>Show/hide password</li>
                        </ul>
                    </div>

                    <div className="feature-card">
                        <h3>🎨 UI/UX hiện đại</h3>
                        <ul>
                            <li>Gradient backgrounds</li>
                            <li>Smooth animations</li>
                            <li>Loading states</li>
                            <li>Error handling đẹp mắt</li>
                        </ul>
                    </div>

                    <div className="feature-card">
                        <h3>📱 Responsive</h3>
                        <ul>
                            <li>Mobile-first design</li>
                            <li>Touch-friendly</li>
                            <li>Accessibility support</li>
                            <li>Cross-browser compatible</li>
                        </ul>
                    </div>

                    <div className="feature-card">
                        <h3>⚡ Performance</h3>
                        <ul>
                            <li>Lazy validation</li>
                            <li>Optimized re-renders</li>
                            <li>Minimal bundle size</li>
                            <li>Fast animations</li>
                        </ul>
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={showModal}
                onClose={closeModal}
                initialMode={modalMode}
            />
        </div>
    );
};

export default AuthDemo;
