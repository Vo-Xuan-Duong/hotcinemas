import React, { useState, useEffect } from 'react';
import './Admin.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsRes, moviesRes, cinemasRes, usersRes] = await Promise.all([
        fetch('/src/data/bookings.json'),
        fetch('/src/data/movies.json'),
        fetch('/src/data/cinemas.json'),
        fetch('/src/data/users.json')
      ]);
      
      const [bookingsData, moviesData, cinemasData, usersData] = await Promise.all([
        bookingsRes.json(),
        moviesRes.json(),
        cinemasRes.json(),
        usersRes.json()
      ]);
      
      setBookings(bookingsData);
      setMovies(moviesData);
      setCinemas(cinemasData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMovieTitle = (movieId) => {
    const movie = movies.find(m => m.id === movieId);
    return movie ? movie.title : 'Không tìm thấy';
  };

  const getCinemaName = (cinemaId) => {
    const cinema = cinemas.find(c => c.id === cinemaId);
    return cinema ? cinema.name : 'Không tìm thấy';
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName : 'Không tìm thấy';
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (window.confirm(`Bạn có chắc chắn muốn cập nhật trạng thái thành "${newStatus}"?`)) {
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
          : booking
      ));
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đặt vé này?')) {
      setBookings(bookings.filter(booking => booking.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Chờ xác nhận', class: 'status-pending' },
      confirmed: { text: 'Đã xác nhận', class: 'status-confirmed' },
      completed: { text: 'Hoàn thành', class: 'status-completed' },
      cancelled: { text: 'Đã hủy', class: 'status-cancelled' },
      expired: { text: 'Hết hạn', class: 'status-expired' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Quản lý Đặt Vé</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
            <option value="expired">Hết hạn</option>
          </select>
        </div>
      </div>

      <div className="admin-content">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã Đặt Vé</th>
                <th>Người Dùng</th>
                <th>Phim</th>
                <th>Rạp</th>
                <th>Suất Chiếu</th>
                <th>Ghế</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Ngày Đặt</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{getUserName(booking.userId)}</td>
                  <td>{getMovieTitle(booking.movieId)}</td>
                  <td>{getCinemaName(booking.cinemaId)}</td>
                  <td>
                    <div>
                      <div>{booking.showtime.date}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>{booking.showtime.time}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {booking.seats.map((seat, index) => (
                        <span key={index} style={{ 
                          background: '#e9ecef', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          fontSize: '0.8rem' 
                        }}>
                          {seat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{booking.totalAmount.toLocaleString('vi-VN')} VNĐ</td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleViewDetail(booking)}
                      >
                        Chi tiết
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteBooking(booking.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Chi Tiết Đặt Vé #{selectedBooking.id}</h2>
              <button onClick={() => setShowDetailModal(false)}>&times;</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Người Dùng:</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      {getUserName(selectedBooking.userId)}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Trạng Thái:</label>
                    <div style={{ padding: '0.75rem' }}>
                      {getStatusBadge(selectedBooking.status)}
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Phim:</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      {getMovieTitle(selectedBooking.movieId)}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Rạp:</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      {getCinemaName(selectedBooking.cinemaId)}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày Chiếu:</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      {selectedBooking.showtime.date}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Giờ Chiếu:</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      {selectedBooking.showtime.time}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Ghế Đã Chọn:</label>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem', 
                    padding: '0.75rem', 
                    background: '#f8f9fa', 
                    borderRadius: '8px' 
                  }}>
                    {selectedBooking.seats.map((seat, index) => (
                      <span key={index} style={{ 
                        background: '#667eea', 
                        color: 'white',
                        padding: '0.5rem 1rem', 
                        borderRadius: '6px', 
                        fontSize: '0.9rem' 
                      }}>
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tổng Tiền:</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px', fontWeight: 'bold' }}>
                      {selectedBooking.totalAmount.toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phương Thức Thanh Toán:</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      {selectedBooking.paymentMethod}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày Đặt:</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      {new Date(selectedBooking.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cập Nhật Lần Cuối:</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      {new Date(selectedBooking.updatedAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Cập Nhật Trạng Thái:</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {['pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedBooking.id, status)}
                      disabled={selectedBooking.status === status}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: selectedBooking.status === status ? 'not-allowed' : 'pointer',
                        background: selectedBooking.status === status ? '#6c757d' : '#667eea',
                        color: 'white',
                        fontSize: '0.8rem'
                      }}
                    >
                      {status === 'pending' && 'Chờ xác nhận'}
                      {status === 'confirmed' && 'Xác nhận'}
                      {status === 'completed' && 'Hoàn thành'}
                      {status === 'cancelled' && 'Hủy'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowDetailModal(false)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings; 