import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RegisterForm from '../../components/Auth/RegisterForm';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitchToLogin = () => {
    // Chuyển đến trang đăng nhập, giữ redirect path nếu có
    navigate('/login', { state: { from: location.state?.from } });
  };

  const handleClose = () => {
    // Sau khi đăng ký thành công, chuyển về trang chủ hoặc trang đích
    const from = location.state?.from?.pathname || '/';
    navigate(from);
  };

  const handleSwitchToOTP = (email) => {
    // Chuyển sang màn hình xác thực OTP
    navigate('/verify-otp', { state: { email } });
  };

  return (
    <div className="auth-page-container">
      <div className="auth-page-card">
        <div className="auth-page-brand">
          <h1>🎬 HotCinemas</h1>
        </div>
        <RegisterForm
          onSwitchToLogin={handleSwitchToLogin}
          onSwitchToOTP={handleSwitchToOTP}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default Register; 