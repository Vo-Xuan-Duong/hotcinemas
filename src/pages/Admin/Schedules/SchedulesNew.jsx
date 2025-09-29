import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Table,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    TimePicker,
    InputNumber,
    Space,
    Tag,
    Typography,
    message,
    Popconfirm,
    Row,
    Col,
    Statistic,
    Badge,
    Switch,
    Tooltip,
    Alert
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    VideoCameraOutlined,
    ShopOutlined,
    EyeOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    DollarCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './Schedules.css';
import schedulesData from '../../../data/showtimes.json';
import moviesData from '../../../data/movies.json';
import cinemasData from '../../../data/cinemas.json';

const { Title, Text } = Typography;
const { Option } = Select;

const Schedules = () => {
    const [form] = Form.useForm();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [movieFilter, setMovieFilter] = useState('all');
    const [cinemaFilter, setCinemaFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        try {
            setLoading(true);
            // Thêm trạng thái cho dữ liệu mẫu
            const schedulesWithStatus = schedulesData.map(schedule => ({
                ...schedule,
                status: schedule.status || 'active',
                seatsBooked: schedule.seatsBooked || Math.floor(Math.random() * 50),
                totalSeats: schedule.totalSeats || 100
            }));
            setSchedules(schedulesWithStatus);
        } catch (error) {
            console.error('Error loading schedules:', error);
            message.error('Lỗi khi tải lịch chiếu');
        } finally {
            setLoading(false);
        }
    };

    const getMovieTitle = (movieId) => {
        const movie = moviesData.find(m => m.id === movieId);
        return movie ? movie.title : 'N/A';
    };

    const getCinemaName = (cinemaId) => {
        const cinema = cinemasData.find(c => c.id === cinemaId);
        return cinema ? cinema.name : 'N/A';
    };

    const handleAddSchedule = () => {
        form.resetFields();
        setShowAddModal(true);
    };

    const handleEditSchedule = (schedule) => {
        setSelectedSchedule(schedule);
        form.setFieldsValue({
            movieId: schedule.movieId,
            cinemaId: schedule.cinemaId,
            screenName: schedule.screenName,
            date: dayjs(schedule.date),
            time: dayjs(schedule.time, 'HH:mm'),
            price: schedule.price,
            format: schedule.format,
            language: schedule.language,
            type: schedule.type,
            status: schedule.status
        });
        setShowEditModal(true);
    };

    const handleViewSchedule = (schedule) => {
        setSelectedSchedule(schedule);
        setShowDetailModal(true);
    };

    const handleDeleteSchedule = async (scheduleId) => {
        try {
            setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
            message.success('Xóa lịch chiếu thành công!');
        } catch (error) {
            console.error('Error deleting schedule:', error);
            message.error('Lỗi khi xóa lịch chiếu');
        }
    };

    const handleStatusChange = (scheduleId, newStatus) => {
        setSchedules(schedules.map(schedule =>
            schedule.id === scheduleId ? { ...schedule, status: newStatus } : schedule
        ));
        message.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'tạm dừng'} lịch chiếu!`);
    };

    const handleSubmit = async (values) => {
        try {
            const scheduleData = {
                ...values,
                date: values.date.format('YYYY-MM-DD'),
                time: values.time.format('HH:mm'),
                id: showEditModal ? selectedSchedule.id : Date.now(),
                status: values.status || 'active',
                seatsBooked: showEditModal ? selectedSchedule.seatsBooked : 0,
                totalSeats: 100
            };

            if (showEditModal) {
                setSchedules(schedules.map(schedule =>
                    schedule.id === selectedSchedule.id ? scheduleData : schedule
                ));
                message.success('Cập nhật lịch chiếu thành công!');
                setShowEditModal(false);
            } else {
                setSchedules([...schedules, scheduleData]);
                message.success('Thêm lịch chiếu thành công!');
                setShowAddModal(false);
            }

            form.resetFields();
            setSelectedSchedule(null);
        } catch (error) {
            console.error('Error saving schedule:', error);
            message.error('Lỗi khi lưu lịch chiếu');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'inactive': return 'default';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Đang chiếu';
            case 'inactive': return 'Tạm dừng';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const getBookingRate = (seatsBooked, totalSeats) => {
        return Math.round((seatsBooked / totalSeats) * 100);
    };

    const getBookingRateColor = (rate) => {
        if (rate >= 80) return 'red';
        if (rate >= 60) return 'orange';
        if (rate >= 40) return 'blue';
        return 'green';
    };

    // Tính toán thống kê
    const stats = {
        totalSchedules: schedules.length,
        activeSchedules: schedules.filter(s => s.status === 'active').length,
        totalRevenue: schedules.reduce((sum, s) => sum + (s.price * s.seatsBooked), 0),
        avgBookingRate: schedules.length > 0 ? 
            schedules.reduce((sum, s) => sum + getBookingRate(s.seatsBooked, s.totalSeats), 0) / schedules.length : 0
    };

    const filteredSchedules = schedules.filter(schedule => {
        const movieTitle = getMovieTitle(schedule.movieId).toLowerCase();
        const cinemaName = getCinemaName(schedule.cinemaId).toLowerCase();
        const searchMatch = movieTitle.includes(searchText.toLowerCase()) ||
            cinemaName.includes(searchText.toLowerCase()) ||
            schedule.screenName.toLowerCase().includes(searchText.toLowerCase());

        const movieMatch = movieFilter === 'all' || schedule.movieId === parseInt(movieFilter);
        const cinemaMatch = cinemaFilter === 'all' || schedule.cinemaId === parseInt(cinemaFilter);
        const statusMatch = statusFilter === 'all' || schedule.status === statusFilter;

        return searchMatch && movieMatch && cinemaMatch && statusMatch;
    });

    const columns = [
        {
            title: 'Phim',
            key: 'movie',
            render: (_, record) => (
                <Space direction="vertical" size={4}>
                    <Text strong>{getMovieTitle(record.movieId)}</Text>
                    <Tag color="blue">{record.format}</Tag>
                </Space>
            ),
        },
        {
            title: 'Rạp chiếu',
            key: 'cinema',
            render: (_, record) => (
                <Space direction="vertical" size={4}>
                    <Text>{getCinemaName(record.cinemaId)}</Text>
                    <Text type="secondary">{record.screenName}</Text>
                </Space>
            ),
        },
        {
            title: 'Ngày & Giờ',
            key: 'datetime',
            render: (_, record) => (
                <Space direction="vertical" size={4}>
                    <Space>
                        <CalendarOutlined />
                        <Text>{dayjs(record.date).format('DD/MM/YYYY')}</Text>
                    </Space>
                    <Space>
                        <ClockCircleOutlined />
                        <Tag color="green">{record.time}</Tag>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Giá vé',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <Text strong style={{ color: '#f50' }}>
                    {price?.toLocaleString('vi-VN')} VNĐ
                </Text>
            ),
        },
        {
            title: 'Đặt vé',
            key: 'booking',
            render: (_, record) => {
                const rate = getBookingRate(record.seatsBooked, record.totalSeats);
                return (
                    <Space direction="vertical" size={4}>
                        <Text>{record.seatsBooked}/{record.totalSeats} ghế</Text>
                        <Tag color={getBookingRateColor(rate)}>{rate}%</Tag>
                    </Space>
                );
            },
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                <Space direction="vertical" size={4}>
                    <Badge 
                        status={getStatusColor(record.status)} 
                        text={getStatusText(record.status)} 
                    />
                    <Switch
                        size="small"
                        checked={record.status === 'active'}
                        onChange={(checked) => handleStatusChange(record.id, checked ? 'active' : 'inactive')}
                    />
                </Space>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleViewSchedule(record)}
                        />
                    </Tooltip>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditSchedule(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa lịch chiếu"
                        description="Bạn có chắc chắn muốn xóa lịch chiếu này?"
                        onConfirm={() => handleDeleteSchedule(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="schedules-container">
            {/* Header */}
            <Card className="schedules-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Title level={2} style={{ margin: 0 }}>Quản lý Lịch chiếu</Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={handleAddSchedule}
                    >
                        Thêm Lịch chiếu
                    </Button>
                </div>

                {/* Statistics */}
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Tổng lịch chiếu"
                                value={stats.totalSchedules}
                                prefix={<CalendarOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Đang chiếu"
                                value={stats.activeSchedules}
                                prefix={<PlayCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Tổng doanh thu"
                                value={stats.totalRevenue}
                                precision={0}
                                prefix={<DollarCircleOutlined />}
                                suffix="đ"
                                valueStyle={{ color: '#f50' }}
                                formatter={(value) => value.toLocaleString('vi-VN')}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Tỷ lệ đặt vé TB"
                                value={stats.avgBookingRate}
                                precision={1}
                                prefix={<UserOutlined />}
                                suffix="%"
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Filters */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Input
                            placeholder="Tìm kiếm lịch chiếu..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo phim"
                            value={movieFilter}
                            onChange={setMovieFilter}
                            style={{ width: '100%' }}
                        >
                            <Option value="all">Tất cả phim</Option>
                            {moviesData.map(movie => (
                                <Option key={movie.id} value={movie.id.toString()}>
                                    <VideoCameraOutlined /> {movie.title}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo rạp"
                            value={cinemaFilter}
                            onChange={setCinemaFilter}
                            style={{ width: '100%' }}
                        >
                            <Option value="all">Tất cả rạp</Option>
                            {cinemasData.map(cinema => (
                                <Option key={cinema.id} value={cinema.id.toString()}>
                                    <ShopOutlined /> {cinema.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="active">Đang chiếu</Option>
                            <Option value="inactive">Tạm dừng</Option>
                            <Option value="cancelled">Đã hủy</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Schedules Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredSchedules}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch chiếu`,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Add Schedule Modal */}
            <Modal
                title="Thêm Lịch chiếu"
                open={showAddModal}
                onCancel={() => {
                    setShowAddModal(false);
                    form.resetFields();
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Phim"
                                name="movieId"
                                rules={[{ required: true, message: 'Vui lòng chọn phim' }]}
                            >
                                <Select placeholder="Chọn phim">
                                    {moviesData.map(movie => (
                                        <Option key={movie.id} value={movie.id}>
                                            {movie.title}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Rạp chiếu"
                                name="cinemaId"
                                rules={[{ required: true, message: 'Vui lòng chọn rạp' }]}
                            >
                                <Select placeholder="Chọn rạp">
                                    {cinemasData.map(cinema => (
                                        <Option key={cinema.id} value={cinema.id}>
                                            {cinema.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Phòng chiếu"
                                name="screenName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}
                            >
                                <Input placeholder="Ví dụ: Phòng 1" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Định dạng"
                                name="format"
                                rules={[{ required: true, message: 'Vui lòng chọn định dạng' }]}
                            >
                                <Select>
                                    <Option value="2D">2D</Option>
                                    <Option value="3D">3D</Option>
                                    <Option value="IMAX">IMAX</Option>
                                    <Option value="4DX">4DX</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày chiếu"
                                name="date"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Giờ chiếu"
                                name="time"
                                rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                            >
                                <TimePicker style={{ width: '100%' }} format="HH:mm" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Giá vé (VNĐ)"
                                name="price"
                                rules={[{ required: true, message: 'Vui lòng nhập giá vé' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Ngôn ngữ"
                                name="language"
                                rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ' }]}
                            >
                                <Select>
                                    <Option value="Tiếng Việt">Tiếng Việt</Option>
                                    <Option value="Tiếng Anh">Tiếng Anh</Option>
                                    <Option value="Tiếng Hàn">Tiếng Hàn</Option>
                                    <Option value="Tiếng Nhật">Tiếng Nhật</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Loại âm thanh"
                                name="type"
                                rules={[{ required: true, message: 'Vui lòng chọn loại âm thanh' }]}
                            >
                                <Select>
                                    <Option value="Phụ đề">Phụ đề</Option>
                                    <Option value="Thuyết minh">Thuyết minh</Option>
                                    <Option value="Lồng tiếng">Lồng tiếng</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        initialValue="active"
                    >
                        <Select>
                            <Option value="active">Đang chiếu</Option>
                            <Option value="inactive">Tạm dừng</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setShowAddModal(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Thêm Lịch chiếu
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Schedule Modal */}
            <Modal
                title="Chỉnh sửa Lịch chiếu"
                open={showEditModal}
                onCancel={() => {
                    setShowEditModal(false);
                    form.resetFields();
                    setSelectedSchedule(null);
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Phim"
                                name="movieId"
                                rules={[{ required: true, message: 'Vui lòng chọn phim' }]}
                            >
                                <Select placeholder="Chọn phim">
                                    {moviesData.map(movie => (
                                        <Option key={movie.id} value={movie.id}>
                                            {movie.title}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Rạp chiếu"
                                name="cinemaId"
                                rules={[{ required: true, message: 'Vui lòng chọn rạp' }]}
                            >
                                <Select placeholder="Chọn rạp">
                                    {cinemasData.map(cinema => (
                                        <Option key={cinema.id} value={cinema.id}>
                                            {cinema.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Phòng chiếu"
                                name="screenName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}
                            >
                                <Input placeholder="Ví dụ: Phòng 1" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Định dạng"
                                name="format"
                                rules={[{ required: true, message: 'Vui lòng chọn định dạng' }]}
                            >
                                <Select>
                                    <Option value="2D">2D</Option>
                                    <Option value="3D">3D</Option>
                                    <Option value="IMAX">IMAX</Option>
                                    <Option value="4DX">4DX</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày chiếu"
                                name="date"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Giờ chiếu"
                                name="time"
                                rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                            >
                                <TimePicker style={{ width: '100%' }} format="HH:mm" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Giá vé (VNĐ)"
                                name="price"
                                rules={[{ required: true, message: 'Vui lòng nhập giá vé' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Ngôn ngữ"
                                name="language"
                                rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ' }]}
                            >
                                <Select>
                                    <Option value="Tiếng Việt">Tiếng Việt</Option>
                                    <Option value="Tiếng Anh">Tiếng Anh</Option>
                                    <Option value="Tiếng Hàn">Tiếng Hàn</Option>
                                    <Option value="Tiếng Nhật">Tiếng Nhật</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Loại âm thanh"
                                name="type"
                                rules={[{ required: true, message: 'Vui lòng chọn loại âm thanh' }]}
                            >
                                <Select>
                                    <Option value="Phụ đề">Phụ đề</Option>
                                    <Option value="Thuyết minh">Thuyết minh</Option>
                                    <Option value="Lồng tiếng">Lồng tiếng</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                    >
                        <Select>
                            <Option value="active">Đang chiếu</Option>
                            <Option value="inactive">Tạm dừng</Option>
                            <Option value="cancelled">Đã hủy</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setShowEditModal(false);
                                form.resetFields();
                                setSelectedSchedule(null);
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Detail Modal */}
            <Modal
                title="Chi tiết Lịch chiếu"
                open={showDetailModal}
                onCancel={() => {
                    setShowDetailModal(false);
                    setSelectedSchedule(null);
                }}
                footer={[
                    <Button key="close" onClick={() => {
                        setShowDetailModal(false);
                        setSelectedSchedule(null);
                    }}>
                        Đóng
                    </Button>,
                    <Button 
                        key="edit" 
                        type="primary"
                        onClick={() => {
                            setShowDetailModal(false);
                            handleEditSchedule(selectedSchedule);
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                ]}
                width={600}
            >
                {selectedSchedule && (
                    <div>
                        <Alert
                            message={`Lịch chiếu #${selectedSchedule.id}`}
                            description={`${getMovieTitle(selectedSchedule.movieId)} - ${getCinemaName(selectedSchedule.cinemaId)}`}
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                        
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card size="small" title="Thông tin cơ bản">
                                    <p><strong>Phim:</strong> {getMovieTitle(selectedSchedule.movieId)}</p>
                                    <p><strong>Rạp:</strong> {getCinemaName(selectedSchedule.cinemaId)}</p>
                                    <p><strong>Phòng:</strong> {selectedSchedule.screenName}</p>
                                    <p><strong>Định dạng:</strong> <Tag color="blue">{selectedSchedule.format}</Tag></p>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card size="small" title="Thông tin chiếu">
                                    <p><strong>Ngày:</strong> {dayjs(selectedSchedule.date).format('DD/MM/YYYY')}</p>
                                    <p><strong>Giờ:</strong> <Tag color="green">{selectedSchedule.time}</Tag></p>
                                    <p><strong>Giá vé:</strong> <Text strong style={{ color: '#f50' }}>
                                        {selectedSchedule.price?.toLocaleString('vi-VN')} VNĐ
                                    </Text></p>
                                    <p><strong>Trạng thái:</strong> 
                                        <Badge 
                                            status={getStatusColor(selectedSchedule.status)} 
                                            text={getStatusText(selectedSchedule.status)} 
                                        />
                                    </p>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginTop: 16 }}>
                            <Col span={12}>
                                <Card size="small" title="Thông tin đặt vé">
                                    <p><strong>Đã đặt:</strong> {selectedSchedule.seatsBooked}/{selectedSchedule.totalSeats} ghế</p>
                                    <p><strong>Tỷ lệ đặt:</strong> 
                                        <Tag color={getBookingRateColor(getBookingRate(selectedSchedule.seatsBooked, selectedSchedule.totalSeats))}>
                                            {getBookingRate(selectedSchedule.seatsBooked, selectedSchedule.totalSeats)}%
                                        </Tag>
                                    </p>
                                    <p><strong>Doanh thu:</strong> <Text strong style={{ color: '#52c41a' }}>
                                        {(selectedSchedule.price * selectedSchedule.seatsBooked).toLocaleString('vi-VN')} VNĐ
                                    </Text></p>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card size="small" title="Thông tin âm thanh">
                                    <p><strong>Ngôn ngữ:</strong> <Tag color="purple">{selectedSchedule.language}</Tag></p>
                                    <p><strong>Loại âm thanh:</strong> <Tag color="orange">{selectedSchedule.type}</Tag></p>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Schedules;
