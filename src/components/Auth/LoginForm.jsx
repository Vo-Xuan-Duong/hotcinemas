import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { STORAGE_KEYS } from '../../utils/constants';
import './LoginForm.css';

const LoginForm = ({ onSwitchToRegister, standalone = true }) => {
    const { login, isLoading, error, clearError } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    // Load remembered email on component mount
    useEffect(() => {
        const rememberedEmail = localStorage.getItem(STORAGE_KEYS.REMEMBER_EMAIL);
        if (rememberedEmail) {
            setFormData(prev => ({ ...prev, email: rememberedEmail }));
            setRememberMe(true);
        }
    }, []);

    // Clear errors when user starts typing
    useEffect(() => {
        if (Object.keys(formErrors).length > 0) {
            setFormErrors({});
        }
        if (error) {
            clearError();
        }
    }, [formData, error, clearError]);

    const validateForm = () => {
        const errors = {};

        // Email validation
        if (!formData.email) {
            errors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email không hợp lệ';
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        return errors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            await login(formData.email, formData.password);

            // Handle remember me
            if (rememberMe) {
                localStorage.setItem(STORAGE_KEYS.REMEMBER_EMAIL, formData.email);
            } else {
                localStorage.removeItem(STORAGE_KEYS.REMEMBER_EMAIL);
            }

            if (standalone) {
                navigate('/');
            }
        } catch (err) {
            // Error is handled by context
            console.error('Login failed:', err);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`login-form-container ${standalone ? 'standalone' : ''}`}>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-header">
                    <h2>Đăng nhập</h2>
                    <p>Chào mừng bạn quay trở lại!</p>
                </div>

                {error && (
                    <div className="error-message">
                        <i className="error-icon">⚠️</i>
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="input-wrapper">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Nhập email của bạn"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={formErrors.email ? 'error' : ''}
                            autoComplete="email"
                        />
                        <i className="input-icon">📧</i>
                    </div>
                    {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <div className="input-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Nhập mật khẩu của bạn"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={formErrors.password ? 'error' : ''}
                            autoComplete="current-password"
                        />
                        <i className="input-icon">🔒</i>
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                            tabIndex={-1}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    {formErrors.password && <span className="field-error">{formErrors.password}</span>}
                </div>

                <div className="form-options">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Ghi nhớ đăng nhập
                    </label>
                    <Link to="/forgot-password" className="forgot-link">
                        Quên mật khẩu?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="loading-spinner"></span>
                            Đang đăng nhập...
                        </>
                    ) : (
                        'Đăng nhập'
                    )}
                </button>

                <div className="form-footer">
                    <p>
                        Chưa có tài khoản?{' '}
                        {onSwitchToRegister ? (
                            <button
                                type="button"
                                className="switch-link"
                                onClick={onSwitchToRegister}
                            >
                                Đăng ký ngay
                            </button>
                        ) : (
                            <Link to="/register" className="switch-link">Đăng ký ngay</Link>
                        )}
                    </p>
                </div>

                <div className="divider">
                    <span>hoặc</span>
                </div>

                <div className="social-login">
                    <button type="button" className="social-button google">
                        <i className="social-icon">🔍</i>
                        Đăng nhập với Google
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
