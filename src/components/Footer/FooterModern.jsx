import React from 'react';
import './FooterModern.css';

const FooterModern = () => {
  return (
    <footer className="footer-modern">
      <div className="footer-container">
        {/* Top section */}
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="footer-logo">🎬 HotCinemas</h3>
            <p className="footer-description">
              Trải nghiệm điện ảnh đỉnh cao với công nghệ hiện đại và dịch vụ tuyệt vời.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                📘
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                📷
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                📺
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                🐦
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-title">Phim</h4>
              <ul className="footer-list">
                <li><a href="/movies">Đang chiếu</a></li>
                <li><a href="/movies?upcoming=true">Sắp chiếu</a></li>
                <li><a href="/movies?special=true">Suất chiếu đặc biệt</a></li>
                <li><a href="/promotions">Khuyến mãi</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Rạp chiếu</h4>
              <ul className="footer-list">
                <li><a href="/cinemas">Danh sách rạp</a></li>
                <li><a href="/schedule">Lịch chiếu</a></li>
                <li><a href="/booking">Đặt vé</a></li>
                <li><a href="/pricing">Bảng giá vé</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Hỗ trợ</h4>
              <ul className="footer-list">
                <li><a href="/help">Trung tâm trợ giúp</a></li>
                <li><a href="/contact">Liên hệ</a></li>
                <li><a href="/feedback">Góp ý</a></li>
                <li><a href="/faq">Câu hỏi thường gặp</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Thông tin</h4>
              <ul className="footer-list">
                <li><a href="/about">Giới thiệu</a></li>
                <li><a href="/careers">Tuyển dụng</a></li>
                <li><a href="/news">Tin tức</a></li>
                <li><a href="/blog">Blog</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2024 HotCinemas. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="footer-legal">
              <a href="/privacy">Chính sách bảo mật</a>
              <a href="/terms">Điều khoản sử dụng</a>
              <a href="/cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterModern;
