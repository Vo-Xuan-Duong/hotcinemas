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
import SeatManager from "../../../components/SeatManager/SeatManager";
import cinemaService from '../../../services/cinemaService';
import roomService from '../../../services/roomService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CinemaDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [cinema, setCinema] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [showEditRoom, setShowEditRoom] = useState(false);
    const [showSeatManager, setShowSeatManager] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showEditCinema, setShowEditCinema] = useState(false);
    const [cinemaForm] = Form.useForm();
    const [debugInfo, setDebugInfo] = useState(null);

    // Debug helper
    const logDebug = (label, data) => {
        console.log(`[CinemaDetail] ${label}:`, data);
        setDebugInfo({ label, data, timestamp: new Date().toLocaleTimeString() });
    };

    useEffect(() => {
        loadCinemaDetail();
    }, [id]);

    const loadCinemaDetail = async () => {
        setLoading(true);
        try {
            logDebug('Starting loadCinemaDetail', { cinemaId: id });

            // Gọi API để lấy thông tin cinema
            const cinemaResponse = await cinemaService.getCinemaById(id);
            // logDebug('Cinema API Response', cinemaResponse);

            // Extract data - handle both response.data.data and response.data patterns
            const cinemaData = cinemaResponse?.data?.data || cinemaResponse?.data || cinemaResponse;
            // logDebug('Extracted Cinema Data', cinemaData);

            // Gọi API để lấy danh sách phòng - handle 404 with empty array
            let roomsData = [];
            try {
                const roomsResponse = await cinemaService.getRoomsByCinemaId(id);
                // logDebug('Rooms API Response', roomsResponse);
                roomsData = roomsResponse?.data?.data || roomsResponse?.data || roomsResponse || [];
                // logDebug('Extracted Rooms Data', roomsData);
            } catch (roomError) {
                // Nếu API rooms trả về 404 hoặc lỗi khác, sử dụng danh sách rỗng
                if (roomError.response?.status === 404) {
                    logDebug('Rooms Not Found (404)', 'Using empty rooms array');
                    roomsData = [];
                } else {
                    // Log lỗi nhưng vẫn tiếp tục với danh sách rỗng
                    logDebug('Rooms API Error', { status: roomError.response?.status, message: roomError.message });
                    console.warn('Error fetching rooms, using empty array:', roomError);
                    roomsData = [];
                }
            }

            if (cinemaData) {
                setCinema(cinemaData);
                setRooms(Array.isArray(roomsData) ? roomsData : []);
                logDebug('State Updated', { cinema: cinemaData, roomsCount: Array.isArray(roomsData) ? roomsData.length : 0 });
            } else {
                logDebug('No Cinema Data', 'Cinema data is null or undefined');
                message.error('Không tìm thấy rạp phim');
                navigate('/admin/cinemas');
            }
        } catch (error) {
            logDebug('Error', { message: error.message, response: error.response });
            console.error('Error loading cinema detail:', error);
            message.error(error.response?.data?.message || 'Lỗi khi tải thông tin rạp phim');
            // Không navigate về nếu lỗi, để user có thể retry
        } finally {
            setLoading(false);
        }
    }; const handleAddRoom = () => {
        form.resetFields();
        setShowAddRoom(true);
    };

    const handleEditRoom = (room) => {
        setSelectedRoom(room);
        form.setFieldsValue({
            name: room.name || '',
            roomType: room.roomType || 'STANDARD_2D', // Dùng trực tiếp giá trị backend
            rowsCount: room.rowsCount || room.seatLayout?.rows || 10,
            seatsPerRow: room.seatsPerRow || room.seatLayout?.seatsPerRow || 12,
            rowVip: room.rowVip || [],
            price: room.price || 0,
            isActive: room.isActive !== undefined ? room.isActive : true
        });
        setShowEditRoom(true);
    };

    const handleSubmitRoom = async (values) => {
        try {
            console.log('Submitting room data:', values);

            // Map theo RoomRequest từ backend
            const roomData = {
                name: values.name,
                roomType: values.roomType, // Dùng trực tiếp giá trị backend (STANDARD_2D, STANDARD_3D, ...)
                rowsCount: values.rowsCount || 10,
                seatsPerRow: values.seatsPerRow || 12,
                rowVip: values.rowVip || [], // List<Long> - danh sách index hàng VIP
                price: values.price || 0,
                isActive: values.isActive !== undefined ? values.isActive : true
            };

            console.log('Processed room data:', roomData);

            if (showEditRoom && selectedRoom) {
                // Update existing room
                console.log('Updating room:', selectedRoom.id);
                const response = await cinemaService.updateRoom(id, selectedRoom.id, roomData);
                console.log('Update room response:', response);
                message.success('Cập nhật phòng chiếu thành công');
            } else {
                // Create new room
                console.log('Creating new room for cinema:', id);
                const response = await cinemaService.addRoom(id, roomData);
                console.log('Create room response:', response);
                message.success('Thêm phòng chiếu thành công');
            }

            setShowAddRoom(false);
            setShowEditRoom(false);
            setSelectedRoom(null);
            form.resetFields();
            await loadCinemaDetail();
        } catch (error) {
            console.error('Error saving room:', error);
            console.error('Error response:', error.response);
            message.error(error.response?.data?.message || error.message || 'Lưu thông tin phòng thất bại');
        }
    };

    const handleManageSeats = (room) => {
        setSelectedRoom(room);
        setShowSeatManager(true);
    };

    const saveSeatLayout = async (seatLayoutData) => {
        if (!selectedRoom) return;

        const updatedRoom = {
            ...selectedRoom,
            seatLayout: seatLayoutData
        };

        try {
            await cinemaService.updateRoom(id, selectedRoom.id, updatedRoom);
            message.success('Lưu sơ đồ ghế thành công');
            setShowSeatManager(false);
            setSelectedRoom(null);
            await loadCinemaDetail();
        } catch (error) {
            console.error('Error saving seat layout:', error);
            message.error(error.response?.data?.message || 'Lưu sơ đồ ghế thất bại');
        }
    };

    const handleDeleteRoom = async (roomId) => {
        try {
            await cinemaService.deleteRoom(id, roomId);
            message.success('Xóa phòng chiếu thành công');
            await loadCinemaDetail();
        } catch (error) {
            console.error('Error deleting room:', error);
            message.error(error.response?.data?.message || 'Xóa phòng thất bại');
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
            console.log('Updating cinema with values:', values);
            const response = await cinemaService.updateCinema(id, values);
            console.log('Update cinema response:', response);
            message.success('Cập nhật thông tin rạp thành công!');
            setShowEditCinema(false);
            cinemaForm.resetFields();
            await loadCinemaDetail();
        } catch (error) {
            console.error('Error updating cinema:', error);
            console.error('Error response:', error.response);
            message.error(error.response?.data?.message || error.message || 'Cập nhật thông tin rạp thất bại');
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
            render: (type, record) => {
                // Map backend roomType to frontend display if needed
                const displayType = record.roomType ? roomService.mapRoomTypeToFrontend(record.roomType) : type;
                const colorMap = {
                    '2D': 'blue',
                    '3D': 'green',
                    'IMAX': 'orange',
                    'VIP': 'gold'
                };
                return <Tag color={colorMap[displayType] || 'default'}>{displayType}</Tag>;
            }
        },
        {
            title: 'Sức chứa',
            key: 'capacity',
            render: (_, record) => {
                const seats = (record.rowsCount || 0) * (record.seatsPerRow || 0);
                return seats > 0 ? `${seats} chỗ` : 'Chưa cập nhật';
            }
        },
        {
            title: 'Giá phòng',
            dataIndex: 'price',
            key: 'price',
            render: (price) => {
                return price ? `${price.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ';
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            )
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
                            Chi tiết rạp: {cinema?.name || 'Loading...'}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '16px' }}>{cinema?.address || ''}</Text>
                    </div>
                    <Space>
                        <Button
                            onClick={loadCinemaDetail}
                            loading={loading}
                        >
                            🔄 Reload Data
                        </Button>
                        <Button
                            icon={<EditOutlined />}
                            size="large"
                            onClick={handleEditCinema}
                            className="action-button"
                            disabled={!cinema}
                        >
                            Chỉnh sửa rạp
                        </Button>
                    </Space>
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
                        {showEditRoom ? (
                            <EditOutlined style={{ color: '#faad14' }} />
                        ) : (
                            <PlusOutlined style={{ color: '#52c41a' }} />
                        )}
                        <span style={{ fontSize: '16px', fontWeight: 600 }}>
                            {showEditRoom ? 'Chỉnh sửa phòng chiếu' : 'Tạo phòng chiếu mới'}
                        </span>
                    </Space>
                }
                open={showAddRoom || showEditRoom}
                onCancel={() => {
                    setShowAddRoom(false);
                    setShowEditRoom(false);
                    form.resetFields();
                }}
                footer={null}
                width={800}
                destroyOnClose
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmitRoom}
                    initialValues={{
                        roomType: 'STANDARD_2D',
                        rowsCount: 10,
                        seatsPerRow: 12,
                        rowVip: [],
                        price: 50000,
                        isActive: true
                    }}
                >
                    <Divider orientation="left" style={{ fontSize: '14px', fontWeight: 500 }}>
                        <Space>
                            <HomeOutlined style={{ color: '#1890ff' }} />
                            Thông tin cơ bản
                        </Space>
                    </Divider>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={<span><strong>Tên phòng</strong></span>}
                                name="name"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên phòng!' },
                                    { min: 3, message: 'Tên phòng phải có ít nhất 3 ký tự!' },
                                    { max: 50, message: 'Tên phòng không được quá 50 ký tự!' }
                                ]}
                                tooltip="Tên phòng chiếu duy nhất trong rạp"
                            >
                                <Input
                                    prefix={<HomeOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="VD: Phòng chiếu 1, Room A, ..."
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={<span><strong>Giá cơ bản</strong></span>}
                                name="price"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập giá phòng!' },
                                    { type: 'number', min: 0, message: 'Giá phải lớn hơn hoặc bằng 0!' }
                                ]}
                                tooltip="Giá cơ bản cho một ghế (giá thực tế sẽ tính theo loại ghế)"
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Nhập giá"
                                    min={0}
                                    step={10000}
                                    size="large"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    addonAfter="VNĐ"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label={<span><strong>Loại phòng chiếu</strong></span>}
                        name="roomType"
                        rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
                        tooltip="Chọn công nghệ chiếu phim"
                    >
                        <Radio.Group
                            buttonStyle="solid"
                            size="large"
                            style={{ width: '100%' }}
                        >
                            <Row gutter={[8, 8]}>
                                <Col span={12}>
                                    <Radio.Button value="STANDARD_2D" style={{ width: '100%', textAlign: 'center' }}>
                                        🎬 2D Thường
                                    </Radio.Button>
                                </Col>
                                <Col span={12}>
                                    <Radio.Button value="STANDARD_3D" style={{ width: '100%', textAlign: 'center' }}>
                                        🕶️ 3D
                                    </Radio.Button>
                                </Col>
                                <Col span={12}>
                                    <Radio.Button value="IMAX" style={{ width: '100%', textAlign: 'center' }}>
                                        🎥 IMAX
                                    </Radio.Button>
                                </Col>
                                <Col span={12}>
                                    <Radio.Button value="VIP" style={{ width: '100%', textAlign: 'center' }}>
                                        ⭐ VIP
                                    </Radio.Button>
                                </Col>
                            </Row>
                        </Radio.Group>
                    </Form.Item>

                    <Divider orientation="left" style={{ fontSize: '14px', fontWeight: 500 }}>
                        <Space>
                            <SettingOutlined style={{ color: '#52c41a' }} />
                            Cấu hình sơ đồ ghế
                        </Space>
                    </Divider>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={<span><strong>Số hàng ghế</strong></span>}
                                name="rowsCount"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số hàng!' },
                                    { type: 'number', min: 1, max: 26, message: 'Số hàng từ 1-26 (A-Z)!' }
                                ]}
                                tooltip="Số hàng ghế từ A-Z (tối đa 26 hàng)"
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    max={26}
                                    size="large"
                                    placeholder="VD: 10 hàng"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={<span><strong>Số ghế mỗi hàng</strong></span>}
                                name="seatsPerRow"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số ghế mỗi hàng!' },
                                    { type: 'number', min: 1, max: 30, message: 'Số ghế từ 1-30!' }
                                ]}
                                tooltip="Số ghế trên mỗi hàng (tối đa 30 ghế)"
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    max={30}
                                    size="large"
                                    placeholder="VD: 12 ghế"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item dependencies={['rowsCount']}>
                        {({ getFieldValue }) => {
                            const rowsCount = getFieldValue('rowsCount') || 0;
                            return (
                                <Form.Item
                                    label={
                                        <span>
                                            <strong>Hàng VIP</strong>
                                            <span style={{ color: '#8c8c8c', fontSize: '12px', marginLeft: '8px' }}>
                                                (Không bắt buộc)
                                            </span>
                                        </span>
                                    }
                                    name="rowVip"
                                    tooltip="Chọn các hàng ghế VIP có giá cao hơn (thường là hàng giữa)"
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Chọn hàng VIP (VD: E, F, G cho hàng giữa)"
                                        allowClear
                                        size="large"
                                        style={{ width: '100%' }}
                                        maxTagCount="responsive"
                                        getPopupContainer={trigger => trigger.parentElement}
                                        dropdownStyle={{ maxHeight: 240, overflowY: 'auto' }}
                                    >
                                        {Array.from({ length: rowsCount }, (_, i) => {
                                            const rowIndex = i;
                                            const rowLabel = String.fromCharCode(65 + i); // A, B, C...
                                            return (
                                                <Option key={rowIndex} value={rowIndex}>
                                                    <Space>
                                                        <StarOutlined style={{ color: '#faad14' }} />
                                                        Hàng {rowLabel} (vị trí {rowIndex + 1})
                                                    </Space>
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            );
                        }}
                    </Form.Item>

                    <Form.Item dependencies={['rowsCount', 'seatsPerRow', 'rowVip', 'price']}>
                        {({ getFieldValue }) => {
                            const rowsCount = getFieldValue('rowsCount') || 0;
                            const seatsPerRow = getFieldValue('seatsPerRow') || 0;
                            const rowVip = getFieldValue('rowVip') || [];
                            const price = getFieldValue('price') || 0;
                            const totalSeats = rowsCount * seatsPerRow;
                            const vipSeats = rowVip.length * seatsPerRow;
                            const normalSeats = totalSeats - vipSeats;

                            return (
                                <Card
                                    size="small"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        color: 'white'
                                    }}
                                >
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Statistic
                                                title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Tổng số ghế</span>}
                                                value={totalSeats}
                                                valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
                                                suffix="ghế"
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Statistic
                                                title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Ghế VIP</span>}
                                                value={vipSeats}
                                                valueStyle={{ color: '#ffd700', fontSize: '24px', fontWeight: 'bold' }}
                                                suffix="ghế"
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Statistic
                                                title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Ghế thường</span>}
                                                value={normalSeats}
                                                valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
                                                suffix="ghế"
                                            />
                                        </Col>
                                    </Row>
                                    <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '12px 0' }} />
                                    <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                                        💰 Giá cơ bản: <strong style={{ color: 'white' }}>{price.toLocaleString('vi-VN')} VNĐ</strong>/ghế
                                    </Text>
                                </Card>
                            );
                        }}
                    </Form.Item>

                    <Divider orientation="left" style={{ fontSize: '14px', fontWeight: 500 }}>
                        <Space>
                            <ToolOutlined style={{ color: '#722ed1' }} />
                            Trạng thái
                        </Space>
                    </Divider>

                    <Form.Item
                        label={<span><strong>Trạng thái hoạt động</strong></span>}
                        name="isActive"
                        tooltip="Chỉ phòng đang hoạt động mới có thể đặt vé"
                    >
                        <Radio.Group size="large">
                            <Radio.Button value={true} style={{ minWidth: '120px' }}>
                                ✅ Hoạt động
                            </Radio.Button>
                            <Radio.Button value={false} style={{ minWidth: '120px' }}>
                                ⛔ Tạm ngưng
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Divider style={{ margin: '24px 0' }} />

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }} size="middle">
                            <Button
                                size="large"
                                onClick={() => {
                                    setShowAddRoom(false);
                                    setShowEditRoom(false);
                                    form.resetFields();
                                }}
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                icon={showEditRoom ? <EditOutlined /> : <PlusOutlined />}
                                style={{ minWidth: '120px' }}
                            >
                                {showEditRoom ? 'Cập nhật' : 'Tạo phòng'}
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
                            <Tag color="blue">{roomService.mapRoomTypeToFrontend(selectedRoom.roomType) || selectedRoom.type}</Tag>
                        </Space>
                    }
                    open={showSeatManager}
                    onCancel={() => setShowSeatManager(false)}
                    footer={null}
                    width="60%"
                    style={{ top: 20 }}
                    bodyStyle={{ height: '75vh', overflow: 'auto', padding: '16px' }}
                    className="seat-manager-modal"
                >
                    {/* <div style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card size="small">
                                    <Statistic
                                        title="Tổng số ghế"
                                        value={(selectedRoom.rowsCount || 0) * (selectedRoom.seatsPerRow || 0)}
                                        prefix={<UserOutlined />}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small">
                                    <Statistic
                                        title="Hàng ghế"
                                        value={selectedRoom.rowsCount || 0}
                                        prefix={<HomeOutlined />}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small">
                                    <Statistic
                                        title="Ghế mỗi hàng"
                                        value={selectedRoom.seatsPerRow || 0}
                                        prefix={<ToolOutlined />}
                                        valueStyle={{ color: '#faad14' }}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </div> */}

                    <SeatManager
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
