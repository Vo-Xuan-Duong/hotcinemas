import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    Popconfirm,
    message,
    Typography,
    Card,
    Row,
    Col,
    Statistic,
    Tag,
    Image,
    Tooltip,
    Divider
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    ShopOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined
} from '@ant-design/icons';

// Import data
import cinemasData from '../../../data/cinemas.json';
import './CinemasAntd.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Cinemas = () => {
    const navigate = useNavigate();
    const [cinemas, setCinemas] = useState(cinemasData);
    const [loading, setLoading] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedCinema, setSelectedCinema] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Tính toán thống kê
    const cinemaStats = {
        total: cinemas.length,
        active: cinemas.filter(c => c.status === 'active').length,
        totalRooms: cinemas.reduce((sum, c) => sum + (c.rooms?.length || 0), 0),
        totalSeats: cinemas.reduce((sum, c) =>
            sum + (c.rooms?.reduce((roomSum, room) => roomSum + (room.capacity || 0), 0) || 0), 0)
    };

    // Lọc rạp
    const filteredCinemas = cinemas.filter(cinema => {
        const matchesSearch = cinema.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            cinema.address?.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = statusFilter === 'all' || cinema.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Xử lý thêm rạp
    const handleAddCinema = (values) => {
        const newCinema = {
            id: Math.max(...cinemas.map(c => c.id || 0)) + 1,
            ...values,
            rooms: [],
            status: values.status || 'active',
            facilities: values.facilities || []
        };

        setCinemas([...cinemas, newCinema]);
        setIsAddModalVisible(false);
        form.resetFields();
        message.success('Thêm rạp chiếu phim thành công!');
    };

    // Xử lý chỉnh sửa rạp
    const handleEditCinema = (values) => {
        const updatedCinemas = cinemas.map(cinema =>
            cinema.id === selectedCinema.id
                ? { ...cinema, ...values }
                : cinema
        );

        setCinemas(updatedCinemas);
        setIsEditModalVisible(false);
        setSelectedCinema(null);
        form.resetFields();
        message.success('Cập nhật rạp chiếu phim thành công!');
    };

    // Xử lý xóa rạp
    const handleDeleteCinema = (cinemaId) => {
        const updatedCinemas = cinemas.filter(cinema => cinema.id !== cinemaId);
        setCinemas(updatedCinemas);
        message.success('Xóa rạp chiếu phim thành công!');
    };

    // Hiển thị modal
    const showAddModal = () => {
        setIsAddModalVisible(true);
        form.resetFields();
    };

    const showEditModal = (cinema) => {
        setSelectedCinema(cinema);
        setIsEditModalVisible(true);
        form.setFieldsValue({
            ...cinema,
            facilities: cinema.facilities || []
        });
    };

    const showDetailModal = (cinema) => {
        setSelectedCinema(cinema);
        setIsDetailModalVisible(true);
    };

    // Render trạng thái
    const renderStatus = (status) => {
        const statusConfig = {
            active: { color: 'green', text: 'Hoạt động' },
            inactive: { color: 'red', text: 'Không hoạt động' },
            maintenance: { color: 'orange', text: 'Bảo trì' }
        };
        const config = statusConfig[status] || statusConfig.active;
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    // Cấu hình cột bảng
    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 100,
            render: (image, record) => (
                <Image
                    src={image}
                    alt={record.name}
                    width={60}
                    height={40}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                />
            ),
        },
        {
            title: 'Tên rạp',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => showDetailModal(record)}
                    style={{ padding: 0, height: 'auto', fontWeight: 500 }}
                >
                    {text}
                </Button>
            ),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
        },
        {
            title: 'Điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 120,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
        },
        {
            title: 'Phòng chiếu',
            dataIndex: 'rooms',
            key: 'rooms',
            width: 100,
            align: 'center',
            render: (rooms) => rooms?.length || 0,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: renderStatus,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => showDetailModal(record)}
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showEditModal(record)}
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title="Xóa rạp chiếu phim"
                            description="Bạn có chắc chắn muốn xóa rạp này?"
                            onConfirm={() => handleDeleteCinema(record.id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="cinemas-container">
            {/* Header */}
            <div className="cinemas-header">
                <div>
                    <Title level={2} className="cinemas-title">
                        Quản lý Rạp Chiếu Phim
                    </Title>
                    <Text className="cinemas-subtitle">
                        Quản lý thông tin các rạp chiếu phim trong hệ thống
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showAddModal}
                    size="large"
                >
                    Thêm rạp mới
                </Button>
            </div>

            {/* Statistics */}
            <Row gutter={[16, 16]} className="quick-stats">
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="Tổng số rạp"
                            value={cinemaStats.total}
                            prefix={<ShopOutlined className="stat-icon" style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="Rạp hoạt động"
                            value={cinemaStats.active}
                            prefix={<ShopOutlined className="stat-icon" style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="Tổng phòng chiếu"
                            value={cinemaStats.totalRooms}
                            prefix={<ShopOutlined className="stat-icon" style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="Tổng ghế ngồi"
                            value={cinemaStats.totalSeats}
                            prefix={<ShopOutlined className="stat-icon" style={{ color: '#722ed1' }} />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Search and Filter */}
            <Card className="search-filter-section">
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Input.Search
                            placeholder="Tìm kiếm theo tên rạp, địa chỉ..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            size="large"
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                            size="large"
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="active">Hoạt động</Option>
                            <Option value="inactive">Không hoạt động</Option>
                            <Option value="maintenance">Bảo trì</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Cinemas Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredCinemas}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        total: filteredCinemas.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} rạp chiếu phim`,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Add Cinema Modal */}
            <Modal
                title="Thêm rạp chiếu phim mới"
                open={isAddModalVisible}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={800}
                className="cinema-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddCinema}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Tên rạp"
                                rules={[{ required: true, message: 'Vui lòng nhập tên rạp!' }]}
                            >
                                <Input placeholder="Nhập tên rạp" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Trạng thái"
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                                initialValue="active"
                            >
                                <Select>
                                    <Option value="active">Hoạt động</Option>
                                    <Option value="inactive">Không hoạt động</Option>
                                    <Option value="maintenance">Bảo trì</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input.TextArea rows={2} placeholder="Nhập địa chỉ chi tiết" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea rows={3} placeholder="Nhập mô tả về rạp" />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Hình ảnh URL"
                    >
                        <Input placeholder="Nhập URL hình ảnh" />
                    </Form.Item>

                    <Form.Item
                        name="facilities"
                        label="Tiện ích"
                    >
                        <Select
                            mode="tags"
                            placeholder="Nhập hoặc chọn tiện ích"
                            options={[
                                { label: 'Parking', value: 'Parking' },
                                { label: 'Food Court', value: 'Food Court' },
                                { label: 'AC', value: 'AC' },
                                { label: 'WiFi', value: 'WiFi' },
                                { label: 'ATM', value: 'ATM' },
                                { label: '3D', value: '3D' },
                                { label: 'IMAX', value: 'IMAX' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Thêm rạp
                            </Button>
                            <Button onClick={() => {
                                setIsAddModalVisible(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Cinema Modal */}
            <Modal
                title="Chỉnh sửa rạp chiếu phim"
                open={isEditModalVisible}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setSelectedCinema(null);
                    form.resetFields();
                }}
                footer={null}
                width={800}
                className="cinema-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEditCinema}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Tên rạp"
                                rules={[{ required: true, message: 'Vui lòng nhập tên rạp!' }]}
                            >
                                <Input placeholder="Nhập tên rạp" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Trạng thái"
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                            >
                                <Select>
                                    <Option value="active">Hoạt động</Option>
                                    <Option value="inactive">Không hoạt động</Option>
                                    <Option value="maintenance">Bảo trì</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input.TextArea rows={2} placeholder="Nhập địa chỉ chi tiết" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea rows={3} placeholder="Nhập mô tả về rạp" />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Hình ảnh URL"
                    >
                        <Input placeholder="Nhập URL hình ảnh" />
                    </Form.Item>

                    <Form.Item
                        name="facilities"
                        label="Tiện ích"
                    >
                        <Select
                            mode="tags"
                            placeholder="Nhập hoặc chọn tiện ích"
                            options={[
                                { label: 'Parking', value: 'Parking' },
                                { label: 'Food Court', value: 'Food Court' },
                                { label: 'AC', value: 'AC' },
                                { label: 'WiFi', value: 'WiFi' },
                                { label: 'ATM', value: 'ATM' },
                                { label: '3D', value: '3D' },
                                { label: 'IMAX', value: 'IMAX' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                            <Button onClick={() => {
                                setIsEditModalVisible(false);
                                setSelectedCinema(null);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Detail Cinema Modal */}
            <Modal
                title="Chi tiết rạp chiếu phim"
                open={isDetailModalVisible}
                onCancel={() => {
                    setIsDetailModalVisible(false);
                    setSelectedCinema(null);
                }}
                footer={[
                    <Button key="close" onClick={() => {
                        setIsDetailModalVisible(false);
                        setSelectedCinema(null);
                    }}>
                        Đóng
                    </Button>
                ]}
                width={800}
            >
                {selectedCinema && (
                    <div>
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Image
                                    src={selectedCinema.image}
                                    alt={selectedCinema.name}
                                    width="100%"
                                    height={200}
                                    style={{ objectFit: 'cover', borderRadius: 8 }}
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                                />
                            </Col>
                            <Col span={16}>
                                <Title level={3}>{selectedCinema.name}</Title>
                                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                    <div>
                                        <EnvironmentOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                                        <Text>{selectedCinema.address}</Text>
                                    </div>
                                    <div>
                                        <PhoneOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                        <Text>{selectedCinema.phone}</Text>
                                    </div>
                                    <div>
                                        <MailOutlined style={{ color: '#faad14', marginRight: 8 }} />
                                        <Text>{selectedCinema.email}</Text>
                                    </div>
                                    <div>
                                        <Text strong>Trạng thái: </Text>
                                        {renderStatus(selectedCinema.status)}
                                    </div>
                                </Space>
                            </Col>
                        </Row>

                        <Divider />

                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Mô tả:</Text>
                            <div style={{ marginTop: 8 }}>
                                <Text>{selectedCinema.description || 'Chưa có mô tả'}</Text>
                            </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Tiện ích:</Text>
                            <div style={{ marginTop: 8 }}>
                                {selectedCinema.facilities?.map((facility, index) => (
                                    <Tag key={index} className="facility-tag">
                                        {facility}
                                    </Tag>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Text strong>Phòng chiếu ({selectedCinema.rooms?.length || 0}):</Text>
                            <div style={{ marginTop: 8 }}>
                                {selectedCinema.rooms?.map((room, index) => (
                                    <div key={index} className="room-item">
                                        <div>
                                            <div className="room-name">{room.name || `Phòng ${index + 1}`}</div>
                                            <div className="room-capacity">{room.capacity || 0} ghế</div>
                                        </div>
                                        <Tag color="blue">{room.type || '2D'}</Tag>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Cinemas;
