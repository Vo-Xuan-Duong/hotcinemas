import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageTransition from './PageTransition';
import './RouteTransition.css';

const RouteTransition = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionType, setTransitionType] = useState('cinema');
  const [loadingMessage, setLoadingMessage] = useState('');

  // Determine transition type and message based on route
  const getTransitionConfig = (pathname) => {
    if (pathname === '/' || pathname === '/home') {
      return { type: 'cinema', message: 'Đang tải trang chủ...' };
    } else if (pathname.startsWith('/movies')) {
      return { type: 'movie', message: 'Đang tải danh sách phim...' };
    } else if (pathname.startsWith('/cinemas')) {
      return { type: 'ticket', message: 'Đang tải thông tin rạp...' };
    } else if (pathname.startsWith('/booking') || pathname.startsWith('/history')) {
      return { type: 'ticket', message: 'Đang tải thông tin đặt vé...' };
    } else if (pathname.startsWith('/profile')) {
      return { type: 'modern', message: 'Đang tải hồ sơ...' };
    } else {
      return { type: 'modern', message: 'Đang tải trang...' };
    }
  };

  useEffect(() => {
    const config = getTransitionConfig(location.pathname);
    setTransitionType(config.type);
    setLoadingMessage(config.message);
    
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      
      const hideTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Short delay to ensure smooth transition
      
      return () => clearTimeout(hideTimer);
    }, 800); // Transition duration
    
    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  return (
    <div className="route-transition-container">
      <div className={`page-content ${isTransitioning ? 'transitioning' : 'visible'}`}>
        {displayChildren}
      </div>
      
      <PageTransition 
        loading={isTransitioning}
        type={transitionType}
        message={loadingMessage}
      />
    </div>
  );
};

export default RouteTransition;
