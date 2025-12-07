import React, { useState, useEffect, useRef } from 'react';
import {
    Card,
    Row,
    Col,
    Space,
    Tag,
    Tooltip,
    Typography,
    Spin,
    Empty
} from 'antd';
import {
    BlockOutlined,
    ToolOutlined,
    StarOutlined,
    UserOutlined,
    HeartOutlined,
    ClockCircleOutlined,
    CloseOutlined
} from '@ant-design/icons';
import './SeatManager.css';
import showtimeService from '../../services/showtimeService';

const { Title, Text } = Typography;

const SeatViewer = ({ showtimeId, selectedScreen }) => {
    const [seatLayout, setSeatLayout] = useState({
        rows: [],
        totalSeats: 0,
        vipSeats: 0,
        bookedSeats: 0,
        availableSeats: 0
    });
    const [loading, setLoading] = useState(true);
    const seatLayoutRef = useRef(null);

    useEffect(() => {
        if (showtimeId) {
            loadShowtimeSeats(showtimeId);
        }
    }, [showtimeId]);

    // Handle scroll indicator
    useEffect(() => {
        const seatLayoutEl = seatLayoutRef.current;
        if (!seatLayoutEl) return;

        const handleScroll = () => {
            const { scrollTop } = seatLayoutEl;
            if (scrollTop > 10) {
                seatLayoutEl.classList.add('scrolled');
            } else {
                seatLayoutEl.classList.remove('scrolled');
            }
        };

        seatLayoutEl.addEventListener('scroll', handleScroll);
        return () => seatLayoutEl.removeEventListener('scroll', handleScroll);
    }, []);

    const loadShowtimeSeats = async (showtimeId) => {
        try {
            setLoading(true);
            const response = await showtimeService.getSeatsByShowtimeId(showtimeId);
            const showtimeSeats = response?.data || response || [];

            if (showtimeSeats.length === 0) {
                setSeatLayout({
                    rows: [],
                    totalSeats: 0,
                    vipSeats: 0,
                    bookedSeats: 0,
                    availableSeats: 0
                });
            } else {
                generateSeatLayoutFromShowtime(showtimeSeats);
            }
        } catch (error) {
            console.error('Error loading showtime seats:', error);
            setSeatLayout({
                rows: [],
                totalSeats: 0,
                vipSeats: 0,
                bookedSeats: 0,
                availableSeats: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const generateSeatLayoutFromShowtime = (showtimeSeats) => {
        const layoutSeats = showtimeSeats.map(showtimeSeat => {
            return {
                id: showtimeSeat.seatId,
                showtimeSeatId: showtimeSeat.id,
                row: showtimeSeat.rowLabel,
                number: parseInt(showtimeSeat.seatNumber),
                type: mapSeatTypeFromAPI(showtimeSeat.seatType),
                status: mapShowtimeSeatStatusFromAPI(showtimeSeat.status),
                rowLabel: showtimeSeat.rowLabel,
                seatNumber: showtimeSeat.seatNumber,
                col: showtimeSeat.col,
                rowIndex: showtimeSeat.row,
                isActive: showtimeSeat.isActive !== false,
                price: showtimeSeat.price
            };
        });

        // Nhóm ghế theo rowLabel
        const groupedByRow = layoutSeats.reduce((acc, seat) => {
            const rowKey = seat.rowLabel;
            if (!acc[rowKey]) {
                acc[rowKey] = [];
            }
            acc[rowKey].push(seat);
            return acc;
        }, {});

        // Tạo rows array
        const rows = Object.keys(groupedByRow)
            .sort((a, b) => a.localeCompare(b))
            .map(rowLabel => {
                const rowSeats = groupedByRow[rowLabel].sort((a, b) => a.col - b.col);
                return {
                    label: rowLabel,
                    seats: rowSeats
                };
            });

        // Tính toán thống kê
        const totalSeats = layoutSeats.length;
        const vipSeats = layoutSeats.filter(s => s.type === 'vip').length;
        const bookedSeats = layoutSeats.filter(s => s.status === 'booked').length;
        const availableSeats = layoutSeats.filter(s => s.status === 'available').length;

        setSeatLayout({
            rows: rows,
            totalSeats: totalSeats,
            vipSeats: vipSeats,
            bookedSeats: bookedSeats,
            availableSeats: availableSeats
        });
    };

    const mapSeatTypeFromAPI = (apiSeatType) => {
        const typeMap = {
            'NORMAL': 'normal',
            'VIP': 'vip',
            'COUPLE': 'couple'
        };
        return typeMap[apiSeatType] || 'normal';
    };

    const mapShowtimeSeatStatusFromAPI = (apiStatus) => {
        const statusMap = {
            'AVAILABLE': 'available',
            'RESERVED': 'held',
            'BOOKED': 'booked'
        };
        return statusMap[apiStatus] || 'available';
    };

    const getStatusText = (status) => {
        const statusTextMap = {
            'available': 'Còn trống',
            'held': 'Đang giữ',
            'booked': 'Đã đặt'
        };
        return statusTextMap[status] || 'Không xác định';
    };

    const getSeatColor = (seat) => {
        // Màu sắc dựa trên trạng thái đặt vé
        switch (seat.status) {
            case 'booked':
                return '#ff4d4f'; // Màu đỏ - Đã đặt
            case 'held':
                return '#faad14'; // Màu vàng cam - Đang giữ
            case 'available':
            default:
                // Khi available, màu sắc dựa vào loại ghế
                switch (seat.type) {
                    case 'vip':
                        return '#faad14'; // Màu vàng cho VIP
                    case 'couple':
                        return '#eb2f96'; // Màu hồng cho ghế đôi
                    case 'normal':
                    default:
                        return '#52c41a'; // Màu xanh cho ghế thường
                }
        }
    };

    const getSeatIcon = (seat) => {
        // Icon dựa trên trạng thái
        switch (seat.status) {
            case 'booked':
                return <UserOutlined />; // Đã đặt
            case 'held':
                return <ClockCircleOutlined />; // Đang giữ
            case 'available':
            default:
                // Khi available, icon dựa vào loại ghế
                switch (seat.type) {
                    case 'vip':
                        return <StarOutlined />;
                    case 'couple':
                        return <HeartOutlined />;
                    case 'normal':
                    default:
                        return <UserOutlined />;
                }
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                    <Text>Đang tải sơ đồ ghế...</Text>
                </div>
            </div>
        );
    }

    return (
        <div className="seat-manager-antd">
            {/* Screen */}
            <div className="screen-indicator">
                <div className="screen">MÀN HÌNH</div>
            </div>

            {/* Seat Layout */}
            <div className="seat-layout" ref={seatLayoutRef}>
                {seatLayout.rows.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '300px',
                        padding: '40px'
                    }}>
                        <Empty description="Chưa có dữ liệu ghế cho lịch chiếu này" />
                    </div>
                ) : (
                    <>
                        {seatLayout.rows.map((row) => {
                            const allCols = seatLayout.rows.flatMap(r => r.seats.map(s => s.col));
                            const maxColInRoom = allCols.length > 0 ? Math.max(...allCols) : 20;
                            const totalCols = maxColInRoom;

                            return (
                                <div key={row.label} className="seat-row">
                                    <div
                                        className="seats"
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${totalCols}, 36px)`,
                                            gap: '4px',
                                            position: 'relative'
                                        }}
                                    >
                                        {Array.from({ length: totalCols }, (_, index) => {
                                            const currentCol = index + 1;
                                            const gridPosition = index + 1;
                                            const seat = row.seats.find(s => s.col === currentCol);

                                            const prevCol = currentCol - 1;
                                            const prevSeat = row.seats.find(s => s.col === prevCol);
                                            const isOccupiedByCoupleSeat = prevSeat && prevSeat.type === 'couple';

                                            if (isOccupiedByCoupleSeat) {
                                                return null;
                                            }

                                            if (seat) {
                                                const isCoupleSeat = seat.type === 'couple';

                                                return (
                                                    <Tooltip
                                                        key={`seat-${seat.id}`}
                                                        title={
                                                            <div>
                                                                <div><strong>Ghế {seat.row}{seat.number}</strong></div>
                                                                <div>Loại: {seat.type === 'normal' ? 'Thường' : seat.type === 'vip' ? 'VIP' : 'Đôi'}</div>
                                                                <div>Trạng thái: {getStatusText(seat.status)}</div>
                                                                <div>Giá: {seat.price?.toLocaleString('vi-VN')} VNĐ</div>
                                                            </div>
                                                        }
                                                    >
                                                        <div
                                                            className={`seat ${seat.type === 'couple' ? 'seat-couple' : ''}`}
                                                            style={{
                                                                backgroundColor: getSeatColor(seat),
                                                                color: 'white',
                                                                gridColumn: isCoupleSeat
                                                                    ? `${gridPosition} / span 2`
                                                                    : gridPosition,
                                                                width: isCoupleSeat ? '72px' : '32px',
                                                                cursor: 'default'
                                                            }}
                                                        >
                                                            <div className="seat-content">
                                                                {getSeatIcon(seat)}
                                                                <span className="seat-number">{seat.row}{seat.number}</span>
                                                            </div>
                                                        </div>
                                                    </Tooltip>
                                                );
                                            } else {
                                                // Ô trống - không có ghế
                                                return (
                                                    <div
                                                        key={`empty-${row.label}-${currentCol}`}
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            gridColumn: gridPosition,
                                                            visibility: 'hidden'
                                                        }}
                                                    />
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>

            {/* Legend - Chú thích màu sắc */}
            <Card size="small" style={{ marginTop: '16px' }} title="Chú thích">
                <Space wrap size={[12, 6]} style={{ width: '100%' }}>
                    {/* Loại ghế */}
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#52c41a',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <UserOutlined style={{ fontSize: '9px' }} />
                        </div>
                        <Text style={{ fontSize: '11px' }}>Thường</Text>
                    </Space>
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#faad14',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <StarOutlined style={{ fontSize: '9px' }} />
                        </div>
                        <Text style={{ fontSize: '11px' }}>VIP</Text>
                    </Space>
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#eb2f96',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <HeartOutlined style={{ fontSize: '9px' }} />
                        </div>
                        <Text style={{ fontSize: '11px' }}>Đôi</Text>
                    </Space>

                    {/* Divider */}
                    <div style={{ width: '1px', height: '16px', backgroundColor: '#d9d9d9', margin: '0 4px' }} />

                    {/* Trạng thái đặt vé */}
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#52c41a',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <UserOutlined style={{ fontSize: '9px' }} />
                        </div>
                        <Text style={{ fontSize: '11px' }}>Còn trống</Text>
                    </Space>
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#faad14',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <ClockCircleOutlined style={{ fontSize: '9px' }} />
                        </div>
                        <Text style={{ fontSize: '11px' }}>Đang giữ</Text>
                    </Space>
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#ff4d4f',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <UserOutlined style={{ fontSize: '9px' }} />
                        </div>
                        <Text style={{ fontSize: '11px' }}>Đã đặt</Text>
                    </Space>
                </Space>
            </Card>

            {/* Statistics */}
            {/* <Row gutter={16} style={{ marginTop: '16px' }}>
                <Col span={6}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                {seatLayout.totalSeats}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Tổng số ghế</div>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                                {seatLayout.bookedSeats}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Đã đặt</div>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                {seatLayout.availableSeats}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Còn trống</div>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                                {seatLayout.totalSeats > 0
                                    ? Math.round((seatLayout.bookedSeats / seatLayout.totalSeats) * 100)
                                    : 0}%
                            </div>
                            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Tỷ lệ đặt</div>
                        </div>
                    </Card>
                </Col>
            </Row> */}
        </div>
    );
};

export default SeatViewer;
