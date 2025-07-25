import React, { useState } from 'react';
import MovieSlider from '../components/MovieSlider/MovieSlider';
import MovieSliderAdvanced from '../components/MovieSlider/MovieSliderAdvanced';
import MovieSliderEnhanced from '../components/MovieSlider/MovieSliderEnhanced';

// Mock data for testing
const mockMovies = [
    {
        id: 1,
        title: "Avengers: Endgame",
        poster: "https://via.placeholder.com/300x450/FF6B6B/FFFFFF?text=Movie+1",
        trailer: "https://youtube.com/watch?v=test1",
        rating: 8.4,
        year: 2019
    },
    {
        id: 2,
        title: "Spider-Man: No Way Home",
        poster: "https://via.placeholder.com/300x450/4ECDC4/FFFFFF?text=Movie+2",
        trailer: "https://youtube.com/watch?v=test2",
        rating: 8.2,
        year: 2021
    },
    {
        id: 3,
        title: "The Batman",
        poster: "https://via.placeholder.com/300x450/45B7D1/FFFFFF?text=Movie+3",
        trailer: "https://youtube.com/watch?v=test3",
        rating: 7.8,
        year: 2022
    },
    {
        id: 4,
        title: "Top Gun: Maverick",
        poster: "https://via.placeholder.com/300x450/96CEB4/FFFFFF?text=Movie+4",
        trailer: "https://youtube.com/watch?v=test4",
        rating: 8.3,
        year: 2022
    },
    {
        id: 5,
        title: "Doctor Strange 2",
        poster: "https://via.placeholder.com/300x450/FECA57/FFFFFF?text=Movie+5",
        trailer: "https://youtube.com/watch?v=test5",
        rating: 7.0,
        year: 2022
    },
    {
        id: 6,
        title: "Black Panther 2",
        poster: "https://via.placeholder.com/300x450/FF9FF3/FFFFFF?text=Movie+6",
        trailer: "https://youtube.com/watch?v=test6",
        rating: 7.5,
        year: 2022
    },
    {
        id: 7,
        title: "Avatar 2",
        poster: "https://via.placeholder.com/300x450/54A0FF/FFFFFF?text=Movie+7",
        trailer: "https://youtube.com/watch?v=test7",
        rating: 8.1,
        year: 2022
    }
];

const CarouselDemo = () => {
    const [isLoading, setIsLoading] = useState(false);

    const simulateLoading = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div style={{ backgroundColor: '#fafbfc', minHeight: '100vh', paddingTop: '2rem' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
                {/* Hero Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '4rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '3rem 2rem',
                    borderRadius: '24px',
                    color: 'white'
                }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        margin: '0 0 1rem 0',
                        textShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}>
                        🎬 Movie Slider Showcase
                    </h1>
                    <p style={{
                        fontSize: '1.3rem',
                        opacity: '0.9',
                        maxWidth: '600px',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        Khám phá các phiên bản carousel được cải tiến với giao diện hiện đại và trải nghiệm mượt mà
                    </p>
                    <button
                        onClick={simulateLoading}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            padding: '0.8rem 2rem',
                            borderRadius: '50px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.3)';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.2)';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        🔄 Test Loading State
                    </button>
                </div>

                {/* Enhanced MovieSlider - Premium Version */}
                <div style={{ marginBottom: '5rem' }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{
                            color: '#1a1a1a',
                            marginBottom: '0.5rem',
                            fontSize: '1.8rem',
                            fontWeight: '700'
                        }}>
                            ✨ Enhanced MovieSlider - Premium Edition
                        </h2>
                        <p style={{ color: '#666', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
                            Phiên bản cao cấp với progress bar, skeleton loading, enhanced animations và responsive tối ưu
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                            marginBottom: '1rem'
                        }}>
                            {['Progress Bar', 'Skeleton Loading', 'Enhanced Animations', 'Backdrop Blur', 'Auto-optimization'].map(feature => (
                                <span key={feature} style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: '500'
                                }}>
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                    <MovieSliderEnhanced
                        movies={mockMovies}
                        title="🚀 Premium Experience"
                        showMoreButton={true}
                        isLoading={isLoading}
                        onShowMore={() => alert('Enhanced "Xem thêm" - Premium features activated!')}
                    />
                </div>

                {/* Basic MovieSlider - Improved */}
                <div style={{ marginBottom: '5rem' }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{
                            color: '#1a1a1a',
                            marginBottom: '0.5rem',
                            fontSize: '1.8rem',
                            fontWeight: '700'
                        }}>
                            🎯 Basic MovieSlider - Improved
                        </h2>
                        <p style={{ color: '#666', margin: '0', fontSize: '1.1rem' }}>
                            Phiên bản cơ bản đã được cải tiến với giao diện mới, animations mượt mà và responsive design
                        </p>
                    </div>
                    <MovieSlider
                        movies={mockMovies}
                        title="🎬 Phim mới nhất - Enhanced UI"
                        showMoreButton={true}
                        onShowMore={() => alert('Basic "Xem thêm" với giao diện mới!')}
                    />
                </div>

                {/* Advanced MovieSlider */}
                <div style={{ marginBottom: '5rem' }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{
                            color: '#1a1a1a',
                            marginBottom: '0.5rem',
                            fontSize: '1.8rem',
                            fontWeight: '700'
                        }}>
                            🔥 Advanced MovieSlider - Autoplay + Dots
                        </h2>
                        <p style={{ color: '#666', margin: '0', fontSize: '1.1rem' }}>
                            Component nâng cao với autoplay, custom dots và enhanced hover effects
                        </p>
                    </div>
                    <MovieSliderAdvanced
                        movies={mockMovies.slice(0, 6)}
                        title="⭐ Phim đề xuất - Advanced Features"
                        autoplay={true}
                        autoplaySpeed={3500}
                        showDots={true}
                        infinite={true}
                        showMoreButton={true}
                        onShowMore={() => alert('Advanced "Xem thêm" với tất cả tính năng!')}
                    />
                </div>

                {/* Features Summary */}
                <div style={{
                    backgroundColor: '#fff',
                    padding: '3rem 2rem',
                    borderRadius: '20px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    marginBottom: '3rem'
                }}>
                    <h3 style={{
                        color: '#333',
                        marginBottom: '2rem',
                        fontSize: '2rem',
                        fontWeight: '700',
                        textAlign: 'center'
                    }}>
                        🎉 Tính năng đã triển khai
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            { icon: '⚡', title: 'React Slick Integration', desc: 'Carousel chuyên nghiệp và mượt mà' },
                            { icon: '📱', title: 'Responsive Design', desc: '4→3→2→1 movies theo kích thước màn hình' },
                            { icon: '🎨', title: 'Enhanced UI/UX', desc: 'Giao diện hiện đại với animations đẹp mắt' },
                            { icon: '🔄', title: 'Autoplay & Controls', desc: 'Tự động chuyển slide với điều khiển linh hoạt' },
                            { icon: '💫', title: 'Loading States', desc: 'Skeleton loading và progress indicators' },
                            { icon: '🎯', title: 'Performance Optimized', desc: 'Lazy loading và smooth transitions' }
                        ].map((feature, index) => (
                            <div key={index} style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                borderRadius: '12px',
                                textAlign: 'center',
                                border: '1px solid rgba(102, 126, 234, 0.1)'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                                <h4 style={{
                                    color: '#333',
                                    margin: '0 0 0.5rem 0',
                                    fontSize: '1.1rem',
                                    fontWeight: '600'
                                }}>
                                    {feature.title}
                                </h4>
                                <p style={{
                                    color: '#666',
                                    margin: '0',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.4'
                                }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack */}
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px',
                    color: 'white'
                }}>
                    <p style={{
                        margin: '0',
                        fontSize: '1.1rem',
                        opacity: '0.9'
                    }}>
                        🔧 <strong>Tech Stack:</strong> React + React-Slick + Modern CSS + Responsive Design<br />
                        📱 <strong>Cross-Platform:</strong> Desktop, Tablet, Mobile với touch support<br />
                        ⚡ <strong>Performance:</strong> Optimized animations và smooth user experience
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CarouselDemo;