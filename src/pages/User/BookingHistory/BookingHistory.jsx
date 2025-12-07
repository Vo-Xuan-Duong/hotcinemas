import React, { useState, useMemo } from 'react';
import {
    Table, Card, Button, Tag, Space, Modal, Descriptions, Row, Col,
    Tooltip, Input, Select, DatePicker, Empty, Statistic, Image,
    Typography, Divider, Rate, message
} from 'antd';
import {
    EyeOutlined, PrinterOutlined, DownloadOutlined, DeleteOutlined,
    CalendarOutlined, ClockCircleOutlined, SearchOutlined, StarFilled,
    UserOutlined, FileTextOutlined
} from '@ant-design/icons';
import moment from 'moment';
import useAuth from '../../../hooks/useAuth';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data
const mockBookings = [
  {
        id: 'BK001',
        movie: 'Spider-Man: No Way Home',
        moviePoster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        cinema: 'CGV Vincom Đồng Khởi',
        cinemaAddress: 'Tầng 3, Vincom Center, 72 Lê Thánh Tôn, Q.1',
        room: 'Phòng 2',
        seats: ['G7', 'G8'],
        showtime: '2024-12-01T14:30:00',
        bookingDate: '2024-11-28T10:15:00',
        quantity: 2,
        totalPrice: 200000,
        status: 'completed',
        paymentMethod: 'Thẻ tín dụng',
        hasReviewed: true,
        rating: 5
    },
    {
        id: 'BK002',
        movie: 'Dune: Part Two',
        moviePoster: 'https://image.tmdb.org/t/p/w500/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg',
        cinema: 'Lotte Cinema Landmark 81',
        cinemaAddress: 'Tầng 4-5, Vincom Landmark 81, Vinhomes Central Park',
        room: 'Phòng IMAX',
        seats: ['E5', 'E6'],
        showtime: '2024-12-15T19:00:00',
        bookingDate: '2024-12-10T16:30:00',
        quantity: 2,
        totalPrice: 300000,
        status: 'upcoming',
        paymentMethod: 'Ví điện tử',
        hasReviewed: false
    },
    {
        id: 'BK003',
        movie: 'Avatar: The Way of Water',
        moviePoster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        cinema: 'Galaxy Cinema Nguyễn Du',
        cinemaAddress: 'Số 116 Nguyễn Du, Q.1',
        room: 'Phòng 3D',
        seats: ['H10'],
        showtime: '2024-11-20T16:45:00',
        bookingDate: '2024-11-18T14:20:00',
        quantity: 1,
        totalPrice: 120000,
        status: 'cancelled',
        paymentMethod: 'Thẻ ATM',
        refundAmount: 100000,
        hasReviewed: false
    }
];

// TicketViewer Component
const TicketViewer = ({ ticket }) => {
    if (!ticket) return null;

    return (
        <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                borderBottom: '2px dashed rgba(255,255,255,0.3)',
                paddingBottom: '16px'
            }}>
                <h2 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '24px' }}>HOT CINEMAS</h2>
                <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>VÉ XEM PHIM ĐIỆN TỬ</p>
            </div>

            {/* Movie & Cinema Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <div style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '16px' }}>{ticket.movie}</strong>
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        📍 {ticket.cinema}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                        {ticket.cinemaAddress}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                        📅 {moment(ticket.showtime).format('DD/MM/YYYY')}
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                        🕐 {moment(ticket.showtime).format('HH:mm')}
                    </div>
                    <div style={{ fontSize: '14px' }}>
                        🎬 {ticket.room}
                    </div>
                </div>
            </div>

            {/* Seats & Price */}
            <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>GHẾ NGỒI</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            {ticket.seats.join(', ')}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>TỔNG TIỀN</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            {ticket.totalPrice.toLocaleString('vi-VN')} VNĐ
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px' }}>
                <div>
                    <div style={{ opacity: 0.8 }}>Mã vé: <strong>{ticket.id}</strong></div>
                    <div style={{ opacity: 0.8 }}>Số lượng: {ticket.quantity} vé</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ opacity: 0.8 }}>Ngày đặt: {moment(ticket.bookingDate).format('DD/MM/YYYY')}</div>
                    <div style={{ opacity: 0.8 }}>Thanh toán: {ticket.paymentMethod}</div>
                </div>
            </div>

            {/* QR Code Placeholder */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '60px',
                height: '60px',
                background: 'white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#333',
                textAlign: 'center'
            }}>
                QR
            </div>

            {/* Footer */}
            <div style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px dashed rgba(255,255,255,0.3)',
                textAlign: 'center',
                fontSize: '10px',
                opacity: 0.8
            }}>
                <p style={{ margin: '0 0 4px 0' }}>Vui lòng có mặt tại rạp trước 15 phút</p>
                <p style={{ margin: '0 0 4px 0' }}>Hotline: 1900-6017 | Website: hotcinemas.vn</p>
                <p style={{ margin: 0 }}>Xem vé lúc: {moment().format('DD/MM/YYYY HH:mm:ss')}</p>
            </div>
        </div>
    );
};

const BookingHistory = () => {
    const { isAuthenticated } = useAuth();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [ticketViewerVisible, setTicketViewerVisible] = useState(false);
    const [ticketToView, setTicketToView] = useState(null);

    // Filter bookings
    const filteredBookings = useMemo(() => {
        return mockBookings.filter(booking => {
            // Search filter
            if (searchText) {
                const searchLower = searchText.toLowerCase();
                if (!booking.movie.toLowerCase().includes(searchLower) &&
                    !booking.cinema.toLowerCase().includes(searchLower) &&
                    !booking.id.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }

            // Status filter
            if (statusFilter && booking.status !== statusFilter) {
                return false;
            }

            // Date filter
            if (dateRange && dateRange.length === 2) {
                const bookingDate = moment(booking.bookingDate);
                if (!bookingDate.isBetween(dateRange[0], dateRange[1], 'day', '[]')) {
                    return false;
                }
            }

            return true;
        });
    }, [searchText, statusFilter, dateRange]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'green';
            case 'upcoming': return 'blue';
            case 'cancelled': return 'red';
            case 'expired': return 'orange';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Đã hoàn thành';
            case 'upcoming': return 'Sắp chiếu';
            case 'cancelled': return 'Đã hủy';
            case 'expired': return 'Đã hết hạn';
            default: return 'Không xác định';
        }
    };

    const handleViewDetail = (record) => {
        setSelectedBooking(record);
        setDetailModalVisible(true);
    };

    const handleViewTicket = (record) => {
        setTicketToView(record);
        setTicketViewerVisible(true);
    };

    const handlePrintTicket = (booking) => {
        const printWindow = window.open('', '_blank');
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Vé xem phim - ${booking.id}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        background: #f5f5f5;
                    }
                    .ticket {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        max-width: 400px;
                        margin: 0 auto;
                        border-radius: 12px;
                        padding: 24px;
                        position: relative;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px dashed rgba(255,255,255,0.3);
                        padding-bottom: 16px;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        margin: 0 0 8px 0;
                        font-size: 24px;
                    }
                    .header p {
                        margin: 0;
                        font-size: 14px;
                        opacity: 0.9;
                    }
                    .content {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    .movie-info h2 {
                        margin: 0 0 8px 0;
                        font-size: 16px;
                    }
                    .cinema-info {
                        text-align: right;
                        font-size: 14px;
                    }
                    .details {
                        background: rgba(255,255,255,0.1);
                        border-radius: 8px;
                        padding: 16px;
                        margin-bottom: 16px;
                    }
                    .details-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                    }
                    .seats {
                        font-size: 18px;
                        font-weight: bold;
                    }
                    .price {
                        text-align: right;
                        font-size: 18px;
                        font-weight: bold;
                    }
                    .booking-details {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                        font-size: 12px;
                    }
                    .qr-code {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        width: 60px;
                        height: 60px;
                        background: white;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #333;
                        font-size: 10px;
                        text-align: center;
                    }
                    .footer {
                        margin-top: 20px;
                        padding-top: 16px;
                        border-top: 1px dashed rgba(255,255,255,0.3);
                        text-align: center;
                        font-size: 10px;
                        opacity: 0.8;
                    }
                    .footer p {
                        margin: 0 0 4px 0;
                    }
                    @media print {
                        body { 
                            background: white; 
                            padding: 0; 
                        }
                        .ticket {
                            box-shadow: none;
                            max-width: none;
                            width: 100%;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <div class="header">
                        <h1>HOT CINEMAS</h1>
                        <p>VÉ XEM PHIM ĐIỆN TỬ</p>
                    </div>
                    
                    <div class="content">
                        <div class="movie-info">
                            <h2>${booking.movie}</h2>
                            <div>📍 ${booking.cinema}</div>
                            <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">
                                ${booking.cinemaAddress}
                            </div>
                        </div>
                        <div class="cinema-info">
                            <div>📅 ${moment(booking.showtime).format('DD/MM/YYYY')}</div>
                            <div>🕐 ${moment(booking.showtime).format('HH:mm')}</div>
                            <div>🎬 ${booking.room}</div>
                        </div>
                    </div>
                    
                    <div class="details">
                        <div class="details-grid">
                            <div>
                                <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">GHẾ NGỒI</div>
                                <div class="seats">${booking.seats.join(', ')}</div>
                            </div>
                            <div class="price">
                                <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px; text-align: right;">TỔNG TIỀN</div>
                                <div>${booking.totalPrice.toLocaleString('vi-VN')} VNĐ</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="booking-details">
                        <div>
                            <div>Mã vé: <strong>${booking.id}</strong></div>
                            <div>Số lượng: ${booking.quantity} vé</div>
                        </div>
                        <div style="text-align: right;">
                            <div>Ngày đặt: ${moment(booking.bookingDate).format('DD/MM/YYYY')}</div>
                            <div>Thanh toán: ${booking.paymentMethod}</div>
                        </div>
                    </div>
                    
                    <div class="qr-code">QR</div>
                    
                    <div class="footer">
                        <p>Vui lòng có mặt tại rạp trước 15 phút</p>
                        <p>Hotline: 1900-6017 | Website: hotcinemas.vn</p>
                        <p>In vé lúc: ${moment().format('DD/MM/YYYY HH:mm:ss')}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    const handleDownloadTicket = (bookingId) => {
        message.success(`Đang tải vé ${bookingId}...`);
    };

    const handleCancelBooking = (bookingId) => {
        Modal.confirm({
            title: 'Xác nhận hủy vé',
            content: 'Bạn có chắc chắn muốn hủy vé này không? Hành động này không thể hoàn tác.',
            onOk: () => {
                message.success(`Đã hủy vé ${bookingId}`);
            }
        });
    };

    const columns = [
        {
            title: 'Mã vé',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Phim',
            dataIndex: 'movie',
            key: 'movie',
            width: 200,
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Image
                        src={record.moviePoster}
                        alt={text}
                        width={40}
                        height={60}
                        preview={false}
                        style={{ borderRadius: '4px' }}
                        fallback="https://via.placeholder.com/40x60?text=No+Image"
                    />
                    <div>
                        <Text strong>{text}</Text>
                        <br />
                        <Text type="secondary">{record.room}</Text>
                    </div>
                </div>
            )
        },
        {
            title: 'Rạp chiếu',
            dataIndex: 'cinema',
            key: 'cinema',
            width: 180,
            render: (text, record) => (
                <div>
                    <Text strong>{text}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.cinemaAddress}</Text>
                </div>
            )
        },
        {
            title: 'Ghế',
            dataIndex: 'seats',
            key: 'seats',
            width: 100,
            render: (seats) => (
                <Space wrap>
                    {seats.map(seat => (
                        <Tag key={seat} color="blue">{seat}</Tag>
                    ))}
                </Space>
            )
        },
        {
            title: 'Suất chiếu',
            dataIndex: 'showtime',
            key: 'showtime',
            width: 140,
            render: (text) => (
                <div>
                    <div>
                        <CalendarOutlined /> {moment(text).format('DD/MM/YYYY')}
                    </div>
                    <div>
                        <ClockCircleOutlined /> {moment(text).format('HH:mm')}
                    </div>
                </div>
            )
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 120,
            render: (price) => (
                <Text strong style={{ color: '#e50914' }}>
                    {new Intl.NumberFormat('vi-VN').format(price)}đ
                </Text>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 180,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(record)}
                            size="small"
                        />
                    </Tooltip>
                    {(record.status === 'completed' || record.status === 'upcoming') && (
                        <Tooltip title="Xem vé">
                            <Button
                                type="link"
                                icon={<FileTextOutlined />}
                                onClick={() => handleViewTicket(record)}
                                size="small"
                                style={{ color: '#1890ff' }}
                            />
                        </Tooltip>
                    )}
                    {(record.status === 'completed' || record.status === 'upcoming') && (
                        <Tooltip title="In vé">
                            <Button
                                type="link"
                                icon={<PrinterOutlined />}
                                onClick={() => handlePrintTicket(record)}
                                size="small"
                                style={{ color: '#52c41a' }}
                            />
                        </Tooltip>
                    )}
                    {record.status === 'completed' && (
                        <Tooltip title="Tải vé">
                            <Button
                                type="link"
                                icon={<DownloadOutlined />}
                                onClick={() => handleDownloadTicket(record.id)}
                                size="small"
                            />
                        </Tooltip>
                    )}
                    {record.status === 'upcoming' && (
                        <Tooltip title="Hủy vé">
                            <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleCancelBooking(record.id)}
                                size="small"
                            />
                        </Tooltip>
                    )}
                </Space>
            )
        }
    ];

    // Calculate statistics
    const totalBookings = mockBookings.length;
    const completedBookings = mockBookings.filter(b => b.status === 'completed').length;
    const upcomingBookings = mockBookings.filter(b => b.status === 'upcoming').length;
    const totalSpent = mockBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

    if (!isAuthenticated) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <Card>
                    <UserOutlined style={{ fontSize: '48px', color: '#e50914', marginBottom: '20px' }} />
                    <Title level={3}>Bạn chưa đăng nhập</Title>
                    <Paragraph>Vui lòng đăng nhập để xem lịch sử đặt vé</Paragraph>
                    <Button type="primary" size="large" href="/login-demo">
                        Đăng nhập
                    </Button>
                </Card>
            </div>
        );
    }

  return (
        <div style={{ padding: '20px', minHeight: '100vh', background: '#f0f2f5' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Page Header */}
                <div style={{ marginBottom: '24px' }}>
                    <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
                        📋 Lịch sử đặt vé
                    </Title>
                    <Paragraph style={{ color: '#666', fontSize: '16px' }}>
                        Quản lý và theo dõi tất cả các vé đã đặt của bạn
                    </Paragraph>
                </div>

                {/* Statistics */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Tổng số vé"
                                value={totalBookings}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<CalendarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Đã hoàn thành"
                                value={completedBookings}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<StarFilled />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Sắp chiếu"
                                value={upcomingBookings}
                                valueStyle={{ color: '#1890ff' }}
                                prefix={<ClockCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Tổng chi tiêu"
                                value={totalSpent}
                                formatter={value => `${new Intl.NumberFormat('vi-VN').format(value)}đ`}
                                valueStyle={{ color: '#faad14' }}
                                prefix={<StarFilled />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Filters */}
                <Card style={{ marginBottom: '24px' }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={8}>
                            <Input
                                prefix={<SearchOutlined />}
                                placeholder="Tìm kiếm theo tên phim, rạp, mã vé..."
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                allowClear
                                size="large"
                            />
                        </Col>
                        <Col xs={24} sm={6}>
                            <Select
                                placeholder="Trạng thái"
                                value={statusFilter}
                                onChange={setStatusFilter}
                                allowClear
                                size="large"
                                style={{ width: '100%' }}
                            >
                                <Option value="completed">Đã hoàn thành</Option>
                                <Option value="upcoming">Sắp chiếu</Option>
                                <Option value="cancelled">Đã hủy</Option>
                                <Option value="expired">Đã hết hạn</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={10}>
                            <RangePicker
                                placeholder={['Từ ngày', 'Đến ngày']}
                                value={dateRange}
                                onChange={setDateRange}
                                size="large"
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                            />
                        </Col>
                    </Row>
                </Card>

                {/* Booking Table */}
                <Card>
                    {filteredBookings.length === 0 ? (
                        <Empty
                            description="Không tìm thấy vé nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={filteredBookings}
                            rowKey="id"
                            pagination={{
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} của ${total} vé`,
                            }}
                            scroll={{ x: 1200 }}
                        />
                    )}
                </Card>

                {/* Detail Modal */}
                <Modal
                    title="Chi tiết đặt vé"
                    open={detailModalVisible}
                    onCancel={() => setDetailModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setDetailModalVisible(false)}>
                            Đóng
                        </Button>,
                        (selectedBooking?.status === 'completed' || selectedBooking?.status === 'upcoming') && (
                            <Button
                                key="view"
                                icon={<FileTextOutlined />}
                                onClick={() => handleViewTicket(selectedBooking)}
                                style={{ background: '#1890ff', borderColor: '#1890ff', color: 'white' }}
                            >
                                Xem vé
                            </Button>
                        ),
                        (selectedBooking?.status === 'completed' || selectedBooking?.status === 'upcoming') && (
                            <Button
                                key="print"
                                icon={<PrinterOutlined />}
                                onClick={() => handlePrintTicket(selectedBooking)}
                                style={{ background: '#52c41a', borderColor: '#52c41a', color: 'white' }}
                            >
                                In vé
                            </Button>
                        ),
                        selectedBooking?.status === 'completed' && (
                            <Button
                                key="download"
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={() => handleDownloadTicket(selectedBooking?.id)}
                            >
                                Tải vé
                            </Button>
                        ),
                        selectedBooking?.status === 'upcoming' && (
                            <Button
                                key="cancel"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    setDetailModalVisible(false);
                                    handleCancelBooking(selectedBooking?.id);
                                }}
                            >
                                Hủy vé
                            </Button>
                        )
                    ].filter(Boolean)}
                    width={700}
                >
                    {selectedBooking && (
                        <div>
                            <Row gutter={[24, 24]}>
                                <Col span={8}>
                                    <Image
                                        src={selectedBooking.moviePoster}
                                        alt={selectedBooking.movie}
                                        width="100%"
                                        style={{ borderRadius: '8px' }}
                                        fallback="https://via.placeholder.com/200x300?text=No+Image"
                                    />
                                </Col>
                                <Col span={16}>
                                    <Title level={4}>
                                        {selectedBooking.movie}
                                    </Title>
                                    <Tag color={getStatusColor(selectedBooking.status)}>
                                        {getStatusText(selectedBooking.status)}
                                    </Tag>
                                    <Divider />
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Mã vé">
                                            <Text strong>{selectedBooking.id}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Rạp chiếu">
                                            {selectedBooking.cinema}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Địa chỉ">
                                            {selectedBooking.cinemaAddress}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Phòng chiếu">
                                            {selectedBooking.room}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ghế ngồi">
                                            <Space>
                                                {selectedBooking.seats.map(seat => (
                                                    <Tag key={seat} color="blue">{seat}</Tag>
                                                ))}
                                            </Space>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Suất chiếu">
                                            {moment(selectedBooking.showtime).format('DD/MM/YYYY HH:mm')}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ngày đặt">
                                            {moment(selectedBooking.bookingDate).format('DD/MM/YYYY HH:mm')}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Phương thức thanh toán">
                                            {selectedBooking.paymentMethod}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Tổng tiền">
                                            <Text strong style={{ color: '#e50914' }}>
                                                {new Intl.NumberFormat('vi-VN').format(selectedBooking.totalPrice)}đ
                                            </Text>
                                        </Descriptions.Item>
                                        {selectedBooking.status === 'cancelled' && selectedBooking.refundAmount && (
                                            <Descriptions.Item label="Số tiền hoàn">
                                                <Text strong style={{ color: '#52c41a' }}>
                                                    {new Intl.NumberFormat('vi-VN').format(selectedBooking.refundAmount)}đ
                                                </Text>
                                            </Descriptions.Item>
                                        )}
                                        {selectedBooking.hasReviewed && (
                                            <Descriptions.Item label="Đánh giá của bạn">
                                                <Rate disabled defaultValue={selectedBooking.rating} />
                                            </Descriptions.Item>
                                        )}
                                    </Descriptions>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal>

                {/* Ticket Viewer Modal */}
                <Modal
                    title={<span><FileTextOutlined /> Xem vé</span>}
                    open={ticketViewerVisible}
                    onCancel={() => setTicketViewerVisible(false)}
                    width={600}
                    footer={[
                        <Button key="close" onClick={() => setTicketViewerVisible(false)}>
                            Đóng
                        </Button>,
                        <Button
                            key="print"
                            type="primary"
                            icon={<PrinterOutlined />}
                            onClick={() => {
                                handlePrintTicket(ticketToView);
                                setTicketViewerVisible(false);
                            }}
                        >
                            In vé
                        </Button>
                    ]}
                >
                    {ticketToView && <TicketViewer ticket={ticketToView} />}
                </Modal>
            </div>
    </div>
  );
};

export default BookingHistory;
