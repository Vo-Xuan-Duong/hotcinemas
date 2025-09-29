import React, { useState, useEffect } from 'react';
import {
    Card,
    Tabs,
    Form,
    Input,
    InputNumber,
    Switch,
    Button,
    Row,
    Col,
    Select,
    Space,
    message,
    Divider,
    Upload,
    Alert,
    TimePicker,
    Checkbox,
    Typography,
    Collapse,
    Tag
} from 'antd';
import {
    SettingOutlined,
    DollarOutlined,
    BuildOutlined,
    MailOutlined,
    ShoppingOutlined,
    SecurityScanOutlined,
    NotificationOutlined,
    BarChartOutlined,
    VideoCameraOutlined,
    SaveOutlined,
    UploadOutlined,
    ReloadOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './Settings.css';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const Settings = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [settings, setSettings] = useState({});
    const [activeTab, setActiveTab] = useState('pricing');
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/data/settings.json');
            const data = await response.json();
            setSettings(data);

            // Set form values with proper formatting
            form.setFieldsValue({
                ...data,
                pricing: {
                    ...data.pricing,
                    basePrice: data.pricing.basePrice,
                    weekendSurcharge: data.pricing.weekendSurcharge,
                    holidaySurcharge: data.pricing.holidaySurcharge
                },
                cinema: {
                    ...data.cinema,
                    defaultOpenTime: data.cinema.defaultOpenTime ? dayjs(data.cinema.defaultOpenTime, 'HH:mm') : null,
                    defaultCloseTime: data.cinema.defaultCloseTime ? dayjs(data.cinema.defaultCloseTime, 'HH:mm') : null
                }
            });

        } catch (error) {
            message.error('Lỗi khi tải cài đặt hệ thống');
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaveLoading(true);
            const values = await form.validateFields();

            // Format data before saving
            const formattedData = {
                ...values,
                cinema: {
                    ...values.cinema,
                    defaultOpenTime: values.cinema?.defaultOpenTime?.format('HH:mm'),
                    defaultCloseTime: values.cinema?.defaultCloseTime?.format('HH:mm')
                },
                lastUpdated: new Date().toISOString(),
                updatedBy: 'admin'
            };

            setSettings(formattedData);
            setHasChanges(false);
            message.success('Lưu cài đặt thành công');

            // Here you would send the data to your backend API
            console.log('Saved settings:', formattedData);

        } catch (error) {
            message.error('Có lỗi xảy ra khi lưu cài đặt');
            console.error('Error saving settings:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleReset = () => {
        form.setFieldsValue(settings);
        setHasChanges(false);
        message.info('Đã khôi phục về cài đặt ban đầu');
    };

    const handleFormChange = () => {
        setHasChanges(true);
    };

    const pricingSection = (
        <Card title="Cài đặt giá vé" className="settings-card">
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        name={['pricing', 'basePrice']}
                        label="Giá vé cơ bản"
                        rules={[{ required: true, message: 'Vui lòng nhập giá vé cơ bản' }]}
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
                        name={['pricing', 'weekendSurcharge']}
                        label="Phụ thu cuối tuần"
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
                        name={['pricing', 'holidaySurcharge']}
                        label="Phụ thu ngày lễ"
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
            </Row>

            <Divider>Phụ thu theo loại ghế</Divider>

            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item name={['pricing', 'vipSurcharge']} label="Ghế VIP">
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            addonAfter="đ"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name={['pricing', 'premiumSurcharge']} label="Ghế Premium">
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            addonAfter="đ"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name={['pricing', 'coupleSurcharge']} label="Ghế đôi">
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            addonAfter="đ"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider>Chiết khấu đặc biệt</Divider>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item name={['pricing', 'childDiscount']} label="Giảm giá trẻ em">
                        <InputNumber
                            min={0}
                            max={100}
                            style={{ width: '100%' }}
                            addonAfter="%"
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['pricing', 'studentDiscount']} label="Giảm giá học sinh/sinh viên">
                        <InputNumber
                            min={0}
                            max={100}
                            style={{ width: '100%' }}
                            addonAfter="%"
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['pricing', 'seniorDiscount']} label="Giảm giá người cao tuổi">
                        <InputNumber
                            min={0}
                            max={100}
                            style={{ width: '100%' }}
                            addonAfter="%"
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );

    const companySection = (
        <Card title="Thông tin công ty" className="settings-card">
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name={['company', 'name']}
                        label="Tên công ty"
                        rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name={['company', 'slogan']} label="Slogan">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        name={['company', 'email']}
                        label="Email"
                        rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['company', 'phone']} label="Số điện thoại">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['company', 'website']} label="Website">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name={['company', 'address']} label="Địa chỉ">
                <TextArea rows={3} />
            </Form.Item>

            <Divider>Mạng xã hội</Divider>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item name={['company', 'facebook']} label="Facebook">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['company', 'instagram']} label="Instagram">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['company', 'youtube']} label="YouTube">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );

    const bookingSection = (
        <Card title="Cài đặt đặt vé" className="settings-card">
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item name={['booking', 'maxSeatsPerBooking']} label="Số ghế tối đa/lần đặt">
                        <InputNumber min={1} max={20} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['booking', 'holdSeatDuration']} label="Thời gian giữ chỗ (phút)">
                        <InputNumber min={5} max={60} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['booking', 'advanceBookingDays']} label="Đặt vé trước (ngày)">
                        <InputNumber min={1} max={90} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>

            <Divider>Chính sách hủy vé</Divider>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item name={['booking', 'cancellationPolicy', 'enableCancellation']} valuePropName="checked">
                        <Switch checkedChildren="Cho phép hủy" unCheckedChildren="Không cho phép" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['booking', 'cancellationPolicy', 'cancellationDeadlineHours']} label="Hạn hủy (giờ trước chiếu)">
                        <InputNumber min={1} max={24} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['booking', 'cancellationPolicy', 'refundPercentage']} label="% hoàn tiền">
                        <InputNumber min={0} max={100} style={{ width: '100%' }} addonAfter="%" />
                    </Form.Item>
                </Col>
            </Row>

            <Divider>Phương thức thanh toán</Divider>

            <Form.Item name={['booking', 'payment', 'enabledMethods']} label="Phương thức được kích hoạt">
                <Checkbox.Group>
                    <Checkbox value="momo">MoMo</Checkbox>
                    <Checkbox value="vnpay">VNPay</Checkbox>
                    <Checkbox value="banking">Chuyển khoản</Checkbox>
                    <Checkbox value="cash">Tiền mặt</Checkbox>
                </Checkbox.Group>
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name={['booking', 'payment', 'defaultMethod']} label="Phương thức mặc định">
                        <Select>
                            <Option value="momo">MoMo</Option>
                            <Option value="vnpay">VNPay</Option>
                            <Option value="banking">Chuyển khoản</Option>
                            <Option value="cash">Tiền mặt</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name={['booking', 'payment', 'autoRefundEnabled']} valuePropName="checked">
                        <Switch checkedChildren="Tự động hoàn tiền" unCheckedChildren="Hoàn tiền thủ công" />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );

    const systemSection = (
        <Card title="Cài đặt hệ thống" className="settings-card">
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name={['system', 'maintenanceMode']} valuePropName="checked">
                        <Switch
                            checkedChildren="Bảo trì"
                            unCheckedChildren="Hoạt động"
                            style={{ marginRight: 8 }}
                        />
                        <span>Chế độ bảo trì</span>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name={['system', 'enableRegistration']} valuePropName="checked">
                        <Switch
                            checkedChildren="Cho phép"
                            unCheckedChildren="Tắt"
                            style={{ marginRight: 8 }}
                        />
                        <span>Đăng ký tài khoản mới</span>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name={['system', 'maintenanceMessage']} label="Thông báo bảo trì">
                <TextArea rows={3} />
            </Form.Item>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item name={['system', 'enableGuestBooking']} valuePropName="checked">
                        <Switch checkedChildren="Cho phép" unCheckedChildren="Không cho phép" />
                        <span style={{ marginLeft: 8 }}>Đặt vé không cần đăng ký</span>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['system', 'enableReviews']} valuePropName="checked">
                        <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                        <span style={{ marginLeft: 8 }}>Đánh giá phim</span>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['system', 'enableRatings']} valuePropName="checked">
                        <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                        <span style={{ marginLeft: 8 }}>Xếp hạng phim</span>
                    </Form.Item>
                </Col>
            </Row>

            <Divider>Cài đặt định dạng</Divider>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item name={['system', 'timezone']} label="Múi giờ">
                        <Select>
                            <Option value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</Option>
                            <Option value="Asia/Bangkok">Bangkok (UTC+7)</Option>
                            <Option value="Asia/Singapore">Singapore (UTC+8)</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['system', 'dateFormat']} label="Định dạng ngày">
                        <Select>
                            <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                            <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                            <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['system', 'currency']} label="Tiền tệ">
                        <Select>
                            <Option value="VND">VND (Việt Nam Đồng)</Option>
                            <Option value="USD">USD (US Dollar)</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );

    const cinemaSection = (
        <Card title="Cài đặt rạp chiếu" className="settings-card">
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name={['cinema', 'defaultOpenTime']} label="Giờ mở cửa mặc định">
                        <TimePicker format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name={['cinema', 'defaultCloseTime']} label="Giờ đóng cửa mặc định">
                        <TimePicker format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item name={['cinema', 'cleaningTimeBetweenShows']} label="Thời gian dọn dẹp (phút)">
                        <InputNumber min={15} max={60} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={['cinema', 'maxShowsPerDay']} label="Số suất chiếu tối đa/ngày">
                        <InputNumber min={4} max={20} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name={['cinema', 'enableOnlineSeating']} valuePropName="checked">
                        <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                        <span style={{ marginLeft: 8 }}>Chọn chỗ ngồi online</span>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name={['cinema', 'enableFoodOrdering']} valuePropName="checked">
                        <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                        <span style={{ marginLeft: 8 }}>Đặt đồ ăn online</span>
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );

    const tabItems = [
        {
            key: 'pricing',
            label: (
                <span>
                    <DollarOutlined />
                    Giá vé
                </span>
            ),
            children: pricingSection
        },
        {
            key: 'company',
            label: (
                <span>
                    <BuildOutlined />
                    Công ty
                </span>
            ),
            children: companySection
        },
        {
            key: 'booking',
            label: (
                <span>
                    <ShoppingOutlined />
                    Đặt vé
                </span>
            ),
            children: bookingSection
        },
        {
            key: 'system',
            label: (
                <span>
                    <SettingOutlined />
                    Hệ thống
                </span>
            ),
            children: systemSection
        },
        {
            key: 'cinema',
            label: (
                <span>
                    <VideoCameraOutlined />
                    Rạp chiếu
                </span>
            ),
            children: cinemaSection
        }
    ];

    return (
        <div className="settings-page">
            <div className="settings-header">
                <Title level={2}>
                    <SettingOutlined /> Cài đặt hệ thống
                </Title>
                <Space>
                    {hasChanges && (
                        <Alert
                            message="Có thay đổi chưa lưu"
                            type="warning"
                            showIcon
                            style={{ marginRight: 16 }}
                        />
                    )}
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleReset}
                        disabled={!hasChanges}
                    >
                        Khôi phục
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={saveLoading}
                        onClick={handleSave}
                        disabled={!hasChanges}
                    >
                        Lưu cài đặt
                    </Button>
                </Space>
            </div>

            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleFormChange}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    type="card"
                    className="settings-tabs"
                />
            </Form>

            <div className="settings-footer">
                <Text type="secondary">
                    Cập nhật lần cuối: {settings.lastUpdated ? dayjs(settings.lastUpdated).format('DD/MM/YYYY HH:mm') : 'Chưa có'}
                    {settings.updatedBy && ` bởi ${settings.updatedBy}`}
                </Text>
            </div>
        </div>
    );
};

export default Settings;
