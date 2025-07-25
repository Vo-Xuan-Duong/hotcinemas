import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalCinemas: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('month'); // 'month' or 'week'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [chartPeriod]);

  const processChartData = (bookings, period) => {
    const now = new Date();
    const data = {};

    if (period === 'month') {
      // Dữ liệu 12 tháng gần nhất
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
        data[key] = { period: monthName, revenue: 0, bookings: 0 };
      }
    } else {
      // Dữ liệu 8 tuần gần nhất
      for (let i = 7; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        const weekStart = new Date(date.getTime() - date.getDay() * 24 * 60 * 60 * 1000);
        const key = `${weekStart.getFullYear()}-W${Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
        const weekName = `Tuần ${Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
        data[key] = { period: weekName, revenue: 0, bookings: 0 };
      }
    }

    // Xử lý dữ liệu bookings
    bookings.forEach(booking => {
      const bookingDate = new Date(booking.createdAt);
      let key;

      if (period === 'month') {
        key = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}`;
      } else {
        const weekStart = new Date(bookingDate.getTime() - bookingDate.getDay() * 24 * 60 * 60 * 1000);
        key = `${weekStart.getFullYear()}-W${Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
      }

      if (data[key]) {
        data[key].revenue += booking.totalAmount || 0;
        data[key].bookings += 1;
      }
    });

    return Object.values(data);
  };

  const loadDashboardData = async () => {
    try {
      const [moviesRes, cinemasRes, usersRes, bookingsRes] = await Promise.all([
        fetch('/src/data/movies.json'),
        fetch('/src/data/cinemas.json'),
        fetch('/src/data/users.json'),
        fetch('/src/data/bookings.json')
      ]);

      const [movies, cinemas, users, bookings] = await Promise.all([
        moviesRes.json(),
        cinemasRes.json(),
        usersRes.json(),
        bookingsRes.json()
      ]);

      const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
      const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;

      setStats({
        totalMovies: movies.length,
        totalCinemas: cinemas.length,
        totalUsers: users.length,
        totalBookings: bookings.length,
        totalRevenue,
        pendingBookings
      });

      // Lấy 5 đặt vé gần nhất
      const sortedBookings = bookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentBookings(sortedBookings);

      // Xử lý dữ liệu biểu đồ
      const chartData = processChartData(bookings, chartPeriod);
      setRevenueData(chartData);
      setBookingData(chartData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period) => {
    setChartPeriod(period);
  };

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Chào mừng đến với trang quản trị Hot Cinemas</p>
      </div>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-movies">
            <div className="stat-icon">🎬</div>
            <div className="stat-info">
              <div className="stat-number">{stats.totalMovies}</div>
              <div className="stat-label">Tổng số phim</div>
            </div>
          </div>

          <div className="stat-card stat-cinemas">
            <div className="stat-icon">🏢</div>
            <div className="stat-info">
              <div className="stat-number">{stats.totalCinemas}</div>
              <div className="stat-label">Tổng số rạp</div>
            </div>
          </div>

          <div className="stat-card stat-users">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Tổng số người dùng</div>
            </div>
          </div>

          <div className="stat-card stat-bookings">
            <div className="stat-icon">🎫</div>
            <div className="stat-info">
              <div className="stat-number">{stats.totalBookings}</div>
              <div className="stat-label">Tổng số đặt vé</div>
            </div>
          </div>

          <div className="stat-card stat-revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <div className="stat-number">{stats.totalRevenue.toLocaleString('vi-VN')}</div>
              <div className="stat-label">Tổng doanh thu (VNĐ)</div>
            </div>
          </div>

          <div className="stat-card stat-pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-number">{stats.pendingBookings}</div>
              <div className="stat-label">Đặt vé chờ xác nhận</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="charts-header">
            <h2>Biểu Đồ Thống Kê</h2>
            <div className="period-selector">
              <button
                className={`period-btn ${chartPeriod === 'month' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('month')}
              >
                Theo Tháng
              </button>
              <button
                className={`period-btn ${chartPeriod === 'week' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('week')}
              >
                Theo Tuần
              </button>
            </div>
          </div>

          <div className="charts-grid">
            {/* Revenue Chart */}
            <div className="chart-container">
              <h3>Doanh Thu</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString('vi-VN')} VNĐ`, 'Doanh Thu']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bookings Chart */}
            <div className="chart-container">
              <h3>Số Lượng Đặt Vé</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [value, 'Số Đặt Vé']}
                  />
                  <Legend />
                  <Bar
                    dataKey="bookings"
                    fill="#82ca9d"
                    name="Số Đặt Vé"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="recent-bookings">
          <h2>Đặt Vé Gần Đây</h2>
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Mã Đặt Vé</th>
                  <th>Người Dùng</th>
                  <th>Phim</th>
                  <th>Rạp</th>
                  <th>Suất Chiếu</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Đặt</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td><span className="booking-id">#{booking.id}</span></td>
                    <td>{booking.userName || 'Không tìm thấy'}</td>
                    <td>{booking.movieTitle || 'Không tìm thấy'}</td>
                    <td>{booking.cinemaName || 'Không tìm thấy'}</td>
                    <td>
                      <div className="showtime-info">
                        <div>{booking.showtime?.date}</div>
                        <div className="showtime-time">{booking.showtime?.time}</div>
                      </div>
                    </td>
                    <td className="amount">{booking?.totalAmount?.toLocaleString('vi-VN')} VNĐ</td>
                    <td>
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status === 'pending' && 'Chờ xác nhận'}
                        {booking.status === 'confirmed' && 'Đã xác nhận'}
                        {booking.status === 'completed' && 'Hoàn thành'}
                        {booking.status === 'cancelled' && 'Đã hủy'}
                        {booking.status === 'expired' && 'Hết hạn'}
                      </span>
                    </td>
                    <td>{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Thao Tác Nhanh</h2>
          <div className="actions-grid">
            <div className="action-card" onClick={() => window.location.href = '/admin/movies'}>
              <div className="action-icon">🎬</div>
              <div className="action-info">
                <div className="action-title">Quản lý Phim</div>
                <div className="action-desc">Thêm, sửa, xóa phim</div>
              </div>
            </div>

            <div className="action-card" onClick={() => window.location.href = '/admin/cinemas'}>
              <div className="action-icon">🏢</div>
              <div className="action-info">
                <div className="action-title">Quản lý Rạp</div>
                <div className="action-desc">Quản lý thông tin rạp</div>
              </div>
            </div>

            <div className="action-card" onClick={() => window.location.href = '/admin/schedules'}>
              <div className="action-icon">📅</div>
              <div className="action-info">
                <div className="action-title">Lịch Chiếu</div>
                <div className="action-desc">Quản lý suất chiếu</div>
              </div>
            </div>

            <div className="action-card" onClick={() => window.location.href = '/admin/bookings'}>
              <div className="action-icon">🎫</div>
              <div className="action-info">
                <div className="action-title">Đặt Vé</div>
                <div className="action-desc">Xem và quản lý đặt vé</div>
              </div>
            </div>

            <div className="action-card" onClick={() => window.location.href = '/admin/users'}>
              <div className="action-icon">👥</div>
              <div className="action-info">
                <div className="action-title">Người Dùng</div>
                <div className="action-desc">Quản lý tài khoản</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 