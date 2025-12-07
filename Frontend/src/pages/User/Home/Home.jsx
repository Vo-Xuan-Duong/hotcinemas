import React, { useState, useEffect } from 'react';
import {
  Spin,
  BackTop,
  FloatButton,
  Tour
} from 'antd';
import {
  ArrowUpOutlined
} from '@ant-design/icons';
import HeroModern from '../../../components/HeroSection/HeroModern';
import MovieShowcase from '../../../components/MovieShowcase/MovieShowcase';
import FeaturedContent from '../../../components/FeaturedContent/FeaturedContent';
import FeaturesSection from '../../../components/FeaturesSection/FeaturesSection';
import './Home.css';
import movieService from '../../../services/movieService';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [tourOpen, setTourOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all movie categories in parallel
        const [allMoviesData, upcomingData, nowShowingData, topRatedData] = await Promise.all([
          movieService.getAllMovies({ size: 20 }), // Returns Page object
          movieService.getComingSoon({ size: 12 }), // Returns array only
          movieService.getNowShowing({ size: 12 }), // Returns array only
          movieService.getTopRated({ size: 10 })    // Returns array only
        ]);

        // Process all movies - handle both Page object and array
        const processMovies = (data) => {
          const items = Array.isArray(data) ? data : (data?.content || []);
          return items.map((m, index) => ({
            ...m,
            id: m.id ?? m._id ?? index + 1,
            poster: m.posterPath || m.posterUrl || '/vite.svg',
            backdrop: m.backdropPath || m.backdropUrl || m.poster || m.posterUrl || '/vite.svg',
            rating: m.rating ?? m.voteAverage ?? 0,
          }));
        };

        console.log('Fetched movie data:', { allMoviesData, upcomingData, nowShowingData, topRatedData });

        setMovies(processMovies(allMoviesData));
        setUpcomingMovies(processMovies(upcomingData));
        setNowShowingMovies(processMovies(nowShowingData));
        setTopRatedMovies(processMovies(topRatedData));
      } catch (err) {
        console.error('Failed to load movies from API', err);
      } finally {
        setLoading(false);
      }
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

  // Use upcoming movies for hero, fallback to all movies if empty
  const heroMovies = upcomingMovies.length > 0 ? upcomingMovies : movies;

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
        <MovieShowcase
          movies={upcomingMovies}
          title="🔥 Phim sắp chiếu"
          loading={loading}
          showFilters={true}
          category="upcoming"
        />
      </section>

      {/* Now Showing Section */}
      <section className="showcase-section-modern">
        <MovieShowcase
          movies={nowShowingMovies}
          title="🎬 Phim đang chiếu hot"
          loading={loading}
          showFilters={true}
          category="now-showing"
        />
      </section>

      {/* Top Rated Movies */}
      <section className="showcase-section-moder">
        <MovieShowcase
          movies={topRatedMovies}
          title="⭐ Phim được đánh giá cao"
          loading={loading}
          // maxItems={4}
          showFilters={false}
          category="top-rated"
        />
      </section>

      {/* Featured Content Section */}
      <section className="featured-section-modern">
        <FeaturedContent movies={movies} />
      </section>

      {/* Features Section */}
      <section className="features-section-modern">
        <FeaturesSection />
      </section>

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

export default Home;
