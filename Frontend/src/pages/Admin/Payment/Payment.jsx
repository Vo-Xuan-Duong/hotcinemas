import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Tag,
  Statistic,
  Row,
  Col,
  Tabs,
  Alert,
  Space,
  Avatar,
  List,
  Typography,
  Divider,
  Badge,
  Progress,
  Tooltip,
  Popconfirm,
  Empty,
  Timeline,
  Descriptions,
  message
} from 'antd';
import {
  CreditCardOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import styles from './Payment.module.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { Password } = Input;

const Payment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [form] = Form.useForm();
  const [gateways, setGateways] = useState([
    {
      id: 1,
      name: 'VNPay',
      type: 'vnpay',
      status: 'active',
      merchantId: 'VNPAY001',
      secretKey: '********',
      testMode: true,
      transactionCount: 1250,
      successRate: 98.5,
      lastTransaction: '2024-01-25 15:30:00'
    },
    {
      id: 2,
      name: 'MoMo',
      type: 'momo',
      status: 'active',
      merchantId: 'MOMO001',
      secretKey: '********',
      testMode: false,
      transactionCount: 890,
      successRate: 97.2,
      lastTransaction: '2024-01-25 14:20:00'
    },
    {
      id: 3,
      name: 'ZaloPay',
      type: 'zalopay',
      status: 'inactive',
      merchantId: 'ZALOPAY001',
      secretKey: '********',
      testMode: true,
      transactionCount: 450,
      successRate: 95.8,
      lastTransaction: '2024-01-24 16:45:00'
    }
  ]);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      amount: 150000,
      gateway: 'VNPay',
      status: 'success',
      customer: 'Nguyễn Văn A',
      orderId: 'ORD001',
      transactionId: 'TXN001',
      createdAt: '2024-01-25 15:30:00',
      fee: 1500,
      netAmount: 148500
    },
    {
      id: 2,
      amount: 250000,
      gateway: 'MoMo',
      status: 'pending',
      customer: 'Trần Thị B',
      orderId: 'ORD002',
      transactionId: 'TXN002',
      createdAt: '2024-01-25 14:20:00',
      fee: 2500,
      netAmount: 247500
    },
    {
      id: 3,
      amount: 180000,
      gateway: 'ZaloPay',
      status: 'failed',
      customer: 'Lê Văn C',
      orderId: 'ORD003',
      transactionId: 'TXN003',
      createdAt: '2024-01-25 13:15:00',
      fee: 1800,
      netAmount: 178200
    }
  ]);
  const [isTransactionDetailModalVisible, setIsTransactionDetailModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const stats = [
    { title: 'Tổng giao dịch', value: transactions.length, icon: <CreditCardOutlined /> },
    { title: 'Thành công', value: transactions.filter(t => t.status === 'success').length, icon: <CheckCircleOutlined /> },
    { title: 'Tỷ lệ thành công', value: transactions.length > 0 ? Math.round(transactions.filter(t => t.status === 'success').length / transactions.length * 100) + '%' : '0%', icon: <SecurityScanOutlined /> },
    { title: 'Doanh thu', value: transactions.reduce((a, b) => a + b.netAmount, 0).toLocaleString('vi-VN') + 'đ', icon: <DollarOutlined /> }
  ];

  // Gateway CRUD
  const handleCreateGateway = () => {
    setIsEditMode(false);
    setSelectedGateway(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditGateway = (record) => {
    setIsEditMode(true);
    setSelectedGateway(record);
    form.setFieldsValue({
      ...record,
      status: record.status === 'active',
      testMode: record.testMode
    });
    setIsModalVisible(true);
  };

  const handleViewGateway = (record) => {
    setSelectedGateway(record);
    setIsDetailModalVisible(true);
  };

  const handleDeleteGateway = (id) => {
    setGateways(gateways.filter(item => item.id !== id));
    message.success('Đã xóa cổng thanh toán!');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newGateway = {
        ...values,
        status: values.status ? 'active' : 'inactive',
        id: isEditMode && selectedGateway ? selectedGateway.id : Date.now(),
        transactionCount: isEditMode && selectedGateway ? selectedGateway.transactionCount : 0,
        successRate: isEditMode && selectedGateway ? selectedGateway.successRate : 100,
        lastTransaction: isEditMode && selectedGateway ? selectedGateway.lastTransaction : ''
      };
      if (isEditMode && selectedGateway) {
        setGateways(gateways.map(item => item.id === selectedGateway.id ? newGateway : item));
        message.success('Cập nhật cổng thanh toán thành công!');
      } else {
        setGateways([newGateway, ...gateways]);
        message.success('Thêm cổng thanh toán thành công!');
      }
      setIsModalVisible(false);
      setSelectedGateway(null);
      setIsEditMode(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedGateway(null);
    setIsEditMode(false);
    form.resetFields();
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
    setSelectedGateway(null);
  };

  // Transaction detail
  const handleViewTransaction = (record) => {
    setSelectedTransaction(record);
    setIsTransactionDetailModalVisible(true);
  };
  const handleTransactionDetailModalCancel = () => {
    setIsTransactionDetailModalVisible(false);
    setSelectedTransaction(null);
  };

  // Transaction refund (giả lập)
  const handleRefundTransaction = (record) => {
    setTransactions(transactions.map(t => t.id === record.id ? { ...t, status: 'refunded' } : t));
    message.success('Hoàn tiền giao dịch thành công!');
  };

  const gatewayColumns = [
    {
      title: 'Cổng thanh toán',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={40}
            icon={<CreditCardOutlined />}
            className={styles['gateway-icon']}
            style={{
              backgroundColor: record.type === 'vnpay' ? '#1890ff' :
                record.type === 'momo' ? '#eb2f96' : '#52c41a'
            }}
          />
          <div>
            <div style={{ fontWeight: 600, color: '#262626' }}>{text}</div>
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
              Merchant ID: {record.merchantId}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      )
    },
    {
      title: 'Chế độ',
      dataIndex: 'testMode',
      key: 'testMode',
      render: (testMode) => (
        <Tag color={testMode ? 'orange' : 'green'}>
          {testMode ? 'Test Mode' : 'Live Mode'}
        </Tag>
      )
    },
    {
      title: 'Thống kê',
      key: 'stats',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.transactionCount} giao dịch
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.successRate}% thành công
          </div>
        </div>
      )
    },
    {
      title: 'Giao dịch cuối',
      dataIndex: 'lastTransaction',
      key: 'lastTransaction',
      render: (date) => (
        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
          {date}
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => handleViewGateway(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => handleEditGateway(record)} />
          </Tooltip>
          <Tooltip title="Test kết nối">
            <Button
              type="text"
              icon={<SettingOutlined />}
              size="small"
              className={styles['test-connection']}
              onClick={() => message.info('Kết nối thành công!')}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa cổng thanh toán này?"
            onConfirm={() => handleDeleteGateway(record.id)}
          >
            <Tooltip title="Xóa">
              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const transactionColumns = [
    {
      title: 'Giao dịch',
      key: 'transaction',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#262626' }}>
            {record.transactionId}
          </div>
          <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
            {record.customer} - {record.orderId}
          </div>
        </div>
      )
    },
    {
      title: 'Số tiền',
      key: 'amount',
      render: (_, record) => (
        <div>
          <div className={styles['amount-display']}>
            {record.amount.toLocaleString('vi-VN')}đ
          </div>
          <div className={styles['fee-display']}>
            Phí: {record.fee.toLocaleString('vi-VN')}đ
          </div>
          <div className={styles['net-amount']}>
            Thực nhận: {record.netAmount.toLocaleString('vi-VN')}đ
          </div>
        </div>
      )
    },
    {
      title: 'Cổng thanh toán',
      dataIndex: 'gateway',
      key: 'gateway',
      render: (gateway) => (
        <Tag color="blue" icon={<CreditCardOutlined />}>
          {gateway}
        </Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          success: { color: 'green', text: 'Thành công', icon: <CheckCircleOutlined /> },
          pending: { color: 'orange', text: 'Đang xử lý', icon: <ClockCircleOutlined /> },
          failed: { color: 'red', text: 'Thất bại', icon: <ExclamationCircleOutlined /> },
          refunded: { color: 'blue', text: 'Đã hoàn tiền', icon: <DollarOutlined /> }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
          {date}
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => handleViewTransaction(record)} />
          </Tooltip>
          <Tooltip title="Hoàn tiền">
            <Button type="text" icon={<DollarOutlined />} size="small" onClick={() => handleRefundTransaction(record)} disabled={record.status === 'refunded'} />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className={styles['payment-container']}>
      <div className={styles['payment-header']}>
        <Title level={2} className={styles['payment-title']}>
          Quản lý thanh toán
        </Title>
        <Text className={styles['payment-subtitle']}>
          Cấu hình và quản lý các cổng thanh toán
        </Text>
      </div>

      <div className={styles['quick-stats']}>
        {stats.map((stat, index) => (
          <div key={index}>
            <Card className={styles['stat-card']}>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: '#262626' }}
              />
            </Card>
          </div>
        ))}
      </div>

      <Card className={styles['payment-card']}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Cấu hình thanh toán</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateGateway}
            className={styles['payment-button']}
          >
            + Thêm cổng thanh toán
          </Button>
        </div>

        <Tabs
          defaultActiveKey="gateways"
          className={styles['payment-tabs']}
          items={[
            {
              key: 'gateways',
              label: 'Cổng thanh toán',
              children: (
                <Table
                  columns={gatewayColumns}
                  dataSource={gateways}
                  rowKey="id"
                  className={styles['payment-table']}
                  pagination={{
                    total: gateways.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} cổng thanh toán`
                  }}
                />
              )
            },
            {
              key: 'transactions',
              label: 'Giao dịch',
              children: (
                <Table
                  columns={transactionColumns}
                  dataSource={transactions}
                  rowKey="id"
                  className={styles['payment-table']}
                  pagination={{
                    total: transactions.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} giao dịch`
                  }}
                />
              )
            },
            {
              key: 'analytics',
              label: 'Phân tích',
              children: (
                <div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card title="Thống kê theo cổng thanh toán" className={styles['payment-card']}>
                        <List
                          dataSource={gateways.map(g => ({
                            gateway: g.name,
                            count: g.transactionCount,
                            percentage: Math.round(g.transactionCount / gateways.reduce((a, b) => a + b.transactionCount, 0) * 100)
                          }))}
                          renderItem={(item) => (
                            <List.Item>
                              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Text>{item.gateway}</Text>
                                <div>
                                  <Text strong>{item.count}</Text>
                                  <Progress
                                    percent={item.percentage}
                                    size="small"
                                    className={styles['payment-progress']}
                                    style={{ marginTop: 4 }}
                                  />
                                </div>
                              </div>
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="Timeline giao dịch" className={styles['payment-card']}>
                        <Timeline className={styles['transaction-timeline']}>
                          {transactions.map((txn) => (
                            <Timeline.Item key={txn.id} color={txn.status === 'success' ? 'green' : txn.status === 'pending' ? 'orange' : txn.status === 'failed' ? 'red' : 'blue'}>
                              <Text>{txn.status === 'success' ? 'Giao dịch thành công' : txn.status === 'pending' ? 'Giao dịch đang xử lý' : txn.status === 'failed' ? 'Giao dịch thất bại' : 'Đã hoàn tiền'} - {txn.gateway}</Text>
                              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{txn.createdAt}</div>
                          </Timeline.Item>
                          ))}
                        </Timeline>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal
        title={isEditMode ? 'Chỉnh sửa cổng thanh toán' : 'Thêm cổng thanh toán mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        className={styles['payment-modal']}
        okText={isEditMode ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" className={styles['payment-form']}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên cổng thanh toán"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              >
                <Input placeholder="Nhập tên cổng thanh toán" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại cổng thanh toán"
                rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
              >
                <Select placeholder="Chọn loại" className={styles['payment-select']}>
                  <Option value="vnpay">VNPay</Option>
                  <Option value="momo">MoMo</Option>
                  <Option value="zalopay">ZaloPay</Option>
                  <Option value="banking">Internet Banking</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="merchantId"
                label="Merchant ID"
                rules={[{ required: true, message: 'Vui lòng nhập Merchant ID!' }]}
              >
                <Input placeholder="Nhập Merchant ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="secretKey"
                label="Secret Key"
                rules={[{ required: true, message: 'Vui lòng nhập Secret Key!' }]}
              >
                <Password placeholder="Nhập Secret Key" className={styles['payment-password']} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                valuePropName="checked"
              >
                <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="testMode"
                label="Chế độ test"
                valuePropName="checked"
              >
                <Switch checkedChildren="Test Mode" unCheckedChildren="Live Mode" />
              </Form.Item>
            </Col>
          </Row>

          <Alert
            message="Lưu ý bảo mật"
            description="Secret Key và các thông tin nhạy cảm sẽ được mã hóa và bảo vệ an toàn."
            type="info"
            showIcon
            className={styles['payment-alert']}
          />
        </Form>
      </Modal>

      <Modal
        title="Chi tiết cổng thanh toán"
        open={isDetailModalVisible}
        onCancel={handleDetailModalCancel}
        width={500}
        footer={[
          <Button key="close" onClick={handleDetailModalCancel}>Đóng</Button>,
          <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => { setIsDetailModalVisible(false); handleEditGateway(selectedGateway); }}>Chỉnh sửa</Button>
        ]}
        className={styles['payment-modal']}
      >
        {selectedGateway && (
          <div style={{ textAlign: 'center' }}>
            <Avatar
              size={64}
              icon={<CreditCardOutlined />}
              style={{ backgroundColor: selectedGateway.type === 'vnpay' ? '#1890ff' : selectedGateway.type === 'momo' ? '#eb2f96' : '#52c41a', marginBottom: 16 }}
            />
            <Title level={4}>{selectedGateway.name}</Title>
            <Text type="secondary">Merchant ID: {selectedGateway.merchantId}</Text>
            <Divider />
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Loại">
                {selectedGateway.type}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {selectedGateway.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
              </Descriptions.Item>
              <Descriptions.Item label="Chế độ">
                {selectedGateway.testMode ? 'Test Mode' : 'Live Mode'}
              </Descriptions.Item>
              <Descriptions.Item label="Số giao dịch">
                {selectedGateway.transactionCount}
              </Descriptions.Item>
              <Descriptions.Item label="Tỷ lệ thành công">
                {selectedGateway.successRate}%
              </Descriptions.Item>
              <Descriptions.Item label="Giao dịch cuối">
                {selectedGateway.lastTransaction}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      <Modal
        title="Chi tiết giao dịch"
        open={isTransactionDetailModalVisible}
        onCancel={handleTransactionDetailModalCancel}
        width={500}
        footer={[
          <Button key="close" onClick={handleTransactionDetailModalCancel}>Đóng</Button>
        ]}
        className={styles['payment-modal']}
      >
        {selectedTransaction && (
          <div style={{ textAlign: 'center' }}>
            <Title level={4}>{selectedTransaction.transactionId}</Title>
            <Text type="secondary">Khách hàng: {selectedTransaction.customer}</Text>
            <Divider />
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Số tiền">
                {selectedTransaction.amount.toLocaleString('vi-VN')}đ
              </Descriptions.Item>
              <Descriptions.Item label="Cổng thanh toán">
                {selectedTransaction.gateway}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {selectedTransaction.status}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {selectedTransaction.createdAt}
              </Descriptions.Item>
              <Descriptions.Item label="Phí">
                {selectedTransaction.fee.toLocaleString('vi-VN')}đ
              </Descriptions.Item>
              <Descriptions.Item label="Thực nhận">
                {selectedTransaction.netAmount.toLocaleString('vi-VN')}đ
              </Descriptions.Item>
              <Descriptions.Item label="Mã đơn hàng">
                {selectedTransaction.orderId}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payment; 