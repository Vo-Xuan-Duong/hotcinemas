import React, { useState, useMemo } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Tag,
    Space,
    Popconfirm,
    message,
    Row,
    Col,
    Card,
    Statistic,
    DatePicker,
    Descriptions,
    Badge,
    Tooltip
} from 'antd';
import {
    CalendarOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import bookingsData from '../../data/bookings.json';
import moviesData from '../../data/movies.json';
import cinemasData from '../../data/cinemas.json';
import usersData from '../../data/users.json';
import './BookingsAntd.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Bookings = () => {
    const [bookings, setBookings] = useState(bookingsData);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [movieFilter, setMovieFilter] = useState('all');
    const [cinemaFilter, setCinemaFilter] = useState('all');

    // Thống kê booking
    const bookingStats = useMemo(() => {
        const stats = {
            total: bookings.length,
            confirmed: bookings.filter(booking => booking.status === 'confirmed').length,
            pending: bookings.filter(booking => booking.status === 'pending').length,
            cancelled: bookings.filter(booking => booking.status === 'cancelled').length,
            expired: bookings.filter(booking => booking.status === 'expired').length,
            totalRevenue: bookings
                .filter(booking => booking.status === 'confirmed')
                .reduce((sum, booking) => sum + booking.totalPrice, 0),
            totalSeats: bookings
                .filter(booking => booking.status === 'confirmed')
                .reduce((sum, booking) => sum + booking.seats.length, 0)
        };
        return stats;
    }, [bookings]);

    // Lọc booking
    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const matchesSearch = booking.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
                booking.movieTitle?.toLowerCase().includes(searchText.toLowerCase()) ||
                booking.cinemaName?.toLowerCase().includes(searchText.toLowerCase()) ||
                booking.customerInfo?.email?.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
            const matchesMovie = movieFilter === 'all' || booking.movieId.toString() === movieFilter;
            const matchesCinema = cinemaFilter === 'all' || booking.cinemaId.toString() === cinemaFilter;
            return matchesSearch && matchesStatus && matchesMovie && matchesCinema;
        });
    }, [bookings, searchText, statusFilter, movieFilter, cinemaFilter]);

    // Xử lý cập nhật trạng thái booking
    const handleStatusChange = (bookingId, newStatus) => {
        const updatedBookings = bookings.map(booking =>
            booking.id === bookingId
                ? { ...booking, status: newStatus, paymentStatus: newStatus === 'confirmed' ? 'paid' : newStatus === 'cancelled' ? 'refunded' : booking.paymentStatus }
                : booking
        );

        setBookings(updatedBookings);
        message.success(`Đã ${newStatus === 'confirmed' ? 'xác nhận' : newStatus === 'cancelled' ? 'hủy' : 'cập nhật'} booking!`);
    };

    // Xử lý xóa booking
    const handleDeleteBooking = (bookingId) => {
        const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
        setBookings(updatedBookings);
        message.success('Xóa booking thành công!');
    };

    // Xử lý chỉnh sửa booking
    const handleEditBooking = (values) => {
        const updatedBookings = bookings.map(booking =>
            booking.id === selectedBooking.id
                ? { ...booking, ...values }
                : booking
        );

        setBookings(updatedBookings);
        setIsEditModalVisible(false);
        setSelectedBooking(null);
        form.resetFields();
        message.success('Cập nhật booking thành công!');
    };

    // Hiển thị modal
    const showDetailModal = (booking) => {
        setSelectedBooking(booking);
        setIsDetailModalVisible(true);
    };

    const showEditModal = (booking) => {
        setSelectedBooking(booking);
        setIsEditModalVisible(true);
        form.setFieldsValue({
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            paymentMethod: booking.paymentMethod
        });
    };

    // Render trạng thái booking
    const renderBookingStatus = (status) => {
        const statusConfig = {
            confirmed: { color: 'success', text: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
            pending: { color: 'warning', text: 'Chờ xử lý', icon: <ClockCircleOutlined /> },
            cancelled: { color: 'error', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
            expired: { color: 'default', text: 'Hết hạn', icon: <ExclamationCircleOutlined /> }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
    };

    // Render trạng thái thanh toán
    const renderPaymentStatus = (status) => {
        const statusConfig = {
            paid: { color: 'success', text: 'Đã thanh toán' },
            pending: { color: 'warning', text: 'Chờ thanh toán' },
            failed: { color: 'error', text: 'Thanh toán thất bại' },
            refunded: { color: 'default', text: 'Đã hoàn tiền' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    // Render phương thức thanh toán
    const renderPaymentMethod = (method) => {
        const methodConfig = {
            credit_card: 'Thẻ tín dụng',
            bank_transfer: 'Chuyển khoản',
            e_wallet: 'Ví điện tử',
            cash: 'Tiền mặt'
        };

        return methodConfig[method] || method;
    };

    // Cấu hình cột bảng
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                        <UserOutlined style={{ marginRight: 8 }} />
                        {record.userName}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{record.customerInfo.email}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{record.customerInfo.phone}</div>
                </div>
            ),
        },
        {
            title: 'Phim',
            key: 'movie',
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                        <VideoCameraOutlined style={{ marginRight: 8 }} />
                        {record.movieTitle}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{record.cinemaName}</div>
                </div>
            ),
        },
        {
            title: 'Suất chiếu',
            key: 'showtime',
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                        <CalendarOutlined style={{ marginRight: 8 }} />
                        {new Date(record.showtime).toLocaleDateString('vi-VN')}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                        {new Date(record.showtime).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                        {record.screening.room} - {record.screening.format}
                    </div>
                </div>
            ),
        },
        {
            title: 'Ghế',
            dataIndex: 'seats',
            key: 'seats',
            render: (seats) => (
                <div>
                    <Badge count={seats.length} style={{ backgroundColor: '#1890ff' }}>
                        <span>{seats.join(', ')}</span>
                    </Badge>
                </div>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (amount) => (
                <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
                    <DollarOutlined style={{ marginRight: 4 }} />
                    {amount?.toLocaleString('vi-VN')} ₫
                </div>
            ),
            sorter: (a, b) => a.totalPrice - b.totalPrice,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                <div>
                    {renderBookingStatus(record.status)}
                    <br />
                    <div style={{ marginTop: 4 }}>
                        {renderPaymentStatus(record.paymentStatus)}
                    </div>
                </div>
            ),
            filters: [
                { text: 'Đã xác nhận', value: 'confirmed' },
                { text: 'Chờ xử lý', value: 'pending' },
                { text: 'Đã hủy', value: 'cancelled' },
                { text: 'Hết hạn', value: 'expired' }
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space size="small" direction="vertical">
                    <Space size="small">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => showDetailModal(record)}
                            size="small"
                        >
                            Xem
                        </Button>
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => showEditModal(record)}
                            size="small"
                        >
                            Sửa
                        </Button>
                    </Space>
                    <Space size="small">
                        {record.status === 'pending' && (
                            <Popconfirm
                                title="Xác nhận booking này?"
                                onConfirm={() => handleStatusChange(record.id, 'confirmed')}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Button type="link" size="small" style={{ color: '#52c41a' }}>
                                    Xác nhận
                                </Button>
                            </Popconfirm>
                        )}
                        {(record.status === 'pending' || record.status === 'confirmed') && (
                            <Popconfirm
                                title="Hủy booking này?"
                                onConfirm={() => handleStatusChange(record.id, 'cancelled')}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Button type="link" danger size="small">
                                    Hủy
                                </Button>
                            </Popconfirm>
                        )}
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa booking này?"
                            onConfirm={() => handleDeleteBooking(record.id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            >
                                Xóa
                            </Button>
                        </Popconfirm>
                    </Space>
                </Space>
            ),
        },
    ];

    return (
        <div className="bookings-container">
            <div className="bookings-header">
                <h1>Quản lý đặt vé</h1>
            </div>

            {/* Thống kê tổng quan */}
            <Row gutter={[16, 16]} className="stats-row">
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng booking"
                            value={bookingStats.total}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Đã xác nhận"
                            value={bookingStats.confirmed}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu"
                            value={bookingStats.totalRevenue}
                            prefix={<DollarOutlined />}
                            suffix="₫"
                            formatter={(value) => value.toLocaleString('vi-VN')}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng ghế đã bán"
                            value={bookingStats.totalSeats}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Bộ lọc */}
            <Card className="filter-card">
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={6}>
                        <Input.Search
                            placeholder="Tìm kiếm theo tên, email, phim..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} md={6}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="confirmed">Đã xác nhận</Option>
                            <Option value="pending">Chờ xử lý</Option>
                            <Option value="cancelled">Đã hủy</Option>
                            <Option value="expired">Hết hạn</Option>
                        </Select>
                    </Col>
                    <Col xs={24} md={6}>
                        <Select
                            placeholder="Lọc theo phim"
                            value={movieFilter}
                            onChange={setMovieFilter}
                            style={{ width: '100%' }}
                        >
                            <Option value="all">Tất cả phim</Option>
                            {moviesData.map(movie => (
                                <Option key={movie.id} value={movie.id.toString()}>
                                    {movie.title}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} md={6}>
                        <Select
                            placeholder="Lọc theo rạp"
                            value={cinemaFilter}
                            onChange={setCinemaFilter}
                            style={{ width: '100%' }}
                        >
                            <Option value="all">Tất cả rạp</Option>
                            {cinemasData.map(cinema => (
                                <Option key={cinema.id} value={cinema.id.toString()}>
                                    {cinema.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Bảng booking */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredBookings}
                    rowKey="id"
                    pagination={{
                        total: filteredBookings.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} booking`,
                    }}
                    scroll={{ x: 1400 }}
                />
            </Card>

            {/* Modal chỉnh sửa booking */}
            <Modal
                title="Chỉnh sửa booking"
                open={isEditModalVisible}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setSelectedBooking(null);
                    form.resetFields();
                }}
                footer={null}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEditBooking}
                >
                    <Form.Item
                        name="status"
                        label="Trạng thái booking"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value="confirmed">Đã xác nhận</Option>
                            <Option value="pending">Chờ xử lý</Option>
                            <Option value="cancelled">Đã hủy</Option>
                            <Option value="expired">Hết hạn</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="paymentStatus"
                        label="Trạng thái thanh toán"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái thanh toán!' }]}
                    >
                        <Select placeholder="Chọn trạng thái thanh toán">
                            <Option value="paid">Đã thanh toán</Option>
                            <Option value="pending">Chờ thanh toán</Option>
                            <Option value="failed">Thanh toán thất bại</Option>
                            <Option value="refunded">Đã hoàn tiền</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="paymentMethod"
                        label="Phương thức thanh toán"
                        rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                    >
                        <Select placeholder="Chọn phương thức thanh toán">
                            <Option value="credit_card">Thẻ tín dụng</Option>
                            <Option value="bank_transfer">Chuyển khoản</Option>
                            <Option value="e_wallet">Ví điện tử</Option>
                            <Option value="cash">Tiền mặt</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                            <Button onClick={() => {
                                setIsEditModalVisible(false);
                                setSelectedBooking(null);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal chi tiết booking */}
            <Modal
                title="Chi tiết booking"
                open={isDetailModalVisible}
                onCancel={() => {
                    setIsDetailModalVisible(false);
                    setSelectedBooking(null);
                }}
                footer={[
                    <Button key="close" onClick={() => {
                        setIsDetailModalVisible(false);
                        setSelectedBooking(null);
                    }}>
                        Đóng
                    </Button>
                ]}
                width={800}
            >
                {selectedBooking && (
                    <div>
                        <Row gutter={[24, 16]}>
                            <Col span={12}>
                                <Card title="Thông tin khách hàng" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Tên">{selectedBooking.customerInfo.name}</Descriptions.Item>
                                        <Descriptions.Item label="Email">{selectedBooking.customerInfo.email}</Descriptions.Item>
                                        <Descriptions.Item label="Số điện thoại">{selectedBooking.customerInfo.phone}</Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Thông tin đặt vé" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Mã booking">#{selectedBooking.id}</Descriptions.Item>
                                        <Descriptions.Item label="Ngày đặt">
                                            {new Date(selectedBooking.bookingDate).toLocaleDateString('vi-VN')} {' '}
                                            {new Date(selectedBooking.bookingDate).toLocaleTimeString('vi-VN')}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Trạng thái">{renderBookingStatus(selectedBooking.status)}</Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[24, 16]} style={{ marginTop: 16 }}>
                            <Col span={12}>
                                <Card title="Thông tin phim" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Phim">{selectedBooking.movieTitle}</Descriptions.Item>
                                        <Descriptions.Item label="Rạp">{selectedBooking.cinemaName}</Descriptions.Item>
                                        <Descriptions.Item label="Phòng chiếu">{selectedBooking.screening.room}</Descriptions.Item>
                                        <Descriptions.Item label="Định dạng">{selectedBooking.screening.format}</Descriptions.Item>
                                        <Descriptions.Item label="Ngôn ngữ">{selectedBooking.screening.language}</Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Thông tin thanh toán" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Phương thức">{renderPaymentMethod(selectedBooking.paymentMethod)}</Descriptions.Item>
                                        <Descriptions.Item label="Trạng thái">{renderPaymentStatus(selectedBooking.paymentStatus)}</Descriptions.Item>
                                        <Descriptions.Item label="Tổng tiền">
                                            <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                                                {selectedBooking.totalPrice?.toLocaleString('vi-VN')} ₫
                                            </strong>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Chi tiết suất chiếu" size="small" style={{ marginTop: 16 }}>
                            <Descriptions column={2} size="small">
                                <Descriptions.Item label="Ngày chiếu">
                                    {new Date(selectedBooking.showtime).toLocaleDateString('vi-VN')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Giờ chiếu">
                                    {new Date(selectedBooking.showtime).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ghế đã chọn" span={2}>
                                    <Space wrap>
                                        {selectedBooking.seats.map(seat => (
                                            <Tag key={seat} color="blue">{seat}</Tag>
                                        ))}
                                    </Space>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Bookings;
