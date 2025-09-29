import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import useAuth from '../../context/useAuth';
import './LoginFormAntd.css';

const LoginFormAntd = ({ onSwitchToRegister, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const success = await login(values.email, values.password);
            if (success) {
                message.success('Đăng nhập thành công!');
                form.resetFields();
                onClose?.();
            } else {
                message.error('Email hoặc mật khẩu không đúng!');
            }
        } catch (error) {
            message.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
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
                        prefix={<UserOutlined />}
                        placeholder="Email"
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
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox className="custom-checkbox">
                                Ghi nhớ đăng nhập
                            </Checkbox>
                        </Form.Item>
                        <Button type="link" className="forgot-password">
                            Quên mật khẩu?
                        </Button>
                    </div>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        className="login-button"
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>

            <Divider className="custom-divider">
                <span>Hoặc đăng nhập bằng</span>
            </Divider>

            <Button
                block
                icon={<GoogleOutlined />}
                className="social-button google-button"
                onClick={() => handleSocialLogin('Google')}
            >
                Đăng nhập bằng Google
            </Button>

            <div className="form-footer">
                <span>Chưa có tài khoản? </span>
                <Button
                    type="link"
                    onClick={onSwitchToRegister}
                    className="switch-button"
                >
                    Đăng ký ngay
                </Button>
            </div>
        </div>
    );
};

export default LoginFormAntd;
