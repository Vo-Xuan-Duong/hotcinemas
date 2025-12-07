import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Form,
    Input,
    Button,
    Space,
    message,
    Avatar,
    Typography,
    Divider,
    Spin,
    Modal,
    Descriptions,
    Tag,
    Image,
    Row,
    Col
} from 'antd';
import QRCode from 'qrcode';
import {
    UserOutlined,
    LockOutlined,
    BellOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    DownloadOutlined,
    PrinterOutlined
} from '@ant-design/icons';
import { User, Lock, Bell, Clock, Edit } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import bookingService from '../../../services/bookingService';
import ticketService from '../../../services/ticketService';
import './AccountSettings.css';

const { Title, Text } = Typography;

const AccountSettings = () => {
    const navigate = useNavigate();
    const { user, updateProfile } = useAuth();
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeMenu, setActiveMenu] = useState('info');
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [bookingHistory, setBookingHistory] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [generatedQR, setGeneratedQR] = useState(null);
    const qrCanvasRef = useRef(null);
    const [bookingPagination, setBookingPagination] = useState({ page: 0, size: 5, totalPages: 0, totalElements: 0 });

    useEffect(() => {
        console.log('AccountSettings - User data:', user);
        if (user) {
            const formData = {
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phoneNumber || '',
                birthDate: user.birthDate || ''
            };
            console.log('Setting form values:', formData);
            form.setFieldsValue(formData);
        }
    }, [user, form]);

    // Load booking history when switching to history tab
    useEffect(() => {
        if (activeMenu === 'history' && user?.id) {
            loadBookingHistory();
        }
    }, [activeMenu, user]);

    // Load more when page changes
    useEffect(() => {
        if (activeMenu === 'history' && user?.id && bookingPagination.page > 0) {
            loadMoreBookings();
        }
    }, [bookingPagination.page]);

    const loadBookingHistory = async () => {
        if (!user?.id) return;

        setBookingLoading(true);
        try {
            const params = {
                page: 0,
                size: bookingPagination.size
            };
            const response = await bookingService.getBookingHistoryByUserId(user.id, params);

            // Handle paginated response
            if (response?.content) {
                setBookingHistory(response.content);
                setBookingPagination({
                    page: 0,
                    size: bookingPagination.size,
                    totalPages: response.totalPages || 0,
                    totalElements: response.totalElements || 0
                });
            } else if (Array.isArray(response)) {
                setBookingHistory(response);
            } else {
                setBookingHistory([]);
            }
        } catch (error) {
            console.error('Error loading booking history:', error);
            message.error('Không thể tải lịch sử đặt vé');
            setBookingHistory([]);
        } finally {
            setBookingLoading(false);
        }
    };

    const generateQRCode = async (bookingCode) => {
        try {
            const qrDataUrl = await QRCode.toDataURL(bookingCode, {
                width: 250,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            setGeneratedQR(qrDataUrl);
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    const handleViewBookingDetail = async (bookingCode) => {
        setDetailLoading(true);
        setDetailModalVisible(true);
        setGeneratedQR(null);
        try {
            const response = await bookingService.getBookingByCode(bookingCode);
            setSelectedBooking(response);

            // Nếu backend không có QR code, tạo QR code từ mã booking
            if (!response.qrCodeBase64) {
                await generateQRCode(response.bookingCode);
            }
        } catch (error) {
            console.error('Error loading booking detail:', error);
            message.error('Không thể tải thông tin đặt vé');
            setDetailModalVisible(false);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCloseDetailModal = () => {
        setDetailModalVisible(false);
        setSelectedBooking(null);
        setGeneratedQR(null);
    };

    const handleDownloadQR = async () => {
        if (!selectedBooking?.id) return;

        try {
            const blob = await ticketService.downloadBookingPDF(selectedBooking.id);
            ticketService.triggerDownload(blob, `ticket-${selectedBooking.bookingCode}.pdf`);
            message.success('Đã tải xuống vé thành công');
        } catch (error) {
            console.error('Error downloading ticket:', error);
            message.error('Không thể tải xuống vé');
        }
    }; const handlePrintTicket = () => {
        window.print();
    };

    const getStatusConfig = (status) => {
        const configs = {
            'PENDING': { color: 'warning', icon: <ClockCircleOutlined />, text: 'Đang chờ thanh toán' },
            'PAID': { color: 'success', icon: <CheckCircleOutlined />, text: 'Đã thanh toán' },
            'CANCELLED': { color: 'default', icon: <CloseCircleOutlined />, text: 'Đã hủy' },
            'FAILED': { color: 'error', icon: <CloseCircleOutlined />, text: 'Thanh toán lỗi' },
            'REFUNDED': { color: 'processing', icon: <CheckCircleOutlined />, text: 'Đã hoàn tiền' }
        };
        return configs[status] || configs['PENDING'];
    };

    const loadMoreBookings = async () => {
        if (!user?.id) return;

        setBookingLoading(true);
        try {
            const params = {
                page: bookingPagination.page,
                size: bookingPagination.size
            };
            const response = await bookingService.getBookingHistoryByUserId(user.id, params);

            // Append new data to existing list
            if (response?.content) {
                setBookingHistory(prev => [...prev, ...response.content]);
                setBookingPagination(prev => ({
                    ...prev,
                    totalPages: response.totalPages || 0,
                    totalElements: response.totalElements || 0
                }));
            }
        } catch (error) {
            console.error('Error loading more bookings:', error);
            message.error('Không thể tải thêm lịch sử');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleSaveInfo = async (values) => {
        setLoading(true);
        try {
            // Map form values to API format
            const updateData = {
                fullName: values.fullName,
                email: values.email,
                phoneNumber: values.phone,
                birthDate: values.birthDate
            };

            await updateProfile(updateData);
            message.success('Cập nhật thông tin thành công!');
            setIsEditingInfo(false);
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin!');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (values) => {
        setLoading(true);
        try {
            if (values.newPassword !== values.confirmPassword) {
                message.error('Mật khẩu xác nhận không khớp!');
                setLoading(false);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success('Đổi mật khẩu thành công!');
            passwordForm.resetFields();
            setIsEditingPassword(false);
        } catch (error) {
            message.error('Có lỗi xảy ra khi đổi mật khẩu!');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (activeMenu === 'info') {
            form.resetFields();
            setIsEditingInfo(false);
        } else if (activeMenu === 'security') {
            passwordForm.resetFields();
            setIsEditingPassword(false);
        }
    };

    const handleEdit = () => {
        if (activeMenu === 'info') {
            setIsEditingInfo(true);
        } else if (activeMenu === 'security') {
            setIsEditingPassword(true);
        }
    };

    const menuItems = [
        {
            key: 'info',
            icon: <User size={16} />,
            label: 'Thông tin cá nhân'
        },
        {
            key: 'security',
            icon: <Lock size={16} />,
            label: 'Mật khẩu & Bảo mật'
        },
        {
            key: 'history',
            icon: <Clock size={16} />,
            label: 'Lịch sử đặt vé'
        },
        {
            key: 'notifications',
            icon: <Bell size={16} />,
            label: 'Cài đặt thông báo'
        }
    ];

    // Debug: Log user state
    console.log('Current user state:', user);
    console.log('Is user loaded?', !!user);

    return (
        <div className="account-settings">
            <div className="settings-container">
                <Title level={2} className="page-title">Cài đặt Tài khoản</Title>
                {!user && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#ff4d4f' }}>
                        <Text type="danger">Vui lòng đăng nhập để xem thông tin cá nhân</Text>
                    </div>
                )}

                <div className="settings-layout">
                    {/* Sidebar */}
                    <div className="settings-sidebar">
                        <div className="sidebar-profile">
                            <Avatar
                                size={48}
                                icon={<UserOutlined />}
                                src={user?.avatar}
                                className="sidebar-avatar"
                            />
                            <div className="sidebar-user-info">
                                <Text strong className="sidebar-name">
                                    {user?.fullName || user?.username || 'Người dùng'}
                                </Text>
                                <Text type="secondary" className="sidebar-email">
                                    {user?.email || ''}
                                </Text>
                            </div>
                        </div>

                        <div className="sidebar-menu">
                            {menuItems.map(item => (
                                <div
                                    key={item.key}
                                    className={`sidebar-menu-item ${activeMenu === item.key ? 'active' : ''}`}
                                    onClick={() => setActiveMenu(item.key)}
                                >
                                    <span className="menu-icon">{item.icon}</span>
                                    <span className="menu-label">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="settings-content">
                        {activeMenu === 'info' && (
                            <div className="content-section">
                                <div className="section-header">
                                    <Title level={3} className="section-title">Thông tin cá nhân</Title>
                                    <Text type="secondary" className="section-description">
                                        Cập nhật thông tin và địa chỉ email của bạn.
                                    </Text>
                                </div>

                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSaveInfo}
                                    className="settings-form"
                                    initialValues={{
                                        fullName: user?.fullName || '',
                                        email: user?.email || '',
                                        phone: user?.phoneNumber || '',
                                        birthDate: user?.birthDate || ''
                                    }}
                                >
                                    <div className="form-row">
                                        <Form.Item
                                            label="Họ và tên"
                                            name="fullName"
                                            className="form-item-half"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập họ tên!' },
                                                { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                                            ]}
                                        >
                                            <Input placeholder="Nguyễn Văn A" size="large" disabled={!isEditingInfo} />
                                        </Form.Item>

                                        <Form.Item
                                            label="Địa chỉ email"
                                            name="email"
                                            className="form-item-half"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập email!' },
                                                { type: 'email', message: 'Email không hợp lệ!' }
                                            ]}
                                        >
                                            <Input placeholder="nguyenvana@email.com" size="large" disabled={!isEditingInfo} />
                                        </Form.Item>
                                    </div>

                                    <div className="form-row">
                                        <Form.Item
                                            label="Số điện thoại"
                                            name="phone"
                                            className="form-item-half"
                                            rules={[
                                                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                                            ]}
                                        >
                                            <Input placeholder="Thêm số điện thoại" size="large" disabled={!isEditingInfo} />
                                        </Form.Item>

                                        <Form.Item
                                            label="Ngày sinh"
                                            name="birthDate"
                                            className="form-item-half"
                                        >
                                            <Input type="date" placeholder="mm/dd/yyyy" size="large" disabled={!isEditingInfo} />
                                        </Form.Item>
                                    </div>
                                </Form>
                            </div>
                        )}

                        {activeMenu === 'security' && (
                            <div className="content-section">
                                <div className="section-header">
                                    <Title level={3} className="section-title">Mật khẩu & Bảo mật</Title>
                                    <Text type="secondary" className="section-description">
                                        Thay đổi mật khẩu để bảo vệ tài khoản của bạn.
                                    </Text>
                                </div>

                                <Form
                                    form={passwordForm}
                                    layout="vertical"
                                    onFinish={handleChangePassword}
                                    className="settings-form"
                                >
                                    <Form.Item
                                        label="Mật khẩu hiện tại"
                                        name="currentPassword"
                                        className="form-item-full"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }
                                        ]}
                                    >
                                        <Input.Password placeholder="••••••••••" size="large" disabled={!isEditingPassword} />
                                    </Form.Item>

                                    <div className="form-row">
                                        <Form.Item
                                            label="Mật khẩu mới"
                                            name="newPassword"
                                            className="form-item-half"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                            ]}
                                        >
                                            <Input.Password placeholder="Nhập mật khẩu mới" size="large" disabled={!isEditingPassword} />
                                        </Form.Item>

                                        <Form.Item
                                            label="Xác nhận mật khẩu mới"
                                            name="confirmPassword"
                                            className="form-item-half"
                                            dependencies={['newPassword']}
                                            rules={[
                                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('newPassword') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input.Password placeholder="Nhập lại mật khẩu mới" size="large" disabled={!isEditingPassword} />
                                        </Form.Item>
                                    </div>
                                </Form>
                            </div>
                        )}

                        {activeMenu === 'notifications' && (
                            <div className="content-section">
                                <div className="section-header">
                                    <Title level={3} className="section-title">Cài đặt thông báo</Title>
                                    <Text type="secondary" className="section-description">
                                        Quản lý cách bạn nhận thông báo từ chúng tôi.
                                    </Text>
                                </div>

                                <div className="notifications-content">
                                    <Text type="secondary">Tính năng đang được phát triển...</Text>
                                </div>
                            </div>
                        )}

                        {activeMenu === 'history' && (
                            <div className="content-section">
                                <div className="section-header">
                                    <Title level={3} className="section-title">Lịch sử đặt vé</Title>
                                    <Text type="secondary" className="section-description">
                                        Xem lại tất cả các đơn đặt vé của bạn.
                                    </Text>
                                </div>

                                {bookingLoading ? (
                                    <div style={{ textAlign: 'center', padding: '40px' }}>
                                        <Spin size="large" tip="Đang tải lịch sử đặt vé..." />
                                    </div>
                                ) : bookingHistory.length > 0 ? (
                                    <div className="booking-history-list">
                                        {bookingHistory.map((booking) => {
                                            // Format datetime for display
                                            let dateTimeStr = 'N/A';
                                            if (booking.showtimeDateTime && booking.showtimeStartTime) {
                                                try {
                                                    const date = new Date(booking.showtimeDateTime);
                                                    const dateStr = date.toLocaleDateString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    });
                                                    dateTimeStr = `${booking.showtimeStartTime} - ${dateStr}`;
                                                } catch (e) {
                                                    console.error('Date format error:', e);
                                                }
                                            }

                                            // Format seats
                                            const seatsStr = booking.seats?.map(s => s.seatName).join(', ') || 'N/A';

                                            // Format status
                                            const statusMap = {
                                                'PENDING': 'Đang chờ thanh toán',
                                                'PAID': 'Đã thanh toán',
                                                'CANCELLED': 'Đã hủy',
                                                'FAILED': 'Thanh toán lỗi',
                                                'REFUNDED': 'Đã hoàn tiền'
                                            };
                                            const statusText = statusMap[booking.status] || booking.status || 'N/A';

                                            return (
                                                <div
                                                    key={booking.id}
                                                    className="booking-item"
                                                    onClick={() => handleViewBookingDetail(booking.bookingCode)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <img
                                                        src={booking.moviePosterUrl || '/placeholder-movie.jpg'}
                                                        alt={booking.movieTitle}
                                                        className="booking-poster"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/80x120?text=No+Image';
                                                        }}
                                                    />
                                                    <div className="booking-content">
                                                        <div className="booking-info">
                                                            <Text strong className="booking-movie">
                                                                {booking.movieTitle || 'Không có thông tin phim'}
                                                            </Text>
                                                            <Text type="secondary" className="booking-details">
                                                                {booking.cinemaName || 'N/A'} • {dateTimeStr}
                                                            </Text>
                                                            <Text type="secondary" className="booking-seats">
                                                                Ghế: {seatsStr}
                                                            </Text>
                                                            {booking.bookingCode && (
                                                                <Text type="secondary" className="booking-code" style={{ fontSize: '12px', marginTop: '4px' }}>
                                                                    Mã đặt vé: {booking.bookingCode}
                                                                </Text>
                                                            )}
                                                        </div>
                                                        <div className="booking-amount">
                                                            <Text strong style={{ color: '#2563eb', fontSize: '16px' }}>
                                                                {(booking.totalPrice || 0).toLocaleString('vi-VN')}đ
                                                            </Text>
                                                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                                                {statusText}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Load More Button */}
                                        {bookingPagination.page < bookingPagination.totalPages - 1 && (
                                            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                                <Button
                                                    size="large"
                                                    onClick={() => {
                                                        setBookingPagination(prev => ({
                                                            ...prev,
                                                            page: prev.page + 1
                                                        }));
                                                    }}
                                                    loading={bookingLoading}
                                                    style={{ minWidth: '150px' }}
                                                >
                                                    Xem thêm
                                                </Button>
                                                <Text type="secondary" style={{ display: 'block', marginTop: '12px', fontSize: '13px' }}>
                                                    Trang {bookingPagination.page + 1} / {bookingPagination.totalPages}
                                                </Text>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
                                        <Text type="secondary">Bạn chưa có đơn đặt vé nào</Text>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        {(activeMenu === 'info' || activeMenu === 'security') && (
                            <div className="form-actions">
                                {((activeMenu === 'info' && !isEditingInfo) || (activeMenu === 'security' && !isEditingPassword)) ? (
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={handleEdit}
                                        className="save-btn"
                                        icon={<Edit size={16} />}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            size="large"
                                            onClick={handleCancel}
                                            className="cancel-btn"
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            type="primary"
                                            size="large"
                                            loading={loading}
                                            onClick={() => {
                                                if (activeMenu === 'info') {
                                                    form.submit();
                                                } else if (activeMenu === 'security') {
                                                    passwordForm.submit();
                                                }
                                            }}
                                            className="save-btn"
                                        >
                                            Lưu thay đổi
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Detail Modal */}
            <Modal
                title="Chi tiết đặt vé"
                open={detailModalVisible}
                onCancel={handleCloseDetailModal}
                width={850}
                centered
                bodyStyle={{ maxHeight: '70vh', overflowY: 'auto', padding: '16px' }}
                footer={[
                    <Button key="close" onClick={handleCloseDetailModal}>
                        Đóng
                    </Button>,
                    <Button
                        key="download"
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadQR}
                        disabled={!selectedBooking?.id}
                    >
                        Tải vé PDF
                    </Button>,
                    <Button
                        key="print"
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={handlePrintTicket}
                    >
                        In vé
                    </Button>
                ]}
            >
                {detailLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" tip="Đang tải..." />
                    </div>
                ) : selectedBooking ? (
                    <Row gutter={[24, 24]}>
                        {/* Left Column - QR Code & Status */}
                        <Col xs={24} md={8}>
                            <div style={{ textAlign: 'center' }}>
                                {selectedBooking.qrCodeBase64 || generatedQR ? (
                                    <Image
                                        src={selectedBooking.qrCodeBase64
                                            ? `data:image/png;base64,${selectedBooking.qrCodeBase64}`
                                            : generatedQR
                                        }
                                        alt="QR Code"
                                        style={{
                                            width: '100%',
                                            maxWidth: '180px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            marginBottom: '12px',
                                            padding: '6px',
                                            background: '#ffffff'
                                        }}
                                        preview={false}
                                    />
                                ) : (
                                    <div style={{
                                        width: '180px',
                                        height: '180px',
                                        margin: '0 auto 12px',
                                        background: '#f3f4f6',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Spin tip="Đang tạo QR..." size="small" />
                                    </div>
                                )}
                                <div style={{ marginBottom: '8px' }}>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Mã đặt vé</Text>
                                    <Title level={5} copyable style={{ margin: '2px 0', fontSize: '15px' }}>
                                        {selectedBooking.bookingCode}
                                    </Title>
                                </div>
                                <Tag
                                    icon={getStatusConfig(selectedBooking.status).icon}
                                    color={getStatusConfig(selectedBooking.status).color}
                                    style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px' }}
                                >
                                    {getStatusConfig(selectedBooking.status).text}
                                </Tag>
                            </div>
                            {selectedBooking.moviePosterUrl && (
                                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                    <Image
                                        src={selectedBooking.moviePosterUrl}
                                        alt={selectedBooking.movieTitle}
                                        style={{
                                            width: '100%',
                                            maxWidth: '150px',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>
                            )}
                        </Col>

                        {/* Right Column - Details */}
                        <Col xs={24} md={16}>
                            {/* Movie Information */}
                            <Card size="small" title="Thông tin phim" style={{ marginBottom: '10px' }}>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Tên phim">
                                        <Text strong>{selectedBooking.movieTitle}</Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Định dạng">
                                        {selectedBooking.movieFormat || 'N/A'}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            {/* Cinema Information */}
                            <Card size="small" title="Thông tin rạp" style={{ marginBottom: '10px' }}>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Rạp chiếu">
                                        <Text strong>{selectedBooking.cinemaName}</Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Phòng chiếu">
                                        {selectedBooking.roomName || 'N/A'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Địa chỉ">
                                        {selectedBooking.cinemaAddress || 'N/A'}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            {/* Showtime Information */}
                            <Card size="small" title="Thông tin suất chiếu" style={{ marginBottom: '10px' }}>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Ngày chiếu">
                                        {selectedBooking.showtimeDateTime ? new Date(selectedBooking.showtimeDateTime).toLocaleDateString('vi-VN', {
                                            weekday: 'long',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        }) : 'N/A'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Giờ chiếu">
                                        {selectedBooking.showtimeStartTime} - {selectedBooking.showtimeEndTime}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            {/* Seat Information */}
                            <Card size="small" title="Thông tin ghế" style={{ marginBottom: '10px' }}>
                                <div>
                                    <Text strong>Ghế đã chọn: </Text>
                                    <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {selectedBooking.seats?.map((seat, index) => (
                                            <Tag key={index} color="blue">
                                                {seat.seatName} - {seat.seatType}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            </Card>

                            {/* Payment Information */}
                            <Card size="small" title="Thông tin thanh toán">
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Giá gốc">
                                        {(selectedBooking.originalPrice || 0).toLocaleString('vi-VN')}đ
                                    </Descriptions.Item>
                                    {selectedBooking.discountAmount > 0 && (
                                        <Descriptions.Item label="Giảm giá">
                                            <Text type="danger">-{(selectedBooking.discountAmount || 0).toLocaleString('vi-VN')}đ</Text>
                                        </Descriptions.Item>
                                    )}
                                    <Descriptions.Item label="Tổng tiền">
                                        <Text strong style={{ fontSize: '18px', color: '#2563eb' }}>
                                            {(selectedBooking.totalPrice || 0).toLocaleString('vi-VN')}đ
                                        </Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ngày đặt vé">
                                        {selectedBooking.bookingDate ? new Date(selectedBooking.bookingDate).toLocaleString('vi-VN') : 'N/A'}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>
                    </Row>
                ) : null}
            </Modal>
        </div>
    );
};

export default AccountSettings;
