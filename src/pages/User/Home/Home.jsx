import React from 'react';
import MovieCard from '../../../components/MovieCard/MovieCard';
import HeroSlider from '../../../components/HeroSlider/HeroSlider';
import MovieSlider from '../../../components/MovieSlider/MovieSlider';
import FeaturedComments from '../../../components/FeaturedComments/FeaturedComments';
import FeaturesSection from '../../../components/FeaturesSection/FeaturesSection';
import './Home.css';
import moviesData from '../../../data/movies.json';

const Home = () => {
  // Dữ liệu mẫu cho phim
  const movies = moviesData;

  // Lọc phim sắp chiếu (releaseDate >= năm hiện tại)
  const currentYear = new Date().getFullYear();
  const upcomingMovies = movies.filter(m => Number(m.releaseDate.split('.')[2]) >= currentYear);
  // Nếu không có phim sắp chiếu, fallback sang tất cả phim
  const heroMovies = upcomingMovies.length > 0 ? upcomingMovies : movies;

  return (
    <div className="home">
      {/* Hero Section */}
      <HeroSlider movies={heroMovies} />

      {/* Movies Section */}
      <MovieSlider movies={movies} title="Phim đang chiếu" showMoreButton={true} onShowMore={() => alert('Xem thêm phim đang chiếu')} />

      {/* Movies Section */}
      <MovieSlider movies={movies} title="Phim sắp chiếu" showMoreButton={true} onShowMore={() => alert('Xem thêm phim sắp chiếu')} />

      {/* Featured Comments Section */}
      <FeaturedComments />

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
};

export default Home; 