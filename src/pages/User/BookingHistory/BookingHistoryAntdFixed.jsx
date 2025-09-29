import React, { useState } from 'react';
import {
    Card,
    Table,
    Button,
    Tag,
    Space,
    Input,
    Select,
    DatePicker,
    Modal,
    Typography,
    Row,
    Col,
    Statistic,
    Image,
    Descriptions,
    Tooltip,
    Empty,
    Divider,
    Rate
} from 'antd';
import {
    SearchOutlined,
    EyeOutlined,
    DownloadOutlined,
    DeleteOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    StarFilled,
    UserOutlined
} from '@ant-design/icons';
import useAuth from '../../../context/useAuth';
import moment from 'moment';
import './BookingHistoryAntd.css';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data
const mockBookings = [
    {
        id: 'HTC001',
        movie: 'Avatar: The Way of Water',
        moviePoster: 'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        cinema: 'CGV Vincom Center',
        cinemaAddress: '191 Bà Triệu, Hai Bà Trưng, Hà Nội',
        room: 'Phòng 3',
        seats: ['G7', 'G8'],
        showtime: '2024-01-15 19:30',
        bookingDate: '2024-01-13 14:20',
        totalPrice: 180000,
        status: 'completed',
        paymentMethod: 'Thẻ tín dụng',
        hasReviewed: true,
        rating: 5
    },
    {
        id: 'HTC002',
        movie: 'Black Panther: Wakanda Forever',
        moviePoster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        cinema: 'Lotte Cinema Landmark',
        cinemaAddress: '5B Nguyễn Du, Hai Bà Trưng, Hà Nội',
        room: 'Phòng 5',
        seats: ['F5', 'F6'],
        showtime: '2024-01-20 20:15',
        bookingDate: '2024-01-18 09:45',
        totalPrice: 200000,
        status: 'upcoming',
        paymentMethod: 'ZaloPay'
    },
    {
        id: 'HTC003',
        movie: 'Top Gun: Maverick',
        moviePoster: 'https://images.unsplash.com/photo-1489599367367-7f72ca2d3085?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        cinema: 'BHD Star Vincom Times City',
        cinemaAddress: '458 Minh Khai, Hai Bà Trưng, Hà Nội',
        room: 'Phòng 1',
        seats: ['C3', 'C4', 'C5'],
        showtime: '2024-01-10 18:00',
        bookingDate: '2024-01-08 16:30',
        totalPrice: 270000,
        status: 'cancelled',
        paymentMethod: 'Momo',
        refundAmount: 243000
    }
];

const BookingHistoryAntd = () => {
    const { user, isAuthenticated } = useAuth();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            case 'upcoming': return 'processing';
            case 'expired': return 'default';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            case 'upcoming': return 'Sắp diễn ra';
            case 'expired': return 'Đã hết hạn';
            default: return status;
        }
    };

    const filteredBookings = mockBookings.filter(booking => {
        const matchText = booking.movie.toLowerCase().includes(searchText.toLowerCase()) ||
            booking.cinema.toLowerCase().includes(searchText.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchText.toLowerCase());

        const matchStatus = statusFilter ? booking.status === statusFilter : true;

        const matchDate = dateRange.length === 2 ?
            moment(booking.bookingDate).isBetween(dateRange[0], dateRange[1], 'day', '[]') : true;

        return matchText && matchStatus && matchDate;
    });

    const handleViewDetail = (booking) => {
        setSelectedBooking(booking);
        setDetailModalVisible(true);
    };

    const handleDownloadTicket = (bookingId) => {
        console.log('Downloading ticket for booking:', bookingId);
        // Mock download functionality
    };

    const handleCancelBooking = (bookingId) => {
        Modal.confirm({
            title: 'Xác nhận hủy vé',
            content: 'Bạn có chắc chắn muốn hủy vé này? Hành động này không thể hoàn tác.',
            okText: 'Hủy vé',
            cancelText: 'Không',
            okType: 'danger',
            onOk: () => {
                console.log('Cancelled booking:', bookingId);
                // Handle cancel booking logic
            },
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
            width: 120,
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
            </div>
        </div>
    );
};

export default BookingHistoryAntd;
