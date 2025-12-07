import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Typography, Space, Badge } from 'antd';
import {
    DashboardOutlined,
    VideoCameraOutlined,
    ShopOutlined,
    CalendarOutlined,
    TeamOutlined,
    FileTextOutlined,
    MessageOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    BellOutlined,
    TableOutlined,
    BarChartOutlined,
    GiftOutlined,
    NotificationOutlined,
    SafetyCertificateOutlined,
    CoffeeOutlined,
    CreditCardOutlined,
    BugOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ScrollToTop from '../components/ScrollToTop';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();

    // Handle responsive behavior
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) {
                setCollapsed(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/admin/movies',
            icon: <VideoCameraOutlined />,
            label: 'Quản lý phim',
        },
        {
            key: '/admin/cinemas',
            icon: <ShopOutlined />,
            label: 'Quản lý rạp',
        },
        {
            key: '/admin/comments',
            icon: <MessageOutlined />,
            label: 'Bình luận',
        },
        {
            key: '/admin/schedules',
            icon: <CalendarOutlined />,
            label: 'Lịch chiếu',
        },
        {
            key: '/admin/users',
            icon: <TeamOutlined />,
            label: 'Người dùng',
        },
        {
            key: '/admin/bookings',
            icon: <FileTextOutlined />,
            label: 'Đặt vé',
        },
        {
            key: '/admin/reports',
            icon: <BarChartOutlined />,
            label: 'Báo cáo',
        },
        {
            key: '/admin/promotions',
            icon: <GiftOutlined />,
            label: 'Khuyến mãi',
        },
        {
            key: '/admin/notifications',
            icon: <NotificationOutlined />,
            label: 'Thông báo',
        },
        {
            key: '/admin/staff',
            icon: <SafetyCertificateOutlined />,
            label: 'Nhân viên',
        },
        {
            key: '/admin/food-beverage',
            icon: <CoffeeOutlined />,
            label: 'Đồ ăn & Đồ uống',
        },
        {
            key: '/admin/testing',
            icon: <BugOutlined />,
            label: 'Testing',
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
        },
    ];

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ cá nhân',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: () => {
                // Handle logout
                navigate('/');
            },
        },
    ];

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    return (
        <Layout className="admin-layout-antd" style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="admin-sider"
                width={200}
                collapsedWidth={isMobile ? 0 : 60}
                breakpoint="lg"
                onBreakpoint={(broken) => {
                    setIsMobile(broken);
                    if (broken) {
                        setCollapsed(true);
                    }
                }}
                style={{
                    position: isMobile ? 'fixed' : 'relative',
                    zIndex: isMobile ? 100 : 1,
                    height: '100vh',
                    left: isMobile && collapsed ? '-200px' : '0',
                    transition: 'left 0.3s ease'
                }}
            >
                <div className="admin-logo">
                    <div className="logo-content">
                        <span className="logo-icon">🎬</span>
                        {!collapsed && (
                            <div className="logo-text">
                                <Title level={4} style={{ color: '#e50914', margin: 0 }}>
                                    HotCinemas
                                </Title>
                                <span className="admin-badge">Admin Panel</span>
                            </div>
                        )}
                    </div>
                </div>

                <Menu
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    className="admin-menu"
                />
            </Sider>

            <Layout className="admin-content-layout">
                <Header className="admin-header">
                    <div className="header-left">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="collapse-btn"
                        />
                    </div>

                    <div className="header-right">
                        <Space size="middle">
                            <Badge count={5} size="small">
                                <Button
                                    type="text"
                                    icon={<BellOutlined />}
                                    className="notification-btn"
                                />
                            </Badge>

                            <Dropdown
                                menu={{ items: userMenuItems }}
                                placement="bottomRight"
                                arrow
                            >
                                <Space style={{ cursor: 'pointer' }} className="user-info">
                                    <Avatar icon={<UserOutlined />} />
                                    <span className="user-name">Admin User</span>
                                </Space>
                            </Dropdown>
                        </Space>
                    </div>
                </Header>

                <Content className="admin-content">
                    <div className="admin-content-wrapper">
                        <ScrollToTop />
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
