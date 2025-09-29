import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Table,
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    Radio,
    Space,
    Divider,
    Row,
    Col,
    Statistic,
    Tag,
    Avatar,
    Typography,
    Empty,
    Spin,
    message,
    Popconfirm,
    Badge
} from 'antd';
import {
    ArrowLeftOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SettingOutlined,
    HomeOutlined,
    UserOutlined,
    StarOutlined,
    ToolOutlined
} from '@ant-design/icons';
import './CinemaDetailAntd.css';
import SeatManagerAntd from "../../../components/SeatManager/SeatManagerAntd";
import cinemasData from '../../../data/cinemas.json';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CinemaDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [cinema, setCinema] = useState(null);
    const [rooms, setRooms] = useState([]); // Changed from screens to rooms for clarity
    const [loading, setLoading] = useState(true);
    const [showAddRoom, setShowAddRoom] = useState(false); // Changed from showAddScreen
    const [showEditRoom, setShowEditRoom] = useState(false); // Changed from showEditScreen
    const [showSeatManager, setShowSeatManager] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null); // Changed from selectedScreen
    const [showEditCinema, setShowEditCinema] = useState(false);
    const [cinemaForm] = Form.useForm();
    const [roomForm, setRoomForm] = useState({ // Changed from screenForm
        name: '',
        capacity: '',
        type: '2D',
        description: '',
        facilities: [],
        seatLayout: {
            rows: 10,
            seatsPerRow: 12,
            vipRows: []
        }
    });

    useEffect(() => {
        loadCinemaDetail();
    }, [id]);

    const loadCinemaDetail = async () => {
        setLoading(true);
        try {
            // Sử dụng dữ liệu mẫu từ cinemas.json
            const foundCinema = cinemasData.find(cinema => cinema.id === parseInt(id));
            if (foundCinema) {
                const cinema = {
                    ...foundCinema,
                    phone: foundCinema.phone || '',
                    email: foundCinema.email || '',
                    description: foundCinema.description || 'Rạp chiếu phim hiện đại với công nghệ âm thanh, hình ảnh tốt nhất',
                    image: foundCinema.image || `https://via.placeholder.com/150x100/667eea/ffffff?text=${encodeURIComponent(foundCinema.name)}`,
                    facilities: foundCinema.facilities || ['Parking', 'Food Court', 'AC']
                };
                setCinema(cinema);
                setRooms(foundCinema.rooms || []);
            } else {
                console.error('Cinema not found');
            }
        } catch (error) {
            console.error('Error loading cinema detail:', error);
            // Optionally, show an error message to the user
        } finally {
            setLoading(false);
        }
    };

    const handleAddRoom = () => {
        setRoomForm({
            name: '',
            capacity: '',
            type: '2D',
            description: '',
            facilities: [],
            seatLayout: {
                rows: 10,
                seatsPerRow: 12,
                vipRows: []
            }
        });
        form.resetFields();
        setShowAddRoom(true);
    };

    const handleEditRoom = (room) => {
        setSelectedRoom(room);
        setRoomForm({
            name: room.name || '',
            capacity: room.capacity || '',
            type: room.type || '2D',
            description: room.description || '',
            facilities: room.facilities || [],
            seatLayout: room.seatLayout || {
                rows: 10,
                seatsPerRow: 12,
                vipRows: []
            }
        });
        form.setFieldsValue({
            name: room.name || '',
            capacity: room.capacity || '',
            type: room.type || '2D',
            description: room.description || '',
            facilities: room.facilities || [],
            rows: room.seatLayout?.rows || 10,
            seatsPerRow: room.seatLayout?.seatsPerRow || 12,
            vipRows: room.seatLayout?.vipRows || []
        });
        setShowEditRoom(true);
    };

    const handleSubmitRoom = async (values) => {
        try {
            if (showEditRoom) {
                // await cinemaService.updateRoom(id, selectedRoom.id, values);
                message.success('Cập nhật phòng chiếu thành công');
            } else {
                // await cinemaService.addRoom(id, values);
                message.success('Thêm phòng chiếu thành công');
            }
            setShowAddRoom(false);
            setShowEditRoom(false);
            setSelectedRoom(null);
            form.resetFields();
            await loadCinemaDetail();
        } catch (error) {
            console.error('Error saving room:', error);
            message.error('Lưu thông tin phòng thất bại. Vui lòng thử lại.');
        }
    };

    const handleManageSeats = (room) => {
        setSelectedRoom(room);
        setShowSeatManager(true);
    };

    const saveSeatLayout = async (seatLayoutData) => {
        if (!selectedRoom) return;

        const updatedRoom = { ...selectedRoom, seatLayout: seatLayoutData };

        try {
            // await cinemaService.updateRoom(id, selectedRoom.id, updatedRoom);
            message.success('Lưu sơ đồ ghế thành công');
            setShowSeatManager(false);
            setSelectedRoom(null);
            await loadCinemaDetail();
        } catch (error) {
            console.error('Error saving seat layout:', error);
            message.error('Lưu sơ đồ ghế thất bại. Vui lòng thử lại.');
        }
    };

    const handleDeleteRoom = async (roomId) => {
        try {
            // await cinemaService.deleteRoom(id, roomId);
            message.success('Xóa phòng chiếu thành công');
            await loadCinemaDetail();
        } catch (error) {
            console.error('Error deleting room:', error);
            message.error('Xóa phòng thất bại. Vui lòng thử lại.');
        }
    };

    const handleEditCinema = () => {
        cinemaForm.setFieldsValue({
            name: cinema.name,
            address: cinema.address,
            phone: cinema.phone,
            email: cinema.email,
            description: cinema.description,
            image: cinema.image,
            facilities: cinema.facilities || []
        });
        setShowEditCinema(true);
    };

    const handleSubmitCinema = async (values) => {
        try {
            // await cinemaService.updateCinema(id, values);
            const updatedCinema = { ...cinema, ...values };
            setCinema(updatedCinema);
            message.success('Cập nhật thông tin rạp thành công!');
            setShowEditCinema(false);
            cinemaForm.resetFields();
        } catch (error) {
            console.error('Error updating cinema:', error);
            message.error('Cập nhật thông tin rạp thất bại. Vui lòng thử lại.');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!cinema) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Empty description="Không tìm thấy rạp phim" />
            </div>
        );
    }

    // Định nghĩa columns cho bảng phòng chiếu
    const columns = [
        {
            title: 'Tên phòng',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const colorMap = {
                    '2D': 'blue',
                    '3D': 'green',
                    'IMAX': 'orange',
                    '4DX': 'purple'
                };
                return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
            }
        },
        {
            title: 'Sức chứa',
            dataIndex: 'capacity',
            key: 'capacity',
            render: (capacity) => capacity ? `${capacity} chỗ` : 'Chưa cập nhật'
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditRoom(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<SettingOutlined />}
                        size="small"
                        type="default"
                        onClick={() => handleManageSeats(record)}
                    >
                        Quản lý ghế
                    </Button>
                    <Popconfirm
                        title="Xóa phòng chiếu"
                        description="Bạn có chắc chắn muốn xóa phòng này?"
                        onConfirm={() => handleDeleteRoom(record.id)}
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
            )
        }
    ];

    return (
        <div className="cinema-detail-container">
            {/* Header */}
            <Card style={{ marginBottom: '24px' }}>
                <div className="back-button">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/admin/cinemas')}
                        size="large"
                        className="action-button"
                    >
                        Quay lại
                    </Button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <Title level={2} style={{ margin: 0 }}>
                            Chi tiết rạp: {cinema.name}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '16px' }}>{cinema.address}</Text>
                    </div>
                    <Button
                        icon={<EditOutlined />}
                        size="large"
                        onClick={handleEditCinema}
                        className="action-button"
                    >
                        Chỉnh sửa rạp
                    </Button>
                </div>
            </Card>

            {/* Cinema Information */}
            <Card
                title={
                    <Space size="middle">
                        <HomeOutlined style={{ color: '#1890ff' }} />
                        <span>Thông tin rạp phim</span>
                    </Space>
                }
                className="cinema-info-card"
                style={{ marginBottom: '24px' }}
            >
                <Row gutter={[24, 16]} align="middle">
                    <Col xs={24} sm={6} md={4}>
                        <Avatar
                            shape="square"
                            size={120}
                            src={cinema.image}
                            icon={<HomeOutlined />}
                            className="cinema-avatar"
                        />
                    </Col>
                    <Col xs={24} sm={18} md={20}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div>
                                <Text strong style={{ color: '#262626' }}>📍 Địa chỉ: </Text>
                                <Text>{cinema.address}</Text>
                            </div>
                            {cinema.phone && (
                                <div>
                                    <Text strong style={{ color: '#262626' }}>📞 Điện thoại: </Text>
                                    <Text copyable>{cinema.phone}</Text>
                                </div>
                            )}
                            {cinema.email && (
                                <div>
                                    <Text strong style={{ color: '#262626' }}>✉️ Email: </Text>
                                    <Text copyable>{cinema.email}</Text>
                                </div>
                            )}
                            {cinema.description && (
                                <div>
                                    <Text strong style={{ color: '#262626' }}>📝 Mô tả: </Text>
                                    <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'Xem thêm' }}>
                                        {cinema.description}
                                    </Paragraph>
                                </div>
                            )}
                            {cinema.facilities && cinema.facilities.length > 0 && (
                                <div>
                                    <Text strong style={{ color: '#262626' }}>🎯 Tiện ích: </Text>
                                    <div style={{ marginTop: '8px' }}>
                                        {cinema.facilities.map((facility, index) => (
                                            <Tag key={index} color="processing" style={{ marginBottom: '4px' }}>
                                                {facility}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: '24px' }} className="stat-cards-row">
                <Col xs={24} sm={8}>
                    <div className="stat-card">
                        <Card>
                            <Statistic
                                title="Tổng phòng chiếu"
                                value={rooms.length}
                                prefix={<HomeOutlined style={{ color: '#1890ff' }} />}
                                valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                            />
                        </Card>
                    </div>
                </Col>
                <Col xs={24} sm={8}>
                    <div className="stat-card">
                        <Card>
                            <Statistic
                                title="Tổng sức chứa"
                                value={rooms.reduce((total, room) => total + (parseInt(room.capacity) || 0), 0)}
                                prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                                suffix="chỗ"
                                valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                            />
                        </Card>
                    </div>
                </Col>
                <Col xs={24} sm={8}>
                    <div className="stat-card">
                        <Card>
                            <Statistic
                                title="Phòng đặc biệt"
                                value={rooms.filter(room => room.type === 'IMAX' || room.type === '4DX').length}
                                prefix={<StarOutlined style={{ color: '#faad14' }} />}
                                valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
                            />
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* Rooms Table */}
            <Card
                title={
                    <Space size="middle">
                        <ToolOutlined style={{ color: '#1890ff' }} />
                        <span>Danh sách phòng chiếu</span>
                        <Badge count={rooms.length} style={{ backgroundColor: '#52c41a' }} />
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddRoom}
                        className="action-button"
                    >
                        Thêm phòng
                    </Button>
                }
                className="rooms-table"
            >
                {rooms.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={rooms.map(room => ({ ...room, key: room.id }))}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} của ${total} phòng`,
                        }}
                        scroll={{ x: 800 }}
                    />
                ) : (
                    <div className="empty-state-container">
                        <Empty
                            description="Chưa có phòng chiếu nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddRoom}
                                size="large"
                                className="action-button"
                            >
                                Thêm phòng chiếu đầu tiên
                            </Button>
                        </Empty>
                    </div>
                )}
            </Card>            {/* Add/Edit Room Modal */}
            <Modal
                title={
                    <Space>
                        {showEditRoom ? <EditOutlined /> : <PlusOutlined />}
                        {showEditRoom ? 'Sửa phòng chiếu' : 'Thêm phòng chiếu'}
                    </Space>
                }
                open={showAddRoom || showEditRoom}
                onCancel={() => {
                    setShowAddRoom(false);
                    setShowEditRoom(false);
                    form.resetFields();
                }}
                footer={null}
                width={700}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmitRoom}
                    initialValues={{
                        type: '2D',
                        rows: 10,
                        seatsPerRow: 12,
                        facilities: [],
                        vipRows: []
                    }}
                >
                    <Divider orientation="left">📋 Thông tin cơ bản</Divider>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên phòng"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên phòng!' }]}
                            >
                                <Input placeholder="Ví dụ: Phòng chiếu 1" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Sức chứa"
                                name="capacity"
                                rules={[{ required: true, message: 'Vui lòng nhập sức chứa!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Số ghế"
                                    min={1}
                                    addonAfter="chỗ"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Loại phòng"
                        name="type"
                        rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
                    >
                        <Radio.Group>
                            <Radio.Button value="2D">2D</Radio.Button>
                            <Radio.Button value="3D">3D</Radio.Button>
                            <Radio.Button value="IMAX">IMAX</Radio.Button>
                            <Radio.Button value="4DX">4DX</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Mô tả về phòng chiếu..."
                        />
                    </Form.Item>

                    <Divider orientation="left">🎯 Tiện ích phòng</Divider>

                    <Form.List name="facilities">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name]}
                                            style={{ margin: 0, flex: 1 }}
                                        >
                                            <Input placeholder="Tên tiện ích" />
                                        </Form.Item>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => remove(name)}
                                        />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Thêm tiện ích
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Divider orientation="left">🪑 Sơ đồ ghế</Divider>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Số hàng"
                                name="rows"
                                rules={[{ required: true, message: 'Vui lòng nhập số hàng!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    max={20}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ghế mỗi hàng"
                                name="seatsPerRow"
                                rules={[{ required: true, message: 'Vui lòng nhập số ghế mỗi hàng!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    max={30}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item dependencies={['rows', 'seatsPerRow']}>
                        {({ getFieldValue }) => {
                            const rows = getFieldValue('rows') || 0;
                            const seatsPerRow = getFieldValue('seatsPerRow') || 0;
                            const totalSeats = rows * seatsPerRow;
                            return (
                                <Card size="small" style={{ background: '#f0f2ff' }}>
                                    <Text strong>Tổng số ghế: {totalSeats} ghế</Text>
                                </Card>
                            );
                        }}
                    </Form.Item>

                    <Form.List name="vipRows">
                        {(fields, { add, remove }) => (
                            <>
                                <Text strong>⭐ Hàng ghế VIP</Text>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8, marginTop: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name]}
                                            style={{ margin: 0, flex: 1 }}
                                        >
                                            <Input
                                                placeholder="Ví dụ: A, B, C..."
                                                maxLength={1}
                                                style={{ textTransform: 'uppercase' }}
                                            />
                                        </Form.Item>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => remove(name)}
                                        />
                                    </Space>
                                ))}
                                <Form.Item style={{ marginTop: 8 }}>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<StarOutlined />}
                                    >
                                        Thêm hàng VIP
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setShowAddRoom(false);
                                setShowEditRoom(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" icon={showEditRoom ? <EditOutlined /> : <PlusOutlined />}>
                                {showEditRoom ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Seat Manager Modal */}
            {showSeatManager && selectedRoom && (
                <Modal
                    title={
                        <Space size="middle">
                            <SettingOutlined style={{ color: '#1890ff' }} />
                            <span>Quản lý sơ đồ ghế - {selectedRoom.name}</span>
                            <Tag color="blue">{selectedRoom.type}</Tag>
                        </Space>
                    }
                    open={showSeatManager}
                    onCancel={() => setShowSeatManager(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setShowSeatManager(false)}>
                            Đóng
                        </Button>,
                        <Button
                            key="save"
                            type="primary"
                            onClick={() => {
                                // Save sẽ được handle bởi SeatManager component
                                message.success('Lưu sơ đồ ghế thành công');
                                setShowSeatManager(false);
                            }}
                        >
                            Lưu thay đổi
                        </Button>
                    ]}
                    width="95%"
                    style={{ top: 20 }}
                    bodyStyle={{ height: '75vh', overflow: 'auto', padding: '16px' }}
                    className="seat-manager-modal"
                >
                    <div style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card size="small">
                                    <Statistic
                                        title="Tổng số ghế"
                                        value={(selectedRoom.seatLayout?.rows || 10) * (selectedRoom.seatLayout?.seatsPerRow || 12)}
                                        prefix={<UserOutlined />}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small">
                                    <Statistic
                                        title="Hàng ghế"
                                        value={selectedRoom.seatLayout?.rows || 10}
                                        prefix={<HomeOutlined />}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small">
                                    <Statistic
                                        title="Ghế mỗi hàng"
                                        value={selectedRoom.seatLayout?.seatsPerRow || 12}
                                        prefix={<ToolOutlined />}
                                        valueStyle={{ color: '#faad14' }}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <SeatManagerAntd
                        selectedScreen={selectedRoom}
                        onSave={saveSeatLayout}
                        onClose={() => setShowSeatManager(false)}
                    />
                </Modal>
            )}

            {/* Edit Cinema Modal */}
            <Modal
                title={
                    <Space>
                        <EditOutlined />
                        <span>Chỉnh sửa thông tin rạp</span>
                    </Space>
                }
                open={showEditCinema}
                onCancel={() => {
                    setShowEditCinema(false);
                    cinemaForm.resetFields();
                }}
                footer={null}
                width={800}
                destroyOnClose
                className="edit-cinema-modal"
            >
                <Form
                    form={cinemaForm}
                    layout="vertical"
                    onFinish={handleSubmitCinema}
                    initialValues={{
                        facilities: []
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên rạp"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên rạp' }]}
                            >
                                <Input placeholder="Nhập tên rạp" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input placeholder="Nhập địa chỉ rạp" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Hình ảnh (URL)"
                                name="image"
                            >
                                <Input placeholder="Nhập URL hình ảnh" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                    >
                        <TextArea
                            rows={4}
                            placeholder="Nhập mô tả về rạp"
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tiện ích"
                        name="facilities"
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn tiện ích"
                            allowClear
                            options={[
                                { label: 'Bãi đỗ xe', value: 'Parking' },
                                { label: 'Khu ẩm thực', value: 'Food Court' },
                                { label: 'Điều hòa', value: 'AC' },
                                { label: 'WiFi miễn phí', value: 'Free WiFi' },
                                { label: 'Thang máy', value: 'Elevator' },
                                { label: 'Ghế massage', value: 'Massage Chair' },
                                { label: 'Phòng game', value: 'Game Room' },
                                { label: 'Cửa hàng', value: 'Shop' }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button
                                onClick={() => {
                                    setShowEditCinema(false);
                                    cinemaForm.resetFields();
                                }}
                            >
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
                                Cập nhật rạp
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CinemaDetail;
