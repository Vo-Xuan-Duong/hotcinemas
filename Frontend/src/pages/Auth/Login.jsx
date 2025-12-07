import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  const handleClose = () => {
    // After successful login, redirect to the intended page
    navigate(from);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-page-card">
        <div className="auth-page-brand">
          <h1>🎬 HotCinemas</h1>
        </div>
        <LoginForm
          onSwitchToRegister={handleSwitchToRegister}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default Login; 