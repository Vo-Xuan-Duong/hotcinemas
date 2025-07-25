import React, { useState, useEffect } from 'react';
import '../Dashboard/Admin.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseDate: '',
    poster: '',
    backgroundImage: '',
    description: '',
    duration: '',
    rating: '',
    ageLabel: '',
    format: '2D',
    trailer: '',
    director: '',
    productionStudio: '',
    audioOptions: [{ language: 'Tiếng Việt', type: 'Phụ đề' }]
  });

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const response = await fetch('/src/data/movies.json');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    setFormData({
      title: '',
      genre: '',
      releaseDate: '',
      poster: '',
      backgroundImage: '',
      description: '',
      duration: '',
      rating: '',
      ageLabel: '',
      format: '2D',
      trailer: '',
      director: '',
      productionStudio: '',
      audioOptions: [{ language: 'Tiếng Việt', type: 'Phụ đề' }]
    });
    setShowAddModal(true);
  };

  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      genre: movie.genre,
      releaseDate: movie.releaseDate,
      poster: movie.poster,
      backgroundImage: movie.backgroundImage,
      description: movie.description,
      duration: movie.duration.toString(),
      rating: movie.rating.toString(),
      ageLabel: movie.ageLabel,
      format: movie.format,
      trailer: movie.trailer,
      director: movie.director,
      productionStudio: movie.productionStudio,
      audioOptions: movie.audioOptions
    });
    setShowEditModal(true);
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      // Trong thực tế, đây sẽ là API call
      setMovies(movies.filter(movie => movie.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMovie = {
      id: showEditModal ? selectedMovie.id : Date.now(),
      ...formData,
      duration: parseInt(formData.duration),
      rating: parseFloat(formData.rating),
      cast: showEditModal ? selectedMovie.cast : []
    };

    if (showEditModal) {
      setMovies(movies.map(movie => movie.id === selectedMovie.id ? newMovie : movie));
      setShowEditModal(false);
    } else {
      setMovies([...movies, newMovie]);
      setShowAddModal(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Quản lý Phim</h1>
        <button className="btn-primary" onClick={handleAddMovie}>
          Thêm Phim Mới
        </button>
      </div>

      <div className="admin-content">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Tên Phim</th>
                <th>Thể Loại</th>
                <th>Ngày Phát Hành</th>
                <th>Thời Lượng</th>
                <th>Đánh Giá</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>
                    <img 
                      src={movie.poster} 
                      alt={movie.title} 
                      className="movie-poster-thumb"
                    />
                  </td>
                  <td>{movie.title}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.releaseDate}</td>
                  <td>{movie.duration} phút</td>
                  <td>{movie.rating}/10</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditMovie(movie)}
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteMovie(movie.id)}
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

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Thêm Phim Mới</h2>
              <button onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên Phim:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Thể Loại:</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({...formData, genre: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ngày Phát Hành:</label>
                <input
                  type="text"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                  placeholder="dd.mm.yyyy"
                  required
                />
              </div>
              <div className="form-group">
                <label>Poster URL:</label>
                <input
                  type="url"
                  value={formData.poster}
                  onChange={(e) => setFormData({...formData, poster: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô Tả:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Thời Lượng (phút):</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Đánh Giá:</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Độ Tuổi:</label>
                  <input
                    type="text"
                    value={formData.ageLabel}
                    onChange={(e) => setFormData({...formData, ageLabel: e.target.value})}
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
              <div className="form-group">
                <label>Đạo Diễn:</label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) => setFormData({...formData, director: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hãng Sản Xuất:</label>
                <input
                  type="text"
                  value={formData.productionStudio}
                  onChange={(e) => setFormData({...formData, productionStudio: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Trailer URL:</label>
                <input
                  type="url"
                  value={formData.trailer}
                  onChange={(e) => setFormData({...formData, trailer: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Thêm Phim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Movie Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Sửa Phim</h2>
              <button onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên Phim:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Thể Loại:</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({...formData, genre: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ngày Phát Hành:</label>
                <input
                  type="text"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                  placeholder="dd.mm.yyyy"
                  required
                />
              </div>
              <div className="form-group">
                <label>Poster URL:</label>
                <input
                  type="url"
                  value={formData.poster}
                  onChange={(e) => setFormData({...formData, poster: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô Tả:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Thời Lượng (phút):</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Đánh Giá:</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Độ Tuổi:</label>
                  <input
                    type="text"
                    value={formData.ageLabel}
                    onChange={(e) => setFormData({...formData, ageLabel: e.target.value})}
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
              <div className="form-group">
                <label>Đạo Diễn:</label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) => setFormData({...formData, director: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hãng Sản Xuất:</label>
                <input
                  type="text"
                  value={formData.productionStudio}
                  onChange={(e) => setFormData({...formData, productionStudio: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Trailer URL:</label>
                <input
                  type="url"
                  value={formData.trailer}
                  onChange={(e) => setFormData({...formData, trailer: e.target.value})}
                  required
                />
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

export default Movies; 