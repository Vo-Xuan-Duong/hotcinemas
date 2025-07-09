import React from 'react';
import './ErrorPages.css';

const Forbidden = () => (
  <div className="error-page">
    <div className="error-illustration">
      <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100" fill="#ffe0b2"/>
        <rect x="60" y="80" width="80" height="40" rx="12" fill="#fff3e0" stroke="#ff9800" strokeWidth="4"/>
        <rect x="90" y="100" width="20" height="20" rx="5" fill="#ff9800"/>
        <rect x="80" y="70" width="40" height="10" rx="5" fill="#ff9800"/>
      </svg>
    </div>
    <h1 className="error-title">403</h1>
    <p className="error-message">Bạn không có quyền truy cập trang này.<br/>Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.</p>
    <a className="error-home-btn" href="/">Quay về trang chủ</a>
  </div>
);

export default Forbidden; 