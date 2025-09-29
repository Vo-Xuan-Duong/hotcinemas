import React, { useState } from 'react';
import { Card, Button, Space, Typography, Divider, Tag, notification } from 'antd';
import { UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import useAuth from '../context/useAuth';
import HeaderStatusIndicator from '../components/HeaderStatusIndicator';

const { Title, Text } = Typography;

const LoginDemo = () => {
    const { user, isAuthenticated, logout, setMockUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const mockUsers = [
        {
            id: 1,
            name: 'Nguyễn Văn An',
            email: 'nguyenvanan@gmail.com',
            phone: '0912345678',
            role: 'user',
            avatar: null,
            joinDate: '2024-01-15',
            isVip: true
        },
        {
            id: 2,
            name: 'Trần Thị Bình',
            email: 'tranthibinh@gmail.com',
            phone: '0987654321',
            role: 'admin',
            avatar: null,
            joinDate: '2023-12-01',
            isVip: false
        },
        {
            id: 3,
            name: 'Lê Hoàng Cường',
            email: 'lehoangcuong@gmail.com',
            phone: '0903456789',
            role: 'user',
            avatar: null,
            joinDate: '2024-03-10',
            isVip: true
        }
    ];

    const simulateLogin = async (mockUser) => {
        setLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update cart and notifications count for demo
            localStorage.setItem('movieCart', JSON.stringify([
                { id: 1, movieId: 1, quantity: 2 },
                { id: 2, movieId: 5, quantity: 1 }
            ]));

            // Dispatch custom event to update header cart count
            window.dispatchEvent(new Event('cartUpdated'));

            // Use AuthContext to set mock user (no reload needed)
            setMockUser(mockUser);

            notification.success({
                message: 'Đăng nhập thành công!',
                description: `Chào mừng ${mockUser.name} quay trở lại HotCinemas. Header đã được cập nhật!`,
                duration: 4
            });

        } catch (error) {
            notification.error({
                message: 'Đăng nhập thất bại',
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    }; const handleLogout = () => {
        logout();
        localStorage.removeItem('USER_TOKEN');
        localStorage.removeItem('USER_INFO');
        localStorage.removeItem('movieCart');

        // Dispatch event to update header
        window.dispatchEvent(new Event('cartUpdated'));

        notification.info({
            message: 'Đã đăng xuất',
            description: 'Header đã được cập nhật về trạng thái chưa đăng nhập'
        });
    };

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <HeaderStatusIndicator />
            <Card title="🎬 Demo Trạng thái Đăng nhập - HotCinemas" size="large">
                {isAuthenticated ? (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <UserOutlined style={{ fontSize: '48px', color: '#e50914', marginBottom: '16px' }} />
                            <Title level={3} style={{ color: '#e50914', margin: 0 }}>
                                Đã đăng nhập thành công!
                            </Title>
                        </div>

                        <Card type="inner" title="Thông tin người dùng hiện tại">
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <div>
                                    <Text strong>Tên:</Text> <Text>{user?.name}</Text>
                                    {user?.isVip && <Tag color="gold" style={{ marginLeft: '8px' }}>VIP</Tag>}
                                    {user?.role === 'admin' && <Tag color="red" style={{ marginLeft: '8px' }}>ADMIN</Tag>}
                                </div>
                                <div>
                                    <Text strong>Email:</Text> <Text>{user?.email}</Text>
                                </div>
                                <div>
                                    <Text strong>Số điện thoại:</Text> <Text>{user?.phone}</Text>
                                </div>
                                <div>
                                    <Text strong>Ngày tham gia:</Text> <Text>{user?.joinDate}</Text>
                                </div>
                            </Space>
                        </Card>

                        <Divider />

                        <div style={{ textAlign: 'center' }}>
                            <Title level={4}>🎯 Header đã được cập nhật realtime!</Title>
                            <div style={{
                                background: '#f6ffed',
                                border: '1px solid #b7eb8f',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '16px'
                            }}>
                                <Space direction="vertical" size="small">
                                    <Text strong style={{ color: '#52c41a' }}>✅ Các thay đổi trên header:</Text>
                                    <Text>👤 User menu hiển thị: {user?.name}</Text>
                                    <Text>🔔 Notification badge: {isAuthenticated ? '3' : '0'} thông báo</Text>
                                    <Text>🛒 Cart badge: 3 items (đã thêm mock data)</Text>
                                    <Text>📱 Mobile menu có user info</Text>
                                </Space>
                            </div>

                            <Title level={5}>🧪 Test các chức năng:</Title>
                            <Space direction="vertical" size="small">
                                <Text>✅ User dropdown menu với tên người dùng</Text>
                                <Text>✅ Notification icon với badge (3 notifications)</Text>
                                <Text>✅ Cart icon với badge (3 items)</Text>
                                <Text>✅ Search functionality</Text>
                                <Text>✅ Mobile responsive menu</Text>
                            </Space>

                            <Divider />

                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => window.open('/notifications', '_blank')}
                                >
                                    Xem Notifications
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => window.open('/cart', '_blank')}
                                >
                                    Xem Cart
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => window.open('/profile', '_blank')}
                                >
                                    Xem Profile
                                </Button>
                            </Space>

                            <Divider />

                            <Button
                                type="primary"
                                danger
                                icon={<LogoutOutlined />}
                                onClick={handleLogout}
                                size="large"
                            >
                                Đăng xuất để test lại
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <LoginOutlined style={{ fontSize: '48px', color: '#666', marginBottom: '16px' }} />
                            <Title level={3} style={{ color: '#666', margin: 0 }}>
                                Chưa đăng nhập
                            </Title>
                            <Text type="secondary">
                                Chọn một tài khoản demo để test chức năng header khi đã đăng nhập
                            </Text>
                        </div>

                        <Title level={4}>Chọn tài khoản demo:</Title>

                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            {mockUsers.map((mockUser, index) => (
                                <Card
                                    key={mockUser.id}
                                    type="inner"
                                    hoverable
                                    actions={[
                                        <Button
                                            type="primary"
                                            icon={<LoginOutlined />}
                                            loading={loading}
                                            onClick={() => simulateLogin(mockUser)}
                                        >
                                            Đăng nhập với tài khoản này
                                        </Button>
                                    ]}
                                >
                                    <Card.Meta
                                        avatar={<UserOutlined style={{ fontSize: '24px', color: '#e50914' }} />}
                                        title={
                                            <div>
                                                {mockUser.name}
                                                {mockUser.isVip && <Tag color="gold" style={{ marginLeft: '8px' }}>VIP</Tag>}
                                                {mockUser.role === 'admin' && <Tag color="red" style={{ marginLeft: '8px' }}>ADMIN</Tag>}
                                            </div>
                                        }
                                        description={
                                            <Space direction="vertical" size="small">
                                                <Text>{mockUser.email}</Text>
                                                <Text>{mockUser.phone}</Text>
                                                <Text type="secondary">Tham gia: {mockUser.joinDate}</Text>
                                            </Space>
                                        }
                                    />
                                </Card>
                            ))}
                        </Space>

                        <Divider />

                        <div style={{ textAlign: 'center' }}>
                            <Title level={5} type="secondary">
                                Sau khi đăng nhập, bạn sẽ thấy:
                            </Title>
                            <Space direction="vertical" size="small">
                                <Text type="secondary">🔔 Notification badge (3)</Text>
                                <Text type="secondary">🛒 Cart badge (3 items)</Text>
                                <Text type="secondary">👤 User dropdown với tên</Text>
                                <Text type="secondary">📱 Mobile menu với user info</Text>
                            </Space>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default LoginDemo;
