import React from 'react';
import './Loading.css';

const Loading = ({ size = 48, text = 'Đang tải...' }) => (
  <div className="loading-container">
    <div className="spinner" style={{ width: size, height: size }}></div>
    {text && <div className="loading-text">{text}</div>}
  </div>
);

export default Loading; 