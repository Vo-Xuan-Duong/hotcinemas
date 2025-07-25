import React, { useState } from 'react';
import HeaderTest from '../components/Header/HeaderTest';
import './HeaderDemo.css';

// Mock user data for demo
const mockUsers = {
    user1: {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        avatar: null
    },
    user2: {
        id: 2,
        name: 'Trần Thị B',
        email: 'tranthib@email.com',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    user3: {
        id: 3,
        name: 'Lê Hoàng Long Tên Rất Dài',
        email: 'lehoanglong@email.com',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
};

const HeaderDemo = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [demoMode, setDemoMode] = useState('logged-out');

    const handleUserChange = (userKey) => {
        if (userKey === 'logged-out') {
            setCurrentUser(null);
            setDemoMode('logged-out');
        } else {
            setCurrentUser(mockUsers[userKey]);
            setDemoMode('logged-in');
        }
    };

    const handleMockLogin = () => {
        console.log('Mock login triggered');
        setCurrentUser(mockUsers.user1);
        setDemoMode('logged-in');
    };

    const handleMockLogout = () => {
        console.log('Mock logout triggered');
        setCurrentUser(null);
        setDemoMode('logged-out');
    };

    return (
        <div className="header-demo">
            <HeaderTest
                user={currentUser}
                onLogin={handleMockLogin}
                onLogout={handleMockLogout}
            />

            <div className="demo-controls">
                <div className="demo-container">
                    <h1>🎬 Header Component Demo</h1>
                    <p>Kiểm tra Header component với các trạng thái user khác nhau</p>

                    <div className="user-controls">
                        <h3>Chọn trạng thái user:</h3>
                        <div className="control-buttons">
                            <button
                                className={demoMode === 'logged-out' ? 'active' : ''}
                                onClick={() => handleUserChange('logged-out')}
                            >
                                Chưa đăng nhập
                            </button>
                            <button
                                className={demoMode === 'logged-in' && currentUser?.id === 1 ? 'active' : ''}
                                onClick={() => handleUserChange('user1')}
                            >
                                User không avatar
                            </button>
                            <button
                                className={demoMode === 'logged-in' && currentUser?.id === 2 ? 'active' : ''}
                                onClick={() => handleUserChange('user2')}
                            >
                                User có avatar
                            </button>
                            <button
                                className={demoMode === 'logged-in' && currentUser?.id === 3 ? 'active' : ''}
                                onClick={() => handleUserChange('user3')}
                            >
                                User tên dài
                            </button>
                        </div>
                    </div>

                    <div className="current-state">
                        <h3>Trạng thái hiện tại:</h3>
                        <div className="state-info">
                            {currentUser ? (
                                <div className="user-info">
                                    <div className="info-item">
                                        <strong>Tên:</strong> {currentUser.name}
                                    </div>
                                    <div className="info-item">
                                        <strong>Email:</strong> {currentUser.email}
                                    </div>
                                    <div className="info-item">
                                        <strong>Avatar:</strong> {currentUser.avatar ? 'Có' : 'Không có'}
                                    </div>
                                </div>
                            ) : (
                                <div className="not-logged-in">
                                    <span>Người dùng chưa đăng nhập</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="features-list">
                        <h3>Tính năng đã test:</h3>
                        <ul>
                            <li>✅ Hiển thị auth buttons khi chưa đăng nhập</li>
                            <li>✅ Hiển thị user menu khi đã đăng nhập</li>
                            <li>✅ Avatar fallback cho user không có ảnh</li>
                            <li>✅ Dropdown menu với các tùy chọn</li>
                            <li>✅ Responsive design trên mobile</li>
                            <li>✅ Click outside để đóng menu</li>
                            <li>✅ Xử lý tên user quá dài</li>
                            <li>✅ Auth modal integration</li>
                            <li>✅ Logout functionality</li>
                            <li>✅ Navigation links</li>
                        </ul>
                    </div>

                    <div className="test-instructions">
                        <h3>Hướng dẫn test:</h3>
                        <ol>
                            <li>Thử các trạng thái user khác nhau ở trên</li>
                            <li>Click vào "Đăng nhập" để mở modal (khi chưa đăng nhập)</li>
                            <li>Click vào avatar để mở user menu (khi đã đăng nhập)</li>
                            <li>Test responsive bằng cách thay đổi kích thước cửa sổ</li>
                            <li>Thử click outside để đóng các menu</li>
                            <li>Test keyboard navigation (Tab, Enter, Escape)</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderDemo;
