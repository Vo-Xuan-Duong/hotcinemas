import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';
import LoginFormAntd from './LoginFormAntd';
import RegisterFormAntd from './RegisterFormAntd';
import './AuthModalAntd.css';

const AuthModalAntd = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [currentMode, setCurrentMode] = useState(initialMode);

    const handleSwitchToRegister = () => {
        setCurrentMode('register');
    };

    const handleSwitchToLogin = () => {
        setCurrentMode('login');
    };

    return (
        <Modal
            title={
                <div className="auth-modal-title">
                    🎬 HotCinemas
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={420}
            className="auth-modal-antd"
            destroyOnClose
        >
            <div className="auth-content">
                {currentMode === 'login' ? (
                    <LoginFormAntd
                        onSwitchToRegister={handleSwitchToRegister}
                        onClose={onClose}
                    />
                ) : (
                    <RegisterFormAntd
                        onSwitchToLogin={handleSwitchToLogin}
                        onClose={onClose}
                    />
                )}
            </div>
        </Modal>
    );
};

export default AuthModalAntd;
