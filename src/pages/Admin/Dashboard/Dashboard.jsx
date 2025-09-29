import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Select,
  Typography,
  Tag,
  Avatar,
  Space,
  Progress,
  Divider,
  Skeleton
} from 'antd';
import {
  DollarOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ShopOutlined,
  CalendarOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './DashboardAntd.css';
import bookingsData from '../../../data/bookings.json';
import moviesData from '../../../data/movies.json';
import cinemasData from '../../../data/cinemas.json';
import usersData from '../../../data/users.json';

const { Title, Text } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const [chartPeriod, setChartPeriod] = useState('month');
  const [loading, setLoading] = useState(false);

  // Thống kê tổng quan từ dữ liệu JSON
  const stats = {
    totalMovies: moviesData.length,
    totalCinemas: cinemasData.length,
    totalUsers: usersData.length,
    totalBookings: bookingsData.length,
    confirmedBookings: bookingsData.filter(b => b.status === 'confirmed').length,
    pendingBookings: bookingsData.filter(b => b.status === 'pending').length,
    totalRevenue: bookingsData
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0),
    totalSeats: bookingsData
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.seats.length, 0)
  };

  // Booking gần đây
  const recentBookings = bookingsData
    .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
    .slice(0, 5);

  // Dữ liệu biểu đồ doanh thu theo tháng
  const revenueData = [
    { month: 'T1', revenue: 45000000, bookings: 150 },
    { month: 'T2', revenue: 52000000, bookings: 180 },
    { month: 'T3', revenue: 48000000, bookings: 165 },
    { month: 'T4', revenue: 61000000, bookings: 210 },
    { month: 'T5', revenue: 58000000, bookings: 195 },
    { month: 'T6', revenue: 67000000, bookings: 230 },
    { month: 'T7', revenue: 75000000, bookings: 260 },
    { month: 'T8', revenue: 69000000, bookings: 240 },
    { month: 'T9', revenue: 64000000, bookings: 220 },
    { month: 'T10', revenue: 71000000, bookings: 245 },
    { month: 'T11', revenue: 68000000, bookings: 235 },
    { month: 'T12', revenue: 78000000, bookings: 275 }
  ];

  // Top phim có doanh thu cao nhất
  const topMovies = moviesData
    .map(movie => {
      const movieBookings = bookingsData.filter(b => b.movieId === movie.id && b.status === 'confirmed');
      return {
        ...movie,
        totalRevenue: movieBookings.reduce((sum, b) => sum + b.totalPrice, 0),
        totalBookings: movieBookings.length
      };
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  // Top rạp có doanh thu cao nhất
  const topCinemas = cinemasData
    .map(cinema => {
      const cinemaBookings = bookingsData.filter(b => b.cinemaId === cinema.id && b.status === 'confirmed');
      return {
        ...cinema,
        totalRevenue: cinemaBookings.reduce((sum, b) => sum + b.totalPrice, 0),
        totalBookings: cinemaBookings.length
      };
    })
  // Render trạng thái booking
  const renderBookingStatus = (status) => {
    const statusConfig = {
      confirmed: { color: 'success', text: 'Đã xác nhận' },
      pending: { color: 'warning', text: 'Chờ xử lý' },
      cancelled: { color: 'error', text: 'Đã hủy' },
      expired: { color: 'default', text: 'Hết hạn' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Cột cho bảng booking gần đây
  const bookingColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.customerInfo?.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phim',
      dataIndex: 'movieTitle',
      key: 'movieTitle',
      ellipsis: true,
    },
    {
      title: 'Rạp',
      dataIndex: 'cinemaName',
      key: 'cinemaName',
      ellipsis: true,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (amount) => `${amount?.toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: renderBookingStatus,
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <Title level={2} className="dashboard-title">
          Dashboard Quản Trị
        </Title>
        <Text className="dashboard-subtitle">
          Tổng quan hệ thống HotCinemas
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stats-card">
            <Statistic
              title="Tổng số phim"
              value={stats.totalMovies}
              prefix={<VideoCameraOutlined className="stats-icon" style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stats-card">
            <Statistic
              title="Tổng số rạp"
              value={stats.totalCinemas}
              prefix={<ShopOutlined className="stats-icon" style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stats-card">
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined className="stats-icon" style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stats-card">
            <Statistic
              title="Tổng đặt vé"
              value={stats.totalBookings}
              prefix={<CalendarOutlined className="stats-icon" style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue and Performance */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card className="stats-card performance-card">
            <Statistic
              title="Tổng doanh thu"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="₫"
              formatter={(value) => value?.toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="stats-card">
            <Statistic
              title="Vé đã xác nhận"
              value={stats.confirmedBookings}
              prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="stats-card">
            <Statistic
              title="Chờ xử lý"
              value={stats.pendingBookings}
              prefix={<RiseOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card className="chart-card" title="Doanh thu theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString('vi-VN')} ₫`, 'Doanh thu']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1890ff"
                  strokeWidth={3}
                  dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="chart-card" title="Số lượng đặt vé theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Số đặt vé']} />
                <Legend />
                <Bar dataKey="bookings" fill="#52c41a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings and Top Lists */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card className="recent-table" title="Đặt vé gần đây">
            <Table
              columns={bookingColumns}
              dataSource={recentBookings}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Top phim doanh thu cao">
            {topMovies.map((movie, index) => (
              <div key={movie.id} className="top-item">
                <div className="top-item-rank">#{index + 1}</div>
                <Avatar
                  src={movie.poster}
                  size={40}
                  style={{ marginRight: 12 }}
                  icon={<VideoCameraOutlined />}
                />
                <div className="top-item-info">
                  <div className="top-item-title">{movie.title}</div>
                  <div className="top-item-meta">
                    {movie.totalBookings || 0} vé | {(movie.totalRevenue || 0).toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} className="quick-actions">
        <Col span={24}>
          <Title level={4}>Thao tác nhanh</Title>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="quick-action-card" onClick={() => window.location.href = '/admin/movies'}>
            <VideoCameraOutlined className="quick-action-icon" />
            <div className="quick-action-title">Quản lý Phim</div>
            <div className="quick-action-desc">Thêm, sửa, xóa phim</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="quick-action-card" onClick={() => window.location.href = '/admin/cinemas'}>
            <ShopOutlined className="quick-action-icon" />
            <div className="quick-action-title">Quản lý Rạp</div>
            <div className="quick-action-desc">Quản lý thông tin rạp</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="quick-action-card" onClick={() => window.location.href = '/admin/schedules'}>
            <CalendarOutlined className="quick-action-icon" />
            <div className="quick-action-title">Lịch Chiếu</div>
            <div className="quick-action-desc">Quản lý suất chiếu</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="quick-action-card" onClick={() => window.location.href = '/admin/bookings'}>
            <CalendarOutlined className="quick-action-icon" />
            <div className="quick-action-title">Đặt Vé</div>
            <div className="quick-action-desc">Xem và quản lý đặt vé</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 