import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Button, message, Result } from 'antd';
import { LockOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './Auth.css';
import './ResetPassword.css';

const ResetPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    const [verifyingToken, setVerifyingToken] = useState(true);

    const token = searchParams.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setTokenValid(false);
                setVerifyingToken(false);
                message.error('Liên kết không hợp lệ!');
                return;
            }

            try {
                // TODO: Gọi API verify token
                // await authService.verifyResetToken(token);

                // Giả lập API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                setTokenValid(true);
            } catch (error) {
                console.error('Token verification error:', error);
                setTokenValid(false);

                if (error.response?.status === 410) {
                    message.error('Liên kết đã hết hạn!');
                } else {
                    message.error('Liên kết không hợp lệ hoặc đã được sử dụng!');
                }
            } finally {
                setVerifyingToken(false);
            }
        };

        verifyToken();
    }, [token]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // TODO: Gọi API reset password
            // await authService.resetPassword(token, values.password);

            // Giả lập API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setResetSuccess(true);
            message.success('Đặt lại mật khẩu thành công!');

            // Tự động chuyển về trang login sau 3 giây
            setTimeout(() => {
                navigate('/login', { state: { passwordReset: true } });
            }, 3000);

        } catch (error) {
            console.error('Reset password error:', error);

            if (error.response) {
                const { data, status } = error.response;

                if (status === 400) {
                    message.error(data.message || 'Mật khẩu không hợp lệ!');
                } else if (status === 410) {
                    message.error('Liên kết đã hết hạn. Vui lòng yêu cầu lại!');
                    setTokenValid(false);
                } else {
                    message.error(data.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại!');
                }
            } else {
                message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!');
            }
        } finally {
            setLoading(false);
        }
    };

    if (verifyingToken) {
        return (
            <div className="auth-page-container">
                <div className="auth-page-card reset-password-card">
                    <div className="auth-page-brand">
                        <h1>🎬 HotCinemas</h1>
                    </div>
                    <div className="verifying-container">
                        <div className="loading-spinner"></div>
                        <p>Đang xác thực liên kết...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="auth-page-container">
                <div className="auth-page-card reset-password-card">
                    <div className="auth-page-brand">
                        <h1>🎬 HotCinemas</h1>
                    </div>
                    <Result
                        status="error"
                        title="Liên kết không hợp lệ"
                        subTitle="Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại."
                        extra={[
                            <Button
                                key="forgot"
                                type="primary"
                                onClick={() => navigate('/forgot-password')}
                            >
                                Yêu cầu lại
                            </Button>,
                            <Button
                                key="login"
                                onClick={() => navigate('/login')}
                            >
                                Quay lại đăng nhập
                            </Button>
                        ]}
                    />
                </div>
            </div>
        );
    }

    if (resetSuccess) {
        return (
            <div className="auth-page-container">
                <div className="auth-page-card reset-password-card">
                    <div className="auth-page-brand">
                        <h1>🎬 HotCinemas</h1>
                    </div>
                    <Result
                        status="success"
                        title="Đặt lại mật khẩu thành công!"
                        subTitle="Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới."
                        extra={[
                            <Button
                                key="login"
                                type="primary"
                                onClick={() => navigate('/login')}
                                icon={<ArrowLeftOutlined />}
                            >
                                Đăng nhập ngay
                            </Button>
                        ]}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page-container">
            <div className="auth-page-card reset-password-card">
                <div className="auth-page-brand">
                    <h1>🎬 HotCinemas</h1>
                </div>

                <div className="reset-password-container">
                    <div className="reset-password-header">
                        <div className="reset-password-icon">
                            <LockOutlined />
                        </div>
                        <h2>Đặt lại mật khẩu</h2>
                        <p>Nhập mật khẩu mới cho tài khoản của bạn</p>
                    </div>

                    <Form
                        form={form}
                        name="reset-password"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu mới!',
                                },
                                {
                                    min: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                                },
                                {
                                    max: 100,
                                    message: 'Mật khẩu không được vượt quá 100 ký tự!',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Mật khẩu mới"
                                className="custom-input"
                                autoFocus
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng xác nhận mật khẩu!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Xác nhận mật khẩu mới"
                                className="custom-input"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                className="submit-button"
                                icon={<CheckCircleOutlined />}
                            >
                                Đặt lại mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="reset-password-info">
                        <div className="info-item">
                            <span className="info-icon">🔐</span>
                            <span>Mật khẩu phải có ít nhất 6 ký tự</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">✅</span>
                            <span>Nên kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
