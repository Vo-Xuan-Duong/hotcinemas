import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Descriptions,
    Button,
    Space,
    Tag,
    Divider,
    Typography,
    Spin,
    message,
    Row,
    Col,
    Image
} from 'antd';
import {
    ArrowLeftOutlined,
    DownloadOutlined,
    PrinterOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import bookingService from '../../../services/bookingService';
import './BookingDetail.css';

const { Title, Text } = Typography;

const BookingDetail = () => {
    const { bookingCode } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookingDetail();
    }, [bookingCode]);

    const loadBookingDetail = async () => {
        setLoading(true);
        try {
            const response = await bookingService.getBookingByCode(bookingCode);
            setBooking(response);
        } catch (error) {
            console.error('Error loading booking detail:', error);
            message.error('Không thể tải thông tin đặt vé');
            navigate('/account-settings');
        } finally {
            setLoading(false);
        }
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

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        if (booking?.qrCodeBase64) {
            const link = document.createElement('a');
            link.href = `data:image/png;base64,${booking.qrCodeBase64}`;
            link.download = `ticket-${booking.bookingCode}.png`;
            link.click();
        }
    };

    if (loading) {
        return (
            <div className="booking-detail-loading">
                <Spin size="large" tip="Đang tải thông tin..." />
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    const statusConfig = getStatusConfig(booking.status);

    return (
        <div className="booking-detail-page">
            <div className="booking-detail-container">
                {/* Header */}
                <div className="booking-header">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/account-settings')}
                        size="large"
                    >
                        Quay lại
                    </Button>
                    <Space>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleDownload}
                            disabled={!booking.qrCodeBase64}
                        >
                            Tải xuống
                        </Button>
                        <Button
                            icon={<PrinterOutlined />}
                            onClick={handlePrint}
                            type="primary"
                        >
                            In vé
                        </Button>
                    </Space>
                </div>

                <Title level={2} className="booking-title">Chi tiết đặt vé</Title>

                <Row gutter={[24, 24]}>
                    {/* Left Column - QR Code & Status */}
                    <Col xs={24} lg={8}>
                        <Card className="qr-card">
                            <div className="qr-section">
                                {booking.qrCodeBase64 ? (
                                    <Image
                                        src={`data:image/png;base64,${booking.qrCodeBase64}`}
                                        alt="QR Code"
                                        className="qr-code"
                                        preview={false}
                                    />
                                ) : (
                                    <div className="qr-placeholder">
                                        <Text type="secondary">QR Code không khả dụng</Text>
                                    </div>
                                )}
                                <div className="booking-code-section">
                                    <Text type="secondary">Mã đặt vé</Text>
                                    <Title level={4} copyable>{booking.bookingCode}</Title>
                                </div>
                                <Tag
                                    icon={statusConfig.icon}
                                    color={statusConfig.color}
                                    className="status-tag"
                                >
                                    {statusConfig.text}
                                </Tag>
                            </div>
                        </Card>

                        {/* Movie Poster */}
                        {booking.moviePosterUrl && (
                            <Card className="poster-card">
                                <Image
                                    src={booking.moviePosterUrl}
                                    alt={booking.movieTitle}
                                    className="movie-poster"
                                />
                            </Card>
                        )}
                    </Col>

                    {/* Right Column - Details */}
                    <Col xs={24} lg={16}>
                        {/* Movie Information */}
                        <Card title="Thông tin phim" className="detail-card">
                            <Descriptions column={{ xs: 1, sm: 2 }}>
                                <Descriptions.Item label="Tên phim">
                                    <Text strong>{booking.movieTitle}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Định dạng">
                                    {booking.movieFormat || 'N/A'}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Cinema Information */}
                        <Card title="Thông tin rạp" className="detail-card">
                            <Descriptions column={{ xs: 1, sm: 2 }}>
                                <Descriptions.Item label="Rạp chiếu">
                                    <Text strong>{booking.cinemaName}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Phòng chiếu">
                                    {booking.roomName || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ" span={2}>
                                    {booking.cinemaAddress || 'N/A'}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Showtime Information */}
                        <Card title="Thông tin suất chiếu" className="detail-card">
                            <Descriptions column={{ xs: 1, sm: 2 }}>
                                <Descriptions.Item label="Ngày chiếu">
                                    {booking.showtimeDateTime ? new Date(booking.showtimeDateTime).toLocaleDateString('vi-VN', {
                                        weekday: 'long',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }) : 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Giờ chiếu">
                                    {booking.showtimeStartTime} - {booking.showtimeEndTime}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Seat Information */}
                        <Card title="Thông tin ghế" className="detail-card">
                            <div className="seats-section">
                                <Text strong>Ghế đã chọn: </Text>
                                <div className="seats-list">
                                    {booking.seats?.map((seat, index) => (
                                        <Tag key={index} color="blue" className="seat-tag">
                                            {seat.seatName} - {seat.seatType}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Payment Information */}
                        <Card title="Thông tin thanh toán" className="detail-card">
                            <Descriptions column={1}>
                                <Descriptions.Item label="Giá gốc">
                                    {(booking.originalPrice || 0).toLocaleString('vi-VN')}đ
                                </Descriptions.Item>
                                {booking.discountAmount > 0 && (
                                    <Descriptions.Item label="Giảm giá">
                                        <Text type="danger">-{(booking.discountAmount || 0).toLocaleString('vi-VN')}đ</Text>
                                    </Descriptions.Item>
                                )}
                                <Descriptions.Item label="Tổng tiền">
                                    <Text strong style={{ fontSize: '20px', color: '#2563eb' }}>
                                        {(booking.totalPrice || 0).toLocaleString('vi-VN')}đ
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày đặt vé">
                                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleString('vi-VN') : 'N/A'}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* User Information */}
                        <Card title="Thông tin khách hàng" className="detail-card">
                            <Descriptions column={{ xs: 1, sm: 2 }}>
                                <Descriptions.Item label="Họ tên">
                                    {booking.userName || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    {booking.userEmail || 'N/A'}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default BookingDetail;
