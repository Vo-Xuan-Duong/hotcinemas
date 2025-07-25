import React, { useState, useEffect } from 'react';
import '../Dashboard/Admin.css';
import './Schedules.css';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [filters, setFilters] = useState({
    movieId: '',
    cinemaId: '',
    date: '',
    format: ''
  });
  const [formData, setFormData] = useState({
    movieId: '',
    cinemaId: '',
    screenName: '',
    date: '',
    time: '',
    price: '',
    format: '2D',
    language: 'Tiếng Việt',
    type: 'Phụ đề'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [schedulesRes, moviesRes, cinemasRes] = await Promise.all([
        fetch('/src/data/showtimes.json'),
        fetch('/src/data/movies.json'),
        fetch('/src/data/cinemas.json')
      ]);
      
      const [schedulesData, moviesData, cinemasData] = await Promise.all([
        schedulesRes.json(),
        moviesRes.json(),
        cinemasRes.json()
      ]);
      
      setSchedules(schedulesData);
      setMovies(moviesData);
      setCinemas(cinemasData);
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

  const handleAddSchedule = () => {
    setFormData({
      movieId: '',
      cinemaId: '',
      screenName: '',
      date: '',
      time: '',
      price: '',
      format: '2D',
      language: 'Tiếng Việt',
      type: 'Phụ đề'
    });
    setShowAddModal(true);
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      movieId: schedule.movieId,
      cinemaId: schedule.cinemaId,
      screenName: schedule.screenName,
      date: schedule.date,
      time: schedule.time,
      price: schedule.price.toString(),
      format: schedule.format,
      language: schedule.language,
      type: schedule.type
    });
    setShowEditModal(true);
  };

  // Validation functions
  const validateForm = () => {
    const errors = {};
    
    if (!formData.movieId) {
      errors.movieId = 'Vui lòng chọn phim';
    }
    
    if (!formData.cinemaId) {
      errors.cinemaId = 'Vui lòng chọn rạp';
    }
    
    if (!formData.screenName.trim()) {
      errors.screenName = 'Vui lòng nhập tên phòng chiếu';
    }
    
    if (!formData.date) {
      errors.date = 'Vui lòng chọn ngày chiếu';
    }
    
    if (!formData.time) {
      errors.time = 'Vui lòng chọn giờ chiếu';
    }
    
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = 'Vui lòng nhập giá vé hợp lệ';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    const newSchedule = {
      id: showEditModal ? selectedSchedule.id : Date.now(),
      ...formData,
      price: Number(formData.price)
    };
    
    if (showEditModal) {
      setSchedules(schedules.map(schedule => 
        schedule.id === selectedSchedule.id ? newSchedule : schedule
      ));
      setShowEditModal(false);
    } else {
      setSchedules([...schedules, newSchedule]);
      setShowAddModal(false);
    }
    
    setFormErrors({});
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch chiếu này?')) {
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    }
  };

  // Filter functions
  const filteredSchedules = schedules.filter(schedule => {
    return (
      (!filters.movieId || schedule.movieId.toString() === filters.movieId) &&
      (!filters.cinemaId || schedule.cinemaId.toString() === filters.cinemaId) &&
      (!filters.date || schedule.date === filters.date) &&
      (!filters.format || schedule.format === filters.format)
    );
  });

  const clearFilters = () => {
    setFilters({
      movieId: '',
      cinemaId: '',
      date: '',
      format: ''
    });
  };

  // Format helpers
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  if (loading) {
    return (
      <div className="loading">
        <span>🎬</span>
        Đang tải dữ liệu lịch chiếu...
      </div>
    );
  }

  return (
    <>
      <div className="schedules-page">
      {/* Header */}
      <div className="schedules-header">
        <h1>Quản lý Lịch Chiếu</h1>
        <button className="btn-add-schedule" onClick={handleAddSchedule}>
          Thêm Lịch Chiếu Mới
        </button>
      </div>

      {/* Filters */}
      <div className="schedules-filters">
        <div className="filter-group">
          <label>🎬 Phim:</label>
          <select
            value={filters.movieId}
            onChange={(e) => setFilters({...filters, movieId: e.target.value})}
          >
            <option value="">Tất cả phim</option>
            {movies.map(movie => (
              <option key={movie.id} value={movie.id}>{movie.title}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>🏢 Rạp:</label>
          <select
            value={filters.cinemaId}
            onChange={(e) => setFilters({...filters, cinemaId: e.target.value})}
          >
            <option value="">Tất cả rạp</option>
            {cinemas.map(cinema => (
              <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>📅 Ngày:</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({...filters, date: e.target.value})}
          />
        </div>

        <div className="filter-group">
          <label>📺 Định dạng:</label>
          <select
            value={filters.format}
            onChange={(e) => setFilters({...filters, format: e.target.value})}
          >
            <option value="">Tất cả định dạng</option>
            <option value="2D">2D</option>
            <option value="3D">3D</option>
            <option value="IMAX">IMAX</option>
            <option value="4DX">4DX</option>
          </select>
        </div>

        <div className="filter-actions">
          <button className="btn-clear" onClick={clearFilters}>
            🗑️ Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Schedules Grid */}
      {filteredSchedules.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>Chưa có lịch chiếu nào</h3>
          <p>Thêm lịch chiếu đầu tiên để bắt đầu quản lý.</p>
          <button className="btn-add-schedule" onClick={handleAddSchedule}>
            Thêm Lịch Chiếu Mới
          </button>
        </div>
      ) : (
        <div className="schedules-grid">
          {filteredSchedules.map((schedule) => (
            <div key={schedule.id} className="schedule-card">
              <div className="schedule-card-header">
                <div>
                  <div className="schedule-movie">{getMovieTitle(schedule.movieId)}</div>
                  <div className="schedule-cinema">{getCinemaName(schedule.cinemaId)} - {schedule.screenName}</div>
                </div>
                <div className="schedule-format">{schedule.format}</div>
              </div>
              
              <div className="schedule-card-body">
                <div className="schedule-time">
                  <div className="time-date">{formatDate(schedule.date)}</div>
                  <div className="time-clock">🕐 {formatTime(schedule.time)}</div>
                </div>

                <div className="schedule-price">
                  <div className="price-label">Giá vé</div>
                  <div className="price-amount">{formatPrice(schedule.price)}</div>
                </div>

                <div className="schedule-info">
                  <div className="info-item">
                    <div className="info-label">Ngôn ngữ</div>
                    <div className="info-value">{schedule.language}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Loại</div>
                    <div className="info-value">{schedule.type}</div>
                  </div>
                </div>

                <div className="schedule-actions">
                  <button 
                    className="btn-edit-schedule" 
                    onClick={() => handleEditSchedule(schedule)}
                  >
                    ✏️ Sửa
                  </button>
                  <button 
                    className="btn-delete-schedule"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="schedule-modal">
            <div className="modal-header">
              <h2>
                <span>📅</span>
                Thêm Lịch Chiếu Mới
              </h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className={`form-group ${formErrors.movieId ? 'error' : ''}`}>
                    <label>
                      🎬 Phim <span className="required">*</span>
                    </label>
                    <select
                      value={formData.movieId}
                      onChange={(e) => setFormData({...formData, movieId: e.target.value})}
                      required
                    >
                      <option value="">Chọn phim</option>
                      {movies.map(movie => (
                        <option key={movie.id} value={movie.id}>
                          {movie.title}
                        </option>
                      ))}
                    </select>
                    {formErrors.movieId && <div className="error-message">{formErrors.movieId}</div>}
                  </div>

                  <div className={`form-group ${formErrors.cinemaId ? 'error' : ''}`}>
                    <label>
                      🏢 Rạp <span className="required">*</span>
                    </label>
                    <select
                      value={formData.cinemaId}
                      onChange={(e) => setFormData({...formData, cinemaId: e.target.value})}
                      required
                    >
                      <option value="">Chọn rạp</option>
                      {cinemas.map(cinema => (
                        <option key={cinema.id} value={cinema.id}>
                          {cinema.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.cinemaId && <div className="error-message">{formErrors.cinemaId}</div>}
                  </div>

                  <div className={`form-group ${formErrors.screenName ? 'error' : ''}`}>
                    <label>
                      📺 Tên Phòng Chiếu <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.screenName}
                      onChange={(e) => setFormData({...formData, screenName: e.target.value})}
                      placeholder="VD: Phòng 1, Screen A, IMAX Hall"
                      required
                    />
                    {formErrors.screenName && <div className="error-message">{formErrors.screenName}</div>}
                  </div>

                  <div className={`form-group ${formErrors.date ? 'error' : ''}`}>
                    <label>
                      📅 Ngày Chiếu <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                    {formErrors.date && <div className="error-message">{formErrors.date}</div>}
                  </div>

                  <div className={`form-group ${formErrors.time ? 'error' : ''}`}>
                    <label>
                      🕐 Giờ Chiếu <span className="required">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    />
                    {formErrors.time && <div className="error-message">{formErrors.time}</div>}
                  </div>

                  <div className={`form-group ${formErrors.price ? 'error' : ''}`}>
                    <label>
                      💰 Giá Vé (VNĐ) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="75000"
                      min="0"
                      step="1000"
                      required
                    />
                    {formErrors.price && <div className="error-message">{formErrors.price}</div>}
                  </div>

                  <div className="form-group">
                    <label>
                      📺 Định Dạng
                    </label>
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData({...formData, format: e.target.value})}
                    >
                      <option value="2D">2D</option>
                      <option value="3D">3D</option>
                      <option value="IMAX">IMAX</option>
                      <option value="4DX">4DX</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      🌐 Ngôn Ngữ
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({...formData, language: e.target.value})}
                    >
                      <option value="Tiếng Việt">Tiếng Việt</option>
                      <option value="Tiếng Anh">Tiếng Anh</option>
                      <option value="Tiếng Nhật">Tiếng Nhật</option>
                      <option value="Tiếng Hàn">Tiếng Hàn</option>
                      <option value="Tiếng Trung">Tiếng Trung</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      📝 Loại
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="Phụ đề">Phụ đề</option>
                      <option value="Thuyết minh">Thuyết minh</option>
                      <option value="Lồng tiếng">Lồng tiếng</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                    <span>❌</span>
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    <span>✅</span>
                    Thêm Lịch Chiếu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
                  required
                />
                {formErrors.screenName && <div className="error-message">{formErrors.screenName}</div>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngày:</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                  {formErrors.date && <div className="error-message">{formErrors.date}</div>}
                </div>
                <div className="form-group">
                  <label>Giờ:</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                  {formErrors.time && <div className="error-message">{formErrors.time}</div>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Giá Vé (VNĐ):</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    min="0"
                    required
                  />
                  {formErrors.price && <div className="error-message">{formErrors.price}</div>}
                </div>
                <div className="form-group">
                  <label>Định Dạng:</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({...formData, format: e.target.value})}
                  >
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX">IMAX</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngôn Ngữ:</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                  >
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Tiếng Nhật">Tiếng Nhật</option>
                    <option value="Tiếng Hàn">Tiếng Hàn</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Loại:</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Phụ đề">Phụ đề</option>
                    <option value="Thuyết minh">Thuyết minh</option>
                    <option value="Lồng tiếng">Lồng tiếng</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Thêm Lịch Chiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Sửa Lịch Chiếu</h2>
              <button onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Phim:</label>
                  <select
                    value={formData.movieId}
                    onChange={(e) => setFormData({...formData, movieId: parseInt(e.target.value)})}
                    required
                  >
                    <option value="">Chọn phim</option>
                    {movies.map(movie => (
                      <option key={movie.id} value={movie.id}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                  {formErrors.movieId && <div className="error-message">{formErrors.movieId}</div>}
                </div>
                <div className="form-group">
                  <label>Rạp:</label>
                  <select
                    value={formData.cinemaId}
                    onChange={(e) => setFormData({...formData, cinemaId: parseInt(e.target.value)})}
                    required
                  >
                    <option value="">Chọn rạp</option>
                    {cinemas.map(cinema => (
                      <option key={cinema.id} value={cinema.id}>
                        {cinema.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.cinemaId && <div className="error-message">{formErrors.cinemaId}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Tên Màn Hình:</label>
                <input
                  type="text"
                  value={formData.screenName}
                  onChange={(e) => setFormData({...formData, screenName: e.target.value})}
                  required
                />
                {formErrors.screenName && <div className="error-message">{formErrors.screenName}</div>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngày:</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                  {formErrors.date && <div className="error-message">{formErrors.date}</div>}
                </div>
                <div className="form-group">
                  <label>Giờ:</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                  {formErrors.time && <div className="error-message">{formErrors.time}</div>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Giá Vé (VNĐ):</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    min="0"
                    required
                  />
                  {formErrors.price && <div className="error-message">{formErrors.price}</div>}
                </div>
                <div className="form-group">
                  <label>Định Dạng:</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({...formData, format: e.target.value})}
                  >
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX">IMAX</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngôn Ngữ:</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                  >
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Tiếng Nhật">Tiếng Nhật</option>
                    <option value="Tiếng Hàn">Tiếng Hàn</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Loại:</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Phụ đề">Phụ đề</option>
                    <option value="Thuyết minh">Thuyết minh</option>
                    <option value="Lồng tiếng">Lồng tiếng</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Cập Nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules;