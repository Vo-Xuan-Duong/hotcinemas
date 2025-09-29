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
    Row,
    Col,
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
    GiftOutlined
} from '@ant-design/icons';
import useAuth from '../../../context/useAuth';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const ProfileAntd = () => {
    const { user, logout, isAuthenticated } = useAuth();
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

    if (!isAuthenticated) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <Card>
                    <UserOutlined style={{ fontSize: '48px', color: '#e50914', marginBottom: '20px' }} />
                    <Title level={3}>Bạn chưa đăng nhập</Title>
                    <Paragraph>Vui lòng đăng nhập để xem thông tin cá nhân</Paragraph>
                    <Button type="primary" size="large" href="/login-demo">
                        Đăng nhập
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', minHeight: '100vh', background: '#f0f2f5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Row gutter={[24, 24]}>
                    {/* Profile Header */}
                    <Col span={24}>
                        <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <Avatar size={80} icon={<UserOutlined />} />
                                    <div>
                                        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                            {userData.name}
                                            {userData.membershipLevel === 'VIP' && (
                                                <Tag color="gold" style={{ marginLeft: '8px' }}>
                                                    <TrophyOutlined /> VIP
                                                </Tag>
                                            )}
                                        </Title>
                                        <Text type="secondary">
                                            <MailOutlined /> {userData.email}
                                        </Text>
                                    </div>
                                </div>
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
                        </Card>
                    </Col>

                    {/* Stats Cards */}
                    <Col xs={24} sm={8}>
                        <Card style={{ textAlign: 'center' }}>
                            <Statistic
                                title="Tổng số lần đặt vé"
                                value={userData.totalBookings}
                                prefix={<HistoryOutlined />}
                                valueStyle={{ color: '#e50914' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card style={{ textAlign: 'center' }}>
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
                        <Card style={{ textAlign: 'center' }}>
                            <Statistic
                                title="Thành viên từ"
                                value={dayjs(userData.joinDate).format('MM/YYYY')}
                                prefix={<CalendarOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>

                    {/* Profile Details */}
                    <Col span={24}>
                        <Card title="Thông tin cá nhân" style={{ borderRadius: '12px' }}>
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
                        </Card>
                    </Col>
                </Row>

                {/* Edit Profile Modal */}
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
                        initialValues={{
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone,
                            address: userData.address
                        }}
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
