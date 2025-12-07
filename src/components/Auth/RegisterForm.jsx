import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './RegisterForm.css';

const RegisterForm = ({ onSwitchToLogin, onSwitchToOTP, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const userData = {
                username: values.username,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
                fullName: values.fullName,
                phoneNumber: values.phoneNumber
            };

            const response = await register(userData);

            if (response) {
                message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
                form.resetFields();
                // Chuyển sang màn hình OTP verification
                onSwitchToOTP?.(values.email);
            }
        } catch (error) {
            console.error('Registration error:', error);

            // Xử lý lỗi từ backend
            if (error.response) {
                const { data, status } = error.response;

                // Lỗi validation từ backend (400)
                if (status === 400) {
                    // Kiểm tra cấu trúc lỗi validation
                    if (data.errors && Array.isArray(data.errors)) {
                        // Hiển thị từng lỗi validation
                        data.errors.forEach((err, index) => {
                            setTimeout(() => {
                                message.error(err.message || err.defaultMessage || err);
                            }, index * 100); // Delay để hiển thị tuần tự
                        });
                    } else if (data.error && Array.isArray(data.error)) {
                        data.error.forEach((err, index) => {
                            setTimeout(() => {
                                message.error(err);
                            }, index * 100);
                        });
                    } else if (data.message) {
                        message.error(data.message);
                    } else if (typeof data === 'string') {
                        message.error(data);
                    } else {
                        message.error('Dữ liệu nhập không hợp lệ!');
                    }
                }
                // Lỗi username/email đã tồn tại (409 hoặc 422)
                else if (status === 409 || status === 422) {
                    message.error(data.message || 'Tên đăng nhập hoặc email đã tồn tại!');
                }
                // Lỗi server (500)
                else if (status >= 500) {
                    message.error(data.message || 'Lỗi server. Vui lòng thử lại sau!');
                }
                // Các lỗi khác
                else {
                    message.error(data.message || error.message || 'Đăng ký thất bại. Vui lòng thử lại!');
                }
            } else if (error.request) {
                // Không nhận được response từ server
                message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!');
            } else {
                // Lỗi khác
                message.error(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!');
            }
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
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên đăng nhập!',
                        },
                        {
                            min: 3,
                            max: 50,
                            message: 'Tên đăng nhập phải từ 3-50 ký tự!',
                        },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Tên đăng nhập"
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
                        {
                            max: 100,
                            message: 'Email không được vượt quá 100 ký tự!',
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
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!',
                        },
                        {
                            min: 6,
                            max: 100,
                            message: 'Mật khẩu phải từ 6-100 ký tự!',
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
                    name="fullName"
                    rules={[
                        {
                            max: 100,
                            message: 'Họ tên không được vượt quá 100 ký tự!',
                        },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Họ và tên (tùy chọn)"
                        className="custom-input"
                    />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    rules={[
                        {
                            pattern: /^[+]?[0-9]{10,15}$/,
                            message: 'Số điện thoại phải từ 10-15 số!',
                        },
                    ]}
                >
                    <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Số điện thoại (tùy chọn)"
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
                        Tôi đồng ý với <Button type="link" className="terms-link">Điều khoản</Button> và <Button type="link" className="terms-link">Chính sách</Button>
                    </Checkbox>
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
                            className="register-button"
                        >
                            Tạo tài khoản
                        </Button>
                    </div>
                </Form.Item>
            </Form>

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

export default RegisterForm;
