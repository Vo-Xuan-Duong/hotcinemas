import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider } from './context/AuthContext';
import { TrailerModalProvider } from './context/TrailerModalContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AppRouter from './router';
import './App.css';
import 'antd/dist/reset.css';
import './styles/antd-overrides.css';
import './styles/responsive-modern.css';

const AppContent = () => {
  const { theme: currentTheme } = useTheme();

  const antdTheme = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#ff6b35',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      borderRadius: 8,
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      // Dynamic colors based on theme
      colorBgBase: currentTheme === 'dark' ? '#141414' : '#ffffff',
      colorBgContainer: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
      colorBorder: currentTheme === 'dark' ? '#404040' : '#e5e7eb',
      colorText: currentTheme === 'dark' ? '#ffffff' : '#1f2937',
      colorTextSecondary: currentTheme === 'dark' ? '#a3a3a3' : '#6b7280',
      boxShadow: currentTheme === 'dark' ?
        '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)' :
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    components: {
      Button: {
        borderRadius: 8,
        controlHeight: 40,
        fontSize: 14,
        fontWeight: 500,
      },
      Card: {
        borderRadius: 12,
        colorBgContainer: currentTheme === 'dark' ? '#262626' : '#ffffff',
        boxShadow: currentTheme === 'dark' ?
          '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)' :
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      Menu: {
        borderRadius: 8,
        itemBorderRadius: 6,
      },
      Input: {
        borderRadius: 8,
        controlHeight: 40,
      },
    },
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <AuthProvider>
        <TrailerModalProvider>
          <div className="App">
            <AppRouter />
          </div>
        </TrailerModalProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
