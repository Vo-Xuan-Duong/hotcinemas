import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Tag, Button, Empty, Avatar, Space } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import './Notifications.css';

const { Title, Text } = Typography;

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock notifications data
        const mockNotifications = [
            {
                id: 1,
                type: 'booking',
                title: 'Đặt vé thành công',
                message: 'Bạn đã đặt thành công 2 vé xem phim "Transformer: Rise of the Beasts" tại CGV Nguyễn Văn Cừ',
                time: '2 phút trước',
                read: false,
                priority: 'high'
            },
            {
                id: 2,
                type: 'promotion',
                title: 'Khuyến mãi mới',
                message: 'Giảm 50% cho tất cả suất chiếu vào thứ 3 hàng tuần. Áp dụng đến hết tháng này!',
                time: '1 giờ trước',
                read: false,
                priority: 'medium'
            },
            {
                id: 3,
                type: 'reminder',
                title: 'Nhắc nhở xem phim',
                message: 'Chỉ còn 30 phút nữa đến giờ chiếu phim "Avatar: The Way of Water" tại Galaxy Nguyễn Du',
                time: '3 giờ trước',
                read: true,
                priority: 'high'
            },
            {
                id: 4,
                type: 'system',
                title: 'Cập nhật hệ thống',
                message: 'Hệ thống đã được cập nhật với tính năng mới. Bạn có thể đặt vé trước 7 ngày.',
                time: '1 ngày trước',
                read: true,
                priority: 'low'
            }
        ];

        setTimeout(() => {
            setNotifications(mockNotifications);
            setLoading(false);
        }, 1000);
    }, []);

    const getNotificationIcon = (type) => {
        const icons = {
            booking: '🎫',
            promotion: '🎁',
            reminder: '⏰',
            system: '⚙️'
        };
        return icons[type] || '📬';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            high: 'red',
            medium: 'orange',
            low: 'blue'
        };
        return colors[priority] || 'default';
    };

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const unreadCount = notifications.filter(notif => !notif.read).length;

    return (
        <div className="notifications-page">
            <div className="notifications-header">
                <div className="header-content">
                    <div className="header-info">
                        <Title level={2}>
                            <BellOutlined /> Thông báo
                        </Title>
                        <Text type="secondary">
                            {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả thông báo đã được đọc'}
                        </Text>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={markAllAsRead}
                        >
                            Đánh dấu tất cả đã đọc
                        </Button>
                    )}
                </div>
            </div>

            <div className="notifications-content">
                {notifications.length === 0 && !loading ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Không có thông báo nào"
                    />
                ) : (
                    <List
                        loading={loading}
                        dataSource={notifications}
                        renderItem={(notification) => (
                            <List.Item className={`notification-item ${!notification.read ? 'unread' : 'read'}`}>
                                <Card
                                    hoverable
                                    className="notification-card"
                                    actions={[
                                        !notification.read && (
                                            <Button
                                                type="text"
                                                icon={<EyeOutlined />}
                                                onClick={() => markAsRead(notification.id)}
                                                title="Đánh dấu đã đọc"
                                            >
                                                Đã đọc
                                            </Button>
                                        ),
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => deleteNotification(notification.id)}
                                            title="Xóa thông báo"
                                        >
                                            Xóa
                                        </Button>
                                    ].filter(Boolean)}
                                >
                                    <Card.Meta
                                        avatar={
                                            <Avatar
                                                size="large"
                                                className={`notification-avatar ${notification.type}`}
                                            >
                                                {getNotificationIcon(notification.type)}
                                            </Avatar>
                                        }
                                        title={
                                            <div className="notification-title">
                                                <span>{notification.title}</span>
                                                <Space>
                                                    <Tag color={getPriorityColor(notification.priority)}>
                                                        {notification.priority === 'high' ? 'Quan trọng' :
                                                            notification.priority === 'medium' ? 'Thông thường' : 'Thấp'}
                                                    </Tag>
                                                    {!notification.read && (
                                                        <Tag color="red">Mới</Tag>
                                                    )}
                                                </Space>
                                            </div>
                                        }
                                        description={
                                            <div className="notification-content">
                                                <Text>{notification.message}</Text>
                                                <div className="notification-time">
                                                    <Text type="secondary" size="small">
                                                        {notification.time}
                                                    </Text>
                                                </div>
                                            </div>
                                        }
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default Notifications;
