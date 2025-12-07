import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { message, Tag, Spin } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './BookingSeatSelection.css';
import showtimeService from '../../../services/showtimeService';
import bookingService from '../../../services/bookingService';
import useSeatWebSocket from '../../../hooks/useSeatWebSocket';
import useAuth from '../../../hooks/useAuth';
import AuthModal from '../../../components/Auth/AuthModal';

const BookingSeatSelection = () => {
    const { showtimeId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    // State từ navigation
    const [showtimeInfo, setShowtimeInfo] = useState(location.state || {});

    // State cho seats
    const [seatLayout, setSeatLayout] = useState({
        rows: [],
        totalSeats: 0,
        availableSeats: 0,
        bookedSeats: 0
    });
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreatingBooking, setIsCreatingBooking] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Update seat status helper (nhận updates từ WebSocket)
    const updateSeatStatus = useCallback((seatIds, status, userId = null) => {
        setSeatLayout(prevLayout => {
            const newRows = prevLayout.rows.map(row => ({
                ...row,
                seats: row.seats.map(seat => {
                    if (seatIds.includes(seat.id)) {
                        return {
                            ...seat,
                            status,
                            lockedByUserId: status === 'held' ? userId : null
                        };
                    }
                    return seat;
                })
            }));

            return {
                ...prevLayout,
                rows: newRows
            };
        });
    }, []);

    // Handle WebSocket seat updates (chỉ nhận real-time updates, KHÔNG load danh sách ghế)
    const handleSeatUpdate = useCallback((updateData) => {
        const { type, seatIds, userId } = updateData;
        const currentUserId = localStorage.getItem('userId');

        switch (type) {
            case 'locked':
            case 'reserved':
            case 'held':
                updateSeatStatus(seatIds, 'held', userId);

                // Nếu ghế được held bởi current user, thêm vào selectedSeats
                if (userId && currentUserId && userId.toString() === currentUserId.toString()) {
                    setSeatLayout(prevLayout => {
                        const mySeats = [];
                        prevLayout.rows.forEach(row => {
                            row.seats.forEach(seat => {
                                if (seatIds.includes(seat.id)) {
                                    mySeats.push({
                                        ...seat,
                                        status: 'held',
                                        lockedByUserId: userId
                                    });
                                }
                            });
                        });

                        if (mySeats.length > 0) {
                            setSelectedSeats(prev => {
                                const newSelected = [...prev];
                                mySeats.forEach(newSeat => {
                                    if (!newSelected.find(s => s.id === newSeat.id)) {
                                        newSelected.push(newSeat);
                                    }
                                });
                                return newSelected;
                            });
                        }

                        return prevLayout;
                    });
                }
                break;

            case 'unlocked':
            case 'released':
            case 'available':
                updateSeatStatus(seatIds, 'available');

                // Xóa khỏi selectedSeats nếu có
                setSelectedSeats(prev => prev.filter(s => !seatIds.includes(s.id)));
                break;

            case 'booked':
                updateSeatStatus(seatIds, 'booked');

                // Xóa khỏi selectedSeats nếu có
                setSelectedSeats(prev => prev.filter(s => !seatIds.includes(s.id)));
                break;

            case 'unavailable':
                updateSeatStatus(seatIds, 'unavailable');
                break;
            case 'maintenance':
                updateSeatStatus(seatIds, 'maintenance');
                break;
            case 'blocked':
                updateSeatStatus(seatIds, 'blocked');
                break;
            default:
                break;
        }
    }, [updateSeatStatus]);

    // Use Seat WebSocket hook (chỉ để nhận real-time updates)
    const { isConnected: wsConnected } = useSeatWebSocket(showtimeId, handleSeatUpdate);

    useEffect(() => {
        if (showtimeId) {
            loadShowtimeDetails();
        }
    }, [showtimeId]);

    const loadShowtimeDetails = async () => {
        try {
            setLoading(true);

            // Load thông tin suất chiếu và ghế
            const [showtimeData, seatsData] = await Promise.all([
                showtimeService.getShowtimeById(showtimeId),
                showtimeService.getSeatsByShowtimeId(showtimeId)
            ]);

            console.log('Showtime data:', showtimeData);
            console.log('Seats data:', seatsData);

            // Cập nhật thông tin suất chiếu - xử lý response structure
            if (showtimeData) {
                const showtime = showtimeData?.data || showtimeData;
                setShowtimeInfo(prev => ({
                    ...prev,
                    movieTitle: showtime.movieTitle || showtime.movie?.title || prev.movieTitle,
                    cinemaName: showtime.cinemaName || showtime.cinema?.name || prev.cinemaName,
                    roomName: showtime.roomName || showtime.room?.name || prev.roomName,
                    startTime: showtime.startTime || prev.startTime,
                    endTime: showtime.endTime || prev.endTime,
                    date: showtime.date || showtime.showtimeDate || prev.date,
                    price: showtime.price || prev.price,
                    formatType: showtime.formatType || prev.formatType,
                    roomId: showtime.roomId || showtime.room?.id || prev.roomId,
                    cinemaId: showtime.cinemaId || showtime.cinema?.id || prev.cinemaId,
                    movieId: showtime.movieId || showtime.movie?.id || prev.movieId
                }));
            }

            // Transform seats data thành layout
            if (seatsData) {
                transformSeatsToLayout(seatsData);
            }

        } catch (error) {
            console.error('Error loading showtime details:', error);
            message.error('Không thể tải thông tin suất chiếu');
        } finally {
            setLoading(false);
        }
    };

    const transformSeatsToLayout = (seatsData) => {
        // Group seats by row
        const seatsArray = Array.isArray(seatsData) ? seatsData :
            (seatsData?.data ? seatsData.data : []);

        if (seatsArray.length === 0) {
            // Generate mock data for demo
            generateMockSeats();
            return;
        }

        console.log('🔍 Raw seats data:', seatsArray);
        console.log('🔍 Total seats from API:', seatsArray.length);

        const rowsMap = {};
        let totalSeats = 0;
        let availableSeats = 0;
        let bookedSeats = 0;
        const mySelectedSeats = []; // Danh sách ghế mình đã lock

        // Get current user ID để kiểm tra ghế nào là của mình
        const currentUserId = localStorage.getItem('user_id');
        console.log('🔍 Current userId:', currentUserId);

        // Deduplicate seats by ID first
        const uniqueSeatsMap = new Map();
        seatsArray.forEach(seat => {
            if (!uniqueSeatsMap.has(seat.id)) {
                uniqueSeatsMap.set(seat.id, seat);
            } else {
                console.warn('⚠️ Duplicate seat ID found:', seat.id, seat);
            }
        });

        console.log('🔍 Unique seats after dedup:', uniqueSeatsMap.size);

        uniqueSeatsMap.forEach(seat => {
            // Convert row number to letter (1->A, 2->B, etc.)
            const rowLabel = seat.row ? String.fromCharCode(64 + seat.row) : 'A';

            if (!rowsMap[rowLabel]) {
                rowsMap[rowLabel] = {
                    label: rowLabel,
                    rowNumber: seat.row,
                    seats: [],
                    seenCols: new Set() // Track which cols are already added
                };
            }

            const seatStatus = seat.status?.toLowerCase() || 'available';

            // Check if this col already exists in this row
            if (rowsMap[rowLabel].seenCols.has(seat.col)) {
                console.warn(`⚠️ Duplicate col ${seat.col} in row ${rowLabel}, skipping:`, seat);
                return; // Skip this duplicate
            }

            // Mark this col as seen
            rowsMap[rowLabel].seenCols.add(seat.col);

            totalSeats++;

            if (seatStatus === 'booked') {
                bookedSeats++;
            } else if (seatStatus === 'available') {
                availableSeats++;
            }

            // Map backend response to frontend structure
            const seatObj = {
                id: seat.id,
                name: seat.name || `${rowLabel}${seat.col}`,
                seatType: seat.seatType?.toLowerCase() || 'normal',
                status: seatStatus,
                price: seat.price || 0,
                rowLabel: rowLabel,
                row: seat.row,
                col: seat.col,
                lockedByUserId: seat.lockedByUserId || null
            };

            rowsMap[rowLabel].seats.push(seatObj);

            // Kiểm tra nếu ghế này đang held bởi current user thì thêm vào selectedSeats
            if (seatStatus === 'held' && seat.lockedByUserId && currentUserId) {
                if (seat.lockedByUserId.toString() === currentUserId.toString()) {
                    console.log('✅ Found my held seat:', seat.name || seat.id);
                    mySelectedSeats.push(seatObj);
                }
            }
        });

        // Sort rows by row number, then sort seats by col number
        const rows = Object.values(rowsMap).sort((a, b) => {
            const rowA = a.rowNumber || 0;
            const rowB = b.rowNumber || 0;
            return rowA - rowB;
        }).map(row => {
            // Remove seenCols from final output
            const { seenCols, ...rowData } = row;
            return rowData;
        });

        rows.forEach(row => {
            // Sort seats by col number (which represents actual seat position)
            row.seats.sort((a, b) => a.col - b.col);
            console.log(`🔍 Row ${row.label}: ${row.seats.length} seats`, row.seats.map(s => `${s.name}(col:${s.col})`));
        });

        console.log('🔍 Final layout:', { rows: rows.length, totalSeats, availableSeats, bookedSeats });
        console.log('✅ My selected seats from backend:', mySelectedSeats.length, mySelectedSeats.map(s => s.name));

        setSeatLayout({
            rows,
            totalSeats,
            availableSeats,
            bookedSeats
        });

        // Cập nhật selectedSeats với các ghế mình đã lock từ backend
        if (mySelectedSeats.length > 0) {
            setSelectedSeats(mySelectedSeats);
            // Thông báo cho user biết đã restore ghế
            setTimeout(() => {
                message.info(`Đã khôi phục ${mySelectedSeats.length} ghế bạn đã chọn trước đó`);
            }, 500);
        }
    };

    const generateMockSeats = () => {
        // Tạo mock data giống hình ảnh
        const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
        const rows = [];
        let totalSeats = 0;
        let availableSeats = 0;
        let bookedSeats = 0;

        rowLabels.forEach((label, rowIndex) => {
            const seats = [];
            const seatsPerRow = rowIndex < 2 ? 4 : 10; // Hàng A, B có 4 ghế, các hàng khác 10 ghế

            for (let i = 1; i <= seatsPerRow; i++) {
                const seatId = `${label}${i}`;
                let status = 'available';
                let seatType = 'normal';

                // Ghế đã bán (màu xám) - theo hình
                if (['C4', 'C5', 'C6', 'C7'].includes(seatId)) {
                    status = 'booked';
                }

                // Ghế VIP (màu vàng) - hàng D, E
                if (['D', 'E'].includes(label)) {
                    seatType = 'vip';
                }

                // Ghế đã chọn trong demo (màu đỏ) - C4, C6, C7
                const isSelectedInDemo = ['C4', 'C6', 'C7'].includes(seatId);

                totalSeats++;
                if (status === 'booked') {
                    bookedSeats++;
                } else {
                    availableSeats++;
                }

                seats.push({
                    id: seatId,
                    col: i,
                    name: seatId,
                    seatType: seatType,
                    status: status,
                    price: seatType === 'vip' ? 135000 : seatType === 'couple' ? 190000 : 95000,
                    rowLabel: label,
                    row: rowIndex + 1,
                    lockedByUserId: null
                });
            }

            rows.push({
                label,
                seats
            });
        });

        setSeatLayout({
            rows,
            totalSeats,
            availableSeats,
            bookedSeats
        });
    };

    const handleSeatClick = async (seat) => {
        // Check for non-selectable statuses
        if (seat.status === 'booked') {
            message.warning('Ghế này đã được đặt');
            return;
        }

        if (seat.status === 'unavailable') {
            message.warning('Ghế này không khả dụng');
            return;
        }

        if (seat.status === 'maintenance') {
            message.warning('Ghế này đang bảo trì');
            return;
        }

        if (seat.status === 'blocked') {
            message.warning('Ghế này đã bị khóa');
            return;
        }

        // Get current user ID from localStorage or auth context
        const currentUserId = localStorage.getItem('user_id');

        // Check if seat is held by another user
        if (seat.status === 'held' && seat.lockedByUserId) {
            if (seat.lockedByUserId.toString() !== currentUserId) {
                message.warning('Ghế này đang được giữ bởi người dùng khác');
                return;
            }
        }

        const seatId = seat.id;
        const isSelected = selectedSeats.find(s => s.id === seatId);

        try {
            if (isSelected) {
                // Bỏ chọn - gọi API unlock
                await showtimeService.unlockSeats(showtimeId, seatId);

                // Cập nhật local state sau khi unlock thành công
                const newSelectedSeats = selectedSeats.filter(s => s.id !== seatId);
                setSelectedSeats(newSelectedSeats);

                // Backend sẽ gửi status update qua WebSocket
            } else {
                // Chọn (giới hạn 10 ghế)
                if (selectedSeats.length >= 10) {
                    message.warning('Chỉ được chọn tối đa 10 ghế');
                    return;
                }

                // Gọi API lock

                const currentUserId = localStorage.getItem('user_id');
                await showtimeService.lockSeats(showtimeId, seatId, currentUserId || '0');

                // Cập nhật local state sau khi lock thành công
                const newSelectedSeats = [...selectedSeats, {
                    ...seat,
                    status: 'held',
                    lockedByUserId: currentUserId
                }];
                setSelectedSeats(newSelectedSeats);

                // Backend sẽ gửi status update qua WebSocket
            }
        } catch (error) {
            console.error('Error locking/unlocking seat:', error);

            if (error.response?.status === 409) {
                message.error('Ghế đã được người khác chọn');
            } else if (error.response?.status === 400) {
                message.error('Không thể chọn ghế này');
            } else {
                message.error('Có lỗi xảy ra. Vui lòng thử lại');
            }
        }
    };

    const calculateTotal = () => {
        return selectedSeats.reduce((total, seat) => total + seat.price, 0);
    };

    // Hàm kiểm tra đăng nhập
    const checkLoginStatus = () => {
        // Check both context user and localStorage to ensure user is really logged out
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('access_token');

        if (!user && (!userId || !token)) {
            message.warning('Vui lòng đăng nhập để đặt vé');
            setShowAuthModal(true);
            return false;
        }
        return true;
    };

    const handleContinue = async () => {
        if (selectedSeats.length === 0) {
            message.warning('Vui lòng chọn ít nhất một ghế');
            return;
        }

        // Kiểm tra đăng nhập trước khi tiếp tục
        if (!checkLoginStatus()) {
            return;
        }

        try {
            setIsCreatingBooking(true);

            // Chuẩn bị dữ liệu booking theo cấu trúc BookingRequest của backend
            const bookingPayload = {
                showtimeId: parseInt(showtimeId),
                seatIds: selectedSeats.map(seat => seat.id),
                voucherCode: null // Có thể thêm voucher sau
            };

            console.log('Creating booking with payload:', bookingPayload);

            // Gọi API tạo booking
            const bookingResponse = await bookingService.createBooking(bookingPayload);

            console.log('Booking created successfully:', bookingResponse);

            message.success('Đã tạo đơn đặt vé thành công!');

            // Lấy booking data từ response
            const bookingData = bookingResponse?.data || bookingResponse;

            // Navigate to payment page với booking data
            navigate('/booking/payment', {
                state: {
                    bookingId: bookingData.id || bookingData.bookingId,
                    bookingCode: bookingData.bookingCode,
                    showtimeId,
                    movieTitle: showtimeInfo.movieTitle,
                    moviePoster: showtimeInfo.moviePoster,
                    cinemaName: showtimeInfo.cinemaName,
                    cinemaAddress: showtimeInfo.cinemaAddress || '',
                    roomName: showtimeInfo.roomName,
                    showTime: `${showtimeInfo.startTime} ~ ${showtimeInfo.endTime}`,
                    showDate: showtimeInfo.date || showtimeInfo.startTime,
                    formatType: showtimeInfo.formatType,
                    selectedSeats: selectedSeats,
                    totalAmount: calculateTotal()
                }
            });

        } catch (error) {
            console.error('Error creating booking:', error);

            // Xử lý các lỗi cụ thể
            if (error.response?.status === 409) {
                message.error('Một số ghế đã được người khác đặt. Vui lòng chọn lại.');
                // Reload seat layout
                loadShowtimeDetails();
            } else if (error.response?.status === 400) {
                message.error(error.response?.data?.message || 'Dữ liệu không hợp lệ');
            } else if (error.response?.status === 401) {
                message.error('Vui lòng đăng nhập để đặt vé');
                navigate('/login', {
                    state: {
                        from: location.pathname,
                        returnData: {
                            showtimeId,
                            selectedSeats: selectedSeats.map(s => s.id)
                        }
                    }
                });
            } else {
                message.error('Có lỗi xảy ra khi tạo đơn đặt vé. Vui lòng thử lại.');
            }
        } finally {
            setIsCreatingBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="booking-seat-page">
                <div className="booking-loading">
                    <Spin size="large" />
                    <p>Đang tải sơ đồ ghế...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-seat-page">
            <div className="booking-seat-container">
                {/* WebSocket Status Indicator */}
                {wsConnected && (
                    <div className="ws-status-indicator">
                        <div className="ws-dot"></div>
                        <span>Đang kết nối real-time</span>
                    </div>
                )}

                {/* Header - Movie Info */}
                <div className="booking-header">
                    <div className="movie-info-header">
                        <h1 className="booking-title">Chọn Ghế Ngồi</h1>
                        <div className="showtime-details">
                            <div className="detail-item">
                                <span className="detail-label">Phim:</span>
                                <span className="detail-value">{showtimeInfo.movieTitle || 'The Avengers'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Rạp:</span>
                                <span className="detail-value">{showtimeInfo.cinemaName || 'Galaxy Nguyễn Du'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Phòng chiếu:</span>
                                <span className="detail-value">{showtimeInfo.roomName || 'Phòng chiếu 2'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Suất chiếu:</span>
                                <span className="detail-value">
                                    {showtimeInfo.startTime || '18:30'} - {showtimeInfo.date || dayjs().format('DD/MM/YYYY')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="booking-content">
                    {/* Left Side - Seat Layout */}
                    <div className="seat-selection-area">
                        {/* Screen */}
                        <div className="screen-display">
                            <div className="screen-label">MÀN HÌNH</div>
                        </div>

                        {/* Seat Grid */}
                        <div className="seat-grid-container">
                            {seatLayout.rows.map((row, rowIndex) => (
                                console.log(`Rendering row ${row.label} with seats:`, row.seats),
                                <div key={row.label} className="seat-row">
                                    <div className="row-label">{row.label}</div>
                                    <div className="row-seats">
                                        {row.seats.map((seat) => {
                                            const isSelected = selectedSeats.find(s => s.id === seat.id);
                                            // Các status không thể chọn
                                            const isDisabled = ['booked', 'unavailable', 'maintenance', 'blocked'].includes(seat.status);

                                            // Check if this seat is held by current user
                                            const currentUserId = localStorage.getItem('userId');
                                            const isMyHeld = seat.status === 'held' &&
                                                seat.lockedByUserId &&
                                                seat.lockedByUserId.toString() === currentUserId;
                                            const isOthersHeld = seat.status === 'held' && !isMyHeld;

                                            // Xác định class hiển thị - CHỈ áp dụng class phù hợp
                                            let seatClasses = ['seat-item', `seat-${seat.seatType}`];
                                            let displayStatus = '';
                                            let canClick = true;

                                            if (isSelected || isMyHeld) {
                                                // Ghế mình đang chọn - màu đỏ, có thể unlock
                                                seatClasses.push('seat-my-selection');
                                                displayStatus = 'Đang chọn (click để bỏ chọn)';
                                                canClick = true;
                                            } else if (isOthersHeld) {
                                                // Ghế người khác đang held - màu vàng, không thể chọn
                                                seatClasses.push('seat-held', 'seat-held-others');
                                                displayStatus = 'Người khác giữ';
                                                canClick = false;
                                            } else if (isDisabled) {
                                                // Ghế đã bán hoặc không khả dụng
                                                seatClasses.push(`seat-${seat.status}`, 'seat-disabled');
                                                displayStatus = seat.status === 'booked' ? 'Đã bán' : 'Không khả dụng';
                                                canClick = false;
                                            } else {
                                                // Ghế trống
                                                seatClasses.push('seat-available');
                                                displayStatus = 'Có thể chọn';
                                                canClick = true;
                                            }

                                            return (
                                                <button
                                                    key={seat.id}
                                                    className={seatClasses.join(' ')}
                                                    onClick={() => handleSeatClick(seat)}
                                                    disabled={!canClick}
                                                    title={`${seat.price.toLocaleString()}đ - ${displayStatus}`}
                                                >
                                                    <span className="seat-number">{seat.col}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="row-label">{row.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="seat-legend">
                            <div className="legend-item">
                                <div className="legend-icon seat-normal seat-available"></div>
                                <span>Ghế trống</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-icon seat-selected-demo"></div>
                                <span>Đang chọn</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-icon seat-booked-demo"></div>
                                <span>Đã bán</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-icon seat-held-demo"></div>
                                <span>Đang giữ</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-icon seat-vip seat-available"></div>
                                <span>Ghế VIP</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-icon seat-couple seat-available"></div>
                                <span>Ghế đôi</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Summary */}
                    <div className="booking-summary-panel">
                        <div className="summary-card">
                            <h3 className="summary-title">Tóm tắt đặt vé</h3>

                            <div className="summary-section">
                                <div className="summary-row">
                                    <span className="summary-label">Phim:</span>
                                    <span className="summary-value">{showtimeInfo.movieTitle || 'The Avengers'}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Rạp:</span>
                                    <span className="summary-value">{showtimeInfo.cinemaName || 'Galaxy Nguyễn Du'}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Suất chiếu:</span>
                                    <span className="summary-value">
                                        {showtimeInfo.startTime || '18:30'} - {showtimeInfo.date || dayjs().format('DD/MM')}
                                    </span>
                                </div>
                            </div>

                            <div className="summary-section">
                                <div className="summary-row highlight">
                                    <span className="summary-label">Ghế đã chọn ({selectedSeats.length}):</span>
                                    <span className="summary-value seats-list">
                                        {selectedSeats.length > 0
                                            ? selectedSeats.map(s => s.name).join(', ')
                                            : 'Chưa chọn ghế'
                                        }
                                    </span>
                                </div>
                                {selectedSeats.length > 0 && (
                                    <div className="selected-seats-detail">
                                        {selectedSeats.map(seat => (
                                            <div key={seat.id} className="seat-detail-item">
                                                <span className="seat-id">{seat.name}</span>
                                                <span className="seat-type-label">
                                                    {seat.seatType === 'vip' ? 'VIP' : seat.seatType === 'couple' ? 'Đôi' : 'Thường'}
                                                </span>
                                                <span className="seat-price">{seat.price.toLocaleString()}đ</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedSeats.length > 0 && (
                                <div className="summary-section">
                                    {['normal', 'vip', 'couple'].map(seatType => {
                                        const seatsOfType = selectedSeats.filter(s => s.seatType === seatType);
                                        if (seatsOfType.length === 0) return null;

                                        const typeName = seatType === 'vip' ? 'VIP' : seatType === 'couple' ? 'Đôi' : 'Thường';
                                        const avgPrice = seatsOfType.reduce((sum, s) => sum + s.price, 0) / seatsOfType.length;

                                        return (
                                            <div key={seatType} className="summary-row">
                                                <span className="summary-label">Giá vé {typeName}:</span>
                                                <span className="summary-value">
                                                    {seatsOfType.length} x {avgPrice.toLocaleString()}đ
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="summary-total">
                                <span className="total-label">Tổng cộng</span>
                                <span className="total-value">{calculateTotal().toLocaleString()}đ</span>
                            </div>

                            <button
                                className="continue-btn"
                                onClick={handleContinue}
                                disabled={selectedSeats.length === 0 || isCreatingBooking}
                            >
                                {isCreatingBooking ? 'Đang xử lý...' : 'Đặt vé'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialMode="login"
            />
        </div>
    );
};

export default BookingSeatSelection;
