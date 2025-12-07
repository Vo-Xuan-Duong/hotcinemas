import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './LoginForm.css';

const LoginForm = ({ onSwitchToRegister, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                usernameOrEmail: values.usernameOrEmail,
                password: values.password,
                rememberMe: !!values.rememberMe,
            };

            await login(payload);

            message.success('Đăng nhập thành công!');
            form.resetFields();

            // If used in modal (onClose exists), just close modal and stay on current page
            if (onClose) {
                onClose();
            } else {
                // If used in page, redirect to intended page or home
                const from = location.state?.from?.pathname || '/';
                navigate(from);
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error status:', error?.status);
            console.error('Error data:', error?.data);

            const status = error?.status;
            const errorData = error?.data;
            let msg = error?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';

            // Xử lý thông báo lỗi từ backend
            if (errorData?.message) {
                msg = errorData.message;
            } else if (errorData?.error) {
                msg = typeof errorData.error === 'string' ? errorData.error : msg;
            }

            // Gắn lỗi vào các field để người dùng thấy trực tiếp
            if (status === 401) {
                const fieldMsg = msg || 'Email/Tên đăng nhập hoặc mật khẩu không đúng.';
                form.setFields([
                    { name: 'password', errors: [fieldMsg] },
                ]);
                message.error(fieldMsg);
            } else if (status === 422) {
                // Xử lý validation errors từ backend
                if (errorData?.errors && Array.isArray(errorData.errors)) {
                    errorData.errors.forEach(err => {
                        const field = err.field || err.path;
                        const message = err.message || err.defaultMessage;
                        if (field) {
                            form.setFields([{ name: field, errors: [message] }]);
                        }
                    });
                } else {
                    form.setFields([
                        { name: 'usernameOrEmail', errors: ['Dữ liệu không hợp lệ.'] },
                    ]);
                }
            } else if (status === 403) {
                message.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.');
                return;
            } else if (status === 404) {
                form.setFields([
                    { name: 'usernameOrEmail', errors: ['Tài khoản không tồn tại.'] },
                ]);
            } else if (status >= 500) {
                message.error('Lỗi server. Vui lòng thử lại sau!');
                return;
            } else if (!status) {
                message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!');
                return;
            }

            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleSocialLogin = (provider) => {
        message.info(`Đăng nhập bằng ${provider} sẽ được phát triển trong tương lai!`);
    };

    return (
        <div className="login-form-antd">
            <div className="form-header">
                <h2>Chào mừng trở lại!</h2>
                <p>Đăng nhập để trải nghiệm đầy đủ tính năng</p>
            </div>

            <Form
                form={form}
                name="login"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="usernameOrEmail"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email hoặc tên đăng nhập!',
                        },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Email hoặc tên đăng nhập"
                        className="custom-input"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!',
                        },
                        {
                            min: 6,
                            message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Mật khẩu"
                        className="custom-input"
                    />
                </Form.Item>

                <Form.Item>
                    <div className="form-options">
                        <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                            <Checkbox className="custom-checkbox">
                                Ghi nhớ đăng nhập
                            </Checkbox>
                        </Form.Item>
                        <Button
                            type="link"
                            className="forgot-password"
                            onClick={() => navigate('/forgot-password')}
                        >
                            Quên mật khẩu?
                        </Button>
                    </div>
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button
                            size="large"
                            block
                            onClick={() => navigate('/')}
                            className="cancel-button"
                        >
                            Hủy
                        </Button>
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            className="login-button"
                        >
                            Đăng nhập
                        </Button>
                    </div>
                </Form.Item>
            </Form>

            <Button
                block
                icon={<GoogleOutlined />}
                className="social-button google-button"
                onClick={() => message.info('Đăng nhập bằng Google sẽ được phát triển trong tương lai!')}
            >
                Đăng nhập bằng Google
            </Button>

            <div className="form-footer">
                <span>Chưa có tài khoản? </span>
                <Button
                    type="link"
                    onClick={onSwitchToRegister || (() => navigate('/auth/register'))}
                    className="switch-button"
                >
                    Đăng ký ngay
                </Button>
            </div>
        </div>
    );
};

export default LoginForm;
