import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, message, Statistic } from 'antd';
import { MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './Auth.css';
import './VerifyOTP.css';

const { Countdown } = Statistic;

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    // Redirect nếu không có email
    useEffect(() => {
        if (!email) {
            message.warning('Vui lòng đăng ký trước khi xác thực!');
            navigate('/register');
        }
    }, [email, navigate]);

    // Tự động focus vào ô đầu tiên
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        // Chỉ cho phép số
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus đến ô tiếp theo
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Backspace: xóa và focus về ô trước
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        // Arrow keys navigation
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);

        if (!/^\d+$/.test(pastedData)) {
            message.error('Vui lòng chỉ paste mã số!');
            return;
        }

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        // Focus vào ô cuối cùng được điền
        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            message.error('Vui lòng nhập đầy đủ 6 số!');
            return;
        }

        setLoading(true);
        try {
            // TODO: Gọi API xác thực OTP
            // const response = await authService.verifyOTP(email, otpCode);

            // Giả lập API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            message.success('Xác thực thành công! Đang chuyển hướng...');

            // Chuyển đến trang đăng nhập hoặc trang chủ
            setTimeout(() => {
                navigate('/login', { state: { verified: true } });
            }, 1000);

        } catch (error) {
            console.error('OTP verification error:', error);
            message.error(error.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn!');
            // Reset OTP
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        try {
            // TODO: Gọi API gửi lại OTP
            // await authService.resendOTP(email);

            // Giả lập API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            message.success('Đã gửi lại mã xác thực!');
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();

        } catch (error) {
            console.error('Resend OTP error:', error);
            message.error(error.response?.data?.message || 'Không thể gửi lại mã. Vui lòng thử lại!');
        } finally {
            setResendLoading(false);
        }
    };

    const handleCountdownFinish = () => {
        setCanResend(true);
    };

    const maskEmail = (email) => {
        if (!email) return '';
        const [username, domain] = email.split('@');
        const maskedUsername = username[0] + '***' + username.slice(-1);
        return `${maskedUsername}@${domain}`;
    };

    if (!email) return null;

    return (
        <div className="auth-page-container">
            <div className="auth-page-card otp-card">
                <div className="auth-page-brand">
                    <h1>🎬 HotCinemas</h1>
                </div>

                <div className="otp-container">
                    <div className="otp-header">
                        <div className="otp-icon">
                            <MailOutlined />
                        </div>
                        <h2>Xác thực tài khoản</h2>
                        <p>
                            Chúng tôi đã gửi mã xác thực 6 số đến<br />
                            <strong>{maskEmail(email)}</strong>
                        </p>
                    </div>

                    <Form onFinish={handleVerify}>
                        <div className="otp-inputs" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(index, e.target.value)}
                                    onKeyDown={e => handleKeyDown(index, e)}
                                    className="otp-input"
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            className="verify-button"
                            size="large"
                            icon={<CheckCircleOutlined />}
                        >
                            Xác thực
                        </Button>
                    </Form>

                    <div className="otp-footer">
                        {!canResend ? (
                            <div className="countdown-container">
                                <span>Gửi lại mã sau </span>
                                <Countdown
                                    value={Date.now() + 60 * 1000}
                                    format="ss"
                                    onFinish={handleCountdownFinish}
                                    valueStyle={{
                                        color: '#e50914',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        display: 'inline'
                                    }}
                                />
                                <span> giây</span>
                            </div>
                        ) : (
                            <div className="resend-container">
                                <span>Không nhận được mã? </span>
                                <Button
                                    type="link"
                                    onClick={handleResend}
                                    loading={resendLoading}
                                    className="resend-button"
                                >
                                    Gửi lại
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="otp-back">
                        <Button
                            type="link"
                            onClick={() => navigate('/register')}
                            className="back-button"
                        >
                            ← Quay lại đăng ký
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
