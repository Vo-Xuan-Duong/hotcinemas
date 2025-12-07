import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button, Card, Typography, Space, Divider, Spin, message } from 'antd';
import { CheckCircleOutlined, DownloadOutlined, MailOutlined, CalendarOutlined, LoadingOutlined } from '@ant-design/icons';
import QRCode from 'qrcode';
import paymentService from '../../../services/paymentService';
import bookingService from '../../../services/bookingService';
import ticketService from '../../../services/ticketService';
import emailService from '../../../services/emailService';
import './BookingSuccess.css';

const { Title, Text } = Typography;

const BookingSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({});

    // Lấy bookingCode từ URL params, state hoặc localStorage
    const bookingCodeParam = searchParams.get('bookingCode') ||
        location.state?.bookingData?.bookingCode ||
        JSON.parse(localStorage.getItem('lastBooking') || '{}').bookingCode;

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                setLoading(true);

                if (bookingCodeParam) {
                    // Lấy booking details từ bookingCode
                    const bookingDetails = await bookingService.getBookingByCode(bookingCodeParam);

                    console.log('Fetched booking details:', bookingDetails);

                    // Format seat information from seats array
                    let seatInfo = 'Chưa có thông tin ghế';
                    if (bookingDetails.seats && bookingDetails.seats.length > 0) {
                        seatInfo = bookingDetails.seats.map(seat => seat.seatName).join(', ');
                    } else if (bookingDetails.seatNames) {
                        seatInfo = bookingDetails.seatNames;
                    }

                    // Map dữ liệu từ BookingResponse
                    const combinedData = {
                        bookingId: bookingDetails.id,
                        bookingCode: bookingDetails.bookingCode,
                        movieTitle: bookingDetails.movieTitle,
                        cinemaName: bookingDetails.cinemaName,
                        cinemaAddress: bookingDetails.cinemaAddress,
                        screen: bookingDetails.roomName,
                        seatNumbers: seatInfo,
                        seats: bookingDetails.seats || [],
                        showDate: bookingDetails.showtimeDateTime ? new Date(bookingDetails.showtimeDateTime).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }) : '',
                        showTime: bookingDetails.showtimeStartTime || '',
                        totalAmount: bookingDetails.totalPrice ? `${bookingDetails.totalPrice.toLocaleString('vi-VN')}đ` : '0đ',
                        moviePoster: bookingDetails.moviePosterUrl || 'https://via.placeholder.com/300x450',
                        bookingDate: bookingDetails.bookingDate,
                        userName: bookingDetails.userName,
                        userEmail: bookingDetails.userEmail,
                        originalPrice: bookingDetails.originalPrice,
                        discountAmount: bookingDetails.discountAmount
                    };

                    setBookingData(combinedData);

                    // Generate QR Code
                    const qrData = `BOOKING:${combinedData.bookingCode}`;
                    const qrUrl = await QRCode.toDataURL(qrData, {
                        width: 300,
                        margin: 2,
                        color: {
                            dark: '#000000',
                            light: '#FFFFFF'
                        }
                    });
                    setQrCodeUrl(qrUrl);
                } else {
                    // Fallback: Sử dụng dữ liệu từ state/localStorage
                    const fallbackData = location.state?.bookingData || JSON.parse(localStorage.getItem('lastBooking') || '{}');
                    setBookingData(fallbackData);

                    if (fallbackData.bookingCode) {
                        const qrData = `BOOKING:${fallbackData.bookingCode}`;
                        const qrUrl = await QRCode.toDataURL(qrData, {
                            width: 300,
                            margin: 2,
                            color: {
                                dark: '#000000',
                                light: '#FFFFFF'
                            }
                        });
                        setQrCodeUrl(qrUrl);
                    }
                }
            } catch (error) {
                console.error('Error fetching booking details:', error);
                // Fallback to existing data
                const fallbackData = location.state?.bookingData || JSON.parse(localStorage.getItem('lastBooking') || '{}');
                setBookingData(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingCodeParam, location.state]);

    const handleDownloadPDF = async () => {
        try {
            if (!bookingData.bookingId) {
                message.error('Không tìm thấy thông tin booking');
                return;
            }

            message.loading('Đang tải vé...', 0);

            // Download by booking ID only
            const pdfBlob = await ticketService.downloadBookingPDF(bookingData.bookingId);

            message.destroy();

            // Trigger download
            const filename = `Ve_${bookingData.bookingId}.pdf`;
            ticketService.triggerDownload(pdfBlob, filename);

            message.success('Tải vé thành công!');
        } catch (error) {
            message.destroy();
            console.error('Error downloading PDF:', error);
            message.error('Không thể tải vé. Vui lòng thử lại sau.');
        }
    };

    const handleSendEmail = async () => {
        try {
            if (!bookingData.bookingId) {
                message.error('Kh\u00f4ng t\u00ecm th\u1ea5y th\u00f4ng tin booking');
                return;
            }

            message.loading('\u0110ang g\u1eedi email...', 0);

            // Send ticket email by booking ID
            await emailService.sendTicketEmail(bookingData.bookingId);

            message.destroy();
            message.success('\u0110\u00e3 g\u1eedi v\u00e9 qua email th\u00e0nh c\u00f4ng!');
        } catch (error) {
            message.destroy();
            console.error('Error sending email:', error);
            message.error('Kh\u00f4ng th\u1ec3 g\u1eedi email. Vui l\u00f2ng th\u1eed l\u1ea1i sau.');
        }
    };

    const handleAddToCalendar = () => {
        // TODO: Implement calendar integration
        console.log('Add to calendar');
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="booking-success-container">
                <div className="success-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} tip="Đang tải thông tin đặt vé..." />
                </div>
            </div>
        );
    }

    const {
        bookingCode = 'XYZ123ABC',
        movieTitle = 'Dune: Part Two',
        cinemaName = 'CGV Crescent Mall',
        cinemaAddress = '101 Tôn Dật Tiên, P.Tân Phú, Quận 7, TP.HCM',
        screen = 'Rạp 05',
        seatNumbers = 'Ghế F11, F12',
        showDate = 'Thứ Sáu, 24 Tháng 6, 2024',
        showTime = '15:30',
        totalAmount = '250.000đ',
        moviePoster = 'https://image.tmdb.org/t/p/original/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg'
    } = bookingData;

    return (
        <div className="booking-success-container">
            <div className="success-content">
                {/* Success Icon */}
                <div className="success-icon">
                    <CheckCircleOutlined />
                </div>

                {/* Success Message */}
                <Title level={2} className="success-title">
                    Chúc mừng! Bạn đã đặt vé thành công.
                </Title>
                <Text className="success-subtitle">
                    Một email xác nhận cũng với vé điện tử đã được gửi đến địa chỉ email của bạn.
                </Text>                <div className="booking-details-wrapper">
                    {/* QR Code Card */}
                    <Card className="qr-code-card" bordered={false}>
                        <div className="qr-code-card-header">
                            <Text className="qr-card-title">Mã vé của bạn</Text>
                        </div>

                        <div className="qr-code-section">
                            {qrCodeUrl && (
                                <div className="qr-code-wrapper">
                                    <img src={qrCodeUrl} alt="QR Code" className="qr-code-image" />
                                </div>
                            )}
                        </div>

                        <div className="booking-code-section">
                            <Text className="code-label">Mã đặt vé:</Text>
                            <Title level={3} className="booking-code">{bookingCode}</Title>
                            <Text className="code-instruction">
                                Sử dụng mã này để xuất vé tại rạp
                            </Text>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons-section">
                            <Text className="action-section-label">Lưu lại vé của bạn</Text>
                            <Space direction="vertical" size="middle" className="action-buttons">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<DownloadOutlined />}
                                    onClick={handleDownloadPDF}
                                    block
                                    className="download-btn"
                                >
                                    Tải vé (PDF)
                                </Button>
                                <Button
                                    size="large"
                                    icon={<MailOutlined />}
                                    onClick={handleSendEmail}
                                    block
                                    className="email-btn"
                                >
                                    Gửi vé qua Email
                                </Button>
                                <Button
                                    size="large"
                                    icon={<CalendarOutlined />}
                                    onClick={handleAddToCalendar}
                                    block
                                    className="calendar-btn"
                                >
                                    Thêm vào Lịch
                                </Button>
                            </Space>
                        </div>
                    </Card>

                    {/* Ticket Details Card */}
                    <Card className="ticket-details-card" bordered={false}>
                        <Title level={4} className="details-title">Chi tiết vé</Title>

                        <div className="ticket-info-grid">
                            {/* Movie Poster */}
                            <div className="movie-poster-section">
                                <img
                                    src={moviePoster}
                                    alt={movieTitle}
                                    className="movie-poster-large"
                                />
                                <div className="movie-name-section">
                                    <Text className="movie-name-label">Phim</Text>
                                    <Text className="movie-name-value">{movieTitle}</Text>
                                </div>
                            </div>

                            {/* Ticket Details - 2 columns */}
                            <div className="ticket-details-columns">
                                {/* Left Column */}
                                <div className="detail-column">
                                    <div className="detail-item">
                                        <Text className="detail-label">Rạp chiếu</Text>
                                        <Text className="detail-value">{cinemaName}</Text>
                                        <Text className="detail-address">{cinemaAddress}</Text>
                                    </div>

                                    <div className="detail-item">
                                        <Text className="detail-label">Thông tin chỗ ngồi</Text>
                                        <Text className="detail-value">{screen}</Text>
                                        <Text className="detail-seats">Ghế: {seatNumbers}</Text>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="detail-column">
                                    <div className="detail-item">
                                        <Text className="detail-label">Suất chiếu</Text>
                                        <Text className="detail-value">{showDate}</Text>
                                        <Text className="detail-time">{showTime}</Text>
                                    </div>

                                    <div className="detail-item detail-item-total">
                                        <Text className="detail-label">Thanh toán</Text>
                                        <Text className="detail-total">{totalAmount}</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Back to Home Button */}
                <Button
                    size="large"
                    onClick={handleBackToHome}
                    className="back-home-btn"
                >
                    Quay về trang chủ
                </Button>
            </div>
        </div>
    );
};

export default BookingSuccess;
