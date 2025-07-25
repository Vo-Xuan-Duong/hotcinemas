import React from 'react';
import useAuth from '../../context/useAuth';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Bạn chưa đăng nhập.</div>;

  return (
    <div className="container" style={{ maxWidth: 500, margin: '2rem auto', background: 'white', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', padding: '2rem' }}>
      <h2 style={{ color: '#667eea', marginBottom: 16 }}>Thông tin cá nhân</h2>
      <div style={{ marginBottom: 12 }}><b>Họ tên:</b> {user.name || 'Chưa cập nhật'}</div>
      <div style={{ marginBottom: 12 }}><b>Email:</b> {user.email}</div>
      <div style={{ marginBottom: 24 }}><b>Vai trò:</b> {user.role || 'Khách hàng'}</div>
      <button style={{ background: 'linear-gradient(45deg, #ff6b6b, #feca57)', color: 'white', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, marginRight: 12, cursor: 'pointer' }}>Chỉnh sửa</button>
      <button onClick={logout} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>Đăng xuất</button>
    </div>
  );
};

export default Profile; 