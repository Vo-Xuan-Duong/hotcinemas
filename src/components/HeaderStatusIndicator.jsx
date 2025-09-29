import React from 'react';
import { Card, Tag, Space, Typography } from 'antd';
import { UserOutlined, BellOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import useAuth from '../context/useAuth';

const { Text } = Typography;

const HeaderStatusIndicator = () => {
    const { user, isAuthenticated } = useAuth();

    const getCartCount = () => {
        const savedCart = localStorage.getItem('movieCart');
        if (savedCart) {
            try {
                const cart = JSON.parse(savedCart);
                return cart.length || 0;
            } catch (error) {
                return 0;
            }
        }
        return 0;
    };

    return (
        <Card
            title="📊 Trạng thái Header hiện tại"
            size="small"
            style={{
                position: 'fixed',
                top: '80px',
                right: '20px',
                width: '300px',
                zIndex: 1001,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
        >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong><UserOutlined /> User:</Text>
                    {isAuthenticated ? (
                        <Tag color="green">{user?.name}</Tag>
                    ) : (
                        <Tag color="default">Chưa đăng nhập</Tag>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong><BellOutlined /> Notifications:</Text>
                    <Tag color={isAuthenticated ? "orange" : "default"}>
                        {isAuthenticated ? '3' : '0'}
                    </Tag>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong><ShoppingCartOutlined /> Cart:</Text>
                    <Tag color={getCartCount() > 0 ? "blue" : "default"}>
                        {getCartCount()}
                    </Tag>
                </div>

                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    {isAuthenticated ? '✅ Header trong trạng thái đã đăng nhập' : '❌ Header trong trạng thái chưa đăng nhập'}
                </div>
            </Space>
        </Card>
    );
};

export default HeaderStatusIndicator;
