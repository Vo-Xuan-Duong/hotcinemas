import React, { useState, useEffect } from 'react';
import '../Dashboard/Admin.css';

const Cinemas = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    image: '',
    facilities: [],
    screens: []
  });

  useEffect(() => {
    loadCinemas();
  }, []);

  const loadCinemas = async () => {
    try {
      const response = await fetch('/src/data/cinemas.json');
      const data = await response.json();
      setCinemas(data);
    } catch (error) {
      console.error('Error loading cinemas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCinema = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      description: '',
      image: '',
      facilities: [],
      screens: []
    });
    setShowAddModal(true);
  };

  const handleEditCinema = (cinema) => {
    setSelectedCinema(cinema);
    setFormData({
      name: cinema.name,
      address: cinema.address,
      phone: cinema.phone,
      email: cinema.email,
      description: cinema.description,
      image: cinema.image,
      facilities: cinema.facilities || [],
      screens: cinema.screens || []
    });
    setShowEditModal(true);
  };

  const handleDeleteCinema = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa rạp này?')) {
      setCinemas(cinemas.filter(cinema => cinema.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCinema = {
      id: showEditModal ? selectedCinema.id : Date.now(),
      ...formData
    };

    if (showEditModal) {
      setCinemas(cinemas.map(cinema => cinema.id === selectedCinema.id ? newCinema : cinema));
      setShowEditModal(false);
    } else {
      setCinemas([...cinemas, newCinema]);
      setShowAddModal(false);
    }
  };

  const addFacility = () => {
    setFormData({
      ...formData,
      facilities: [...formData.facilities, '']
    });
  };

  const removeFacility = (index) => {
    const newFacilities = formData.facilities.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      facilities: newFacilities
    });
  };

  const updateFacility = (index, value) => {
    const newFacilities = [...formData.facilities];
    newFacilities[index] = value;
    setFormData({
      ...formData,
      facilities: newFacilities
    });
  };

  const addScreen = () => {
    setFormData({
      ...formData,
      screens: [...formData.screens, { name: '', capacity: '', type: '2D' }]
    });
  };

  const removeScreen = (index) => {
    const newScreens = formData.screens.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      screens: newScreens
    });
  };

  const updateScreen = (index, field, value) => {
    const newScreens = [...formData.screens];
    newScreens[index] = { ...newScreens[index], [field]: value };
    setFormData({
      ...formData,
      screens: newScreens
    });
  };

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Quản lý Rạp Chiếu Phim</h1>
        <button className="btn-primary" onClick={handleAddCinema}>
          Thêm Rạp Mới
        </button>
      </div>

      <div className="admin-content">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hình Ảnh</th>
                <th>Tên Rạp</th>
                <th>Địa Chỉ</th>
                <th>Điện Thoại</th>
                <th>Email</th>
                <th>Số Màn Hình</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {cinemas.map((cinema) => (
                <tr key={cinema.id}>
                  <td>
                    <img 
                      src={cinema.image} 
                      alt={cinema.name} 
                      className="movie-poster-thumb"
                    />
                  </td>
                  <td>{cinema.name}</td>
                  <td>{cinema.address}</td>
                  <td>{cinema.phone}</td>
                  <td>{cinema.email}</td>
                  <td>{cinema.screens ? cinema.screens.length : 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditCinema(cinema)}
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteCinema(cinema.id)}
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

      {/* Add Cinema Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Thêm Rạp Mới</h2>
              <button onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên Rạp:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Địa Chỉ:</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Điện Thoại:</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Hình Ảnh URL:</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
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
              
              <div className="form-group">
                <label>Tiện Nghi:</label>
                {formData.facilities.map((facility, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={facility}
                      onChange={(e) => updateFacility(index, e.target.value)}
                      placeholder="Nhập tiện nghi"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeFacility(index)}
                      style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem' }}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addFacility} style={{ background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem', marginTop: '0.5rem' }}>
                  Thêm Tiện Nghi
                </button>
              </div>

              <div className="form-group">
                <label>Màn Hình:</label>
                {formData.screens.map((screen, index) => (
                  <div key={index} style={{ border: '1px solid #e9ecef', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={screen.name}
                        onChange={(e) => updateScreen(index, 'name', e.target.value)}
                        placeholder="Tên màn hình"
                        style={{ flex: 1 }}
                      />
                      <input
                        type="number"
                        value={screen.capacity}
                        onChange={(e) => updateScreen(index, 'capacity', e.target.value)}
                        placeholder="Sức chứa"
                        style={{ flex: 1 }}
                      />
                      <select
                        value={screen.type}
                        onChange={(e) => updateScreen(index, 'type', e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="2D">2D</option>
                        <option value="3D">3D</option>
                        <option value="IMAX">IMAX</option>
                      </select>
                      <button 
                        type="button" 
                        onClick={() => removeScreen(index)}
                        style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem' }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addScreen} style={{ background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem' }}>
                  Thêm Màn Hình
                </button>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Thêm Rạp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Cinema Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Sửa Rạp</h2>
              <button onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên Rạp:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Địa Chỉ:</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Điện Thoại:</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Hình Ảnh URL:</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
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
              
              <div className="form-group">
                <label>Tiện Nghi:</label>
                {formData.facilities.map((facility, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={facility}
                      onChange={(e) => updateFacility(index, e.target.value)}
                      placeholder="Nhập tiện nghi"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeFacility(index)}
                      style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem' }}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addFacility} style={{ background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem', marginTop: '0.5rem' }}>
                  Thêm Tiện Nghi
                </button>
              </div>

              <div className="form-group">
                <label>Màn Hình:</label>
                {formData.screens.map((screen, index) => (
                  <div key={index} style={{ border: '1px solid #e9ecef', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={screen.name}
                        onChange={(e) => updateScreen(index, 'name', e.target.value)}
                        placeholder="Tên màn hình"
                        style={{ flex: 1 }}
                      />
                      <input
                        type="number"
                        value={screen.capacity}
                        onChange={(e) => updateScreen(index, 'capacity', e.target.value)}
                        placeholder="Sức chứa"
                        style={{ flex: 1 }}
                      />
                      <select
                        value={screen.type}
                        onChange={(e) => updateScreen(index, 'type', e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="2D">2D</option>
                        <option value="3D">3D</option>
                        <option value="IMAX">IMAX</option>
                      </select>
                      <button 
                        type="button" 
                        onClick={() => removeScreen(index)}
                        style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem' }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addScreen} style={{ background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem' }}>
                  Thêm Màn Hình
                </button>
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

export default Cinemas; 