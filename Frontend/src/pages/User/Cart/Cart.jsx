import React, { useState, useEffect } from 'react';
import { Card, Button, List, Typography, Empty, Row, Col, InputNumber, Divider, Space, Tag, message } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const { Title, Text } = Typography;

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock cart data
        const mockCartItems = [
            {
                id: 1,
                movieTitle: 'Transformer: Rise of the Beasts',
                cinema: 'CGV Nguyễn Văn Cừ',
                showtime: '19:30 - 21:45',
                date: '2025-07-29',
                seats: ['A5', 'A6'],
                price: 120000,
                quantity: 2,
                poster: '/images/transformer.jpg'
            },
            {
                id: 2,
                movieTitle: 'Avatar: The Way of Water',
                cinema: 'Galaxy Nguyễn Du',
                showtime: '20:00 - 23:15',
                date: '2025-07-30',
                seats: ['B8', 'B9', 'B10'],
                price: 150000,
                quantity: 3,
                poster: '/images/avatar.jpg'
            }
        ];

        setTimeout(() => {
            setCartItems(mockCartItems);
            setLoading(false);
        }, 1000);
    }, []);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(id);
            return;
        }

        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
        message.success('Đã xóa khỏi giỏ hàng');
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const proceedToCheckout = () => {
        if (cartItems.length === 0) {
            message.warning('Giỏ hàng của bạn đang trống');
            return;
        }

        // Save cart to localStorage for checkout process
        localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
        navigate('/booking/confirm');
    };

    const continueShopping = () => {
        navigate('/movies');
    };

    return (
        <div className="cart-page">
            <div className="cart-header">
                <Title level={2}>
                    <ShoppingCartOutlined /> Giỏ hàng của bạn
                </Title>
                <Text type="secondary">
                    {cartItems.length > 0 ? `${getTotalItems()} vé phim` : 'Giỏ hàng trống'}
                </Text>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card className="cart-items-card">
                        {cartItems.length === 0 ? (
                            <Empty
                                image="/images/empty-cart.svg"
                                description={
                                    <div>
                                        <Text>Giỏ hàng của bạn đang trống</Text>
                                        <br />
                                        <Button
                                            type="primary"
                                            style={{ marginTop: 16 }}
                                            onClick={continueShopping}
                                        >
                                            Khám phá phim mới
                                        </Button>
                                    </div>
                                }
                            />
                        ) : (
                            <List
                                loading={loading}
                                dataSource={cartItems}
                                renderItem={(item) => (
                                    <List.Item className="cart-item">
                                        <Card
                                            hoverable
                                            className="cart-item-card"
                                        >
                                            <Row gutter={16} align="middle">
                                                <Col xs={24} sm={6}>
                                                    <div className="movie-poster">
                                                        <img
                                                            src={item.poster}
                                                            alt={item.movieTitle}
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/200x300?text=Movie+Poster';
                                                            }}
                                                        />
                                                    </div>
                                                </Col>

                                                <Col xs={24} sm={12}>
                                                    <div className="movie-info">
                                                        <Title level={4}>{item.movieTitle}</Title>
                                                        <Space direction="vertical" size="small">
                                                            <Text>📍 {item.cinema}</Text>
                                                            <Text>🕐 {item.showtime}</Text>
                                                            <Text>📅 {item.date}</Text>
                                                            <div>
                                                                🪑 {item.seats.map(seat => (
                                                                    <Tag key={seat} color="blue">{seat}</Tag>
                                                                ))}
                                                            </div>
                                                        </Space>
                                                    </div>
                                                </Col>

                                                <Col xs={24} sm={6}>
                                                    <div className="quantity-controls">
                                                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                                            <div className="price">
                                                                <Text strong style={{ fontSize: 16, color: '#e50914' }}>
                                                                    {(item.price * item.quantity).toLocaleString()}đ
                                                                </Text>
                                                                <br />
                                                                <Text type="secondary" size="small">
                                                                    {item.price.toLocaleString()}đ/vé
                                                                </Text>
                                                            </div>

                                                            <div className="quantity">
                                                                <Space>
                                                                    <Button
                                                                        size="small"
                                                                        icon={<MinusOutlined />}
                                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    />
                                                                    <InputNumber
                                                                        size="small"
                                                                        min={1}
                                                                        value={item.quantity}
                                                                        onChange={(value) => updateQuantity(item.id, value)}
                                                                        style={{ width: 60 }}
                                                                    />
                                                                    <Button
                                                                        size="small"
                                                                        icon={<PlusOutlined />}
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    />
                                                                </Space>
                                                            </div>

                                                            <Button
                                                                danger
                                                                type="text"
                                                                icon={<DeleteOutlined />}
                                                                onClick={() => removeItem(item.id)}
                                                                size="small"
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </Space>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card className="cart-summary-card" title="Tóm tắt đơn hàng">
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div className="summary-row">
                                <Text>Số lượng vé:</Text>
                                <Text strong>{getTotalItems()} vé</Text>
                            </div>

                            <div className="summary-row">
                                <Text>Tạm tính:</Text>
                                <Text>{getTotalPrice().toLocaleString()}đ</Text>
                            </div>

                            <div className="summary-row">
                                <Text>Phí dịch vụ:</Text>
                                <Text>0đ</Text>
                            </div>

                            <Divider />

                            <div className="summary-row total">
                                <Title level={4}>Tổng cộng:</Title>
                                <Title level={4} style={{ color: '#e50914', margin: 0 }}>
                                    {getTotalPrice().toLocaleString()}đ
                                </Title>
                            </div>

                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    onClick={proceedToCheckout}
                                    disabled={cartItems.length === 0}
                                >
                                    Tiến hành thanh toán
                                </Button>

                                <Button
                                    size="large"
                                    block
                                    onClick={continueShopping}
                                >
                                    Tiếp tục mua vé
                                </Button>
                            </Space>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Cart;
