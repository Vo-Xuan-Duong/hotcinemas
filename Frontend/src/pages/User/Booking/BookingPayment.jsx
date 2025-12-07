import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message, Radio, Button, Spin } from 'antd';
import { CreditCardOutlined, WalletOutlined, QrcodeOutlined, BankOutlined, SafetyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import QRCode from 'qrcode';
import './BookingPayment.css';
import paymentService from '../../../services/paymentService';
import bookingService from '../../../services/bookingService';

const BookingPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state;

    const [paymentMethod, setPaymentMethod] = useState('momo');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        if (!bookingData) {
            message.error('Không tìm thấy thông tin đặt vé');
            navigate('/');
            return;
        }

        // Generate QR code for MoMo by default
        generateQRCode();
    }, [bookingData, navigate]);

    const generateQRCode = async () => {
        try {
            const total = bookingData.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
            const orderId = `BOOKING_${Date.now()}`;
            const paymentString = `2|99|${orderId}|${total}|Thanh toan ve xem phim|0|0|0`;

            const qrUrl = await QRCode.toDataURL(paymentString, {
                width: 250,
                margin: 2,
                color: {
                    dark: '#A50064',
                    light: '#FFFFFF'
                }
            });

            setQrCodeUrl(qrUrl);
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    const handlePayment = async () => {
        if (!paymentMethod) {
            message.warning('Vui lòng chọn phương thức thanh toán');
            return;
        }

        try {
            setIsProcessing(true);

            // Sử dụng bookingId đã được tạo từ trang chọn ghế
            const bookingId = bookingData.bookingId;

            if (!bookingId) {
                message.error('Không tìm thấy thông tin đơn đặt vé');
                navigate('/');
                return;
            }

            console.log('Creating payment for booking:', bookingId);

            // Tạo payment cho booking (backend sẽ tự tính amount từ booking)
            const paymentPayload = {
                bookingId: bookingId,
                paymentMethod: paymentMethod.toUpperCase() // MOMO, VNPAY, ZALOPAY
            };

            const response = await paymentService.createPayment(paymentPayload);

            console.log('Payment created:', response);

            // Lấy payment data từ response
            const paymentData = response?.data || response;

            // Kiểm tra nếu có paymentUrl (thanh toán online)
            if (paymentData.paymentUrl) {
                console.log('Redirecting to payment URL:', paymentData.paymentUrl);

                // Lưu thông tin booking để có thể quay lại sau khi thanh toán
                const bookingInfo = {
                    bookingCode: bookingData.bookingCode,
                    bookingId: bookingId,
                    paymentId: paymentData.paymentId,
                    transactionId: paymentData.transactionId,
                    movieTitle: bookingData.movieTitle,
                    moviePoster: bookingData.moviePoster,
                    cinemaName: bookingData.cinemaName,
                    cinemaAddress: bookingData.cinemaAddress || '',
                    screen: bookingData.roomName || 'Rạp 01',
                    seatNumbers: bookingData.selectedSeats.map(s => s.seatLabel || s.name).join(', '),
                    showDate: dayjs(bookingData.showDate).format('dddd, DD [Tháng] M, YYYY'),
                    showTime: bookingData.showTime,
                    totalAmount: calculateTotal().toLocaleString() + 'đ',
                    paymentMethod: paymentService.getPaymentMethodName(paymentMethod),
                    paymentDate: paymentData.paymentDate
                };

                localStorage.setItem('pendingPayment', JSON.stringify(bookingInfo));

                message.info('Đang chuyển đến trang thanh toán...');

                // Chuyển hướng đến trang thanh toán của cổng thanh toán
                setTimeout(() => {
                    window.location.href = paymentData.paymentUrl;
                }, 500);

            } else {
                // Thanh toán thành công ngay (không cần redirect)
                message.success('Thanh toán thành công!');

                const bookingSuccessData = {
                    bookingCode: bookingData.bookingCode || 'XYZ' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                    bookingId: bookingId,
                    paymentId: paymentData.paymentId,
                    transactionId: paymentData.transactionId,
                    movieTitle: bookingData.movieTitle,
                    moviePoster: bookingData.moviePoster,
                    cinemaName: bookingData.cinemaName,
                    cinemaAddress: bookingData.cinemaAddress || '',
                    screen: bookingData.roomName || 'Rạp 01',
                    seatNumbers: bookingData.selectedSeats.map(s => s.seatLabel || s.name).join(', '),
                    showDate: dayjs(bookingData.showDate).format('dddd, DD [Tháng] M, YYYY'),
                    showTime: bookingData.showTime,
                    totalAmount: calculateTotal().toLocaleString() + 'đ',
                    paymentMethod: paymentService.getPaymentMethodName(paymentMethod)
                };

                localStorage.setItem('lastBooking', JSON.stringify(bookingSuccessData));

                setTimeout(() => {
                    navigate('/booking/success', { state: { bookingData: bookingSuccessData } });
                }, 500);
            }

        } catch (error) {
            console.error('Payment error:', error);

            // Xử lý lỗi cụ thể
            if (error.response?.status === 404) {
                message.error('Không tìm thấy đơn đặt vé');
                navigate('/');
            } else if (error.response?.status === 400) {
                message.error(error.response?.data?.message || 'Thanh toán không hợp lệ');
            } else if (error.response?.status === 409) {
                message.error('Booking đã được thanh toán rồi');
            } else {
                message.error('Thanh toán thất bại. Vui lòng thử lại.');
            }

            const errorData = {
                errorMessage: error.response?.data?.message || 'Có lỗi xảy ra trong quá trình thanh toán.',
                movieTitle: bookingData.movieTitle,
                reason: error.response?.data?.reason || 'Thanh toán không thành công.',
                transactionId: error.response?.data?.transactionId || ''
            };

            setTimeout(() => {
                navigate('/booking/failed', { state: { errorData } });
            }, 1000);

        } finally {
            setIsProcessing(false);
        }
    };

    const getPaymentMethodName = (method) => {
        return paymentService.getPaymentMethodName(method);
    };

    const calculateTotal = () => {
        return bookingData?.selectedSeats?.reduce((sum, seat) => sum + seat.price, 0) || 0;
    };

    const handleCancelBooking = async () => {
        try {
            setIsCancelling(true);

            const bookingId = bookingData.bookingId;

            if (!bookingId) {
                message.warning('Không tìm thấy thông tin đơn đặt vé để hủy');
                navigate(-1);
                return;
            }

            // Gọi API xóa booking
            await bookingService.deleteBooking(bookingId);

            message.success('Đã hủy đơn đặt vé thành công');

            // Quay về trang chọn ghế sau khi xóa
            navigate(-1);

        } catch (error) {
            console.error('Error cancelling booking:', error);

            // Nếu API xóa thất bại (ví dụ: booking không tồn tại), vẫn cho phép quay lại
            if (error.response?.status === 404) {
                message.warning('Đơn đặt vé không tồn tại');
            } else {
                message.error('Không thể hủy đơn đặt vé. Vui lòng thử lại.');
            }

            // Vẫn quay lại dù có lỗi
            navigate(-1);

        } finally {
            setIsCancelling(false);
        }
    };

    if (!bookingData) {
        return (
            <div className="payment-page">
                <div className="payment-loading">
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="payment-header">
                    <SafetyOutlined className="security-icon" />
                    <h1 className="payment-title">Thanh toán an toàn</h1>
                </div>

                <div className="payment-content">
                    {/* Left Side - Payment Methods */}
                    <div className="payment-method-section">
                        <div className="section-card">
                            <h2 className="section-title">Chọn phương thức thanh toán</h2>

                            <Radio.Group
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="payment-options"
                            >
                                <Radio.Button value="momo" className="payment-option">
                                    <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="payment-logo" />
                                    <div className="payment-info">
                                        <span className="payment-name">MoMo</span>
                                        <span className="payment-desc">Ví điện tử MoMo</span>
                                    </div>
                                </Radio.Button>

                                <Radio.Button value="vnpay" className="payment-option">
                                    <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" alt="VNPay" className="payment-logo" />
                                    <div className="payment-info">
                                        <span className="payment-name">VNPay</span>
                                        <span className="payment-desc">Thanh toán qua VNPay</span>
                                    </div>
                                </Radio.Button>

                                <Radio.Button value="zalopay" className="payment-option">
                                    <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" alt="ZaloPay" className="payment-logo" />
                                    <div className="payment-info">
                                        <span className="payment-name">ZaloPay</span>
                                        <span className="payment-desc">Ví điện tử ZaloPay</span>
                                    </div>
                                </Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="order-summary-section">
                        <div className="section-card">
                            <h2 className="section-title">Tóm tắt đơn hàng</h2>

                            <div className="movie-summary">
                                <div className="summary-details">
                                    <div className="info-item">
                                        <span className="info-label">Phim</span>
                                        <span className="info-value">{bookingData.movieTitle}</span>
                                    </div>

                                    <div className="info-item">
                                        <span className="info-label">Rạp</span>
                                        <span className="info-value">{bookingData.cinemaName}</span>
                                    </div>

                                    <div className="info-item">
                                        <span className="info-label">Suất chiếu</span>
                                        <span className="info-value">{bookingData.showTime} - {dayjs(bookingData.showDate).format('DD/MM/YYYY')}</span>
                                    </div>

                                    <div className="info-item">
                                        <span className="info-label">Ghế</span>
                                        <span className="info-value">
                                            {bookingData.selectedSeats.map(seat => seat.seatLabel || seat.name).join(', ')}
                                        </span>
                                    </div>

                                    <div className="price-breakdown">
                                        <div className="price-item">
                                            <span className="price-label">Giá vé ({bookingData.selectedSeats.length})</span>
                                            <span className="price-value">
                                                {bookingData.selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toLocaleString()}đ
                                            </span>
                                        </div>
                                        <div className="price-item">
                                            <span className="price-label">Phí tiện ích</span>
                                            <span className="price-value">0đ</span>
                                        </div>
                                    </div>

                                    <div className="total-section">
                                        <span className="total-label">Tổng cộng</span>
                                        <span className="total-value">{calculateTotal().toLocaleString()}đ</span>
                                    </div>
                                </div>
                            </div>

                            <div className="payment-actions">
                                <Button
                                    size="large"
                                    onClick={handleCancelBooking}
                                    className="back-btn"
                                    disabled={isProcessing || isCancelling}
                                    loading={isCancelling}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    loading={isProcessing}
                                    onClick={handlePayment}
                                    className="confirm-payment-btn"
                                    icon={<CreditCardOutlined />}
                                    disabled={isCancelling}
                                >
                                    {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPayment;
