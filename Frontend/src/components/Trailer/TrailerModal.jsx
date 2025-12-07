import React from 'react';
import './TrailerModal.css';

const TrailerModal = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
  if (!isOpen) return null;

  console.log('TrailerModal render:', { isOpen, trailerUrl, movieTitle });

  return (
    <div className="trailer-modal-overlay" onClick={onClose}>
      <div className="trailer-modal" onClick={e => e.stopPropagation()}>
        <div className="trailer-modal-header">
          <div className="trailer-modal-title-wrapper">
            <div className="trailer-modal-icon">🎬</div>
            <div className="trailer-modal-title-text">
              <h2 className="trailer-modal-title">{movieTitle}</h2>
              <span className="trailer-modal-subtitle">Official Trailer</span>
            </div>
          </div>
          <button className="trailer-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="trailer-video-container">
          {trailerUrl ? (
            <iframe
              className="trailer-video"
              src={trailerUrl.replace('youtube.com', 'youtube-nocookie.com')}
              title={`Trailer ${movieTitle}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            ></iframe>
          ) : (
            <div className="trailer-error">
              <div className="trailer-error-icon">🎬</div>
              <p>Đang tải trailer...</p>
              <span className="trailer-error-hint">Hoặc trailer không khả dụng</span>
            </div>
          )}
        </div>
        <div className="trailer-modal-footer">
          <div className="trailer-controls">
            <button className="trailer-fullscreen-btn" title="Toàn màn hình">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
            <button className="trailer-share-btn" title="Chia sẻ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal; 