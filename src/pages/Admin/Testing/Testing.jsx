import React, { useState, useEffect } from 'react';
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
  Steps,
  message,
  Descriptions,
  Drawer,
  DatePicker,
  InputNumber,
  TimePicker
} from 'antd';
import {
  BugOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  FileTextOutlined,
  DownloadOutlined,
  ReloadOutlined,
  StopOutlined,
  PauseCircleOutlined,
  BarChartOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './Testing.module.css';
// import testingData from '../../../data/testing.json'; // File removed during cleanup

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const Testing = () => {
  const [form] = Form.useForm();
  const [tests, setTests] = useState([]);
  const [testRuns, setTestRuns] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedTestRun, setSelectedTestRun] = useState(null);
  const [runDrawerVisible, setRunDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Load data from JSON file - using mock data since testing.json was removed
  const initialTests = []; // Mock empty data
  const initialTestRuns = []; // Mock empty data

  useEffect(() => {
    setTests(initialTests);
    setTestRuns(initialTestRuns);
  }, []);

  const stats = [
    {
      title: 'Tổng test cases',
      value: tests.length,
      icon: <BugOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Đã pass',
      value: tests.filter(t => t.status === 'passed').length,
      icon: <CheckCircleOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Coverage TB',
      value: `${Math.round(tests.reduce((sum, t) => sum + t.coverage, 0) / tests.length)}%`,
      icon: <FileTextOutlined />,
      color: '#722ed1'
    },
    {
      title: 'Test runs',
      value: testRuns.length,
      icon: <PlayCircleOutlined />,
      color: '#fa8c16'
    }
  ];

  const handleCreateTest = () => {
    setIsEditMode(false);
    setSelectedTest(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTest = (test) => {
    setIsEditMode(true);
    setSelectedTest(test);
    form.setFieldsValue({
      name: test.name,
      type: test.type,
      priority: test.priority,
      status: test.status,
      description: test.description,
      steps: test.steps,
      expectedResult: test.expectedResult,
      environment: test.environment,
      browser: test.browser,
      os: test.os
    });
    setIsModalVisible(true);
  };

  const handleViewTest = (test) => {
    setSelectedTest(test);
    setDetailDrawerVisible(true);
  };

  const handleDeleteTest = (testId) => {
    setTests(tests.filter(test => test.id !== testId));
    message.success('Đã xóa test case thành công!');
  };

  const handleRunTest = (test) => {
    setTests(tests.map(t =>
      t.id === test.id
        ? { ...t, status: 'running', lastRun: dayjs().format('YYYY-MM-DD HH:mm:ss') }
        : t
    ));
    message.info(`Đang chạy test: ${test.name}`);

    // Simulate test running
    setTimeout(() => {
      const newStatus = Math.random() > 0.3 ? 'passed' : 'failed';
      setTests(tests.map(t =>
        t.id === test.id
          ? { ...t, status: newStatus, duration: `${(Math.random() * 20 + 5).toFixed(1)}s` }
          : t
      ));
      message.success(`Test ${test.name} ${newStatus === 'passed' ? 'passed' : 'failed'}!`);
    }, 3000);
  };

  const handleRunAllTests = () => {
    setLoading(true);
    message.info('Đang chạy tất cả tests...');

    setTimeout(() => {
      setTests(tests.map(test => ({
        ...test,
        status: Math.random() > 0.2 ? 'passed' : 'failed',
        duration: `${(Math.random() * 20 + 5).toFixed(1)}s`,
        lastRun: dayjs().format('YYYY-MM-DD HH:mm:ss')
      })));
      setLoading(false);
      message.success('Đã chạy xong tất cả tests!');
    }, 5000);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (isEditMode) {
        setTests(tests.map(test =>
          test.id === selectedTest.id
            ? { ...test, ...values, lastRun: dayjs().format('YYYY-MM-DD HH:mm:ss') }
            : test
        ));
        message.success('Cập nhật test case thành công!');
      } else {
        const newTest = {
          id: Date.now(),
          ...values,
          duration: '0s',
          coverage: 0,
          lastRun: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          status: 'pending'
        };
        setTests([...tests, newTest]);
        message.success('Thêm test case thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
      setIsEditMode(false);
      setSelectedTest(null);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setIsEditMode(false);
    setSelectedTest(null);
  };

  const handleViewTestRun = (testRun) => {
    setSelectedTestRun(testRun);
    setRunDrawerVisible(true);
  };

  const getFilteredTests = () => {
    return tests.filter(test => {
      const searchMatch = test.name.toLowerCase().includes(searchText.toLowerCase()) ||
        test.description.toLowerCase().includes(searchText.toLowerCase());
      const statusMatch = statusFilter === 'all' || test.status === statusFilter;
      const typeMatch = typeFilter === 'all' || test.type === typeFilter;
      const priorityMatch = priorityFilter === 'all' || test.priority === priorityFilter;

      return searchMatch && statusMatch && typeMatch && priorityMatch;
    });
  };

  const columns = [
    {
      title: 'Test Case',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#262626' }}>{text}</div>
          <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{record.description}</div>
        </div>
      )
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeConfig = {
          unit: { color: 'green', text: 'Unit Test', icon: <BugOutlined /> },
          integration: { color: 'blue', text: 'Integration Test', icon: <SettingOutlined /> },
          e2e: { color: 'purple', text: 'E2E Test', icon: <PlayCircleOutlined /> }
        };
        const config = typeConfig[type] || { color: 'default', text: type };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const priorityConfig = {
          high: { color: 'red', text: 'Cao' },
          medium: { color: 'orange', text: 'Trung bình' },
          low: { color: 'blue', text: 'Thấp' }
        };
        const config = priorityConfig[priority] || { color: 'default', text: priority };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          passed: { color: 'green', text: 'Passed', icon: <CheckCircleOutlined /> },
          failed: { color: 'red', text: 'Failed', icon: <ExclamationCircleOutlined /> },
          pending: { color: 'orange', text: 'Pending', icon: <ClockCircleOutlined /> },
          running: { color: 'blue', text: 'Running', icon: <PlayCircleOutlined /> }
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
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
          {duration}
        </div>
      )
    },
    {
      title: 'Coverage',
      key: 'coverage',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#262626' }}>{record.coverage}%</div>
          <Progress
            percent={record.coverage}
            size="small"
            className={styles['testing-progress']}
          />
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Chạy test">
            <Button
              type="text"
              icon={record.status === 'running' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              size="small"
              className={styles['testing-button']}
              onClick={() => handleRunTest(record)}
              loading={record.status === 'running'}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewTest(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditTest(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa test case này?"
            onConfirm={() => handleDeleteTest(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const runColumns = [
    {
      title: 'Test Run',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#262626' }}>{text}</div>
          <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
            {record.createdAt}
          </div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          completed: { color: 'green', text: 'Hoàn thành', icon: <CheckCircleOutlined /> },
          running: { color: 'blue', text: 'Đang chạy', icon: <PlayCircleOutlined /> },
          failed: { color: 'red', text: 'Thất bại', icon: <ExclamationCircleOutlined /> }
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
      title: 'Kết quả',
      key: 'results',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            Pass: {record.passed} | Fail: {record.failed} | Skip: {record.skipped}
          </div>
          <Progress
            percent={Math.round((record.passed / record.totalTests) * 100)}
            size="small"
            className={styles['testing-progress']}
          />
        </div>
      )
    },
    {
      title: 'Coverage',
      dataIndex: 'coverage',
      key: 'coverage',
      render: (coverage) => (
        <div>
          <div style={{ fontWeight: 600, color: '#262626' }}>{coverage}%</div>
          <Progress
            percent={coverage}
            size="small"
            className={styles['testing-progress']}
          />
        </div>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
          {duration}
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewTestRun(record)}
            />
          </Tooltip>
          <Tooltip title="Tải xuống">
            <Button type="text" icon={<DownloadOutlined />} size="small" />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className={styles['testing-container']}>
      <div className={styles['testing-header']}>
        <Title level={2} className={styles['testing-title']}>
          Quản lý testing
        </Title>
        <Text className={styles['testing-subtitle']}>
          Quản lý test cases, test runs và báo cáo chất lượng
        </Text>
      </div>

      <div className={styles['quick-stats']}>
        {stats.map((stat, index) => (
          <div key={index} className={styles['stat-card']}>
            <Statistic
              title={stat.title}
              value={stat.value}
              prefix={stat.icon}
              valueStyle={{ color: stat.color }}
            />
          </div>
        ))}
      </div>

      <Card className={styles['testing-card']}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Test Management</Title>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRunAllTests}
              loading={loading}
              className={styles['testing-button-secondary']}
            >
              Chạy tất cả
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateTest}
              className={styles['testing-button']}
            >
              + Thêm test case
            </Button>
          </Space>
        </div>

        <Tabs
          defaultActiveKey="tests"
          className={styles['testing-tabs']}
          items={[
            {
              key: 'tests',
              label: 'Test Cases',
              children: (
                <div>
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={8}>
                      <Input
                        placeholder="Tìm kiếm test cases..."
                        prefix={<BugOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </Col>
                    <Col xs={24} sm={4}>
                      <Select
                        placeholder="Trạng thái"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: '100%' }}
                      >
                        <Option value="all">Tất cả trạng thái</Option>
                        <Option value="passed">Passed</Option>
                        <Option value="failed">Failed</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="running">Running</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Select
                        placeholder="Loại test"
                        value={typeFilter}
                        onChange={setTypeFilter}
                        style={{ width: '100%' }}
                      >
                        <Option value="all">Tất cả loại</Option>
                        <Option value="unit">Unit Test</Option>
                        <Option value="integration">Integration Test</Option>
                        <Option value="e2e">E2E Test</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Select
                        placeholder="Ưu tiên"
                        value={priorityFilter}
                        onChange={setPriorityFilter}
                        style={{ width: '100%' }}
                      >
                        <Option value="all">Tất cả ưu tiên</Option>
                        <Option value="high">Cao</Option>
                        <Option value="medium">Trung bình</Option>
                        <Option value="low">Thấp</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                          setSearchText('');
                          setStatusFilter('all');
                          setTypeFilter('all');
                          setPriorityFilter('all');
                        }}
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>

                  <Table
                    columns={columns}
                    dataSource={getFilteredTests()}
                    rowKey="id"
                    className={styles['testing-table']}
                    pagination={{
                      total: getFilteredTests().length,
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} test cases`
                    }}
                  />
                </div>
              )
            },
            {
              key: 'runs',
              label: 'Test Runs',
              children: (
                <Table
                  columns={runColumns}
                  dataSource={testRuns}
                  rowKey="id"
                  className={styles['testing-table']}
                  pagination={{
                    total: testRuns.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} test runs`
                  }}
                />
              )
            },
            {
              key: 'coverage',
              label: 'Test Coverage',
              children: (
                <div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card title="Coverage theo module" className={styles['testing-card']}>
                        <List
                          dataSource={[
                            { module: 'Authentication', coverage: 95 },
                            { module: 'Booking', coverage: 87 },
                            { module: 'Payment', coverage: 82 },
                            { module: 'Admin', coverage: 78 }
                          ]}
                          renderItem={(item) => (
                            <List.Item>
                              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Text>{item.module}</Text>
                                <div>
                                  <Text strong>{item.coverage}%</Text>
                                  <Progress
                                    percent={item.coverage}
                                    size="small"
                                    className={styles['testing-progress']}
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
                      <Card title="Test Execution Steps" className={styles['testing-card']}>
                        <Steps
                          direction="vertical"
                          size="small"
                          current={2}
                          items={[
                            { title: 'Setup Environment', description: 'Khởi tạo test environment' },
                            { title: 'Run Unit Tests', description: 'Chạy unit tests' },
                            { title: 'Run Integration Tests', description: 'Chạy integration tests' },
                            { title: 'Run E2E Tests', description: 'Chạy end-to-end tests' },
                            { title: 'Generate Report', description: 'Tạo báo cáo kết quả' }
                          ]}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            },
            {
              key: 'reports',
              label: 'Báo cáo',
              children: (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Empty description="Chưa có báo cáo nào" />
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* Test Detail Drawer */}
      <Drawer
        title="Chi tiết Test Case"
        placement="right"
        width={600}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
      >
        {selectedTest && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên test case" span={1}>
              {selectedTest.name}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={1}>
              {selectedTest.description}
            </Descriptions.Item>
            <Descriptions.Item label="Loại test">
              <Tag color={
                selectedTest.type === 'unit' ? 'green' :
                  selectedTest.type === 'integration' ? 'blue' : 'purple'
              }>
                {selectedTest.type === 'unit' ? 'Unit Test' :
                  selectedTest.type === 'integration' ? 'Integration Test' : 'E2E Test'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ưu tiên">
              <Tag color={
                selectedTest.priority === 'high' ? 'red' :
                  selectedTest.priority === 'medium' ? 'orange' : 'blue'
              }>
                {selectedTest.priority === 'high' ? 'Cao' :
                  selectedTest.priority === 'medium' ? 'Trung bình' : 'Thấp'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Badge
                status={
                  selectedTest.status === 'passed' ? 'success' :
                    selectedTest.status === 'failed' ? 'error' :
                      selectedTest.status === 'running' ? 'processing' : 'default'
                }
                text={
                  selectedTest.status === 'passed' ? 'Passed' :
                    selectedTest.status === 'failed' ? 'Failed' :
                      selectedTest.status === 'running' ? 'Running' : 'Pending'
                }
              />
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian chạy">
              {selectedTest.duration}
            </Descriptions.Item>
            <Descriptions.Item label="Coverage">
              {selectedTest.coverage}%
            </Descriptions.Item>
            <Descriptions.Item label="Lần chạy cuối">
              {selectedTest.lastRun}
            </Descriptions.Item>
            <Descriptions.Item label="Environment">
              {selectedTest.environment}
            </Descriptions.Item>
            <Descriptions.Item label="Browser">
              {selectedTest.browser}
            </Descriptions.Item>
            <Descriptions.Item label="OS">
              {selectedTest.os}
            </Descriptions.Item>
            <Descriptions.Item label="Các bước thực hiện" span={1}>
              <Text style={{ whiteSpace: 'pre-line' }}>{selectedTest.steps}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Kết quả mong đợi" span={1}>
              {selectedTest.expectedResult}
            </Descriptions.Item>
            <Descriptions.Item label="Kết quả thực tế" span={1}>
              {selectedTest.actualResult}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      {/* Test Run Detail Drawer */}
      <Drawer
        title="Chi tiết Test Run"
        placement="right"
        width={600}
        onClose={() => setRunDrawerVisible(false)}
        open={runDrawerVisible}
      >
        {selectedTestRun && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên test run" span={1}>
              {selectedTestRun.name}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Badge
                status={
                  selectedTestRun.status === 'completed' ? 'success' :
                    selectedTestRun.status === 'running' ? 'processing' : 'error'
                }
                text={
                  selectedTestRun.status === 'completed' ? 'Hoàn thành' :
                    selectedTestRun.status === 'running' ? 'Đang chạy' : 'Thất bại'
                }
              />
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tests">
              {selectedTestRun.totalTests}
            </Descriptions.Item>
            <Descriptions.Item label="Passed">
              <Text type="success">{selectedTestRun.passed}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Failed">
              <Text type="danger">{selectedTestRun.failed}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Skipped">
              <Text type="secondary">{selectedTestRun.skipped}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian chạy">
              {selectedTestRun.duration}
            </Descriptions.Item>
            <Descriptions.Item label="Coverage">
              {selectedTestRun.coverage}%
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {selectedTestRun.createdAt}
            </Descriptions.Item>
            <Descriptions.Item label="Environment">
              {selectedTestRun.environment}
            </Descriptions.Item>
            <Descriptions.Item label="Triggered by">
              {selectedTestRun.triggeredBy}
            </Descriptions.Item>
            {selectedTestRun.details && (
              <>
                <Descriptions.Item label="Thời gian bắt đầu">
                  {selectedTestRun.details.startTime}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian kết thúc">
                  {selectedTestRun.details.endTime || 'Đang chạy...'}
                </Descriptions.Item>
                <Descriptions.Item label="Tỷ lệ thành công">
                  {selectedTestRun.details.successRate}%
                </Descriptions.Item>
                <Descriptions.Item label="Tỷ lệ thất bại">
                  {selectedTestRun.details.failureRate}%
                </Descriptions.Item>
                <Descriptions.Item label="Tỷ lệ bỏ qua">
                  {selectedTestRun.details.skipRate}%
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Drawer>

      <Modal
        title={isEditMode ? "Chỉnh sửa test case" : "Thêm test case mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        className={styles['testing-modal']}
      >
        <Form form={form} layout="vertical" className={styles['testing-form']}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên test case"
                rules={[{ required: true, message: 'Vui lòng nhập tên test case!' }]}
              >
                <Input placeholder="Nhập tên test case" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại test"
                rules={[{ required: true, message: 'Vui lòng chọn loại test!' }]}
              >
                <Select placeholder="Chọn loại test" className={styles['testing-select']}>
                  <Option value="unit">Unit Test</Option>
                  <Option value="integration">Integration Test</Option>
                  <Option value="e2e">E2E Test</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="Mức độ ưu tiên"
                rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
              >
                <Select placeholder="Chọn mức độ ưu tiên" className={styles['testing-select']}>
                  <Option value="high">Cao</Option>
                  <Option value="medium">Trung bình</Option>
                  <Option value="low">Thấp</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái" className={styles['testing-select']}>
                  <Option value="pending">Pending</Option>
                  <Option value="running">Running</Option>
                  <Option value="passed">Passed</Option>
                  <Option value="failed">Failed</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="environment"
                label="Environment"
              >
                <Input placeholder="VD: Chrome 120.0.0" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="browser"
                label="Browser"
              >
                <Input placeholder="VD: Chrome" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="os"
                label="Operating System"
              >
                <Input placeholder="VD: Windows 10" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={3} placeholder="Nhập mô tả test case" />
          </Form.Item>

          <Form.Item
            name="steps"
            label="Test Steps"
          >
            <TextArea rows={4} placeholder="Nhập các bước thực hiện test" />
          </Form.Item>

          <Form.Item
            name="expectedResult"
            label="Kết quả mong đợi"
          >
            <TextArea rows={2} placeholder="Nhập kết quả mong đợi" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Testing; 