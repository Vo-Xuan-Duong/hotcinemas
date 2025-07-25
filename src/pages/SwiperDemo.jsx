import React from 'react';
import MovieSlider from '../components/MovieSlider/MovieSlider';
import MovieSliderTest from '../components/MovieSlider/MovieSliderTest';
import { mockMovies } from '../utils/movieData';
import './SwiperDemo.css';

const SwiperDemo = () => {
    const movies = mockMovies;
    const popularMovies = movies.filter(movie => movie.rating >= 8.0);
    const actionMovies = movies.filter(movie => movie.genre.includes('Hành động'));
    const comedyMovies = movies.filter(movie => movie.genre.includes('Hài'));

    const handleShowMore = (category) => {
        console.log(`Show more ${category} movies`);
        // Implement navigation to category page
    };

    return (
        <div className="swiper-demo">
            <div className="demo-header">
                <h1>MovieSlider với Swiper Carousel Demo</h1>
                <p>Giao diện mượt mà với hiệu ứng chuyển động đẹp mắt</p>
            </div>

            <div className="demo-content">
                <h3>Test Version (Simple)</h3>
                <MovieSliderTest
                    movies={popularMovies}
                    title="🏆 Phim Nổi Bật (Test)"
                    showMoreButton={true}
                    onShowMore={() => handleShowMore('popular')}
                />

                <h3>Production Version</h3>
                <MovieSlider
                    movies={actionMovies}
                    title="💥 Phim Hành Động"
                    showMoreButton={true}
                    onShowMore={() => handleShowMore('action')}
                />

                <MovieSlider
                    movies={comedyMovies}
                    title="😄 Phim Hài"
                    showMoreButton={true}
                    onShowMore={() => handleShowMore('comedy')}
                />

                <MovieSlider
                    movies={movies}
                    title="🎬 Tất Cả Phim"
                    showMoreButton={true}
                    onShowMore={() => handleShowMore('all')}
                />
            </div>

            <div className="demo-features">
                <h2>🚀 Tính Năng Mới</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>🎨 Giao Diện Mượt Mà</h3>
                        <p>Sử dụng Swiper.js với hiệu ứng chuyển động mượt mà</p>
                    </div>
                    <div className="feature-card">
                        <h3>📱 Responsive</h3>
                        <p>Tự động điều chỉnh số lượng slide theo kích thước màn hình</p>
                    </div>
                    <div className="feature-card">
                        <h3>⚡ Auto Play</h3>
                        <p>Tự động chuyển slide với khả năng tạm dừng khi hover</p>
                    </div>
                    <div className="feature-card">
                        <h3>🎯 Touch Support</h3>
                        <p>Hỗ trợ vuốt trên thiết bị di động</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwiperDemo;
