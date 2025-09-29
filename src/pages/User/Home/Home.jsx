import React, { useState, useEffect } from 'react';
import { Spin, BackTop } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import HeroAntd from '../../../components/HeroSection/HeroAntd';
import MovieShowcaseAntd from '../../../components/MovieShowcase/MovieShowcaseAntd';
import FeaturedContentAntd from '../../../components/FeaturedContent/FeaturedContentAntd';
import FeaturesSection from '../../../components/FeaturesSection/FeaturesSection';
import './Home.css';
import moviesData from '../../../data/movies.json';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process movies data
      const processedMovies = moviesData.map((movie, index) => ({
        ...movie,
        id: movie.id || index + 1,
        poster: movie.poster || `https://picsum.photos/300/450?random=${index}`,
        backdrop: movie.backdrop || movie.poster || `https://picsum.photos/1200/800?random=${index}`,
        rating: movie.rating || (Math.random() * 3 + 7).toFixed(1),
        overview: movie.overview || `Một bộ phim tuyệt vời với cốt truyện hấp dẫn và diễn xuất xuất sắc từ dàn diễn viên tài năng.`,
      }));
      
      setMovies(processedMovies);
      setLoading(false);
    };

    loadData();
  }, []);

  // Lọc phim sắp chiếu
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

  if (loading) {
    return (
      <div className="home-loading">
        <Spin size="large" tip="Đang tải nội dung...">
          <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }} />
        </Spin>
      </div>
    );
  }

  return (
    <div className="home-antd">
      {/* Hero Section */}
      <HeroAntd movies={heroMovies} />

      {/* Now Showing Movies */}
      <MovieShowcaseAntd 
        movies={nowShowingMovies} 
        title="Phim đang chiếu" 
        loading={loading}
      />

      {/* Featured Content */}
      <FeaturedContentAntd movies={movies} />

      {/* Upcoming Movies */}
      <MovieShowcaseAntd 
        movies={upcomingMovies} 
        title="Phim sắp chiếu" 
        loading={loading}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Back to Top Button */}
      <BackTop 
        style={{
          height: 50,
          width: 50,
          backgroundColor: '#ff6b35',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ArrowUpOutlined style={{ color: 'white', fontSize: '20px' }} />
      </BackTop>
    </div>
  );
};

export default Home; 