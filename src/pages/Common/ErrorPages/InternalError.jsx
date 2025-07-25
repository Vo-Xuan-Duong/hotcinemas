import React from 'react';
import './ErrorPages.css';

const InternalError = () => (
  <div className="error-page">
    <div className="error-illustration">
      <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100" fill="#ffe0e0"/>
        <ellipse cx="100" cy="120" rx="50" ry="20" fill="#fff"/>
        <rect x="80" y="60" width="40" height="40" rx="10" fill="#ff5252"/>
        <rect x="95" y="75" width="10" height="20" rx="3" fill="#fff"/>
      </svg>
    </div>
    <h1 className="error-title">500</h1>
    <p className="error-message">Có lỗi xảy ra trên máy chủ.<br/>Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
    <a className="error-home-btn" href="/">Quay về trang chủ</a>
  </div>
);

export default InternalError; 