import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import {
    FacebookOutlined,
    InstagramOutlined,
    TwitterOutlined,
    YoutubeOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    CreditCardOutlined,
    BankOutlined,
    MobileOutlined,
    PayCircleOutlined
} from '@ant-design/icons';
import './Footer.css';

const { Footer: LayoutFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <FacebookOutlined />, href: '#', label: 'Facebook' },
        { icon: <InstagramOutlined />, href: '#', label: 'Instagram' },
        { icon: <TwitterOutlined />, href: '#', label: 'Twitter' },
        { icon: <YoutubeOutlined />, href: '#', label: 'Youtube' },
    ];

    const paymentMethods = [
        { icon: <CreditCardOutlined />, label: 'Thẻ tín dụng' },
        { icon: <BankOutlined />, label: 'Chuyển khoản' },
        { icon: <MobileOutlined />, label: 'Ví điện tử' },
        { icon: <PayCircleOutlined />, label: 'QR Pay' },
    ];

    return (
        <LayoutFooter className="footer-antd">
            <div className="footer-content">
                <Row gutter={[32, 32]}>
                    <Col xs={24} sm={24} md={10}>
                        <div className="footer-section">
                            <Title level={3} className="footer-title">
                                🎬 HotCinemas
                            </Title>
                            <Text className="footer-description">
                                Hệ thống rạp chiếu phim hàng đầu Việt Nam, mang đến trải nghiệm
                                giải trí đỉnh cao với công nghệ hiện đại nhất.
                            </Text>
                            <div className="social-links">
                                <Space size="middle">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            className="social-link"
                                            aria-label={social.label}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </Space>
                            </div>
                        </div>
                    </Col>

                    <Col xs={12} sm={8} md={5}>
                        <div className="footer-section">
                            <Title level={4} className="footer-section-title">
                                Thông tin
                            </Title>
                            <ul className="footer-links">
                                <li><Link href="/about">Về chúng tôi</Link></li>
                                <li><Link href="/careers">Tuyển dụng</Link></li>
                                <li><Link href="/news">Tin tức</Link></li>
                                <li><Link href="/contact">Liên hệ</Link></li>
                            </ul>
                        </div>
                    </Col>

                    <Col xs={12} sm={8} md={4}>
                        <div className="footer-section">
                            <Title level={4} className="footer-section-title">
                                Hỗ trợ
                            </Title>
                            <ul className="footer-links">
                                <li><Link href="/help">Trợ giúp</Link></li>
                                <li><Link href="/faq">FAQ</Link></li>
                                <li><Link href="/booking-guide">Đặt vé</Link></li>
                                <li><Link href="/terms">Điều khoản</Link></li>
                            </ul>
                        </div>
                    </Col>

                    <Col xs={24} sm={8} md={5}>
                        <div className="footer-section">
                            <Title level={4} className="footer-section-title">
                                Liên hệ
                            </Title>
                            <div className="contact-info">
                                <Space direction="vertical" size="small">
                                    <div className="contact-item">
                                        <PhoneOutlined className="contact-icon" />
                                        <Text>1900-xxxx</Text>
                                    </div>
                                    <div className="contact-item">
                                        <MailOutlined className="contact-icon" />
                                        <Text>info@hotcinemas.vn</Text>
                                    </div>
                                    <div className="contact-item">
                                        <EnvironmentOutlined className="contact-icon" />
                                        <Text>Quận 1, TP.HCM</Text>
                                    </div>
                                </Space>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Divider className="footer-divider" />

                <div className="footer-bottom">
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Text className="copyright">
                                © {currentYear} HotCinemas. Tất cả quyền được bảo lưu.
                            </Text>
                        </Col>
                        <Col>
                            <Space split={<Divider type="vertical" />}>
                                <Link href="/terms" className="bottom-link">Điều khoản</Link>
                                <Link href="/privacy" className="bottom-link">Bảo mật</Link>
                                <Link href="/cookies" className="bottom-link">Cookies</Link>
                            </Space>
                        </Col>
                    </Row>
                </div>
            </div>
        </LayoutFooter>
    );
};

export default Footer;
