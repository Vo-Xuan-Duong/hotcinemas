import React from 'react';
import { Spin } from 'antd';
import './PageTransition.css';

const PageTransition = ({ 
  loading = true, 
  type = 'cinema', 
  message = '',
  size = 'default' 
}) => {
  if (!loading) return null;

  const renderLoader = () => {
    switch (type) {
      case 'cinema':
        return (
          <div className="cinema-loader">
            <div className="film-strip">
              <div className="film-hole"></div>
              <div className="film-hole"></div>
              <div className="film-hole"></div>
              <div className="film-hole"></div>
            </div>
            <div className="projector-light"></div>
          </div>
        );
      
      case 'movie':
        return (
          <div className="movie-loader">
            <div className="clapperboard">
              <div className="clapper-top"></div>
              <div className="clapper-bottom"></div>
            </div>
          </div>
        );
      
      case 'ticket':
        return (
          <div className="ticket-loader">
            <div className="ticket">
              <div className="ticket-perforation">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="perf-hole"></div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="modern-loader">
            <div className="spinner-ring">
              <div className="ring-segment"></div>
              <div className="ring-segment"></div>
              <div className="ring-segment"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`page-transition-overlay ${size}`}>
      <div className="transition-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="transition-content">
        <div className="loader-container">
          {renderLoader()}
        </div>
        
        <div className="loading-text">
          <h3 className="loading-title">
            {message || 'Đang tải...'}
          </h3>
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTransition;
