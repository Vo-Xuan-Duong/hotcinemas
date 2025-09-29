import React, { useState, useEffect } from 'react';
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
    message,
    Row,
    Col,
    Tabs,
    List,
    Badge,
    Progress,
    Statistic,
    Upload,
    Switch
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    LogoutOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    StarFilled,
    HistoryOutlined,
    SettingOutlined,
    CameraOutlined,
    TrophyOutlined,
    HeartOutlined,
    GiftOutlined
} from '@ant-design/icons';
import { useAuth } from '../../../context/useAuth';
import dayjs from 'dayjs';
import './ProfileAntd.css';

const { Title, Text, Paragraph } = Typography;

const ProfileAntd = () => {
    const { user, logout } = useAuth();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [activeTab, setActiveTab] = useState('1');

    // Enhanced mock user data
    const userData = {
        name: user?.name || 'Khách hàng',
        email: user?.email || 'khachhang@hotcinemas.com',
        phone: '0987654321',
        birthDate: '1990-05-15',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        membershipLevel: 'VIP',
        points: 2450,
        nextLevelPoints: 5000,
        totalBookings: 27,
        totalSpent: 3850000,
        joinDate: '2022-01-15',
        avatar: null,
        notifications: {
            email: true,
            sms: true,
            promotions: false
        },
        preferences: {
            genres: ['Hành động', 'Khoa học viễn tưởng', 'Kinh dị'],
            cinemas: ['CGV Vincom', 'Lotte Cinema', 'Galaxy Cinema']
        }
    };

    // Mock booking history
    const recentBookings = [
        {
            id: 1,
            movie: 'Avatar: The Way of Water',
            moviePoster: 'https://via.placeholder.com/100x150?text=Avatar',
            cinema: 'CGV Vincom Center',
            room: 'Phòng 3',
            date: '2024-01-15',
            time: '19:30',
            seats: ['G7', 'G8'],
            total: 180000,
            status: 'completed',
            rating: 5
        },
        {
            id: 2,
            movie: 'Black Panther: Wakanda Forever',
            moviePoster: 'https://via.placeholder.com/100x150?text=BlackPanther',
            cinema: 'Lotte Cinema Landmark',
            room: 'Phòng 5',
            date: '2024-01-20',
            time: '20:15',
            seats: ['F5', 'F6'],
            total: 200000,
            status: 'upcoming',
            rating: null
        }
    ];

    // Mock favorite movies
    const favoriteMovies = [
        {
            id: 1,
            title: 'Inception',
            poster: 'https://via.placeholder.com/200x300?text=Inception',
            genre: 'Khoa học viễn tưởng',
            year: 2010,
            rating: 5
        },
        {
            id: 2,
            title: 'The Dark Knight',
            poster: 'https://via.placeholder.com/200x300?text=DarkKnight',
            genre: 'Hành động',
            year: 2008,
            rating: 5
        }
    ];

    useEffect(() => {
        if (editModalVisible) {
            form.setFieldsValue({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                birthDate: userData.birthDate ? dayjs(userData.birthDate) : null,
                address: userData.address
            });
        }
    }, [editModalVisible, form, userData]);

    const handleEditProfile = () => {
        setEditModalVisible(true);
    };

    const handleSaveProfile = async (values) => {
        setLoading(true);
        try {
            // Simulate API call
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

    const handleChangePassword = async (values) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            Modal.success({
                title: 'Thành công',
                content: 'Đổi mật khẩu thành công!'
            });
            setChangePasswordVisible(false);
            passwordForm.resetFields();
        } catch (error) {
            Modal.error({
                title: 'Lỗi',
                content: 'Có lỗi xảy ra khi đổi mật khẩu!'
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'green';
            case 'upcoming': return 'blue';
            case 'cancelled': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Đã xem';
            case 'upcoming': return 'Sắp xem';
            case 'cancelled': return 'Đã hủy';
            default: return 'Không xác định';
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
                    {/* Profile Header */}
                    <Col span={24}>
                        <Card className="profile-header-card">
                            <div className="profile-header">
                                <div className="profile-avatar-section">
                                    <div className="avatar-container">
                                        <Avatar
                                            size={100}
                                            icon={<UserOutlined />}
                                            className="profile-avatar"
                                            src={userData.avatar}
                                        />
                                    </div>
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
                                        <div className="profile-stats">
                                            <Statistic
                                                title="Điểm tích lũy"
                                                value={userData.points}
                                                suffix={`/${userData.nextLevelPoints}`}
                                            />
                                            <Progress
                                                percent={(userData.points / userData.nextLevelPoints) * 100}
                                                size="small"
                                                strokeColor="#e50914"
                                            />
                                        </div>
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
                                            icon={<SettingOutlined />}
                                            onClick={() => setChangePasswordVisible(true)}
                                        >
                                            Đổi mật khẩu
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

                    {/* Stats Cards */}
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

                    {/* Main Content Tabs */}
                    <Col span={24}>
                        <Card className="profile-content-card">
                            <Tabs activeKey={activeTab} onChange={setActiveTab}>
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
                                            <Badge count={userData.points} style={{ backgroundColor: '#e50914' }}>
                                                <TrophyOutlined style={{ fontSize: '18px' }} />
                                            </Badge>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Tabs.TabPane>

                                <Tabs.TabPane
                                    tab={
                                        <span>
                                            <HistoryOutlined />
                                            Lịch sử gần đây
                                        </span>
                                    }
                                    key="2"
                                >
                                    <List
                                        dataSource={recentBookings}
                                        renderItem={(booking) => (
                                            <List.Item className="booking-item">
                                                <Card hoverable className="booking-card">
                                                    <Row gutter={16} align="middle">
                                                        <Col xs={24} sm={4}>
                                                            <div className="movie-poster">
                                                                <img
                                                                    src={booking.moviePoster}
                                                                    alt={booking.movie}
                                                                    style={{ width: '100%', borderRadius: '8px' }}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col xs={24} sm={12}>
                                                            <div className="booking-info">
                                                                <Title level={5} className="movie-title">
                                                                    {booking.movie}
                                                                </Title>
                                                                <Text type="secondary" className="cinema-name">
                                                                    📍 {booking.cinema} - {booking.room}
                                                                </Text>
                                                                <div className="booking-time">
                                                                    <CalendarOutlined /> {booking.date} {booking.time}
                                                                </div>
                                                                <div className="booking-seats">
                                                                    Ghế: {booking.seats.join(', ')}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={24} sm={8}>
                                                            <div className="booking-summary">
                                                                <div className="booking-total">
                                                                    <Text strong>
                                                                        {new Intl.NumberFormat('vi-VN').format(booking.total)}đ
                                                                    </Text>
                                                                </div>
                                                                <Tag color={getStatusColor(booking.status)}>
                                                                    {getStatusText(booking.status)}
                                                                </Tag>
                                                                {booking.rating && (
                                                                    <div className="booking-rating">
                                                                        <StarFilled style={{ color: '#fadb14' }} />
                                                                        <span>{booking.rating}/5</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </List.Item>
                                        )}
                                    />
                                </Tabs.TabPane>

                                <Tabs.TabPane
                                    tab={
                                        <span>
                                            <HeartOutlined />
                                            Phim yêu thích
                                        </span>
                                    }
                                    key="3"
                                >
                                    <Row gutter={[16, 16]}>
                                        {favoriteMovies.map(movie => (
                                            <Col xs={24} sm={12} md={8} lg={6} key={movie.id}>
                                                <Card
                                                    hoverable
                                                    cover={
                                                        <img
                                                            alt={movie.title}
                                                            src={movie.poster}
                                                            style={{ height: 200, objectFit: 'cover' }}
                                                        />
                                                    }
                                                    actions={[
                                                        <HeartOutlined key="favorite" />,
                                                        <StarFilled key="rating" style={{ color: '#fadb14' }} />,
                                                    ]}
                                                >
                                                    <Card.Meta
                                                        title={movie.title}
                                                        description={
                                                            <div>
                                                                <div>{movie.genre}</div>
                                                                <div>Năm: {movie.year}</div>
                                                                <div>
                                                                    <StarFilled style={{ color: '#fadb14' }} />
                                                                    {movie.rating}/5
                                                                </div>
                                                            </div>
                                                        }
                                                    />
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </Tabs.TabPane>

                                <Tabs.TabPane
                                    tab={
                                        <span>
                                            <SettingOutlined />
                                            Cài đặt
                                        </span>
                                    }
                                    key="4"
                                >
                                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                        <Card title="Thông báo" size="small">
                                            <Row gutter={[16, 16]}>
                                                <Col span={24}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <Text strong>Thông báo email</Text>
                                                            <br />
                                                            <Text type="secondary">Nhận thông báo về phim mới và khuyến mãi</Text>
                                                        </div>
                                                        <Switch defaultChecked={userData.notifications.email} />
                                                    </div>
                                                </Col>
                                                <Col span={24}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <Text strong>Thông báo SMS</Text>
                                                            <br />
                                                            <Text type="secondary">Nhận SMS xác nhận đặt vé</Text>
                                                        </div>
                                                        <Switch defaultChecked={userData.notifications.sms} />
                                                    </div>
                                                </Col>
                                                <Col span={24}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <Text strong>Khuyến mãi</Text>
                                                            <br />
                                                            <Text type="secondary">Nhận thông báo về các chương trình khuyến mãi</Text>
                                                        </div>
                                                        <Switch defaultChecked={userData.notifications.promotions} />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>

                                        <Card title="Sở thích" size="small">
                                            <Row gutter={[16, 16]}>
                                                <Col span={12}>
                                                    <Text strong>Thể loại yêu thích:</Text>
                                                    <div style={{ marginTop: 8 }}>
                                                        {userData.preferences.genres.map(genre => (
                                                            <Tag key={genre} color="blue">{genre}</Tag>
                                                        ))}
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong>Rạp yêu thích:</Text>
                                                    <div style={{ marginTop: 8 }}>
                                                        {userData.preferences.cinemas.map(cinema => (
                                                            <Tag key={cinema} color="green">{cinema}</Tag>
                                                        ))}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Space>
                                </Tabs.TabPane>
                            </Tabs>
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

                {/* Change Password Modal */}
                <Modal
                    title="Đổi mật khẩu"
                    open={changePasswordVisible}
                    onCancel={() => setChangePasswordVisible(false)}
                    footer={null}
                    width={500}
                >
                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handleChangePassword}
                    >
                        <Form.Item
                            label="Mật khẩu hiện tại"
                            name="currentPassword"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                        </Form.Item>
                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu mới" />
                        </Form.Item>
                        <Form.Item
                            label="Xác nhận mật khẩu mới"
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Xác nhận mật khẩu mới" />
                        </Form.Item>
                        <Row justify="end" gutter={8}>
                            <Col>
                                <Button onClick={() => setChangePasswordVisible(false)}>
                                    Hủy
                                </Button>
                            </Col>
                            <Col>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Đổi mật khẩu
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
