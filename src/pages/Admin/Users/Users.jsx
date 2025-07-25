import React, { useState, useEffect } from 'react';
import '../Dashboard/Admin.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    role: 'user',
    status: 'active'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/src/data/users.json');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setFormData({
      username: '',
      email: '',
      fullName: '',
      phone: '',
      role: 'user',
      status: 'active'
    });
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      id: showEditModal ? selectedUser.id : Date.now(),
      ...formData,
      createdAt: showEditModal ? selectedUser.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (showEditModal) {
      setUsers(users.map(user => user.id === selectedUser.id ? newUser : user));
      setShowEditModal(false);
    } else {
      setUsers([...users, newUser]);
      setShowAddModal(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { text: 'Hoạt động', class: 'status-active' },
      inactive: { text: 'Không hoạt động', class: 'status-inactive' },
      suspended: { text: 'Tạm khóa', class: 'status-suspended' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { text: 'Admin', class: 'role-admin' },
      user: { text: 'Người dùng', class: 'role-user' },
      moderator: { text: 'Moderator', class: 'role-moderator' }
    };
    
    const config = roleConfig[role] || roleConfig.user;
    return <span className={`role-badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Quản lý Người Dùng</h1>
        <button className="btn-primary" onClick={handleAddUser}>
          Thêm Người Dùng Mới
        </button>
      </div>

      <div className="admin-content">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Đăng Nhập</th>
                <th>Email</th>
                <th>Họ Tên</th>
                <th>Điện Thoại</th>
                <th>Vai Trò</th>
                <th>Trạng Thái</th>
                <th>Ngày Tạo</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.fullName}</td>
                  <td>{user.phone}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditUser(user)}
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteUser(user.id)}
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Thêm Người Dùng Mới</h2>
              <button onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tên Đăng Nhập:</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
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
              <div className="form-row">
                <div className="form-group">
                  <label>Họ Tên:</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Điện Thoại:</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Vai Trò:</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="user">Người dùng</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Trạng Thái:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="suspended">Tạm khóa</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Thêm Người Dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Sửa Người Dùng</h2>
              <button onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tên Đăng Nhập:</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
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
              <div className="form-row">
                <div className="form-group">
                  <label>Họ Tên:</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Điện Thoại:</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Vai Trò:</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="user">Người dùng</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Trạng Thái:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="suspended">Tạm khóa</option>
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

export default Users; 