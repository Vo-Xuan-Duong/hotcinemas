import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GoogleOutlined } from '@ant-design/icons';
import useAuth from '../../context/useAuth';
import './RegisterFormAntd.css';

const RegisterFormAntd = ({ onSwitchToLogin, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const userData = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                password: values.password
            };

            const success = await register(userData);
            if (success) {
                message.success('Đăng ký thành công! Chào mừng bạn đến với HotCinemas!');
                form.resetFields();
                onClose?.();
            } else {
                message.error('Email đã được sử dụng!');
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

    const handleSocialRegister = (provider) => {
        message.info(`Đăng ký bằng ${provider} sẽ được phát triển trong tương lai!`);
    };

    return (
        <div className="register-form-antd">
            <div className="form-header">
                <h2>Tạo tài khoản mới</h2>
                <p>Tham gia cộng đồng yêu phim của chúng tôi</p>
            </div>

            <Form
                form={form}
                name="register"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                size="large"
                scrollToFirstError
            >
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập họ tên!',
                        },
                        {
                            min: 2,
                            message: 'Họ tên phải có ít nhất 2 ký tự!',
                        },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Họ và tên"
                        className="custom-input"
                    />
                </Form.Item>

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
                        placeholder="Email"
                        className="custom-input"
                    />
                </Form.Item>

                <Form.Item
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập số điện thoại!',
                        },
                        {
                            pattern: /^[0-9]{10,11}$/,
                            message: 'Số điện thoại không hợp lệ!',
                        },
                    ]}
                >
                    <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Số điện thoại"
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
                        placeholder="Xác nhận mật khẩu"
                        className="custom-input"
                    />
                </Form.Item>

                <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản!')),
                        },
                    ]}
                >
                    <Checkbox className="custom-checkbox">
                        Tôi đồng ý với{' '}
                        <Button type="link" className="terms-link">
                            Điều khoản sử dụng
                        </Button>{' '}
                        và{' '}
                        <Button type="link" className="terms-link">
                            Chính sách bảo mật
                        </Button>
                    </Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        className="register-button"
                    >
                        Tạo tài khoản
                    </Button>
                </Form.Item>
            </Form>

            <Divider className="custom-divider">
                <span>Hoặc đăng ký bằng</span>
            </Divider>

            <Button
                block
                icon={<GoogleOutlined />}
                className="social-button google-button"
                onClick={() => handleSocialRegister('Google')}
            >
                Đăng ký bằng Google
            </Button>

            <div className="form-footer">
                <span>Đã có tài khoản? </span>
                <Button
                    type="link"
                    onClick={onSwitchToLogin}
                    className="switch-button"
                >
                    Đăng nhập ngay
                </Button>
            </div>
        </div>
    );
};

export default RegisterFormAntd;
