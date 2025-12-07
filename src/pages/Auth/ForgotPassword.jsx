import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import './Auth.css';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [sentEmail, setSentEmail] = useState('');

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // TODO: Gọi API gửi email reset password
            // await authService.forgotPassword(values.email);

            // Giả lập API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSentEmail(values.email);
            setEmailSent(true);
            message.success('Email khôi phục mật khẩu đã được gửi!');

        } catch (error) {
            console.error('Forgot password error:', error);

            if (error.response) {
                const { data, status } = error.response;

                if (status === 404) {
                    message.error('Email không tồn tại trong hệ thống!');
                } else if (status === 429) {
                    message.error('Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau!');
                } else {
                    message.error(data.message || 'Không thể gửi email. Vui lòng thử lại!');
                }
            } else {
                message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        try {
            // TODO: Gọi API gửi lại email
            // await authService.forgotPassword(sentEmail);

            await new Promise(resolve => setTimeout(resolve, 1000));

            message.success('Email đã được gửi lại!');

        } catch (error) {
            console.error('Resend email error:', error);
            message.error('Không thể gửi lại email. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    if (emailSent) {
        return (
            <div className="auth-page-container">
                <div className="auth-page-card forgot-password-card">
                    <div className="auth-page-brand">
                        <h1>🎬 HotCinemas</h1>
                    </div>

                    <Result
                        status="success"
                        title="Email đã được gửi!"
                        subTitle={
                            <div className="success-message">
                                <p>Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến</p>
                                <strong>{sentEmail}</strong>
                                <p className="check-spam">
                                    Vui lòng kiểm tra hộp thư đến và cả thư mục spam.
                                </p>
                            </div>
                        }
                        extra={[
                            <Button
                                key="resend"
                                onClick={handleResend}
                                loading={loading}
                                icon={<SendOutlined />}
                            >
                                Gửi lại email
                            </Button>,
                            <Button
                                key="back"
                                type="primary"
                                onClick={handleBackToLogin}
                                icon={<ArrowLeftOutlined />}
                            >
                                Quay lại đăng nhập
                            </Button>
                        ]}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page-container">
            <div className="auth-page-card forgot-password-card">
                <div className="auth-page-brand">
                    <h1>🎬 HotCinemas</h1>
                </div>

                <div className="forgot-password-container">
                    <div className="forgot-password-header">
                        <div className="forgot-password-icon">
                            <MailOutlined />
                        </div>
                        <h2>Quên mật khẩu?</h2>
                        <p>
                            Nhập email đã đăng ký của bạn. Chúng tôi sẽ gửi hướng dẫn
                            khôi phục mật khẩu đến email của bạn.
                        </p>
                    </div>

                    <Form
                        form={form}
                        name="forgot-password"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Email đã đăng ký"
                                className="custom-input"
                                autoFocus
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                className="submit-button"
                                icon={<SendOutlined />}
                            >
                                Gửi email khôi phục
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="forgot-password-footer">
                        <Button
                            type="link"
                            onClick={handleBackToLogin}
                            className="back-button"
                            icon={<ArrowLeftOutlined />}
                        >
                            Quay lại đăng nhập
                        </Button>
                    </div>

                    <div className="forgot-password-info">
                        <div className="info-item">
                            <span className="info-icon">💡</span>
                            <span>Email sẽ chứa liên kết khôi phục có hiệu lực trong 15 phút</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">🔒</span>
                            <span>Đảm bảo an toàn và bảo mật cho tài khoản của bạn</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
