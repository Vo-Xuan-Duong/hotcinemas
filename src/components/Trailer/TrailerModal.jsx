import React from 'react';
import './TrailerModal.css';

const TrailerModal = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="trailer-modal-overlay" onClick={onClose}>
      <div className="trailer-modal" onClick={e => e.stopPropagation()}>
        <button className="trailer-modal-close" onClick={onClose}>&times;</button>
        <h2 className="trailer-modal-title">Trailer: {movieTitle}</h2>
        <div className="trailer-video-container">
          <iframe
            className="trailer-video"
            src={trailerUrl}
            title={movieTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal; 