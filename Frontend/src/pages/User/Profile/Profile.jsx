import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Form,
    Input,
    Select,
    DatePicker,
    Upload,
    Avatar,
    Typography,
    Space,
    Divider,
    Tag,
    Progress,
    Statistic,
    Badge,
    Tabs,
    Table,
    Rate,
    Empty,
    message,
    Modal,
    Breadcrumb,
    BackTop
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    CameraOutlined,
    SaveOutlined,
    HistoryOutlined,
    HeartOutlined,
    TrophyOutlined,
    GiftOutlined,
    SettingOutlined,
    SecurityScanOutlined,
    BellOutlined,
    HomeOutlined,
    ArrowUpOutlined,
    StarOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined
} from '@ant-design/icons';
import {
    User,
    Edit,
    Camera,
    Save,
    Heart,
    Trophy,
    Gift,
    Settings,
    Shield,
    Bell,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Star,
    Ticket,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import useAuth from '../../../hooks/useAuth';
import './Profile.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [activeTab, setActiveTab] = useState('info');

    // Mock data for user stats and history
    const [userStats, setUserStats] = useState({
        totalBookings: 25,
        totalSpent: 2500000,
        favoriteMovies: 15,
        loyaltyPoints: 1250,
        memberLevel: 'VIP Gold',
        joinDate: '2023-01-15'
    });

    const [bookingHistory, setBookingHistory] = useState([
        {
            id: 1,
            movie: 'Avengers: Endgame',
            cinema: 'CGV Vincom Center',
            date: '2024-01-15',
            time: '19:30',
            seats: ['G7', 'G8'],
            total: 180000,
            status: 'completed'
        },
        {
            id: 2,
            movie: 'Spider-Man: No Way Home',
            cinema: 'Lotte Cinema Diamond Plaza',
            date: '2024-01-10',
            time: '21:00',
            seats: ['F5', 'F6'],
            total: 200000,
            status: 'completed'
        }
    ]);

    const [favoriteMovies, setFavoriteMovies] = useState([
        {
            id: 1,
            title: 'The Dark Knight',
            poster: 'https://picsum.photos/200/300?random=1',
            rating: 9.0,
            year: 2008
        },
        {
            id: 2,
            title: 'Inception',
            poster: 'https://picsum.photos/200/300?random=2',
            rating: 8.8,
            year: 2010
        }
    ]);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                phone: user.phone,
                birthDate: user.birthDate ? dayjs(user.birthDate) : null,
                gender: user.gender,
                address: user.address,
                city: user.city
            });
        }
    }, [user, form]);

    const handleSave = async (values) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            await updateUser({
                ...values,
                birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null
            });

            message.success('Cập nhật thông tin thành công!');
            setEditMode(false);
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật thông tin!');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setAvatar(info.file.response.url);
            setLoading(false);
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'VIP Gold': return '#faad14';
            case 'VIP Silver': return '#bfbfbf';
            case 'VIP Platinum': return '#722ed1';
            default: return '#1890ff';
        }
    };

    const getLevelProgress = (points) => {
        const levels = [
            { name: 'Bronze', min: 0, max: 500 },
            { name: 'Silver', min: 500, max: 1000 },
            { name: 'Gold', min: 1000, max: 2000 },
            { name: 'Platinum', min: 2000, max: 5000 }
        ];

        const currentLevel = levels.find(l => points >= l.min && points < l.max);
        if (!currentLevel) return 100;

        return ((points - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;
    };

    const bookingColumns = [
        {
            title: 'Phim',
            dataIndex: 'movie',
            key: 'movie',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Rạp',
            dataIndex: 'cinema',
            key: 'cinema'
        },
        {
            title: 'Ngày chiếu',
            dataIndex: 'date',
            key: 'date',
            render: (date) => (
                <Space>
                    <Calendar size={14} />
                    {dayjs(date).format('DD/MM/YYYY')}
                </Space>
            )
        },
        {
            title: 'Giờ chiếu',
            dataIndex: 'time',
            key: 'time',
            render: (time) => (
                <Space>
                    <Clock size={14} />
                    {time}
                </Space>
            )
        },
        {
            title: 'Ghế',
            dataIndex: 'seats',
            key: 'seats',
            render: (seats) => seats.join(', ')
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
            render: (total) => (
                <Text strong style={{ color: 'var(--accent-red)' }}>
                    {total.toLocaleString('vi-VN')}đ
                </Text>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'completed' ? 'success' : 'processing'}>
                    {status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                </Tag>
            )
        }
    ];

  return (
        <div className="profile-modern">
            {/* Breadcrumb */}
            <div className="breadcrumb-section">
                <div className="container">
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/">
                                <HomeOutlined /> Trang chủ
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <UserOutlined /> Hồ sơ cá nhân
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <div className="container">
                {/* Profile Header */}
                <Card className="profile-header-card">
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} sm={8} md={6}>
                            <div className="avatar-section">
                                <Badge
                                    count={
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={<Camera size={16} />}
                                            size="small"
                                            onClick={() => setEditMode(true)}
                                        />
                                    }
                                    offset={[-10, 40]}
                                >
                                    <Avatar
                                        size={120}
                                        src={avatar || user?.avatar}
                                        icon={<User size={40} />}
                                        className="profile-avatar"
                                    />
                                </Badge>
                                <div className="user-level">
                                    <Badge
                                        count={userStats.memberLevel}
                                        style={{
                                            backgroundColor: getLevelColor(userStats.memberLevel),
                                            fontSize: '11px',
                                            fontWeight: 600
                                        }}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={16} md={18}>
                            <div className="profile-info">
                                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                    <div className="name-section">
                                        <Title level={2} style={{ margin: 0 }}>
                                            {user?.name || 'Người dùng'}
                                        </Title>
                                        <Text type="secondary" style={{ fontSize: '14px' }}>
                                            Thành viên từ {dayjs(userStats.joinDate).format('DD/MM/YYYY')}
                                        </Text>
                                    </div>

                                    <Space wrap size={16} style={{ marginTop: '16px' }}>
                                        <Space size={6}>
                                            <Mail size={16} color="#6b7280" />
                                            <Text style={{ fontSize: '14px' }}>{user?.email}</Text>
                                        </Space>
                                        <Space size={6}>
                                            <Phone size={16} color="#6b7280" />
                                            <Text style={{ fontSize: '14px' }}>{user?.phone || '1234567890'}</Text>
                                        </Space>
                                        <Space size={6}>
                                            <MapPin size={16} color="#6b7280" />
                                            <Text style={{ fontSize: '14px' }}>{user?.address || 'Localhost'}</Text>
                                        </Space>
                                    </Space>

                                    <div className="loyalty-progress">
                                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                            <Space justify="space-between" style={{ width: '100%' }}>
                                                <Text strong style={{ fontSize: '15px' }}>
                                                    Điểm tích lũy: {userStats.loyaltyPoints.toLocaleString('vi-VN')}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: '13px' }}>
                                                    {userStats.memberLevel}
                                                </Text>
                                            </Space>
                                            <Progress
                                                percent={getLevelProgress(userStats.loyaltyPoints)}
                                                strokeColor={getLevelColor(userStats.memberLevel)}
                                                trailColor="rgba(0,0,0,0.06)"
                                                strokeWidth={10}
                                                showInfo={false}
                                            />
                                        </Space>
                                    </div>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Stats Cards */}
                <Row gutter={[16, 16]} className="stats-section">
                    <Col xs={12} sm={6}>
                        <Card className="stat-card" bordered={false}>
                            <Statistic
                                title="Tổng đặt vé"
                                value={userStats.totalBookings}
                                prefix={<Ticket size={20} color="#e50914" />}
                                valueStyle={{
                                    color: 'var(--accent-red)',
                                    fontSize: '28px',
                                    fontWeight: '700'
                                }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card className="stat-card" bordered={false}>
                            <Statistic
                                title="Tổng chi tiêu"
                                value={userStats.totalSpent}
                                prefix={<Gift size={20} color="#10b981" />}
                                suffix="đ"
                                valueStyle={{
                                    color: '#10b981',
                                    fontSize: '28px',
                                    fontWeight: '700'
                                }}
                                formatter={(value) => value.toLocaleString('vi-VN')}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card className="stat-card" bordered={false}>
                            <Statistic
                                title="Phim yêu thích"
                                value={userStats.favoriteMovies}
                                prefix={<Heart size={20} color="#ef4444" />}
                                valueStyle={{
                                    color: '#ef4444',
                                    fontSize: '28px',
                                    fontWeight: '700'
                                }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card className="stat-card" bordered={false}>
                            <Statistic
                                title="Điểm tích lũy"
                                value={userStats.loyaltyPoints}
                                prefix={<Trophy size={20} color="#faad14" />}
                                valueStyle={{
                                    color: '#faad14',
                                    fontSize: '28px',
                                    fontWeight: '700'
                                }}
                                formatter={(value) => value.toLocaleString('vi-VN')}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Main Content Tabs */}
                <Card className="content-tabs-card">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        size="large"
                        tabBarStyle={{ marginBottom: 24 }}
                    >
                        <TabPane
                            tab={
                                <Space>
                                    <User size={16} />
                                    Thông tin cá nhân
                                </Space>
                            }
                            key="info"
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSave}
                                disabled={!editMode}
                            >
                                <Row gutter={[24, 16]}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Họ và tên"
                                            name="name"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                        >
                                            <Input size="large" prefix={<User size={16} />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập email!' },
                                                { type: 'email', message: 'Email không hợp lệ!' }
                                            ]}
                                        >
                                            <Input size="large" prefix={<Mail size={16} />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Số điện thoại"
                                            name="phone"
                                        >
                                            <Input size="large" prefix={<Phone size={16} />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Ngày sinh"
                                            name="birthDate"
                                        >
                                            <DatePicker
                                                size="large"
                                                style={{ width: '100%' }}
                                                format="DD/MM/YYYY"
                                                placeholder="Chọn ngày sinh"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Giới tính"
                                            name="gender"
                                        >
                                            <Select size="large" placeholder="Chọn giới tính">
                                                <Option value="male">Nam</Option>
                                                <Option value="female">Nữ</Option>
                                                <Option value="other">Khác</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Thành phố"
                                            name="city"
                                        >
                                            <Select size="large" placeholder="Chọn thành phố">
                                                <Option value="ho-chi-minh">Thành phố Hồ Chí Minh</Option>
                                                <Option value="ha-noi">Hà Nội</Option>
                                                <Option value="da-nang">Đà Nẵng</Option>
                                                <Option value="can-tho">Cần Thơ</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Form.Item
                                            label="Địa chỉ"
                                            name="address"
                                        >
                                            <Input.TextArea
                                                size="large"
                                                rows={3}
                                                placeholder="Nhập địa chỉ của bạn"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider />

                                <Space>
                                    {editMode ? (
                                        <>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={loading}
                                                icon={<Save size={16} />}
                                                size="large"
                                            >
                                                Lưu thay đổi
                                            </Button>
                                            <Button
                                                onClick={() => setEditMode(false)}
                                                size="large"
                                            >
                                                Hủy
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            type="primary"
                                            onClick={() => setEditMode(true)}
                                            icon={<Edit size={16} />}
                                            size="large"
                                        >
                                            Chỉnh sửa thông tin
                                        </Button>
                                    )}
                                </Space>
                            </Form>
                        </TabPane>

                        <TabPane
                            tab={
                                <Space>
                                    <Clock size={16} />
                                    Lịch sử đặt vé
                                </Space>
                            }
                            key="history"
                        >
                            <Table
                                columns={bookingColumns}
                                dataSource={bookingHistory}
                                rowKey="id"
                                pagination={{ pageSize: 10 }}
                                scroll={{ x: 800 }}
                                className="booking-history-table"
                            />
                        </TabPane>

                        <TabPane
                            tab={
                                <Space>
                                    <Heart size={16} />
                                    Phim yêu thích
                                </Space>
                            }
                            key="favorites"
                        >
                            {favoriteMovies.length > 0 ? (
                                <Row gutter={[16, 16]}>
                                    {favoriteMovies.map(movie => (
                                        <Col xs={12} sm={8} md={6} lg={4} key={movie.id}>
                                            <Card
                                                hoverable
                                                cover={
                                                    <img
                                                        src={movie.poster}
                                                        alt={movie.title}
                                                        style={{ height: 200, objectFit: 'cover' }}
                                                    />
                                                }
                                                className="favorite-movie-card"
                                            >
                                                <Card.Meta
                                                    title={
                                                        <Text ellipsis={{ tooltip: movie.title }}>
                                                            {movie.title}
                                                        </Text>
                                                    }
                                                    description={
                                                        <Space direction="vertical" size={4}>
                                                            <Space>
                                                                <Star size={12} fill="#faad14" color="#faad14" />
                                                                <Text>{movie.rating}</Text>
                                                            </Space>
                                                            <Text type="secondary">{movie.year}</Text>
                                                        </Space>
                                                    }
                                                />
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <Empty description="Chưa có phim yêu thích nào" />
                            )}
                        </TabPane>

                        <TabPane
                            tab={
                                <Space>
                                    <Settings size={16} />
                                    Cài đặt
                                </Space>
                            }
                            key="settings"
                        >
                            <Space direction="vertical" size={16} style={{ width: '100%' }}>
                                <Card title="Cài đặt thông báo" size="small">
                                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                        <div className="setting-item">
                                            <Space justify="space-between" style={{ width: '100%' }}>
                                                <Space>
                                                    <Bell size={16} />
                                                    <Text>Thông báo email</Text>
                                                </Space>
                                                <Button size="small">Bật</Button>
                                            </Space>
                                        </div>
                                        <div className="setting-item">
                                            <Space justify="space-between" style={{ width: '100%' }}>
                                                <Space>
                                                    <Bell size={16} />
                                                    <Text>Thông báo push</Text>
                                                </Space>
                                                <Button size="small">Bật</Button>
                                            </Space>
                                        </div>
                                    </Space>
                                </Card>

                                <Card title="Bảo mật" size="small">
                                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                        <div className="setting-item">
                                            <Space justify="space-between" style={{ width: '100%' }}>
                                                <Space>
                                                    <Shield size={16} />
                                                    <Text>Đổi mật khẩu</Text>
                                                </Space>
                                                <Button size="small" type="primary">Đổi</Button>
                                            </Space>
                                        </div>
                                        <div className="setting-item">
                                            <Space justify="space-between" style={{ width: '100%' }}>
                                                <Space>
                                                    <Shield size={16} />
                                                    <Text>Xác thực 2 bước</Text>
                                                </Space>
                                                <Button size="small">Bật</Button>
                                            </Space>
                                        </div>
                                    </Space>
                                </Card>
                            </Space>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>

            {/* Back to Top */}
            <BackTop
                style={{
                    height: 50,
                    width: 50,
                    backgroundColor: 'var(--accent-red)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(229, 9, 20, 0.3)',
                }}
            >
                <ArrowUpOutlined style={{ color: 'white', fontSize: '20px' }} />
            </BackTop>
    </div>
  );
};

export default Profile; 
