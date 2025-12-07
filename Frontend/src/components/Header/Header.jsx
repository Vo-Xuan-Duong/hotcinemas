import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Input, Badge, Drawer, Tooltip, List, Empty } from 'antd';
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
    BulbFilled,
    DashboardOutlined,
    CheckOutlined,
    DeleteOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useAuthModal } from '../../context/AuthModalContext';
import './Header.css';

const { Header: LayoutHeader } = Layout;
const { Search } = Input;

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { openAuthModal } = useAuthModal();
    const [current, setCurrent] = useState('/');
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Đặt vé thành công',
            content: 'Bạn đã đặt vé xem phim "Gió Vẫn Thổi" thành công',
            time: '5 phút trước',
            read: false,
            type: 'success'
        },
        {
            id: 2,
            title: 'Ưu đãi mới',
            content: 'Giảm 20% cho các suất chiếu buổi sáng từ thứ 2 - thứ 6',
            time: '1 giờ trước',
            read: false,
            type: 'promotion'
        },
        {
            id: 3,
            title: 'Phim mới sắp ra mắt',
            content: 'Deadpool & Wolverine sẽ công chiếu vào ngày 26/07',
            time: '3 giờ trước',
            read: true,
            type: 'info'
        }
    ]);

    // Get user display name with fallback to localStorage for instant display
    const getUserDisplayName = () => {
        if (user?.fullName) return user.fullName;
        if (user?.name) return user.name;

        // Fallback: Try to get from localStorage if state hasn't updated yet
        try {
            const storedUser = localStorage.getItem('user_info');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                return parsedUser?.fullName || parsedUser?.name || 'User';
            }
        } catch (e) {
            console.error('Error parsing user info:', e);
        }

        return 'User';
    };

    // Check if user has Admin role
    const isAdmin = () => {
        if (user?.role === 'ADMIN' || user?.role === 'Admin') return true;
        if (user?.roles?.includes('ADMIN') || user?.roles?.includes('Admin')) return true;

        // Fallback: Check localStorage
        try {
            const storedUser = localStorage.getItem('user_info');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser?.role === 'ADMIN' || parsedUser?.role === 'Admin') return true;
                if (parsedUser?.roles?.includes('ADMIN') || parsedUser?.roles?.includes('Admin')) return true;
            }
        } catch (e) {
            console.error('Error parsing user info:', e);
        }

        return false;
    };

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
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
        // Update unread count
        const unreadCount = notifications.filter(n => !n.read && n.id !== id).length;
        setNotificationCount(unreadCount);
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
        const unreadCount = notifications.filter(n => !n.read && n.id !== id).length;
        setNotificationCount(unreadCount);
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
        setNotificationCount(0);
    };

    const onClick = (e) => {
        // Extract base path for selectedKeys (remove query params)
        const basePath = e.key.split('?')[0];
        setCurrent(basePath);
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
        // {
        //     key: 'history',
        //     icon: <HistoryOutlined />,
        //     label: 'Lịch sử đặt vé',
        //     onClick: () => navigate('/history'),
        // },
        // Thêm menu Admin nếu user có role Admin
        ...(isAdmin() ? [
            {
                type: 'divider',
            },
            {
                key: 'admin',
                icon: <DashboardOutlined />,
                label: 'Quản trị',
                onClick: () => navigate('/admin'),
                style: { color: '#1890ff', fontWeight: '500' }
            },
        ] : []),
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

    // Notification dropdown content
    const notificationDropdown = (
        <div style={{ width: 360, maxHeight: 480, overflow: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>Thông báo</span>
                {notifications.some(n => !n.read) && (
                    <Button type="link" size="small" onClick={markAllAsRead}>
                        Đánh dấu đã đọc tất cả
                    </Button>
                )}
            </div>
            {notifications.length > 0 ? (
                <List
                    dataSource={notifications}
                    renderItem={(item) => (
                        <List.Item
                            style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                backgroundColor: item.read ? '#fff' : '#f0f7ff',
                                transition: 'all 0.3s'
                            }}
                            actions={[
                                !item.read && (
                                    <Tooltip title="Đánh dấu đã đọc">
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<CheckOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(item.id);
                                            }}
                                        />
                                    </Tooltip>
                                ),
                                <Tooltip title="Xóa">
                                    <Button
                                        type="text"
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(item.id);
                                        }}
                                    />
                                </Tooltip>
                            ]}
                            onClick={() => markAsRead(item.id)}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        background: item.type === 'success' ? '#52c41a20' : item.type === 'promotion' ? '#ff4d4f20' : '#1890ff20',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 20
                                    }}>
                                        {item.type === 'success' ? '🎫' : item.type === 'promotion' ? '🎁' : '🎬'}
                                    </div>
                                }
                                title={<span style={{ fontWeight: item.read ? 400 : 600 }}>{item.title}</span>}
                                description={
                                    <>
                                        <div style={{ marginBottom: 4, color: '#666' }}>{item.content}</div>
                                        <div style={{ fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <ClockCircleOutlined /> {item.time}
                                        </div>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không có thông báo"
                    style={{ padding: '40px 0' }}
                />
            )}
        </div>
    );

    // Menu items
    const menuItems = React.useMemo(() => {
        const items = [
            { key: '/', icon: <HomeOutlined />, label: 'Trang chủ' },
            { key: '/movies', icon: <VideoCameraOutlined />, label: 'Phim' },
            { key: '/schedule', icon: <CalendarOutlined />, label: 'Lịch chiếu' },
            { key: '/cinemas', icon: <ShopOutlined />, label: 'Rạp chiếu' }
        ];
        return items;
    }, []);

    return (
        <LayoutHeader className="header-antd">
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
                            <Dropdown
                                dropdownRender={() => notificationDropdown}
                                trigger={['click']}
                                placement="bottomRight"
                                arrow
                            >
                                <Badge count={notificationCount} showZero={false}>
                                    <Button
                                        type="text"
                                        icon={<BellOutlined />}
                                        className="header-icon-btn"
                                        title="Thông báo"
                                    />
                                </Badge>
                            </Dropdown>
                        )}

                        {isAuthenticated ? (
                            <Dropdown
                                menu={{ items: userMenuItems }}
                                placement="bottomRight"
                                arrow
                            >
                                <Space style={{ cursor: 'pointer' }}>
                                    <Avatar
                                        src={user?.avatar}
                                        icon={<UserOutlined />}
                                    />
                                    <span className="user-name">{getUserDisplayName()}</span>
                                </Space>
                            </Dropdown>
                        ) : (
                            <Space>
                                <Button
                                    type="default"
                                    onClick={() => navigate('/register')}
                                >
                                    Đăng ký
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => navigate('/login')}
                                >
                                    Đăng nhập
                                </Button>
                            </Space>
                        )}
                    </Space>
                </div>
            </div>

            <Drawer
                title={
                    <div className="mobile-drawer-title">
                        <span className="logo-icon">🎬</span>
                        <span className="logo-text">HotCinemas</span>
                    </div>
                }
                placement="left"
                closable={true}
                maskClosable={false}
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                className="mobile-menu-drawer"
                width="200"
                rootStyle={{ zIndex: 2147483647 }}
                mask={false}
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
                </div>
            </Drawer>
        </LayoutHeader>
    );
};

export default Header;
