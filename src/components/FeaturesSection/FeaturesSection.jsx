import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => (
  <section className="features-section">
    <div className="container">
      <h2>Tại sao chọn HotCinemas?</h2>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🎬</div>
          <h3>Phim mới nhất</h3>
          <p>Cập nhật những bộ phim bom tấn mới nhất từ Hollywood</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎵</div>
          <h3>Âm thanh chất lượng</h3>
          <p>Hệ thống âm thanh Dolby Atmos cho trải nghiệm tuyệt vời</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🪑</div>
          <h3>Ghế ngồi thoải mái</h3>
          <p>Ghế ngồi cao cấp với khả năng điều chỉnh và sưởi ấm</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Đặt vé dễ dàng</h3>
          <p>Đặt vé online nhanh chóng và thuận tiện</p>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesSection; 