import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Row,
    Col,
    Tag,
    Space,
    message,
    Statistic,
    DatePicker,
    InputNumber,
    Switch,
    Tooltip,
    Progress,
    Popconfirm,
    Tabs,
    Alert,
    Checkbox,
    TimePicker,
    Typography
} from 'antd';

const { Text } = Typography;
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CopyOutlined,
    EyeOutlined,
    GiftOutlined,
    PercentageOutlined,
    CalendarOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    StopOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './Promotions.css';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const Promotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [movies, setMovies] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('all');
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);

    const [stats, setStats] = useState({
        totalPromotions: 0,
        activePromotions: 0,
        totalUsage: 0,
        totalSavings: 0
    });

    const promotionTypes = [
        { value: 'percentage', label: 'Giảm theo %', icon: <PercentageOutlined /> },
        { value: 'fixed', label: 'Giảm số tiền cố định', icon: <GiftOutlined /> },
        { value: 'buy_x_get_y', label: 'Mua X tặng Y', icon: <GiftOutlined /> }
    ];

    const statusConfig = {
        active: { label: 'Đang hoạt động', color: 'success', icon: <PlayCircleOutlined /> },
        paused: { label: 'Tạm dừng', color: 'warning', icon: <PauseCircleOutlined /> },
        scheduled: { label: 'Chờ kích hoạt', color: 'processing', icon: <ClockCircleOutlined /> },
        expired: { label: 'Hết hạn', color: 'error', icon: <StopOutlined /> }
    };

    const daysOfWeek = [
        { value: 'monday', label: 'Thứ 2' },
        { value: 'tuesday', label: 'Thứ 3' },
        { value: 'wednesday', label: 'Thứ 4' },
        { value: 'thursday', label: 'Thứ 5' },
        { value: 'friday', label: 'Thứ 6' },
        { value: 'saturday', label: 'Thứ 7' },
        { value: 'sunday', label: 'Chủ nhật' }
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const [promotionRes, movieRes, cinemaRes] = await Promise.all([
                fetch('/data/promotions.json'),
                fetch('/src/data/movies.json'),
                fetch('/src/data/cinemas.json')
            ]);

            const promotionData = await promotionRes.json();
            const movieData = await movieRes.json();
            const cinemaData = await cinemaRes.json();

            setPromotions(promotionData);
            setMovies(movieData);
            setCinemas(cinemaData);

            calculateStats(promotionData);

        } catch (error) {
            message.error('Lỗi khi tải dữ liệu khuyến mãi');
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (promotionData) => {
        const totalPromotions = promotionData.length;
        const activePromotions = promotionData.filter(p => p.status === 'active').length;
        const totalUsage = promotionData.reduce((sum, p) => sum + p.usedCount, 0);

        // Estimate total savings (simplified calculation)
        const totalSavings = promotionData.reduce((sum, p) => {
            if (p.type === 'fixed') {
                return sum + (p.discount * p.usedCount);
            } else if (p.type === 'percentage') {
                return sum + ((p.minAmount * p.discount / 100) * p.usedCount);
            }
            return sum;
        }, 0);

        setStats({
            totalPromotions,
            activePromotions,
            totalUsage,
            totalSavings
        });
    };

    const handleCreatePromotion = () => {
        setEditingPromotion(null);
        form.resetFields();
        form.setFieldsValue({
            type: 'percentage',
            status: 'active',
            usageLimit: 100,
            discount: 10,
            minAmount: 50000
        });
        setModalVisible(true);
    };

    const handleEditPromotion = (promotion) => {
        setEditingPromotion(promotion);
        form.setFieldsValue({
            ...promotion,
            dateRange: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
            timeRange: promotion.timeRange ? [
                dayjs(promotion.timeRange.start, 'HH:mm'),
                dayjs(promotion.timeRange.end, 'HH:mm')
            ] : null
        });
        setModalVisible(true);
    };

    const handleSavePromotion = async (values) => {
        try {
            setLoading(true);

            const { dateRange, timeRange, ...otherValues } = values;

            const promotionData = {
                ...otherValues,
                startDate: dateRange[0].format('YYYY-MM-DD'),
                endDate: dateRange[1].format('YYYY-MM-DD'),
                timeRange: timeRange ? {
                    start: timeRange[0].format('HH:mm'),
                    end: timeRange[1].format('HH:mm')
                } : null,
                createdDate: editingPromotion ? editingPromotion.createdDate : new Date().toISOString(),
                createdBy: 'admin',
                usedCount: editingPromotion ? editingPromotion.usedCount : 0
            };

            if (editingPromotion) {
                // Update existing promotion
                const updatedPromotions = promotions.map(p =>
                    p.id === editingPromotion.id ? { ...promotionData, id: editingPromotion.id } : p
                );
                setPromotions(updatedPromotions);
                calculateStats(updatedPromotions);
                message.success('Cập nhật khuyến mãi thành công');
            } else {
                // Create new promotion
                const newPromotion = {
                    ...promotionData,
                    id: Math.max(...promotions.map(p => p.id)) + 1
                };
                const updatedPromotions = [...promotions, newPromotion];
                setPromotions(updatedPromotions);
                calculateStats(updatedPromotions);
                message.success('Tạo khuyến mãi thành công');
            }

            setModalVisible(false);
            form.resetFields();

        } catch (error) {
            message.error('Có lỗi xảy ra khi lưu khuyến mãi');
            console.error('Error saving promotion:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePromotion = (promotion) => {
        const updatedPromotions = promotions.filter(p => p.id !== promotion.id);
        setPromotions(updatedPromotions);
        calculateStats(updatedPromotions);
        message.success('Xóa khuyến mãi thành công');
    };

    const handleToggleStatus = (promotion) => {
        const newStatus = promotion.status === 'active' ? 'paused' : 'active';
        const updatedPromotions = promotions.map(p =>
            p.id === promotion.id ? { ...p, status: newStatus } : p
        );
        setPromotions(updatedPromotions);
        calculateStats(updatedPromotions);
        message.success(`${newStatus === 'active' ? 'Kích hoạt' : 'Tạm dừng'} khuyến mãi thành công`);
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        message.success('Đã sao chép mã khuyến mãi');
    };

    const handleViewPromotion = (promotion) => {
        setSelectedPromotion(promotion);
        setDetailModalVisible(true);
    };
    const handleDetailModalCancel = () => {
        setDetailModalVisible(false);
        setSelectedPromotion(null);
    };

    const getFilteredPromotions = () => {
        if (activeTab === 'all') return promotions;
        return promotions.filter(p => p.status === activeTab);
    };

    const columns = [
        {
            title: 'Tên khuyến mãi',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space direction="vertical" size="small">
                    <strong>{text}</strong>
                    <Space>
                        <Tag color="blue">{record.code}</Tag>
                        <Button
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => handleCopyCode(record.code)}
                        />
                    </Space>
                </Space>
            )
        },
        {
            title: 'Loại & Giá trị',
            key: 'discount',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Tag color={record.type === 'percentage' ? 'green' : 'orange'}>
                        {promotionTypes.find(t => t.value === record.type)?.label}
                    </Tag>
                    <Text strong>
                        {record.type === 'percentage'
                            ? `${record.discount}%`
                            : record.type === 'fixed'
                                ? `${record.discount.toLocaleString('vi-VN')}đ`
                                : `Mua ${record.buyQuantity} tặng ${record.getQuantity}`
                        }
                    </Text>
                </Space>
            )
        },
        {
            title: 'Thời gian',
            key: 'period',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Text>{dayjs(record.startDate).format('DD/MM/YYYY')}</Text>
                    <Text type="secondary">đến</Text>
                    <Text>{dayjs(record.endDate).format('DD/MM/YYYY')}</Text>
                </Space>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const config = statusConfig[status];
                return (
                    <Tag color={config.color} icon={config.icon}>
                        {config.label}
                    </Tag>
                );
            }
        },
        {
            title: 'Sử dụng',
            key: 'usage',
            render: (_, record) => {
                const percentage = (record.usedCount / record.usageLimit) * 100;
                return (
                    <Space direction="vertical" size="small" style={{ minWidth: 120 }}>
                        <Text>{record.usedCount}/{record.usageLimit}</Text>
                        <Progress
                            percent={percentage}
                            size="small"
                            status={percentage >= 90 ? 'exception' : percentage >= 70 ? 'active' : 'normal'}
                            showInfo={false}
                        />
                    </Space>
                );
            }
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleViewPromotion(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEditPromotion(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title={record.status === 'active' ? 'Bạn có chắc muốn tạm dừng khuyến mãi này?' : 'Bạn có chắc muốn kích hoạt khuyến mãi này?'}
                        onConfirm={() => handleToggleStatus(record)}
                        okText={record.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                        cancelText="Hủy"
                    >
                        <Tooltip title={record.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}>
                            <Button
                                icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                                size="small"
                                type={record.status === 'active' ? 'default' : 'primary'}
                            />
                        </Tooltip>
                    </Popconfirm>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa khuyến mãi này?"
                        onConfirm={() => handleDeletePromotion(record)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Tooltip title="Xóa">
                            <Button
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="promotions-page">
            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng số khuyến mãi"
                            value={stats.totalPromotions}
                            prefix={<GiftOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đang hoạt động"
                            value={stats.activePromotions}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Lượt sử dụng"
                            value={stats.totalUsage}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng tiết kiệm"
                            value={stats.totalSavings}
                            prefix={<PercentageOutlined />}
                            suffix="đ"
                            valueStyle={{ color: '#fa8c16' }}
                            formatter={(value) => value.toLocaleString('vi-VN')}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Table */}
            <Card
                title="Danh sách khuyến mãi"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreatePromotion}
                    >
                        Tạo khuyến mãi
                    </Button>
                }
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    style={{ marginBottom: 16 }}
                    items={[
                        { key: 'all', label: 'Tất cả' },
                        { key: 'active', label: 'Đang hoạt động' },
                        { key: 'paused', label: 'Tạm dừng' },
                        { key: 'scheduled', label: 'Chờ kích hoạt' },
                        { key: 'expired', label: 'Hết hạn' }
                    ]}
                />

                <Table
                    columns={columns}
                    dataSource={getFilteredPromotions()}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Tổng ${total} khuyến mãi`
                    }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingPromotion ? "Chỉnh sửa khuyến mãi" : "Tạo khuyến mãi mới"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSavePromotion}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Tên khuyến mãi"
                                rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi' }]}
                            >
                                <Input placeholder="VD: Giảm 20% vé cuối tuần" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="code"
                                label="Mã khuyến mãi"
                                rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi' }]}
                            >
                                <Input placeholder="VD: WEEKEND20" style={{ textTransform: 'uppercase' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                    >
                        <TextArea rows={3} placeholder="Mô tả chi tiết về khuyến mãi..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="type"
                                label="Loại khuyến mãi"
                                rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                            >
                                <Select>
                                    {promotionTypes.map(type => (
                                        <Option key={type.value} value={type.value}>
                                            {type.icon} {type.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="discount"
                                label="Giá trị giảm"
                                rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    formatter={(value) => form.getFieldValue('type') === 'percentage' ? `${value}%` : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '').replace('%', '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="status"
                                label="Trạng thái"
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                            >
                                <Select>
                                    {Object.entries(statusConfig).map(([key, config]) => (
                                        <Option key={key} value={key}>
                                            {config.icon} {config.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="minAmount"
                                label="Giá trị đơn tối thiểu"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    addonAfter="đ"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="usageLimit"
                                label="Giới hạn sử dụng"
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="dateRange"
                        label="Thời gian áp dụng"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
                    >
                        <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.Item
                        name="applicableDays"
                        label="Ngày trong tuần áp dụng"
                    >
                        <Checkbox.Group options={daysOfWeek} />
                    </Form.Item>

                    <Form.Item
                        name="timeRange"
                        label="Khung giờ áp dụng (tùy chọn)"
                    >
                        <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="applicableMovies"
                                label="Phim áp dụng (để trống = tất cả)"
                            >
                                <Select mode="multiple" placeholder="Chọn phim">
                                    {movies.map(movie => (
                                        <Option key={movie.id} value={movie.id}>
                                            {movie.title}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="applicableCinemas"
                                label="Rạp áp dụng (để trống = tất cả)"
                            >
                                <Select mode="multiple" placeholder="Chọn rạp">
                                    {cinemas.map(cinema => (
                                        <Option key={cinema.id} value={cinema.id}>
                                            {cinema.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setModalVisible(false)}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {editingPromotion ? 'Cập nhật' : 'Tạo khuyến mãi'}
                        </Button>
                    </Space>
                </Form>
            </Modal>

            {/* Detail Modal */}
            <Modal
                title="Chi tiết khuyến mãi"
                open={detailModalVisible}
                onCancel={handleDetailModalCancel}
                width={600}
                footer={[
                    <Button key="close" onClick={handleDetailModalCancel}>Đóng</Button>,
                    <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => { setDetailModalVisible(false); handleEditPromotion(selectedPromotion); }}>Chỉnh sửa</Button>
                ]}
            >
                {selectedPromotion && (
                    <div>
                        <h2>{selectedPromotion.name}</h2>
                        <p><b>Mã khuyến mãi:</b> <Tag color="blue">{selectedPromotion.code}</Tag></p>
                        <p><b>Mô tả:</b> {selectedPromotion.description}</p>
                        <p><b>Loại:</b> {promotionTypes.find(t => t.value === selectedPromotion.type)?.label}</p>
                        <p><b>Giá trị:</b> {selectedPromotion.type === 'percentage' ? `${selectedPromotion.discount}%` : selectedPromotion.type === 'fixed' ? `${selectedPromotion.discount.toLocaleString('vi-VN')}đ` : `Mua ${selectedPromotion.buyQuantity} tặng ${selectedPromotion.getQuantity}`}</p>
                        <p><b>Thời gian áp dụng:</b> {dayjs(selectedPromotion.startDate).format('DD/MM/YYYY')} - {dayjs(selectedPromotion.endDate).format('DD/MM/YYYY')}</p>
                        <p><b>Trạng thái:</b> <Tag color={statusConfig[selectedPromotion.status].color} icon={statusConfig[selectedPromotion.status].icon}>{statusConfig[selectedPromotion.status].label}</Tag></p>
                        <p><b>Lượt sử dụng:</b> {selectedPromotion.usedCount}/{selectedPromotion.usageLimit}</p>
                        <p><b>Ngày tạo:</b> {selectedPromotion.createdDate ? dayjs(selectedPromotion.createdDate).format('DD/MM/YYYY HH:mm') : ''}</p>
                        <p><b>Người tạo:</b> {selectedPromotion.createdBy}</p>
                        <p><b>Áp dụng cho phim:</b> {selectedPromotion.applicableMovies && selectedPromotion.applicableMovies.length > 0 ? selectedPromotion.applicableMovies.map(id => movies.find(m => m.id === id)?.title).join(', ') : 'Tất cả'}</p>
                        <p><b>Áp dụng cho rạp:</b> {selectedPromotion.applicableCinemas && selectedPromotion.applicableCinemas.length > 0 ? selectedPromotion.applicableCinemas.map(id => cinemas.find(c => c.id === id)?.name).join(', ') : 'Tất cả'}</p>
                        <p><b>Ngày trong tuần áp dụng:</b> {selectedPromotion.applicableDays && selectedPromotion.applicableDays.length > 0 ? selectedPromotion.applicableDays.map(d => daysOfWeek.find(day => day.value === d)?.label).join(', ') : 'Tất cả'}</p>
                        <p><b>Khung giờ áp dụng:</b> {selectedPromotion.timeRange ? `${selectedPromotion.timeRange.start} - ${selectedPromotion.timeRange.end}` : 'Cả ngày'}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Promotions;
