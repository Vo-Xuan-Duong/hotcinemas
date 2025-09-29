import React from 'react';
import { Layout, BackTop } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import HeaderAntd from '../components/Header/HeaderAntd';
import FooterAntd from '../components/Footer/FooterAntd';
import { Outlet } from 'react-router-dom';
import { TrailerModalProvider } from '../context/TrailerModalContext';

const { Content } = Layout;

const UserLayout = () => {
  return (
    <TrailerModalProvider>
      <Layout className="user-layout">
        <HeaderAntd />
        <Content className="main-content">
          <Outlet />
        </Content>
        <FooterAntd />

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

export default UserLayout; 