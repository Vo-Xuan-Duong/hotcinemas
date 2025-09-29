import React, { useState, useEffect, useRef } from 'react';
import {
    Card,
    Button,
    Row,
    Col,
    Space,
    Tag,
    Select,
    InputNumber,
    Modal,
    Form,
    Input,
    message,
    Divider,
    Tooltip,
    Typography,
    Badge
} from 'antd';
import {
    SaveOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    BlockOutlined,
    ToolOutlined,
    StarOutlined,
    UserOutlined,
    HeartOutlined,
    PlusOutlined,
    MinusOutlined
} from '@ant-design/icons';
import './SeatManagerAntd.css';
import seatData from '../../data/seatData.json';

const { Title, Text } = Typography;
const { Option } = Select;

const SeatManagerAntd = ({ selectedScreen, onSave, onClose }) => {
    const [seatLayout, setSeatLayout] = useState({
        rows: [],
        totalSeats: 0,
        vipSeats: [],
        blockedSeats: []
    });

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [editMode, setEditMode] = useState('view'); // view, edit, select
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkForm] = Form.useForm();

    // State cho modal chỉnh sửa ghế đơn lẻ
    const [showSeatEditModal, setShowSeatEditModal] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [seatEditForm] = Form.useForm();

    // Ref cho scroll indicator
    const seatLayoutRef = useRef(null);

    useEffect(() => {
        if (selectedScreen) {
            generateSeatLayout(selectedScreen);
        }
    }, [selectedScreen]);

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

    const generateSeatLayout = (screen) => {
        // Sử dụng dữ liệu mẫu từ seatData.json
        const seats = seatData.seats || [];

        // Hiển thị tất cả ghế nhưng đặt status thành 'available' cho quản lý bố cục
        const layoutSeats = seats.map(seat => ({
            ...seat,
            // Trong chế độ quản lý bố cục, tất cả ghế đều available
            status: 'available'
        }));

        // Nhóm ghế theo hàng
        const groupedByRow = layoutSeats.reduce((acc, seat) => {
            if (!acc[seat.row]) {
                acc[seat.row] = [];
            }
            acc[seat.row].push(seat);
            return acc;
        }, {});

        // Tạo rows array cho component
        const rows = Object.keys(groupedByRow)
            .sort() // Sắp xếp theo thứ tự A, B, C...
            .map(rowLabel => {
                const rowSeats = groupedByRow[rowLabel].sort((a, b) => a.number - b.number);
                const hasVipSeats = rowSeats.some(seat => seat.type === 'vip');

                return {
                    label: rowLabel,
                    seats: rowSeats,
                    isVip: hasVipSeats
                };
            });

        // Tính toán thống kê cho tất cả ghế
        const totalSeats = layoutSeats.length;
        const vipRows = rows.filter(row => row.isVip).map(row => row.label);

        setSeatLayout({
            rows: rows,
            totalSeats: totalSeats,
            vipSeats: vipRows,
            blockedSeats: []
        });
    };

    const getSeatColor = (seat) => {
        if (selectedSeats.includes(seat.id)) return '#1890ff';

        // Ưu tiên hiển thị trạng thái trước, sau đó mới đến loại ghế
        if (seat.status === 'blocked') {
            return '#8c8c8c'; // Màu xám cho ghế bị khóa
        }

        if (seat.status === 'booked') {
            return '#ff4d4f'; // Màu đỏ cho ghế đã đặt
        }

        // Trong chế độ quản lý bố cục, màu sắc dựa vào loại ghế khi available
        switch (seat.type) {
            case 'vip':
                return '#faad14'; // Màu vàng cho VIP
            case 'couple':
                return '#eb2f96'; // Màu hồng cho ghế đôi
            case 'normal':
            default:
                return '#52c41a'; // Màu xanh cho ghế thường
        }
    };

    const getSeatIcon = (seat) => {
        // Ưu tiên hiển thị icon trạng thái trước
        if (seat.status === 'blocked') {
            return <BlockOutlined />; // Icon khóa cho ghế bị khóa
        }

        if (seat.status === 'booked') {
            return <UserOutlined />; // Icon user cho ghế đã đặt
        }

        // Trong chế độ quản lý bố cục, icon dựa vào loại ghế khi available
        switch (seat.type) {
            case 'vip':
                return <StarOutlined />;
            case 'couple':
                return <HeartOutlined />;
            case 'normal':
            default:
                return <UserOutlined />;
        }
    };

    const handleSeatClick = (seat) => {
        if (editMode === 'select') {
            const newSelectedSeats = selectedSeats.includes(seat.id)
                ? selectedSeats.filter(id => id !== seat.id)
                : [...selectedSeats, seat.id];
            setSelectedSeats(newSelectedSeats);
        } else if (editMode === 'edit') {
            toggleSeatStatus(seat);
        } else {
            // Mở modal chỉnh sửa ghế
            setSelectedSeat(seat);
            setShowSeatEditModal(true);
            seatEditForm.setFieldsValue({
                row: seat.row,
                number: seat.number,
                type: seat.type,
                price: seat.price,
                status: seat.status
            });
        }
    };

    const toggleSeatStatus = (seat) => {
        // Trong chế độ quản lý bố cục, chuyển đổi loại ghế thay vì trạng thái
        const typeCycle = {
            'normal': 'vip',
            'vip': 'couple',
            'couple': 'normal'
        };

        const newRows = seatLayout.rows.map(row => ({
            ...row,
            seats: row.seats.map(s =>
                s.id === seat.id
                    ? { ...s, type: typeCycle[s.type] || 'normal' }
                    : s
            )
        }));

        setSeatLayout({ ...seatLayout, rows: newRows });
    };

    const handleBulkEdit = (values) => {
        const newRows = seatLayout.rows.map(row => ({
            ...row,
            seats: row.seats.map(seat =>
                selectedSeats.includes(seat.id)
                    ? { ...seat, ...values }
                    : seat
            )
        }));

        setSeatLayout({ ...seatLayout, rows: newRows });
        setSelectedSeats([]);
        setShowBulkModal(false);
        bulkForm.resetFields();
        message.success(`Đã cập nhật ${selectedSeats.length} ghế`);
    };

    const handleSeatEdit = (values) => {
        const newRows = seatLayout.rows.map(row => ({
            ...row,
            seats: row.seats.map(seat =>
                seat.id === selectedSeat.id
                    ? { ...seat, ...values }
                    : seat
            )
        }));

        setSeatLayout({ ...seatLayout, rows: newRows });
        setShowSeatEditModal(false);
        setSelectedSeat(null);
        seatEditForm.resetFields();
        message.success(`Đã cập nhật ghế ${selectedSeat.row}${selectedSeat.number}`);
    };

    const handleAddSeat = (rowLabel) => {
        const targetRow = seatLayout.rows.find(row => row.label === rowLabel);
        if (!targetRow) return;

        // Tìm số ghế lớn nhất trong hàng
        const maxSeatNumber = Math.max(...targetRow.seats.map(seat => seat.number));
        const newSeatNumber = maxSeatNumber + 1;
        const newSeatId = `${rowLabel}${newSeatNumber}`;

        // Tạo ghế mới
        const newSeat = {
            id: newSeatId,
            row: rowLabel,
            number: newSeatNumber,
            type: 'normal',
            status: 'available',
            price: 70000
        };

        // Cập nhật layout
        const newRows = seatLayout.rows.map(row =>
            row.label === rowLabel
                ? { ...row, seats: [...row.seats, newSeat] }
                : row
        );

        setSeatLayout({ ...seatLayout, rows: newRows });
        message.success(`Đã thêm ghế ${newSeatId}`);
    };

    const handleRemoveSeat = (rowLabel) => {
        const targetRow = seatLayout.rows.find(row => row.label === rowLabel);
        if (!targetRow || targetRow.seats.length <= 1) {
            message.warning('Không thể xóa ghế. Mỗi hàng phải có ít nhất 1 ghế.');
            return;
        }

        // Xóa ghế cuối cùng trong hàng
        const newRows = seatLayout.rows.map(row =>
            row.label === rowLabel
                ? { ...row, seats: row.seats.slice(0, -1) }
                : row
        );

        setSeatLayout({ ...seatLayout, rows: newRows });
        message.success(`Đã xóa ghế cuối hàng ${rowLabel}`);
    };

    const handleAddRow = () => {
        // Tìm label hàng tiếp theo (A, B, C, ... Z)
        const existingLabels = seatLayout.rows.map(row => row.label).sort();
        let nextLabel = 'A';

        for (let i = 0; i < existingLabels.length; i++) {
            const currentLabel = String.fromCharCode(65 + i); // A=65, B=66, ...
            if (!existingLabels.includes(currentLabel)) {
                nextLabel = currentLabel;
                break;
            }
            if (i === existingLabels.length - 1) {
                nextLabel = String.fromCharCode(existingLabels[i].charCodeAt(0) + 1);
            }
        }

        // Tạo hàng mới với 10 ghế mặc định
        const newRow = {
            label: nextLabel,
            seats: Array.from({ length: 10 }, (_, index) => ({
                id: `${nextLabel}${index + 1}`,
                row: nextLabel,
                number: index + 1,
                type: 'normal',
                status: 'available',
                price: 70000
            })),
            isVip: false
        };

        // Thêm hàng mới vào layout (sắp xếp theo thứ tự alphabet)
        const newRows = [...seatLayout.rows, newRow].sort((a, b) => a.label.localeCompare(b.label));

        setSeatLayout({ ...seatLayout, rows: newRows });
        message.success(`Đã thêm hàng ${nextLabel} với 10 ghế`);
    };

    const handleRemoveRow = (rowLabel) => {
        if (seatLayout.rows.length <= 1) {
            message.warning('Không thể xóa hàng. Phòng chiếu phải có ít nhất 1 hàng ghế.');
            return;
        }

        const newRows = seatLayout.rows.filter(row => row.label !== rowLabel);
        setSeatLayout({ ...seatLayout, rows: newRows });
        message.success(`Đã xóa hàng ${rowLabel}`);
    };

    const resetLayout = () => {
        generateSeatLayout(selectedScreen);
        setSelectedSeats([]);
        message.success('Đã khôi phục bố cục ban đầu');
    };

    const saveLayout = () => {
        const layoutData = {
            rows: seatLayout.rows.length,
            seatsPerRow: seatLayout.rows[0]?.seats.length || 0,
            vipRows: seatLayout.vipSeats,
            seats: seatLayout.rows.flatMap(row => row.seats)
        };

        onSave(layoutData);
    };

    const getSeatStats = () => {
        const allSeats = seatLayout.rows.flatMap(row => row.seats);
        return {
            total: allSeats.length,
            vip: allSeats.filter(s => s.type === 'vip').length,
            couple: allSeats.filter(s => s.type === 'couple').length,
            normal: allSeats.filter(s => s.type === 'normal').length,
            // Thống kê theo trạng thái
            available: allSeats.filter(s => s.status === 'available').length,
            booked: allSeats.filter(s => s.status === 'booked').length,
            blocked: allSeats.filter(s => s.status === 'blocked').length
        };
    };

    const stats = getSeatStats();

    return (
        <div className="seat-manager-antd">
            {/* Control Panel */}
            <Card style={{ marginBottom: '16px' }}>
                <Row gutter={16} align="middle">
                    <Col span={8}>
                        <Space>
                            <Text strong>Chế độ:</Text>
                            <Select
                                value={editMode}
                                onChange={setEditMode}
                                style={{ width: 120 }}
                            >
                                <Option value="view">
                                    <EyeOutlined /> Xem
                                </Option>
                                <Option value="edit">
                                    <EditOutlined /> Chỉnh sửa
                                </Option>
                                <Option value="select">
                                    <UserOutlined /> Chọn nhiều
                                </Option>
                            </Select>
                        </Space>
                    </Col>
                    <Col span={8}>
                        {selectedSeats.length > 0 && (
                            <Space>
                                <Badge count={selectedSeats.length}>
                                    <Button onClick={() => setShowBulkModal(true)}>
                                        Chỉnh sửa hàng loạt
                                    </Button>
                                </Badge>
                                <Button onClick={() => setSelectedSeats([])}>
                                    Bỏ chọn
                                </Button>
                            </Space>
                        )}
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                        <Space>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={resetLayout}
                            >
                                Khôi phục
                            </Button>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={saveLayout}
                            >
                                Lưu bố cục
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>



            {/* Usage Guide */}
            <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
                <Space direction="vertical" size={4}>
                    <Text strong style={{ color: '#389e0d' }}>💡 Hướng dẫn sử dụng:</Text>
                    <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                        • <strong>Chế độ Xem:</strong> Nhấn vào ghế để mở modal chỉnh sửa chi tiết
                    </Text>
                    <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                        • <strong>Chế độ Chỉnh sửa:</strong> Nhấn vào ghế để thay đổi loại ghế nhanh
                    </Text>
                    <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                        • <strong>Chế độ Chọn nhiều:</strong> Chọn nhiều ghế và chỉnh sửa hàng loạt
                    </Text>
                    <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                        • <strong>Quản lý hàng:</strong> Thêm hàng mới hoặc xóa hàng bằng nút (-) bên cạnh tên hàng
                    </Text>
                    <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                        • <strong>Quản lý ghế:</strong> Thêm (+) hoặc xóa (-) ghế ở cuối mỗi hàng
                    </Text>
                </Space>
            </Card>

            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: '16px' }}>
                <Col span={6}>
                    <Card size="small">
                        <div className="stat-item">
                            <Text type="secondary">Tổng ghế</Text>
                            <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                                {stats.total}
                            </Text>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div className="stat-item">
                            <Text type="secondary">Ghế thường</Text>
                            <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                                {stats.normal}
                            </Text>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div className="stat-item">
                            <Text type="secondary">Ghế VIP</Text>
                            <Text strong style={{ fontSize: '18px', color: '#faad14' }}>
                                {stats.vip}
                            </Text>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div className="stat-item">
                            <Text type="secondary">Ghế đôi</Text>
                            <Text strong style={{ fontSize: '18px', color: '#eb2f96' }}>
                                {stats.couple}
                            </Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Status Statistics */}
            <Row gutter={16} style={{ marginBottom: '16px' }}>
                <Col span={6}>
                    <Card size="small">
                        <div className="stat-item">
                            <Text type="secondary">Có thể đặt</Text>
                            <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                                {stats.available}
                            </Text>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div className="stat-item">
                            <Text type="secondary">Đã đặt</Text>
                            <Text strong style={{ fontSize: '18px', color: '#ff4d4f' }}>
                                {stats.booked}
                            </Text>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div className="stat-item">
                            <Text type="secondary">Bị khóa</Text>
                            <Text strong style={{ fontSize: '18px', color: '#8c8c8c' }}>
                                {stats.blocked}
                            </Text>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div className="stat-item">
                            <Text type="secondary">Tỷ lệ lấp đầy</Text>
                            <Text strong style={{ fontSize: '18px', color: '#722ed1' }}>
                                {stats.total > 0 ? Math.round((stats.booked / stats.total) * 100) : 0}%
                            </Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Legend - Chú thích màu sắc và trạng thái */}
            <Card size="small" style={{ marginBottom: '16px' }} title="Chú thích">
                <Row gutter={[16, 8]}>
                    <Col span={12}>
                        <Text strong style={{ marginBottom: '8px', display: 'block' }}>Loại ghế:</Text>
                        <Space direction="vertical" size={4}>
                            <Space align="center">
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#52c41a',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <UserOutlined style={{ fontSize: '12px' }} />
                                </div>
                                <Text>Ghế thường</Text>
                            </Space>
                            <Space align="center">
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#faad14',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <StarOutlined style={{ fontSize: '12px' }} />
                                </div>
                                <Text>Ghế VIP</Text>
                            </Space>
                            <Space align="center">
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#eb2f96',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <HeartOutlined style={{ fontSize: '12px' }} />
                                </div>
                                <Text>Ghế đôi</Text>
                            </Space>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <Text strong style={{ marginBottom: '8px', display: 'block' }}>Trạng thái:</Text>
                        <Space direction="vertical" size={4}>
                            <Space align="center">
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#52c41a',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <UserOutlined style={{ fontSize: '12px' }} />
                                </div>
                                <Text>Có thể đặt</Text>
                            </Space>
                            <Space align="center">
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#ff4d4f',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <UserOutlined style={{ fontSize: '12px' }} />
                                </div>
                                <Text>Đã đặt</Text>
                            </Space>
                            <Space align="center">
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#8c8c8c',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <BlockOutlined style={{ fontSize: '12px' }} />
                                </div>
                                <Text>Bị khóa</Text>
                            </Space>
                            <Space align="center">
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#1890ff',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <UserOutlined style={{ fontSize: '12px' }} />
                                </div>
                                <Text>Đang chọn</Text>
                            </Space>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Screen */}
            <div className="screen-indicator">
                <div className="screen">MÀN HÌNH</div>
            </div>

            {/* Seat Layout */}
            <div className="seat-layout" ref={seatLayoutRef}>
                {seatLayout.rows.map((row, rowIndex) => (
                    <div key={row.label} className="seat-row">
                        <div className="row-label">
                            <Space align="center">
                                {row.label}
                                {row.isVip && <StarOutlined style={{ color: '#faad14' }} />}
                                <Tooltip title={`Xóa hàng ${row.label}`}>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<MinusOutlined />}
                                        className="remove-row-btn"
                                        onClick={() => handleRemoveRow(row.label)}
                                        disabled={seatLayout.rows.length <= 1}
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                            color: seatLayout.rows.length <= 1 ? '#d9d9d9' : '#ff7875',
                                            padding: 0,
                                            marginLeft: '4px'
                                        }}
                                    />
                                </Tooltip>
                            </Space>
                        </div>
                        <div className="seats">
                            {row.seats.map((seat, seatIndex) => (
                                <Tooltip
                                    key={seat.id}
                                    title={
                                        <div>
                                            <div><strong>Ghế {seat.id}</strong></div>
                                            <div>Loại: {seat.type === 'normal' ? 'Thường' : seat.type === 'vip' ? 'VIP' : 'Đôi'}</div>
                                            <div>Giá: {seat.price?.toLocaleString() || '70,000'} VNĐ</div>
                                            <div>Trạng thái: {
                                                seat.status === 'available' ? 'Có thể đặt' :
                                                    seat.status === 'booked' ? 'Đã đặt' :
                                                        seat.status === 'blocked' ? 'Bị khóa' : 'Không xác định'
                                            }</div>
                                        </div>
                                    }
                                >
                                    <div
                                        className={`seat ${editMode !== 'view' ? 'clickable' : ''} ${selectedSeats.includes(seat.id) ? 'selected' : ''
                                            } ${seat.type === 'couple' ? 'seat-couple' : ''} ${seat.status === 'blocked' ? 'blocked' : ''}`}
                                        style={{
                                            backgroundColor: getSeatColor(seat),
                                            color: 'white'
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                    >
                                        <div className="seat-content">
                                            {getSeatIcon(seat)}
                                            <span className="seat-number">{seat.number}</span>
                                        </div>
                                    </div>
                                </Tooltip>
                            ))}

                            {/* Add Seat Button */}
                            <Tooltip title={`Thêm ghế mới vào hàng ${row.label}`}>
                                <Button
                                    type="dashed"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    className="add-seat-btn"
                                    onClick={() => handleAddSeat(row.label)}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderColor: '#d9d9d9',
                                        color: '#8c8c8c',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: '8px'
                                    }}
                                />
                            </Tooltip>

                            {/* Remove Seat Button */}
                            <Tooltip title={`Xóa ghế cuối hàng ${row.label}`}>
                                <Button
                                    type="dashed"
                                    size="small"
                                    icon={<MinusOutlined />}
                                    className="remove-seat-btn"
                                    onClick={() => handleRemoveSeat(row.label)}
                                    disabled={row.seats.length <= 1}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderColor: row.seats.length <= 1 ? '#d9d9d9' : '#ff7875',
                                        color: row.seats.length <= 1 ? '#d9d9d9' : '#ff7875',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: '4px'
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                ))}

                {/* Add Row Button at the bottom */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px dashed #d9d9d9'
                }}>
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={handleAddRow}
                        size="large"
                        style={{
                            borderColor: '#52c41a',
                            color: '#52c41a',
                            backgroundColor: '#f6ffed',
                            minWidth: '200px',
                            height: '48px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Thêm hàng mới
                    </Button>
                </div>
            </div>

            {/* Bulk Edit Modal */}
            <Modal
                title="Chỉnh sửa ghế hàng loạt"
                open={showBulkModal}
                onCancel={() => setShowBulkModal(false)}
                footer={null}
            >
                <Form
                    form={bulkForm}
                    layout="vertical"
                    onFinish={handleBulkEdit}
                >
                    <Text>Đã chọn: <strong>{selectedSeats.length}</strong> ghế</Text>

                    <Divider />

                    <Form.Item
                        label="Loại ghế"
                        name="type"
                        initialValue="normal"
                    >
                        <Select>
                            <Option value="normal">Ghế thường</Option>
                            <Option value="vip">Ghế VIP</Option>
                            <Option value="couple">Ghế đôi</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Giá (VNĐ)"
                        name="price"
                        initialValue={70000}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            step={10000}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button onClick={() => setShowBulkModal(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Áp dụng
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Single Seat Edit Modal */}
            <Modal
                title={`Chỉnh sửa ghế ${selectedSeat?.row}${selectedSeat?.number}`}
                open={showSeatEditModal}
                onCancel={() => {
                    setShowSeatEditModal(false);
                    setSelectedSeat(null);
                    seatEditForm.resetFields();
                }}
                footer={null}
                width={500}
            >
                <Form
                    form={seatEditForm}
                    layout="vertical"
                    onFinish={handleSeatEdit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Hàng"
                                name="row"
                                rules={[{ required: true, message: 'Vui lòng nhập hàng ghế' }]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số ghế"
                                name="number"
                                rules={[{ required: true, message: 'Vui lòng nhập số ghế' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    max={50}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Loại ghế"
                        name="type"
                        rules={[{ required: true, message: 'Vui lòng chọn loại ghế' }]}
                    >
                        <Select>
                            <Option value="normal">
                                <Space>
                                    <UserOutlined style={{ color: '#52c41a' }} />
                                    Ghế thường
                                </Space>
                            </Option>
                            <Option value="vip">
                                <Space>
                                    <StarOutlined style={{ color: '#faad14' }} />
                                    Ghế VIP
                                </Space>
                            </Option>
                            <Option value="couple">
                                <Space>
                                    <HeartOutlined style={{ color: '#eb2f96' }} />
                                    Ghế đôi
                                </Space>
                            </Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Giá (VNĐ)"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá ghế' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            step={10000}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select>
                            <Option value="available">Có thể đặt</Option>
                            <Option value="booked">Đã đặt</Option>
                            <Option value="blocked">Bị khóa</Option>
                        </Select>
                    </Form.Item>

                    <Divider />

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setShowSeatEditModal(false);
                                setSelectedSeat(null);
                                seatEditForm.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Lưu thay đổi
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SeatManagerAntd;
