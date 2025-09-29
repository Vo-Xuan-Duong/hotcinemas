import React, { useState, useEffect } from 'react';
import {
  Spin,
  BackTop,
  FloatButton,
  Tour
} from 'antd';
import {
  ArrowUpOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import HeroModern from '../../../components/HeroSection/HeroModern';
import MovieShowcaseAntd from '../../../components/MovieShowcase/MovieShowcaseAntd';
import FeaturedContentAntd from '../../../components/FeaturedContent/FeaturedContentAntd';
import FeaturesSection from '../../../components/FeaturesSection/FeaturesSection';
import './HomeModern.css';
import moviesData from '../../../data/movies.json';

const HomeModern = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [tourOpen, setTourOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Process movies data
      const processedMovies = moviesData.map((movie, index) => ({
        ...movie,
        id: movie.id || index + 1,
        poster: movie.poster || `https://picsum.photos/300/450?random=${index}`,
        backdrop: movie.backdrop || movie.poster || `https://picsum.photos/1200/800?random=${index}`,
        rating: movie.rating || (Math.random() * 3 + 7).toFixed(1),
        overview: movie.overview || `Một bộ phim tuyệt vời với cốt truyện hấp dẫn và diễn xuất xuất sắc từ dàn diễn viên tài năng.`,
        genre: movie.genre || ['Hành động', 'Phiêu lưu'][Math.floor(Math.random() * 2)],
        ageLabel: movie.ageLabel || ['13+', '16+', '18+'][Math.floor(Math.random() * 3)],
      }));

      setMovies(processedMovies);
      setLoading(false);
    };

    loadData();
  }, []);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter movies by categories
  const currentYear = new Date().getFullYear();
  const upcomingMovies = movies.filter(m => {
    if (m.releaseDate) {
      const year = m.releaseDate.includes('.')
        ? Number(m.releaseDate.split('.')[2])
        : new Date(m.releaseDate).getFullYear();
      return year >= currentYear;
    }
    return false;
  });

  const heroMovies = upcomingMovies.length > 0 ? upcomingMovies : movies;
  const nowShowingMovies = movies.filter(m => {
    if (m.releaseDate) {
      const year = m.releaseDate.includes('.')
        ? Number(m.releaseDate.split('.')[2])
        : new Date(m.releaseDate).getFullYear();
      return year <= currentYear;
    }
    return true;
  });

  const topRatedMovies = movies
    .filter(m => parseFloat(m.rating) >= 8.0)
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));

  if (loading) {
    return (
      <div className="home-loading-modern">
        <Spin
          size="large"
          tip="Đang tải nội dung..."
          className="loading-spinner-modern"
        >
          <div className="loading-placeholder" />
        </Spin>
      </div>
    );
  }

  return (
    <div className="home-modern">
      {/* Hero Section */}
      <section className="hero-section-modern">
        <HeroModern movies={heroMovies} />
      </section>

      {/* Upcoming Movies */}
      <section className="showcase-section-modern">
        <MovieShowcaseAntd
          movies={upcomingMovies}
          title="🔥 Phim sắp chiếu"
          loading={loading}
          showFilters={true}
        />
      </section>

      {/* Now Showing Section */}
      <section className="showcase-section-modern">
        <MovieShowcaseAntd
          movies={nowShowingMovies}
          title="🎬 Phim đang chiếu hot"
          loading={loading}
          showFilters={true}
        />
      </section>

      {/* Top Rated Movies */}
      <section className="showcase-section-moder">
        <MovieShowcaseAntd
          movies={topRatedMovies}
          title="⭐ Phim được đánh giá cao"
          loading={loading}
          maxItems={4}
          showFilters={false}
        />
      </section>

      {/* Featured Content Section */}
      <section className="featured-section-modern">
        <FeaturedContentAntd movies={movies} />
      </section>

      {/* Features Section */}
      <section className="features-section-modern">
        <FeaturesSection />
      </section>

      {/* Custom Floating Support Buttons */}
      <div className="custom-floating-support">
        <div className="support-buttons-container">
          <div className="support-button phone-support" onClick={() => window.open('tel:19006420')}>
            <PhoneOutlined />
            <span className="tooltip-text">Hotline: 1900-6420</span>
          </div>
          <div className="support-button chat-support" onClick={() => console.log('Opening chat...')}>
            <MessageOutlined />
            <span className="tooltip-text">Chat trực tuyến</span>
          </div>
        </div>
        <div className="main-support-button">
          <CustomerServiceOutlined />
          <span className="tooltip-text">Hỗ trợ khách hàng</span>
        </div>
      </div>

      {/* Custom Back to Top Button */}
      {showBackToTop && (
        <div
          className="custom-back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUpOutlined />
          <span className="tooltip-text">Lên đầu trang</span>
        </div>
      )}

      {/* Tour for new users */}
      <Tour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={[
          {
            title: 'Chào mừng đến với HotCinemas!',
            description: 'Khám phá những bộ phim hot nhất đang chiếu.',
            target: null,
          },
          {
            title: 'Phim đang chiếu',
            description: 'Xem các phim đang chiếu tại rạp.',
            target: () => document.querySelector('.showcase-section-modern'),
          },
          {
            title: 'Đặt vé nhanh',
            description: 'Click vào phim để xem chi tiết và đặt vé.',
            target: () => document.querySelector('.movie-showcase-card'),
          },
        ]}
      />
    </div>
  );
};

export default HomeModern;
