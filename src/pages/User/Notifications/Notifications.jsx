import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Tag, Button, Empty, Avatar, Space, message } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import './Notifications.css';
import notificationService from '../../../services/notificationService';

const { Title, Text } = Typography;

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const data = await notificationService.list();
                // Normalize payload shape
                const items = Array.isArray(data) ? data : (data?.items || []);
                setNotifications(items.map(n => ({
                    id: n.id ?? n._id,
                    type: n.type || 'system',
                    title: n.title || 'Thông báo',
                    message: n.message || n.content || '',
                    time: n.time || n.createdAt || '',
                    read: !!(n.read ?? n.isRead),
                    priority: n.priority || 'low'
                })));
            } catch (err) {
                message.error(err.message || 'Không tải được danh sách thông báo');
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
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

    const markAsRead = async (id) => {
        // Optimistic UI
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        try {
            await notificationService.markAsRead(id);
        } catch (err) {
            message.error('Không thể đánh dấu đã đọc');
        }
    };

    const deleteNotification = async (id) => {
        const prev = notifications;
        setNotifications(prev.filter(n => n.id !== id));
        try {
            await notificationService.delete(id);
        } catch (err) {
            message.error('Xóa thất bại');
            setNotifications(prev);
        }
    };

    const markAllAsRead = async () => {
        // Optimistic UI
        const prev = notifications;
        setNotifications(prev.map(n => ({ ...n, read: true })));
        try {
            await notificationService.markAllAsRead();
        } catch (err) {
            message.error('Không thể đánh dấu tất cả đã đọc');
            setNotifications(prev);
        }
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
