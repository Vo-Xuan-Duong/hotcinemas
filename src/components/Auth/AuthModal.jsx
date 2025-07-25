import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);

    // Update mode when initialMode changes
    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset'; // Restore body scroll
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSwitchToRegister = () => {
        setMode('register');
    };

    const handleSwitchToLogin = () => {
        setMode('login');
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={handleOverlayClick}>
            <div className="auth-modal-content">
                <button className="auth-modal-close" onClick={onClose}>
                    ✕
                </button>

                {/* Tab navigation */}
                {/* <div className="auth-modal-tabs">
                    <button
                        className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={handleSwitchToLogin}
                    >
                        Đăng nhập
                    </button>
                    <button
                        className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                        onClick={handleSwitchToRegister}
                    >
                        Đăng ký
                    </button>
                </div> */}

                <div className="auth-modal-body">
                    {mode === 'login' ? (
                        <LoginForm
                            onSwitchToRegister={handleSwitchToRegister}
                            standalone={false}
                        />
                    ) : (
                        <RegisterForm
                            onSwitchToLogin={handleSwitchToLogin}
                            standalone={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
