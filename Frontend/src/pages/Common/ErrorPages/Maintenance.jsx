import React from 'react';
import './ErrorPages.css';

const Maintenance = () => (
  <div className="error-page">
    <div className="error-illustration">
      <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100" fill="#fff9c4"/>
        <rect x="70" y="110" width="60" height="20" rx="8" fill="#fffde7"/>
        <rect x="90" y="80" width="20" height="40" rx="6" fill="#fbc02d"/>
        <rect x="80" y="70" width="40" height="10" rx="5" fill="#fbc02d"/>
      </svg>
    </div>
    <h1 className="error-title">Bảo trì</h1>
    <p className="error-message">Hệ thống đang được bảo trì.<br/>Vui lòng quay lại sau ít phút nữa.</p>
    <a className="error-home-btn" href="/">Quay về trang chủ</a>
  </div>
);

export default Maintenance; 