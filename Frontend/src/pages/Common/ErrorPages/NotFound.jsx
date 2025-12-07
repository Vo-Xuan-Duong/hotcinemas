import React from 'react';
import './ErrorPages.css';

const NotFound = () => (
  <div className="error-page">
    <div className="error-illustration">
      <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100" fill="#F8D7DA"/>
        <ellipse cx="70" cy="90" rx="15" ry="20" fill="#fff"/>
        <ellipse cx="130" cy="90" rx="15" ry="20" fill="#fff"/>
        <circle cx="70" cy="95" r="5" fill="#222"/>
        <circle cx="130" cy="95" r="5" fill="#222"/>
        <ellipse cx="100" cy="140" rx="35" ry="15" fill="#fff"/>
        <path d="M80 140 Q100 160 120 140" stroke="#222" strokeWidth="3" fill="none"/>
      </svg>
    </div>
    <h1 className="error-title">404</h1>
    <p className="error-message">Không tìm thấy trang bạn yêu cầu.<br/>Có lẽ bạn đã lạc vào vũ trụ song song?</p>
    <a className="error-home-btn" href="/">Quay về trang chủ</a>
  </div>
);

export default NotFound; 