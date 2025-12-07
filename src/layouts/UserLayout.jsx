import React, { useEffect } from 'react';
import { Layout, BackTop } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AuthModal from '../components/Auth/AuthModal';
import { Outlet } from 'react-router-dom';
import { TrailerModalProvider } from '../context/TrailerModalContext';
import { AuthModalProvider, useAuthModal } from '../context/AuthModalContext';
import { setAuthErrorCallback } from '../utils/apiClient';
import ScrollToTop from '../components/ScrollToTop';

const { Content } = Layout;

const UserLayoutContent = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal } = useAuthModal();
  const location = useLocation();

  // Setup 401 auto-open modal handler
  useEffect(() => {
    const handleAuthError = (error) => {
      console.log('Auth error detected, opening login modal...', error);
      // Lưu đường dẫn hiện tại để redirect sau khi đăng nhập
      openAuthModal('login', location.pathname);
    };

    // Register callback
    setAuthErrorCallback(handleAuthError);

    // Cleanup
    return () => {
      setAuthErrorCallback(null);
    };
  }, [openAuthModal, location.pathname]);

  return (
    <TrailerModalProvider>
      <ScrollToTop />
      <Layout className="user-layout">
        <Header />
        <Content className="main-content">
          <Outlet />
        </Content>
        <Footer />

        {/* Global Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          initialMode={authModalMode}
        />

        {/* Global Back to Top - Only shows when scrolled down */}
        <BackTop
          visibilityHeight={200}
          style={{
            right: 24,
            bottom: 24,
            transition: 'all 0.3s ease',
          }}
          duration={500}
        >
          <div
            style={{
              height: 50,
              width: 50,
              lineHeight: '50px',
              borderRadius: '50%',
              backgroundColor: '#ff6b35',
              color: '#fff',
              textAlign: 'center',
              fontSize: '20px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 20px rgba(255, 107, 53, 0.4)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: 1,
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1) translateY(-2px)';
              e.target.style.boxShadow = '0 8px 30px rgba(255, 107, 53, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(255, 107, 53, 0.4)';
            }}
          >
            <ArrowUpOutlined />
          </div>
        </BackTop>
      </Layout>
    </TrailerModalProvider>
  );
};

const UserLayout = () => {
  return (
    <AuthModalProvider>
      <UserLayoutContent />
    </AuthModalProvider>
  );
};

export default UserLayout; 