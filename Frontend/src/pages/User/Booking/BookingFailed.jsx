import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button, Card, Typography, Spin } from 'antd';
import { CloseCircleOutlined, ReloadOutlined, HomeOutlined, LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import paymentService from '../../../services/paymentService';
import bookingService from '../../../services/bookingService';
import './BookingFailed.css';

const { Title, Text } = Typography;

const BookingFailed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [errorData, setErrorData] = useState({});

    // Lấy transactionId từ URL params hoặc state
    const transactionId = searchParams.get('transactionId') || location.state?.errorData?.transactionId;

    useEffect(() => {
        // Cuộn lên đầu trang khi load
        window.scrollTo(0, 0);

        const fetchBookingDetails = async () => {
            try {
                setLoading(true);

                if (transactionId) {
                    // Lấy payment details từ transactionId
                    const paymentData = await paymentService.getPaymentByTransactionId(transactionId);

                    // Lấy booking details từ bookingId trong payment
                    const bookingDetails = await bookingService.getBookingById(paymentData.bookingId);

                    // Kết hợp dữ liệu với error message từ state
                    const combinedData = {
                        errorMessage: location.state?.errorData?.errorMessage || 'Thanh toán không thành công',
                        reason: location.state?.errorData?.reason || 'Lỗi không xác định',
                        movieTitle: bookingDetails.movieTitle || bookingDetails.movie?.title,
                        cinemaName: bookingDetails.cinemaName || bookingDetails.cinema?.name,
                        showTime: bookingDetails.showtimeTime || bookingDetails.showtime?.time,
                        showDate: bookingDetails.showtimeDate || bookingDetails.showtime?.date,
                        seatNumbers: bookingDetails.seatNames || bookingDetails.seats?.map(s => s.name).join(', '),
                        totalAmount: bookingDetails.totalAmount ? `${bookingDetails.totalAmount?.toLocaleString('vi-VN')}đ` : '0đ',
                        transactionId: paymentData.transactionId,
                        bookingCode: bookingDetails.code,
                        bookingId: bookingDetails.id,
                        moviePoster: bookingDetails.moviePoster || bookingDetails.movie?.poster,
                        cinemaAddress: bookingDetails.cinemaAddress || bookingDetails.cinema?.address,
                        screen: bookingDetails.screenName || bookingDetails.screen?.name
                    };

                    setErrorData(combinedData);
                } else {
                    // Fallback: Sử dụng dữ liệu từ state hoặc localStorage
                    const fallbackData = location.state?.errorData || JSON.parse(localStorage.getItem('pendingPayment') || '{}');

                    // Nếu có error và reason từ URL params, sử dụng chúng
                    const errorMessage = searchParams.get('error');
                    const reason = searchParams.get('reason');
                    if (errorMessage) fallbackData.errorMessage = decodeURIComponent(errorMessage);
                    if (reason) fallbackData.reason = decodeURIComponent(reason);

                    // Đảm bảo format đúng cho totalAmount
                    if (fallbackData.totalAmount && !fallbackData.totalAmount.includes('đ')) {
                        fallbackData.totalAmount = fallbackData.totalAmount + 'đ';
                    }

                    setErrorData(fallbackData);
                }
            } catch (error) {
                console.error('Error fetching booking details:', error);
                // Fallback to existing data from state hoặc localStorage
                const fallbackData = location.state?.errorData || JSON.parse(localStorage.getItem('pendingPayment') || '{}');
                setErrorData(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [transactionId, location.state]);

    const handleTryAgain = () => {
        // Chuẩn bị dữ liệu để retry payment
        const retryData = {
            bookingId: errorData.bookingId,
            bookingCode: errorData.bookingCode,
            movieTitle: errorData.movieTitle,
            moviePoster: errorData.moviePoster,
            cinemaName: errorData.cinemaName,
            cinemaAddress: errorData.cinemaAddress,
            roomName: errorData.screen,
            selectedSeats: errorData.seatNumbers ? errorData.seatNumbers.split(', ').map((seat, idx) => ({
                name: seat,
                seatLabel: seat,
                price: 0 // Sẽ được tính lại từ backend
            })) : [],
            showDate: errorData.showDate,
            showTime: errorData.showTime,
            totalAmount: errorData.totalAmount
        };

        navigate('/booking/payment', { state: retryData });
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleContactSupport = () => {
        navigate('/support');
    };

    if (loading) {
        return (
            <div className="booking-failed-page">
                <div className="failed-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} tip="Đang tải thông tin..." />
                </div>
            </div>
        );
    }

    const {
        errorMessage = 'Rất tiếc, giao dịch của bạn không thể hoàn tất do thông tin thẻ không hợp lệ. Vui lòng kiểm tra lại và thử lại.',
        movieTitle = '',
        cinemaName = '',
        showTime = '',
        showDate = '',
        seatNumbers = '',
        totalAmount = '0đ',
        reason = 'Thanh toán không thành công.',
        bookingCode = ''
    } = errorData;

    return (
        <div className="booking-failed-page">
            <div className="failed-container">
                {/* Failed Icon */}
                <div className="failed-icon-wrapper">
                    <div className="failed-icon-circle">
                        <CloseCircleOutlined className="failed-icon" />
                    </div>
                </div>

                {/* Title */}
                <Title level={2} className="failed-title">
                    Thanh toán không thành công
                </Title>

                {/* Error Message */}
                <Text className="failed-message">
                    {errorMessage}
                </Text>

                {/* Order Summary Card */}
                <Card className="failed-summary-card">
                    <div className="summary-header">
                        <Text className="summary-title">Tóm tắt đơn hàng</Text>
                    </div>

                    <div className="summary-content">
                        {movieTitle && (
                            <div className="summary-row">
                                <Text className="summary-label">Phim:</Text>
                                <Text className="summary-value">{movieTitle}</Text>
                            </div>
                        )}

                        {cinemaName && (
                            <div className="summary-row">
                                <Text className="summary-label">Rạp:</Text>
                                <Text className="summary-value">{cinemaName}</Text>
                            </div>
                        )}

                        {showTime && (
                            <div className="summary-row">
                                <Text className="summary-label">Suất chiếu:</Text>
                                <Text className="summary-value">
                                    {showTime} - {showDate ? dayjs(showDate).format('DD/MM/YYYY') : ''}
                                </Text>
                            </div>
                        )}

                        {seatNumbers && (
                            <div className="summary-row">
                                <Text className="summary-label">Số vé:</Text>
                                <Text className="summary-value">{seatNumbers}</Text>
                            </div>
                        )}

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <Text className="total-label">Tổng cộng:</Text>
                            <Text className="total-value">{totalAmount}</Text>
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="warning-message">
                        <CloseCircleOutlined className="warning-icon" />
                        <Text className="warning-text">
                            Ghế của bạn sẽ được giữ trong <strong>09:15</strong>
                        </Text>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="failed-actions">
                    <Button
                        size="large"
                        className="choose-method-btn"
                        onClick={handleTryAgain}
                    >
                        Chọn phương thức ...
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        className="retry-payment-btn"
                        icon={<ReloadOutlined />}
                        onClick={handleTryAgain}
                    >
                        Thử lại thanh toán
                    </Button>
                </div>

                {/* Support Link */}
                <div className="support-link">
                    <Text className="support-text">Cần trợ giúp? </Text>
                    <Button
                        type="link"
                        onClick={handleContactSupport}
                        className="support-link-btn"
                    >
                        Liên hệ với chúng tôi
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BookingFailed;
