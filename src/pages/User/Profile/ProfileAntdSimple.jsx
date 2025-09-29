import React, { useState } from 'react';
import {
    Card,
    Button,
    Avatar,
    Typography,
    Descriptions,
    Space,
    Tag,
    Modal,
    Form,
    Input,
    DatePicker,
    Row,
    Col,
    Tabs,
    Statistic
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    LogoutOutlined,
    MailOutlined,
    CalendarOutlined,
    TrophyOutlined,
    HistoryOutlined,
    SettingOutlined,
    GiftOutlined
} from '@ant-design/icons';
import { useAuth } from '../../../context/useAuth';
import dayjs from 'dayjs';
import './ProfileAntd.css';

const { Title, Text, Paragraph } = Typography;

const ProfileAntd = () => {
    const { user, logout } = useAuth();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const userData = {
        name: user?.name || 'Khách hàng',
        email: user?.email || 'khachhang@hotcinemas.com',
        phone: '0987654321',
        birthDate: '1990-05-15',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        membershipLevel: 'VIP',
        points: 2450,
        totalBookings: 27,
        totalSpent: 3850000,
        joinDate: '2022-01-15'
    };

    const handleEditProfile = () => {
        setEditModalVisible(true);
    };

    const handleSaveProfile = async (values) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            Modal.success({
                title: 'Thành công',
                content: 'Cập nhật thông tin thành công!'
            });
            setEditModalVisible(false);
        } catch (error) {
            Modal.error({
                title: 'Lỗi',
                content: 'Có lỗi xảy ra khi cập nhật thông tin!'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="profile-antd">
                <div className="container">
                    <Card className="not-logged-in-card">
                        <div className="not-logged-in-content">
                            <UserOutlined className="not-logged-in-icon" />
                            <Title level={3}>Bạn chưa đăng nhập</Title>
                            <Paragraph>Vui lòng đăng nhập để xem thông tin cá nhân</Paragraph>
                            <Button type="primary" size="large">
                                Đăng nhập
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-antd">
            <div className="container">
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Card className="profile-header-card">
                            <div className="profile-header">
                                <div className="profile-avatar-section">
                                    <Avatar
                                        size={100}
                                        icon={<UserOutlined />}
                                        className="profile-avatar"
                                    />
                                    <div className="profile-basic-info">
                                        <Title level={2} className="profile-name">
                                            {userData.name}
                                            {userData.membershipLevel === 'VIP' && (
                                                <Tag color="gold" className="vip-tag">
                                                    <TrophyOutlined /> VIP
                                                </Tag>
                                            )}
                                        </Title>
                                        <Text type="secondary" className="profile-email">
                                            <MailOutlined /> {userData.email}
                                        </Text>
                                    </div>
                                </div>
                                <div className="profile-actions">
                                    <Space>
                                        <Button
                                            type="primary"
                                            icon={<EditOutlined />}
                                            onClick={handleEditProfile}
                                        >
                                            Chỉnh sửa
                                        </Button>
                                        <Button
                                            danger
                                            icon={<LogoutOutlined />}
                                            onClick={() => {
                                                Modal.confirm({
                                                    title: 'Xác nhận đăng xuất',
                                                    content: 'Bạn có chắc chắn muốn đăng xuất?',
                                                    onOk: logout
                                                });
                                            }}
                                        >
                                            Đăng xuất
                                        </Button>
                                    </Space>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Card className="stat-card">
                            <Statistic
                                title="Tổng số lần đặt vé"
                                value={userData.totalBookings}
                                prefix={<HistoryOutlined />}
                                valueStyle={{ color: '#e50914' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="stat-card">
                            <Statistic
                                title="Tổng chi tiêu"
                                value={userData.totalSpent}
                                formatter={(value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`}
                                prefix={<GiftOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="stat-card">
                            <Statistic
                                title="Thành viên từ"
                                value={dayjs(userData.joinDate).format('MM/YYYY')}
                                prefix={<CalendarOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card className="profile-content-card">
                            <Tabs defaultActiveKey="1">
                                <Tabs.TabPane
                                    tab={
                                        <span>
                                            <UserOutlined />
                                            Thông tin cá nhân
                                        </span>
                                    }
                                    key="1"
                                >
                                    <Descriptions bordered column={2}>
                                        <Descriptions.Item label="Họ và tên">
                                            {userData.name}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Email">
                                            {userData.email}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Số điện thoại">
                                            {userData.phone}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ngày sinh">
                                            {dayjs(userData.birthDate).format('DD/MM/YYYY')}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Địa chỉ" span={2}>
                                            {userData.address}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Hạng thành viên">
                                            <Tag color={userData.membershipLevel === 'VIP' ? 'gold' : 'blue'}>
                                                {userData.membershipLevel}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Điểm tích lũy">
                                            {userData.points}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Tabs.TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                </Row>

                <Modal
                    title="Chỉnh sửa thông tin cá nhân"
                    open={editModalVisible}
                    onCancel={() => setEditModalVisible(false)}
                    footer={null}
                    width={600}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSaveProfile}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Họ và tên"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                >
                                    <Input placeholder="Nhập họ và tên" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' }
                                    ]}
                                >
                                    <Input placeholder="Nhập email" disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                >
                                    <Input placeholder="Nhập số điện thoại" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Ngày sinh"
                                    name="birthDate"
                                >
                                    <DatePicker
                                        placeholder="Chọn ngày sinh"
                                        style={{ width: '100%' }}
                                        format="DD/MM/YYYY"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Địa chỉ"
                                    name="address"
                                >
                                    <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="end" gutter={8}>
                            <Col>
                                <Button onClick={() => setEditModalVisible(false)}>
                                    Hủy
                                </Button>
                            </Col>
                            <Col>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Lưu thay đổi
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default ProfileAntd;
