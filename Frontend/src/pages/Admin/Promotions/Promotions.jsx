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
import voucherService from '../../../services/voucherService';
import movieService from '../../../services/movieService';
import cinemaService from '../../../services/cinemaService';
import './Promotions.css';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const Promotions = () => {
    const [vouchers, setVouchers] = useState([]);
    const [movies, setMovies] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('all');
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const [stats, setStats] = useState({
        totalVouchers: 0,
        activeVouchers: 0,
        totalUsage: 0,
        totalSavings: 0
    });

    const voucherTypes = [
        { value: 'PERCENTAGE', label: 'Giảm giá theo phần trăm', icon: <PercentageOutlined /> },
        { value: 'FIXED_AMOUNT', label: 'Giảm giá cố định', icon: <GiftOutlined /> }
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
    }, [activeTab, pagination.current, pagination.pageSize]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Load vouchers - API chỉ có getAllVouchers và getActiveVouchers
            let voucherResponse;
            if (activeTab === 'active') {
                // Sử dụng endpoint active-vouchers
                voucherResponse = await voucherService.getActiveVouchers(
                    pagination.current - 1,
                    pagination.pageSize,
                    'name,asc'
                );
            } else {
                // Lấy tất cả và filter client-side cho các tab khác
                voucherResponse = await voucherService.getAllVouchers(
                    pagination.current - 1,
                    pagination.pageSize,
                    'id,desc'
                );
            }

            // Load movies and cinemas
            const [movieResponse, cinemaResponse] = await Promise.all([
                movieService.getAllMovies(0, 100),
                cinemaService.getAllCinemas(0, 100)
            ]);

            // Extract data from API response
            const voucherData = voucherResponse.data?.data?.content || voucherResponse.data?.content || [];
            const movieData = movieResponse.data?.data?.content || movieResponse.data?.content || [];
            const cinemaData = cinemaResponse.data?.data?.content || cinemaResponse.data?.content || [];

            setVouchers(Array.isArray(voucherData) ? voucherData : []);
            setMovies(Array.isArray(movieData) ? movieData : []);
            setCinemas(Array.isArray(cinemaData) ? cinemaData : []);

            // Update pagination
            const totalElements = voucherResponse.data?.data?.totalElements || voucherResponse.data?.totalElements || 0;
            setPagination(prev => ({
                ...prev,
                total: totalElements
            }));

            // Calculate stats from loaded data
            calculateStats(Array.isArray(voucherData) ? voucherData : []);

        } catch (error) {
            message.error('Lỗi khi tải dữ liệu voucher');
            console.error('Error loading data:', error);
            setVouchers([]);
            setMovies([]);
            setCinemas([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (voucherData) => {
        const totalVouchers = voucherData.length;
        const activeVouchers = voucherData.filter(p => p.isActive === true).length;
        const totalUsage = voucherData.reduce((sum, p) => sum + (p.usedCount || 0), 0);

        // Estimate total savings (simplified calculation)
        const totalSavings = voucherData.reduce((sum, p) => {
            const usedCount = p.usedCount || 0;
            if (p.discountType === 'FIXED_AMOUNT') {
                return sum + (p.discountValue * usedCount);
            } else if (p.discountType === 'PERCENTAGE') {
                return sum + ((p.minPurchaseAmount * p.discountValue / 100) * usedCount);
            }
            return sum;
        }, 0);

        setStats({
            totalVouchers,
            activeVouchers,
            totalUsage,
            totalSavings
        });
    };

    const handleCreateVoucher = () => {
        setEditingVoucher(null);
        form.resetFields();
        form.setFieldsValue({
            discountType: 'PERCENTAGE',
            isActive: true,
            usageLimit: 100,
            discountValue: 10,
            minPurchaseAmount: 50000,
            maxDiscountAmount: 100000
        });
        setModalVisible(true);
    };

    const handleEditVoucher = (voucher) => {
        setEditingVoucher(voucher);
        form.setFieldsValue({
            ...voucher,
            dateRange: [dayjs(voucher.startDate), dayjs(voucher.endDate)],
            timeRange: voucher.timeRange ? [
                dayjs(voucher.timeRange.start, 'HH:mm'),
                dayjs(voucher.timeRange.end, 'HH:mm')
            ] : null
        });
        setModalVisible(true);
    };

    const handleSaveVoucher = async (values) => {
        try {
            setLoading(true);

            const { dateRange, ...otherValues } = values;

            // Format data theo API request body
            const voucherData = {
                code: otherValues.code,
                name: otherValues.name,
                description: otherValues.description,
                discountType: otherValues.discountType,
                discountValue: otherValues.discountValue,
                startDate: dateRange[0].format('YYYY-MM-DDTHH:mm:ss'),
                endDate: dateRange[1].format('YYYY-MM-DDTHH:mm:ss'),
                minPurchaseAmount: otherValues.minPurchaseAmount || 0,
                maxDiscountAmount: otherValues.maxDiscountAmount || 0,
                usageLimit: otherValues.usageLimit || 0,
                isActive: otherValues.isActive !== undefined ? otherValues.isActive : true
            };

            if (editingVoucher) {
                // Update existing voucher
                await voucherService.updateVoucher(editingVoucher.id, voucherData);
                message.success('Cập nhật voucher thành công');
            } else {
                // Create new voucher
                await voucherService.createVoucher(voucherData);
                message.success('Tạo voucher thành công');
            }

            setModalVisible(false);
            form.resetFields();
            loadData(); // Reload data from API

        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu voucher');
            console.error('Error saving voucher:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVoucher = async (voucher) => {
        try {
            await voucherService.deleteVoucher(voucher.id);
            message.success('Xóa voucher thành công');
            loadData(); // Reload data from API
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa voucher');
            console.error('Error deleting voucher:', error);
        }
    };

    const handleToggleStatus = async (voucher) => {
        try {
            await voucherService.toggleVoucherStatus(voucher.id, voucher.isActive);
            const newStatus = !voucher.isActive;
            message.success(`${newStatus ? 'Kích hoạt' : 'Tạm dừng'} voucher thành công`);
            loadData(); // Reload data from API
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra');
            console.error('Error toggling status:', error);
        }
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        message.success('Đã sao chép mã voucher');
    };

    const handleViewVoucher = (voucher) => {
        setSelectedVoucher(voucher);
        setDetailModalVisible(true);
    };
    const handleDetailModalCancel = () => {
        setDetailModalVisible(false);
        setSelectedVoucher(null);
    };

    const getFilteredVouchers = () => {
        if (activeTab === 'all') {
            return vouchers;
        } else if (activeTab === 'active') {
            return vouchers.filter(p => p.isActive === true);
        } else if (activeTab === 'paused') {
            return vouchers.filter(p => p.isActive === false);
        } else if (activeTab === 'scheduled') {
            const now = new Date();
            return vouchers.filter(p => new Date(p.startDate) > now);
        } else if (activeTab === 'expired') {
            const now = new Date();
            return vouchers.filter(p => new Date(p.endDate) < now);
        }
        return vouchers;
    };

    const handleTableChange = (newPagination) => {
        setPagination({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
            total: pagination.total
        });
    };

    const columns = [
        {
            title: 'Tên voucher',
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
            render: (_, record) => {
                // Check if it's percentage type (case-insensitive)
                const isPercentage = record.discountType?.toUpperCase() === 'PERCENTAGE' ||
                    record.discountValue <= 100; // Fallback: assume percentage if value <= 100

                return (
                    <Space direction="vertical" size="small">
                        <Tag color={isPercentage ? 'green' : 'orange'}>
                            {isPercentage ? '%' : 'VND'}
                        </Tag>
                        <Text strong>
                            {isPercentage
                                ? `${record.discountValue}%`
                                : `${Number(record.discountValue || 0).toLocaleString('vi-VN')}đ`
                            }
                        </Text>
                    </Space>
                );
            }
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
            key: 'status',
            render: (_, record) => {
                let status = 'expired';
                const now = new Date();
                const startDate = new Date(record.startDate);
                const endDate = new Date(record.endDate);

                if (startDate > now) {
                    status = 'scheduled';
                } else if (endDate < now) {
                    status = 'expired';
                } else if (record.isActive) {
                    status = 'active';
                } else {
                    status = 'paused';
                }

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
                const usedCount = record.usedCount || 0;
                const usageLimit = record.usageLimit || 0;
                const percentage = usageLimit > 0 ? (usedCount / usageLimit) * 100 : 0;

                return (
                    <Space direction="vertical" size="small" style={{ minWidth: 120 }}>
                        <Text>{usedCount}/{usageLimit}</Text>
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
                            onClick={() => handleViewVoucher(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEditVoucher(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title={record.isActive ? 'Bạn có chắc muốn tạm dừng voucher này?' : 'Bạn có chắc muốn kích hoạt voucher này?'}
                        onConfirm={() => handleToggleStatus(record)}
                        okText={record.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                        cancelText="Hủy"
                    >
                        <Tooltip title={record.isActive ? 'Tạm dừng' : 'Kích hoạt'}>
                            <Button
                                icon={record.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                                size="small"
                                type={record.isActive ? 'default' : 'primary'}
                            />
                        </Tooltip>
                    </Popconfirm>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa voucher này?"
                        onConfirm={() => handleDeleteVoucher(record)}
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
            {/* Main Table */}
            <Card
                title="Danh sách voucher"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateVoucher}
                    >
                        Tạo voucher
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
                    dataSource={getFilteredVouchers()}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Tổng ${total} voucher`
                    }}
                    onChange={handleTableChange}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingVoucher ? "Chỉnh sửa voucher" : "Tạo voucher mới"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveVoucher}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Tên voucher"
                                rules={[{ required: true, message: 'Vui lòng nhập tên voucher' }]}
                            >
                                <Input placeholder="VD: Giảm 20% vé cuối tuần" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="code"
                                label="Mã voucher"
                                rules={[{ required: true, message: 'Vui lòng nhập mã voucher' }]}
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
                        <TextArea rows={3} placeholder="Mô tả chi tiết về voucher..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="discountType"
                                label="Loại voucher"
                                rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                            >
                                <Select>
                                    {voucherTypes.map(type => (
                                        <Option key={type.value} value={type.value}>
                                            {type.icon} {type.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="discountValue"
                                label="Giá trị giảm"
                                rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    formatter={(value) => form.getFieldValue('discountType') === 'PERCENTAGE' ? `${value}%` : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '').replace('%', '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="isActive"
                                label="Trạng thái"
                                valuePropName="checked"
                            >
                                <Switch checkedChildren="Kích hoạt" unCheckedChildren="Tạm dừng" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="minPurchaseAmount"
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
                        <Col span={8}>
                            <Form.Item
                                name="maxDiscountAmount"
                                label="Giảm tối đa"
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
                        <Col span={8}>
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
                        <RangePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY HH:mm"
                            showTime={{ format: 'HH:mm' }}
                        />
                    </Form.Item>

                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setModalVisible(false)}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {editingVoucher ? 'Cập nhật' : 'Tạo voucher'}
                        </Button>
                    </Space>
                </Form>
            </Modal>

            {/* Detail Modal */}
            <Modal
                title="Chi tiết voucher"
                open={detailModalVisible}
                onCancel={handleDetailModalCancel}
                width={600}
                footer={[
                    <Button key="close" onClick={handleDetailModalCancel}>Đóng</Button>,
                    <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => { setDetailModalVisible(false); handleEditVoucher(selectedVoucher); }}>Chỉnh sửa</Button>
                ]}
            >
                {selectedVoucher && (
                    <div>
                        <h2>{selectedVoucher.name}</h2>
                        <p><b>Mã voucher:</b> <Tag color="blue">{selectedVoucher.code}</Tag></p>
                        <p><b>Mô tả:</b> {selectedVoucher.description}</p>
                        <p><b>Loại:</b> {voucherTypes.find(t => t.value === selectedVoucher.type)?.label}</p>
                        <p><b>Giá trị:</b> {selectedVoucher.type === 'percentage' ? `${selectedVoucher.discount}%` : selectedVoucher.type === 'fixed' ? `${selectedVoucher.discount.toLocaleString('vi-VN')}đ` : `Mua ${selectedVoucher.buyQuantity} tặng ${selectedVoucher.getQuantity}`}</p>
                        <p><b>Thời gian áp dụng:</b> {dayjs(selectedVoucher.startDate).format('DD/MM/YYYY')} - {dayjs(selectedVoucher.endDate).format('DD/MM/YYYY')}</p>
                        <p><b>Trạng thái:</b> <Tag color={statusConfig[selectedVoucher.status].color} icon={statusConfig[selectedVoucher.status].icon}>{statusConfig[selectedVoucher.status].label}</Tag></p>
                        <p><b>Lượt sử dụng:</b> {selectedVoucher.usedCount}/{selectedVoucher.usageLimit}</p>
                        <p><b>Ngày tạo:</b> {selectedVoucher.createdDate ? dayjs(selectedVoucher.createdDate).format('DD/MM/YYYY HH:mm') : ''}</p>
                        <p><b>Người tạo:</b> {selectedVoucher.createdBy}</p>
                        <p><b>Áp dụng cho phim:</b> {selectedVoucher.applicableMovies && selectedVoucher.applicableMovies.length > 0 ? selectedVoucher.applicableMovies.map(id => movies.find(m => m.id === id)?.title).join(', ') : 'Tất cả'}</p>
                        <p><b>Áp dụng cho rạp:</b> {selectedVoucher.applicableCinemas && selectedVoucher.applicableCinemas.length > 0 ? selectedVoucher.applicableCinemas.map(id => cinemas.find(c => c.id === id)?.name).join(', ') : 'Tất cả'}</p>
                        <p><b>Ngày trong tuần áp dụng:</b> {selectedVoucher.applicableDays && selectedVoucher.applicableDays.length > 0 ? selectedVoucher.applicableDays.map(d => daysOfWeek.find(day => day.value === d)?.label).join(', ') : 'Tất cả'}</p>
                        <p><b>Khung giờ áp dụng:</b> {selectedVoucher.timeRange ? `${selectedVoucher.timeRange.start} - ${selectedVoucher.timeRange.end}` : 'Cả ngày'}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Promotions;
