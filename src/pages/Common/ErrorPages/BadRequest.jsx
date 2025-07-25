import React from 'react';
import './ErrorPages.css';

const BadRequest = () => (
  <div className="error-page">
    <div className="error-illustration">
      <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100" fill="#e3f2fd"/>
        <rect x="70" y="90" width="60" height="30" rx="10" fill="#fff"/>
        <rect x="90" y="110" width="20" height="10" rx="3" fill="#2196f3"/>
        <rect x="80" y="70" width="40" height="10" rx="5" fill="#2196f3"/>
      </svg>
    </div>
    <h1 className="error-title">400</h1>
    <p className="error-message">Yêu cầu không hợp lệ.<br/>Vui lòng kiểm tra lại thông tin gửi lên.</p>
    <a className="error-home-btn" href="/">Quay về trang chủ</a>
  </div>
);

export default BadRequest; 