import React, { useState } from 'react';
import MovieSlider from '../components/MovieSlider/MovieSlider';

// Enhanced mock data for scrolling demo
const scrollDemoMovies = [
    { id: 1, title: "The Dark Knight", poster: "https://via.placeholder.com/300x450/1a1a2e/ffffff?text=The+Dark+Knight", trailer: "https://youtube.com/watch?v=test1" },
    { id: 2, title: "Inception", poster: "https://via.placeholder.com/300x450/16213e/ffffff?text=Inception", trailer: "https://youtube.com/watch?v=test2" },
    { id: 3, title: "Interstellar", poster: "https://via.placeholder.com/300x450/0f3460/ffffff?text=Interstellar", trailer: "https://youtube.com/watch?v=test3" },
    { id: 4, title: "Tenet", poster: "https://via.placeholder.com/300x450/533483/ffffff?text=Tenet", trailer: "https://youtube.com/watch?v=test4" },
    { id: 5, title: "Dunkirk", poster: "https://via.placeholder.com/300x450/7209b7/ffffff?text=Dunkirk", trailer: "https://youtube.com/watch?v=test5" },
    { id: 6, title: "Batman Begins", poster: "https://via.placeholder.com/300x450/a663cc/ffffff?text=Batman+Begins", trailer: "https://youtube.com/watch?v=test6" },
    { id: 7, title: "The Prestige", poster: "https://via.placeholder.com/300x450/4ea5d9/ffffff?text=The+Prestige", trailer: "https://youtube.com/watch?v=test7" },
    { id: 8, title: "Memento", poster: "https://via.placeholder.com/300x450/006ba6/ffffff?text=Memento", trailer: "https://youtube.com/watch?v=test8" },
    { id: 9, title: "Insomnia", poster: "https://via.placeholder.com/300x450/0496c7/ffffff?text=Insomnia", trailer: "https://youtube.com/watch?v=test9" },
    { id: 10, title: "Following", poster: "https://via.placeholder.com/300x450/5390d9/ffffff?text=Following", trailer: "https://youtube.com/watch?v=test10" },
];

const ScrollDemo = () => {
    const [currentDemo, setCurrentDemo] = useState('enhanced');

    return (
        <div style={{
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            padding: '2rem 0'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>

                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '2.5rem 2rem',
                    borderRadius: '20px',
                    color: 'white'
                }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        margin: '0 0 1rem 0',
                        textShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}>
                        🎬 Enhanced Movie Scrolling
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        opacity: '0.9',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: '1.5'
                    }}>
                        Trải nghiệm cuộn phim mượt mà với mouse wheel, keyboard navigation, và touch gestures
                    </p>
                </div>

                {/* Features Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem'
                }}>
                    {[
                        { icon: '🖱️', title: 'Mouse Wheel Scrolling', desc: 'Cuộn chuột để duyệt qua các bộ phim' },
                        { icon: '⌨️', title: 'Keyboard Navigation', desc: 'Sử dụng phím mũi tên, Home, End' },
                        { icon: '👆', title: 'Touch & Swipe', desc: 'Vuốt trên mobile và tablet' },
                        { icon: '📊', title: 'Progress Indicators', desc: 'Thanh tiến trình và số lượng phim' },
                        { icon: '🎯', title: 'Smart Scrolling', desc: 'Cuộn thông minh theo từng slide' },
                        { icon: '♿', title: 'Accessibility', desc: 'Hỗ trợ screen reader và ARIA' }
                    ].map((feature, index) => (
                        <div key={index} style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                            border: '1px solid rgba(102, 126, 234, 0.1)',
                            transition: 'transform 0.2s ease'
                        }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                            <h3 style={{
                                color: '#333',
                                margin: '0 0 0.5rem 0',
                                fontSize: '1.1rem',
                                fontWeight: '600'
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{
                                color: '#666',
                                margin: '0',
                                fontSize: '0.9rem',
                                lineHeight: '1.4'
                            }}>
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Demo Section */}
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        color: '#1a1a1a',
                        marginBottom: '1rem',
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        textAlign: 'center'
                    }}>
                        🚀 Thử nghiệm tính năng cuộn
                    </h2>

                    {/* Instructions */}
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}>
                        <h3 style={{ margin: '0 0 1rem 0', color: '#333', fontSize: '1.1rem' }}>
                            📋 Hướng dẫn sử dụng:
                        </h3>
                        <ul style={{
                            margin: '0',
                            paddingLeft: '1.5rem',
                            color: '#555',
                            lineHeight: '1.6'
                        }}>
                            <li><strong>🖱️ Mouse:</strong> Đưa chuột vào slider và cuộn lên/xuống để duyệt phim</li>
                            <li><strong>⌨️ Keyboard:</strong> Click vào slider, dùng ← → để điều hướng, Home/End để đến đầu/cuối</li>
                            <li><strong>👆 Touch:</strong> Vuốt trái/phải trên mobile hoặc tablet</li>
                            <li><strong>🔘 Buttons:</strong> Click nút Previous/Next hoặc dùng progress bar</li>
                        </ul>
                    </div>
                </div>

                {/* Enhanced Movie Slider Demo */}
                <MovieSlider
                    movies={scrollDemoMovies}
                    title="🎯 Enhanced Scrolling Experience"
                    showMoreButton={true}
                    onShowMore={() => alert('🎉 Tính năng "Xem thêm" với enhanced scrolling!')}
                />

                {/* Additional demos */}
                <div style={{ marginTop: '3rem' }}>
                    <MovieSlider
                        movies={scrollDemoMovies.slice(0, 6)}
                        title="🎮 Interactive Movie Collection"
                        showMoreButton={false}
                    />
                </div>

                {/* Tips Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '16px',
                    marginTop: '3rem',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>
                        💡 Mẹo sử dụng
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginTop: '1.5rem'
                    }}>
                        <div style={{ opacity: '0.9' }}>
                            <strong>🎯 Focus:</strong> Click vào slider để kích hoạt keyboard navigation
                        </div>
                        <div style={{ opacity: '0.9' }}>
                            <strong>⚡ Speed:</strong> Cuộn nhanh để chuyển nhiều slide cùng lúc
                        </div>
                        <div style={{ opacity: '0.9' }}>
                            <strong>📱 Mobile:</strong> Vuốt mạnh để cuộn nhanh hơn
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollDemo;
