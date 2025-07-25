import React, { useState, useEffect } from 'react';
import '../Dashboard/Admin.css';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
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

  const handleDeleteSchedule = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch chiếu này?')) {
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSchedule = {
      id: showEditModal ? selectedSchedule.id : Date.now(),
      ...formData,
      price: parseFloat(formData.price)
    };

    if (showEditModal) {
      setSchedules(schedules.map(schedule => schedule.id === selectedSchedule.id ? newSchedule : schedule));
      setShowEditModal(false);
    } else {
      setSchedules([...schedules, newSchedule]);
      setShowAddModal(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Quản lý Lịch Chiếu</h1>
        <button className="btn-primary" onClick={handleAddSchedule}>
          Thêm Lịch Chiếu Mới
        </button>
      </div>

      <div className="admin-content">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Phim</th>
                <th>Rạp</th>
                <th>Màn Hình</th>
                <th>Ngày</th>
                <th>Giờ</th>
                <th>Giá Vé</th>
                <th>Định Dạng</th>
                <th>Ngôn Ngữ</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td>{getMovieTitle(schedule.movieId)}</td>
                  <td>{getCinemaName(schedule.cinemaId)}</td>
                  <td>{schedule.screenName}</td>
                  <td>{schedule.date}</td>
                  <td>{schedule.time}</td>
                  <td>{schedule.price.toLocaleString('vi-VN')} VNĐ</td>
                  <td>{schedule.format}</td>
                  <td>{schedule.language} - {schedule.type}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditSchedule(schedule)}
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteSchedule(schedule.id)}
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

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Thêm Lịch Chiếu Mới</h2>
              <button onClick={() => setShowAddModal(false)}>&times;</button>
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
                </div>
                <div className="form-group">
                  <label>Giờ:</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
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
                </div>
                <div className="form-group">
                  <label>Giờ:</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
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