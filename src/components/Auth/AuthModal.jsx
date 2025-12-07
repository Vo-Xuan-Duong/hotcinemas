import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import OTPVerificationForm from './OTPVerificationForm';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [currentMode, setCurrentMode] = useState(initialMode);
    const [registerEmail, setRegisterEmail] = useState('');

    // Sync currentMode with initialMode whenever modal is (re)opened
    useEffect(() => {
        if (isOpen) {
            setCurrentMode(initialMode);
            setRegisterEmail('');
        }
    }, [isOpen, initialMode]);

    const handleSwitchToRegister = () => {
        setCurrentMode('register');
    };

    const handleSwitchToLogin = () => {
        setCurrentMode('login');
    };

    const handleSwitchToOTP = (email) => {
        setRegisterEmail(email);
        setCurrentMode('otp');
    };

    const handleOTPSuccess = () => {
        setCurrentMode('login');
        setRegisterEmail('');
    };

    const handleBackToRegister = () => {
        setCurrentMode('register');
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
                    <LoginForm
                        onSwitchToRegister={handleSwitchToRegister}
                        onClose={onClose}
                    />
                ) : currentMode === 'otp' ? (
                    <OTPVerificationForm
                        email={registerEmail}
                        onSuccess={handleOTPSuccess}
                        onBack={handleBackToRegister}
                    />
                ) : (
                    <RegisterForm
                        onSwitchToLogin={handleSwitchToLogin}
                        onSwitchToOTP={handleSwitchToOTP}
                        onClose={onClose}
                    />
                )}
            </div>
        </Modal>
    );
};

export default AuthModal;
