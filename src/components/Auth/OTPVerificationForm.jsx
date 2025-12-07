import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';
import './OTPVerificationForm.css';

const OTPVerificationForm = ({ email, onSuccess, onBack }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    useEffect(() => {
        // Focus vào ô input đầu tiên khi component mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleOTPChange = (index, value) => {
        // Chỉ cho phép nhập số
        if (value && !/^\d+$/.test(value)) {
            return;
        }

        const newOTP = form.getFieldValue('otp') || ['', '', '', '', '', ''];
        newOTP[index] = value;
        form.setFieldsValue({ otp: newOTP });

        // Auto focus sang ô tiếp theo
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Backspace: xóa và quay lại ô trước
        if (e.key === 'Backspace') {
            const newOTP = form.getFieldValue('otp') || ['', '', '', '', '', ''];
            if (!newOTP[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
        // Arrow keys navigation
        else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const otpArray = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
        form.setFieldsValue({ otp: otpArray });

        // Focus vào ô cuối cùng có giá trị
        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const onFinish = async () => {
        setLoading(true);
        try {
            const otpValues = form.getFieldValue('otp') || [];
            const otpCode = otpValues.join('');

            if (otpCode.length !== 6) {
                message.error('Vui lòng nhập đủ 6 số OTP!');
                setLoading(false);
                return;
            }

            const response = await authService.verifyOTP(email, otpCode);

            if (response && response.status === 200) {
                message.success('Xác thực tài khoản thành công!');
                onSuccess?.();
            } else {
                message.error(response.message || 'Mã OTP không chính xác!');
            }
        } catch (error) {
            console.error('OTP verification error:', error);

            if (error.response) {
                const { data, status } = error.response;
                if (status === 400 || status === 401) {
                    message.error(data.message || 'Mã OTP không chính xác hoặc đã hết hạn!');
                } else {
                    message.error(data.message || 'Xác thực thất bại. Vui lòng thử lại!');
                }
            } else {
                message.error(error.message || 'Không thể kết nối đến server!');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true);
        try {
            const response = await authService.resendOTP(email);
            if (response) {
                message.success('Đã gửi lại mã OTP đến email của bạn!');
                setCountdown(60);
                setCanResend(false);
                // Clear OTP inputs
                form.setFieldsValue({ otp: ['', '', '', '', '', ''] });
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            if (error.response?.data?.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Không thể gửi lại mã OTP. Vui lòng thử lại!');
            }
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="otp-verification-form">
            <div className="form-header">
                <div className="email-icon">
                    <MailOutlined />
                </div>
                <h2>Xác thực tài khoản</h2>
                <p>Nhập mã OTP đã được gửi đến</p>
                <p className="email-display">{email}</p>
            </div>

            <Form
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                initialValues={{ otp: ['', '', '', '', '', ''] }}
            >
                <Form.Item name="otp">
                    <div className="otp-inputs">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <Input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                maxLength={1}
                                className="otp-input"
                                onChange={(e) => handleOTPChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                            />
                        ))}
                    </div>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        className="verify-button"
                    >
                        Xác thực
                    </Button>
                </Form.Item>
            </Form>

            <div className="otp-footer">
                <div className="resend-section">
                    {canResend ? (
                        <Button
                            type="link"
                            onClick={handleResendOTP}
                            loading={resendLoading}
                            className="resend-button"
                        >
                            Gửi lại mã OTP
                        </Button>
                    ) : (
                        <span className="countdown-text">
                            Gửi lại mã sau {countdown}s
                        </span>
                    )}
                </div>
                <Button
                    type="link"
                    onClick={onBack}
                    className="back-button"
                >
                    Quay lại đăng ký
                </Button>
            </div>
        </div>
    );
};

export default OTPVerificationForm;
