import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import './RegisterForm.css';

const RegisterForm = ({ onSwitchToLogin, standalone = true }) => {
    const { register, isLoading, error, clearError } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();

    // Clear errors when user starts typing
    useEffect(() => {
        if (Object.keys(formErrors).length > 0) {
            setFormErrors({});
        }
        if (error) {
            clearError();
        }
    }, [formData, error, clearError]);

    // Calculate password strength
    useEffect(() => {
        const password = formData.password;
        let strength = 0;

        if (password.length >= 6) strength += 1;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        setPasswordStrength(strength);
    }, [formData.password]);

    const validateForm = () => {
        const errors = {};

        // Name validation
        if (!formData.name) {
            errors.name = 'Họ và tên là bắt buộc';
        } else if (formData.name.length < 2) {
            errors.name = 'Họ và tên phải có ít nhất 2 ký tự';
        }

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

        // Confirm password validation
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
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
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (standalone) {
                navigate('/');
            }
        } catch (err) {
            // Error is handled by context
            console.error('Registration failed:', err);
        }
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
            case 1: return 'Yếu';
            case 2: return 'Trung bình';
            case 3: return 'Mạnh';
            case 4:
            case 5: return 'Rất mạnh';
            default: return '';
        }
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
            case 1: return '#e53e3e';
            case 2: return '#dd6b20';
            case 3: return '#38a169';
            case 4:
            case 5: return '#25a162';
            default: return '#e2e8f0';
        }
    };

    return (
        <div className={`register-form-container ${standalone ? 'standalone' : ''}`}>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-header">
                    <h2>Đăng ký</h2>
                    <p>Tạo tài khoản mới để bắt đầu!</p>
                </div>

                {error && (
                    <div className="error-message">
                        <i className="error-icon">⚠️</i>
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="name">Họ và tên</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Nhập họ và tên của bạn"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={formErrors.name ? 'error' : ''}
                            autoComplete="name"
                        />
                        <i className="input-icon">👤</i>
                    </div>
                    {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                </div>

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
                            autoComplete="new-password"
                        />
                        <i className="input-icon">🔒</i>
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => togglePasswordVisibility('password')}
                            tabIndex={-1}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    {formData.password && (
                        <div className="password-strength">
                            <div className="strength-bar">
                                <div
                                    className="strength-fill"
                                    style={{
                                        width: `${(passwordStrength / 5) * 100}%`,
                                        backgroundColor: getPasswordStrengthColor()
                                    }}
                                ></div>
                            </div>
                            <span
                                className="strength-text"
                                style={{ color: getPasswordStrengthColor() }}
                            >
                                Độ mạnh: {getPasswordStrengthText()}
                            </span>
                        </div>
                    )}
                    {formErrors.password && <span className="field-error">{formErrors.password}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                    <div className="input-wrapper">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Nhập lại mật khẩu của bạn"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={formErrors.confirmPassword ? 'error' : ''}
                            autoComplete="new-password"
                        />
                        <i className="input-icon">🔓</i>
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    {formErrors.confirmPassword && <span className="field-error">{formErrors.confirmPassword}</span>}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="loading-spinner"></span>
                            Đang đăng ký...
                        </>
                    ) : (
                        'Đăng ký'
                    )}
                </button>

                <div className="form-footer">
                    <p>
                        Đã có tài khoản?{' '}
                        {onSwitchToLogin ? (
                            <button
                                type="button"
                                className="switch-link"
                                onClick={onSwitchToLogin}
                            >
                                Đăng nhập ngay
                            </button>
                        ) : (
                            <Link to="/login" className="switch-link">Đăng nhập ngay</Link>
                        )}
                    </p>
                </div>

                {/* <div className="terms">
                    <p>
                        Bằng việc đăng ký, bạn đồng ý với{' '}
                        <Link to="/terms" className="terms-link">Điều khoản sử dụng</Link>
                        {' '}và{' '}
                        <Link to="/privacy" className="terms-link">Chính sách bảo mật</Link>
                        {' '}của chúng tôi.
                    </p>
                </div> */}
            </form>
        </div>
    );
};

export default RegisterForm;
