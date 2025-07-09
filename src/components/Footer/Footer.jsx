import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>HotCinemas</h3>
          <p>Hệ thống rạp chiếu phim hàng đầu Việt Nam</p>
          <div className="social-links">
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">📷</a>
            <a href="#" className="social-link">🐦</a>
            <a href="#" className="social-link">📺</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Thông tin</h4>
          <ul className="footer-links">
            <li><a href="/about">Về chúng tôi</a></li>
            <li><a href="/careers">Tuyển dụng</a></li>
            <li><a href="/press">Báo chí</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Hỗ trợ</h4>
          <ul className="footer-links">
            <li><a href="/help">Trung tâm trợ giúp</a></li>
            <li><a href="/faq">Câu hỏi thường gặp</a></li>
            <li><a href="/terms">Điều khoản sử dụng</a></li>
            <li><a href="/privacy">Chính sách bảo mật</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Liên hệ</h4>
          <div className="contact-info">
            <p>📞 1900-xxxx</p>
            <p>📧 info@hotcinemas.vn</p>
            <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; 2024 HotCinemas. Tất cả quyền được bảo lưu.</p>
          <div className="payment-methods">
            <span>💳</span>
            <span>🏦</span>
            <span>📱</span>
            <span>💸</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 