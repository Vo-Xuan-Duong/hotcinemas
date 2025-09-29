import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    Statistic,
    Table,
    Select,
    DatePicker,
    Badge,
    Progress,
    Typography,
    Space,
    Button,
    Tag
} from 'antd';
import {
    DollarOutlined,
    UserOutlined,
    VideoCameraOutlined,
    ShopOutlined,
    FileTextOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    EyeOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import './DashboardAntd.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const DashboardAntd = () => {
    const [stats, setStats] = useState({
        totalMovies: 125,
        totalCinemas: 12,
        totalUsers: 15420,
        totalBookings: 8945,
        totalRevenue: 2850000000,
        pendingBookings: 23
    });

    const [recentBookings, setRecentBookings] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [movieStats, setMovieStats] = useState([]);
    const [chartPeriod, setChartPeriod] = useState('month');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, [chartPeriod]);

    const loadDashboardData = () => {
        // Mock data for demonstration
        const mockRevenueData = [
            { name: 'T1', revenue: 240000000, bookings: 1200 },
            { name: 'T2', revenue: 220000000, bookings: 1100 },
            { name: 'T3', revenue: 280000000, bookings: 1400 },
            { name: 'T4', revenue: 320000000, bookings: 1600 },
            { name: 'T5', revenue: 350000000, bookings: 1750 },
            { name: 'T6', revenue: 380000000, bookings: 1900 },
            { name: 'T7', revenue: 420000000, bookings: 2100 },
            { name: 'T8', revenue: 390000000, bookings: 1950 },
            { name: 'T9', revenue: 360000000, bookings: 1800 },
            { name: 'T10', revenue: 340000000, bookings: 1700 },
            { name: 'T11', revenue: 380000000, bookings: 1900 },
            { name: 'T12', revenue: 450000000, bookings: 2250 }
        ];

        const mockRecentBookings = [
            { id: 1, user: 'Nguyễn Văn A', movie: 'Spider-Man: No Way Home', cinema: 'CGV Sư Vạn Hạnh', seats: 'A1, A2', amount: 200000, status: 'confirmed', time: '2024-01-15 14:30' },
            { id: 2, user: 'Trần Thị B', movie: 'Encanto', cinema: 'Lotte Cinema Đầm Sen', seats: 'B5, B6, B7', amount: 300000, status: 'pending', time: '2024-01-15 19:45' },
            { id: 3, user: 'Lê Văn C', movie: 'The Batman', cinema: 'Galaxy Cinema Nguyễn Du', seats: 'C10', amount: 100000, status: 'confirmed', time: '2024-01-15 16:20' },
            { id: 4, user: 'Phạm Thị D', movie: 'Dune', cinema: 'BHD Star Vincom', seats: 'D1, D2', amount: 220000, status: 'cancelled', time: '2024-01-15 20:00' },
            { id: 5, user: 'Hoàng Văn E', movie: 'No Time to Die', cinema: 'CGV Landmark 81', seats: 'E12, E13', amount: 250000, status: 'confirmed', time: '2024-01-15 21:15' }
        ];

        const mockMovieStats = [
            { name: 'Spider-Man', value: 25, color: '#e50914' },
            { name: 'Encanto', value: 20, color: '#ff6b35' },
            { name: 'The Batman', value: 18, color: '#ffa726' },
            { name: 'Dune', value: 15, color: '#66bb6a' },
            { name: 'Other', value: 22, color: '#42a5f5' }
        ];

        setRevenueData(mockRevenueData);
        setRecentBookings(mockRecentBookings);
        setMovieStats(mockMovieStats);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const bookingColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: 'Phim',
            dataIndex: 'movie',
            key: 'movie',
            ellipsis: true,
        },
        {
            title: 'Rạp',
            dataIndex: 'cinema',
            key: 'cinema',
            ellipsis: true,
        },
        {
            title: 'Ghế',
            dataIndex: 'seats',
            key: 'seats',
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusConfig = {
                    confirmed: { color: 'success', text: 'Đã xác nhận' },
                    pending: { color: 'warning', text: 'Chờ xử lý' },
                    cancelled: { color: 'error', text: 'Đã hủy' }
                };
                return <Badge status={statusConfig[status].color} text={statusConfig[status].text} />;
            },
        },
        {
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: () => (
                <Button type="link" icon={<EyeOutlined />} size="small">
                    Chi tiết
                </Button>
            ),
        },
    ];

    const StatCard = ({ title, value, prefix, suffix, trend, trendValue, icon, color }) => (
        <Card className="stat-card">
            <Statistic
                title={title}
                value={value}
                prefix={icon}
                suffix={suffix}
                valueStyle={{ color: color || '#e50914' }}
            />
            {trend && (
                <div className="stat-trend">
                    {trend === 'up' ? (
                        <Text type="success">
                            <ArrowUpOutlined /> {trendValue}%
                        </Text>
                    ) : (
                        <Text type="danger">
                            <ArrowDownOutlined /> {trendValue}%
                        </Text>
                    )}
                    <Text type="secondary"> so với tháng trước</Text>
                </div>
            )}
        </Card>
    );

    return (
        <div className="dashboard-antd">
            <div className="dashboard-header">
                <Title level={2}>Dashboard</Title>
                <Space>
                    <RangePicker />
                    <Select defaultValue="month" onChange={setChartPeriod}>
                        <Option value="week">Tuần</Option>
                        <Option value="month">Tháng</Option>
                        <Option value="year">Năm</Option>
                    </Select>
                </Space>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[24, 24]} className="stats-row">
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Tổng doanh thu"
                        value={stats.totalRevenue}
                        icon={<DollarOutlined />}
                        suffix=" VNĐ"
                        trend="up"
                        trendValue={12.5}
                        color="#52c41a"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Tổng vé đã bán"
                        value={stats.totalBookings}
                        icon={<FileTextOutlined />}
                        trend="up"
                        trendValue={8.2}
                        color="#1890ff"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Người dùng"
                        value={stats.totalUsers}
                        icon={<UserOutlined />}
                        trend="up"
                        trendValue={15.3}
                        color="#722ed1"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Phim đang chiếu"
                        value={stats.totalMovies}
                        icon={<VideoCameraOutlined />}
                        trend="down"
                        trendValue={2.1}
                        color="#fa8c16"
                    />
                </Col>
            </Row>

            {/* Charts */}
            <Row gutter={[24, 24]} className="charts-row">
                <Col xs={24} lg={16}>
                    <Card title="Doanh thu theo thời gian" className="chart-card">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a1a1a',
                                        border: '1px solid #333',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value, name) => [
                                        name === 'revenue' ? formatCurrency(value) : value,
                                        name === 'revenue' ? 'Doanh thu' : 'Số vé'
                                    ]}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#e50914"
                                    strokeWidth={3}
                                    dot={{ fill: '#e50914', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: '#e50914', strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="bookings"
                                    stroke="#1890ff"
                                    strokeWidth={2}
                                    yAxisId="right"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Phim phổ biến" className="chart-card">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={movieStats}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {movieStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Recent Bookings Table */}
            <Row gutter={[24, 24]} className="table-row">
                <Col span={24}>
                    <Card
                        title="Đặt vé gần đây"
                        extra={
                            <Button type="primary" size="small">
                                Xem tất cả
                            </Button>
                        }
                        className="table-card"
                    >
                        <Table
                            columns={bookingColumns}
                            dataSource={recentBookings}
                            rowKey="id"
                            pagination={{ pageSize: 5, showSizeChanger: false }}
                            scroll={{ x: 800 }}
                            loading={loading}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row gutter={[24, 24]} className="actions-row">
                <Col xs={24} sm={8}>
                    <Card className="action-card">
                        <div className="action-content">
                            <VideoCameraOutlined className="action-icon" />
                            <div className="action-info">
                                <Title level={4}>Thêm phim mới</Title>
                                <Text type="secondary">Cập nhật danh sách phim</Text>
                            </div>
                            <Button type="primary">Thêm</Button>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="action-card">
                        <div className="action-content">
                            <CalendarOutlined className="action-icon" />
                            <div className="action-info">
                                <Title level={4}>Tạo lịch chiếu</Title>
                                <Text type="secondary">Quản lý suất chiếu</Text>
                            </div>
                            <Button type="primary">Tạo</Button>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="action-card">
                        <div className="action-content">
                            <ShopOutlined className="action-icon" />
                            <div className="action-info">
                                <Title level={4}>Quản lý rạp</Title>
                                <Text type="secondary">Cấu hình hệ thống rạp</Text>
                            </div>
                            <Button type="primary">Quản lý</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardAntd;
