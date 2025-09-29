import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Input, Badge, Drawer, notification, Tooltip } from 'antd';
import {
    HomeOutlined,
    VideoCameraOutlined,
    CalendarOutlined,
    ShopOutlined,
    SearchOutlined,
    UserOutlined,
    LogoutOutlined,
    HistoryOutlined,
    MenuOutlined,
    BellOutlined,
    BulbFilled
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { useTheme } from '../../context/ThemeContext';
import AuthModalAntd from '../Auth/AuthModalAntd';
import './HeaderAntd.css';

const { Header } = Layout;
const { Search } = Input;

const HeaderAntd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login');
    const [current, setCurrent] = useState('/');
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3);

    // Update current menu item based on location
    useEffect(() => {
        const path = location.pathname;
        if (path === '/') {
            setCurrent('/');
        } else if (path.startsWith('/movies')) {
            setCurrent('/movies');
        } else if (path.startsWith('/schedule')) {
            setCurrent('/schedule');
        } else if (path.startsWith('/cinemas')) {
            setCurrent('/cinemas');
        } else {
            setCurrent('');
        }
    }, [location]);

    // Mock data for notifications
    useEffect(() => {
        // Set notification count based on auth status
        if (isAuthenticated) {
            setNotificationCount(3); // Mock notification count for logged in users
        } else {
            setNotificationCount(0); // No notifications for guests
        }
    }, [isAuthenticated]); const openAuthModal = (mode) => {
        setAuthModalMode(mode);
        setShowAuthModal(true);
    };

    const closeAuthModal = () => {
        setShowAuthModal(false);
    };

    const handleLogout = () => {
        logout();
    };

    const onClick = (e) => {
        setCurrent(e.key);
        navigate(e.key);
        setMobileMenuVisible(false); // Close mobile menu after navigation
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ cá nhân',
            onClick: () => navigate('/profile'),
        },
        {
            key: 'history',
            icon: <HistoryOutlined />,
            label: 'Lịch sử đặt vé',
            onClick: () => navigate('/history'),
        },
        {
            key: 'notifications',
            icon: <BellOutlined />,
            label: 'Thông báo',
            onClick: () => navigate('/notifications'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout,
        },
    ];

    const menuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: 'Trang chủ',
        },
        {
            key: '/movies',
            icon: <VideoCameraOutlined />,
            label: 'Phim',
        },
        {
            key: '/schedule',
            icon: <CalendarOutlined />,
            label: 'Lịch chiếu',
        },
        {
            key: '/cinemas',
            icon: <ShopOutlined />,
            label: 'Rạp chiếu',
        },
    ];

    return (
        <Header className="header-antd">
            <div className="header-content">
                <div className="logo-section">
                    <div
                        className="logo"
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="logo-icon">🎬</span>
                        <span className="logo-text">HotCinemas</span>
                    </div>
                </div>

                <div className="menu-section">
                    <Menu
                        onClick={onClick}
                        selectedKeys={[current]}
                        mode="horizontal"
                        items={menuItems}
                        className="main-menu desktop-menu"
                        overflowedIndicator={null}
                        disabledOverflow={true}
                    />

                    <Button
                        className="mobile-menu-button"
                        icon={<MenuOutlined />}
                        onClick={() => setMobileMenuVisible(true)}
                    />
                </div>

                <div className="actions-section">
                    <Space size="middle">
                        <Search
                            placeholder="Tìm kiếm phim, rạp..."
                            allowClear
                            style={{ width: 250 }}
                            onSearch={(value) => {
                                if (value.trim()) {
                                    navigate(`/search?q=${encodeURIComponent(value)}&type=all`);
                                }
                            }}
                            onPressEnter={(e) => {
                                const value = e.target.value;
                                if (value.trim()) {
                                    navigate(`/search?q=${encodeURIComponent(value)}&type=all`);
                                }
                            }}
                        />

                        {/* Notifications Icon */}
                        {isAuthenticated && (
                            <Badge count={notificationCount} showZero={false}>
                                <Button
                                    type="text"
                                    icon={<BellOutlined />}
                                    className="header-icon-btn"
                                    onClick={() => navigate('/notifications')}
                                    title="Thông báo"
                                />
                            </Badge>
                        )}

                        {isAuthenticated ? (
                            <Dropdown
                                menu={{ items: userMenuItems }}
                                placement="bottomRight"
                                arrow
                            >
                                <Space style={{ cursor: 'pointer' }}>
                                    <Avatar icon={<UserOutlined />} />
                                    <span className="user-name">{user?.name || 'User'}</span>
                                </Space>
                            </Dropdown>
                        ) : (
                            <Space>
                                <Button
                                    type="dashed"
                                    onClick={() => navigate('/login-demo')}
                                    style={{ borderColor: '#faad14', color: '#faad14' }}
                                >
                                    Test Đăng nhập
                                </Button>
                                <Button
                                    type="default"
                                    onClick={() => openAuthModal('register')}
                                >
                                    Đăng ký
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => openAuthModal('login')}
                                >
                                    Đăng nhập
                                </Button>
                            </Space>
                        )}
                    </Space>
                </div>
            </div>

            <AuthModalAntd
                isOpen={showAuthModal}
                onClose={closeAuthModal}
                initialMode={authModalMode}
            />

            <Drawer
                title={
                    <div className="mobile-drawer-title">
                        <span className="logo-icon">🎬</span>
                        <span className="logo-text">HotCinemas</span>
                    </div>
                }
                placement="right"
                closable={true}
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                className="mobile-menu-drawer"
            >
                <div className="mobile-menu-content">
                    <Menu
                        onClick={onClick}
                        selectedKeys={[current]}
                        mode="vertical"
                        items={menuItems}
                        className="mobile-menu"
                    />

                    <div className="mobile-search">
                        <Input.Search
                            placeholder="Tìm kiếm phim, rạp..."
                            allowClear
                            onSearch={(value) => {
                                if (value.trim()) {
                                    navigate(`/search?q=${encodeURIComponent(value)}&type=all`);
                                    setMobileMenuVisible(false);
                                }
                            }}
                        />
                    </div>

                    <div className="mobile-auth-section">
                        {isAuthenticated ? (
                            <div className="mobile-user-info">
                                <div className="user-avatar">
                                    <Avatar icon={<UserOutlined />} />
                                    <span>{user?.name || 'User'}</span>
                                </div>
                                <Button
                                    block
                                    icon={<UserOutlined />}
                                    onClick={() => {
                                        navigate('/profile');
                                        setMobileMenuVisible(false);
                                    }}
                                >
                                    Hồ sơ cá nhân
                                </Button>
                                <Button
                                    block
                                    icon={<HistoryOutlined />}
                                    onClick={() => {
                                        navigate('/history');
                                        setMobileMenuVisible(false);
                                    }}
                                >
                                    Lịch sử đặt vé
                                </Button>
                                <Button
                                    block
                                    danger
                                    icon={<LogoutOutlined />}
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuVisible(false);
                                    }}
                                >
                                    Đăng xuất
                                </Button>
                            </div>
                        ) : (
                            <div className="mobile-auth-buttons">
                                <Button
                                    block
                                    type="dashed"
                                    style={{ borderColor: '#faad14', color: '#faad14', marginBottom: '8px' }}
                                    onClick={() => {
                                        navigate('/login-demo');
                                        setMobileMenuVisible(false);
                                    }}
                                >
                                    Test Đăng nhập
                                </Button>
                                <Button
                                    block
                                    onClick={() => {
                                        openAuthModal('register');
                                        setMobileMenuVisible(false);
                                    }}
                                >
                                    Đăng ký
                                </Button>
                                <Button
                                    block
                                    type="primary"
                                    onClick={() => {
                                        openAuthModal('login');
                                        setMobileMenuVisible(false);
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Drawer>
        </Header>
    );
};

export default HeaderAntd;
