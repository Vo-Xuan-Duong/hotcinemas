import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import './Auth.css';

const Register = ({ onSwitchToLogin }) => {
  const { register, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setFormError('');
    if (password !== confirmPassword) {
      setFormError('Mật khẩu xác nhận không khớp!');
      return;
    }
    try {
      await register({ name, email, password });
      navigate('/');
    } catch {
      // Không làm gì
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng ký</h2>
        {formError && <div className="error-message">{formError}</div>}
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Họ và tên"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
        <p className="auth-link">
          Đã có tài khoản?{' '}
          {onSwitchToLogin ? (
            <span className="switch-link" onClick={onSwitchToLogin} style={{ color: '#007bff', cursor: 'pointer' }}>Đăng nhập</span>
          ) : (
            <Link to="/login">Đăng nhập</Link>
          )}
        </p>
      </form>
    </div>
  );
};

export default Register; 