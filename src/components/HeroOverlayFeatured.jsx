import React from 'react';
import './HeroOverlayFeatured.css';

const featuredMovies = [
  {
    title: 'Ma Không Đầu',
    date: '17.10.2025',
    genre: 'Kinh Dị, Hài, Giật gân',
    poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    description: 'Một câu chuyện rùng rợn về một hồn ma không đầu ám ảnh một ngôi làng cổ kính...'
  },
  {
    title: 'Doraemon: Nobita và Vùng Đất Mới',
    date: '25.10.2025',
    genre: 'Hoạt hình, Phiêu lưu',
    poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    description: 'Nobita cùng bạn bè khám phá vùng đất mới đầy bí ẩn và thử thách.'
  },
  {
    title: 'Dune: Part Two',
    date: '01.11.2025',
    genre: 'Khoa học viễn tưởng, Hành động',
    poster: 'https://image.tmdb.org/t/p/w500/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg',
    description: 'Cuộc chiến giành quyền lực trên hành tinh cát tiếp tục với những pha hành động mãn nhãn.'
  }
];

const HeroOverlayFeatured = () => (
  <div className="hero-overlay">
    <div className="hero-featured-title">Phim sắp ra mắt đặc sắc</div>
    <div className="hero-featured-list">
      {featuredMovies.map((movie, idx) => (
        <div className="hero-featured-card" key={idx}>
          <img src={movie.poster} alt={movie.title} className="hero-featured-poster" />
          <div className="hero-featured-info">
            <div className="hero-featured-name">{movie.title}</div>
            <div className="hero-featured-date">Khởi chiếu: {movie.date}</div>
            <div className="hero-featured-genre">{movie.genre}</div>
            <div className="hero-featured-desc">{movie.description}</div>
            <button className="hero-featured-btn">Đặt vé ngay</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default HeroOverlayFeatured;
