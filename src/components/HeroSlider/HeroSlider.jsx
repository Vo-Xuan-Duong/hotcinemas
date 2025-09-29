import React, { useState, useEffect, useRef } from 'react';
import './HeroSlider.css';
import HeroOverlayFeatured from '../HeroOverlayFeatured';

const HeroSlider = ({ movies }) => {
  const [index, setIndex] = useState(0);
  const heroMovies = movies && movies.length > 0 ? movies : [];
  const timerRef = useRef();

  // Chuyển phim theo chỉ số
  const goTo = (newIndex) => {
    if (heroMovies.length === 0) return;
    if (newIndex < 0) setIndex(heroMovies.length - 1);
    else if (newIndex >= heroMovies.length) setIndex(0);
    else setIndex(newIndex);
  };

  // Reset timer khi index thay đổi
  useEffect(() => {
    if (heroMovies.length === 0) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroMovies.length);
    }, 10000);
    return () => clearInterval(timerRef.current);
  }, [index, heroMovies.length]);

  if (heroMovies.length === 0) return null;
  const movie = heroMovies[index];

  return (
    <section
      className="hero hero-bg"
      style={{
        backgroundImage: `url(${movie.poster})`,
      }}
    >
      {index === 0 ? (
        <HeroOverlayFeatured />
      ) : (
        <div className="hero-content">
          <h1>{movie.title}</h1>
          <p className="hero-desc">{movie.description}</p>
          <div className="hero-meta">
            <span><b>Khởi chiếu:</b> {movie.releaseDate}</span> | <span><b>Thể loại:</b> {movie.genre}</span> | <span><b>Thời lượng:</b> {movie.duration}</span>
          </div>
          <button className="cta-button">Đặt vé ngay</button>
        </div>
      )}
      <div className="hero-indicators">
        {heroMovies.map((_, i) => (
          <button
            key={i}
            className={`hero-indicator${i === index ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Chuyển đến phim ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;