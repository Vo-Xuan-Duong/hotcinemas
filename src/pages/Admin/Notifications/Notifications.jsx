import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
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
  Spin,
  message
} from 'antd';
import {
  BellOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SendOutlined,
  SettingOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import styles from './Notifications.module.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Notifications = () => {
  const [notificationList, setNotificationList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [templateList, setTemplateList] = useState([]);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [templateModalType, setTemplateModalType] = useState('create');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateForm] = Form.useForm();

  useEffect(() => {
    fetch('/data/notifications.json')
      .then(res => res.json())
      .then(data => {
        setNotificationList(data);
        setLoading(false);
      })
      .catch(() => {
        setNotificationList([]);
        setLoading(false);
      });
  }, []);

  const handleCreateNotification = () => {
    setModalType('create');
    setSelectedNotification(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then(values => {
        if (modalType === 'create') {
          // Tạo mới
          const newNotification = {
            ...values,
            id: Date.now(),
            schedule: values.schedule ? values.schedule.toISOString() : new Date().toISOString(),
            createdAt: new Date().toLocaleString(),
            sentTo: 0,
            opened: 0,
            status: 'Chưa gửi'
          };
          setNotificationList([newNotification, ...notificationList]);
          message.success('Tạo thông báo thành công!');
        } else if (modalType === 'edit' && selectedNotification) {
          // Sửa
          const updatedList = notificationList.map(item =>
            item.id === selectedNotification.id
              ? {
                ...item,
                ...values,
                schedule: values.schedule && values.schedule.toISOString ? values.schedule.toISOString() : item.schedule
              }
              : item
          );
          setNotificationList(updatedList);
          message.success('Cập nhật thông báo thành công!');
        }
        setIsModalVisible(false);
        setSelectedNotification(null);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedNotification(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Loại thông báo',
      dataIndex: 'type',
      key: 'type',
      render: text => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Mức độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: text => <Tag color={text === 'Khẩn cấp' ? 'red' : text === 'Quan trọng' ? 'orange' : 'green'}>{text}</Tag>,
    },
    {
      title: 'Thời gian gửi',
      dataIndex: 'schedule',
      key: 'schedule',
      render: text => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => handleViewNotification(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEditNotification(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thông báo này?"
            onConfirm={() => handleDeleteNotification(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleViewNotification = (record) => {
    setSelectedNotification(record);
    setModalType('view');
    form.setFieldsValue({
      ...record,
      schedule: record.schedule ? dayjs(record.schedule) : null
    });
    setIsModalVisible(true);
  };

  const handleEditNotification = (record) => {
    setSelectedNotification(record);
    setModalType('edit');
    form.setFieldsValue({
      ...record,
      schedule: record.schedule ? dayjs(record.schedule) : null
    });
    setIsModalVisible(true);
  };

  const handleDeleteNotification = (id) => {
    setNotificationList(notificationList.filter(item => item.id !== id));
    message.success('Xóa thông báo thành công!');
  };

  // Template CRUD
  const handleCreateTemplate = () => {
    setTemplateModalType('create');
    setSelectedTemplate(null);
    templateForm.resetFields();
    setIsTemplateModalVisible(true);
  };

  const handleEditTemplate = (record) => {
    setSelectedTemplate(record);
    setTemplateModalType('edit');
    templateForm.setFieldsValue(record);
    setIsTemplateModalVisible(true);
  };

  const handleDeleteTemplate = (id) => {
    setTemplateList(templateList.filter(item => item.id !== id));
    message.success('Xóa template thành công!');
  };

  const handleTemplateModalOk = () => {
    templateForm.validateFields().then(values => {
      if (templateModalType === 'create') {
        const newTemplate = {
          ...values,
          id: Date.now()
        };
        setTemplateList([newTemplate, ...templateList]);
        message.success('Tạo template thành công!');
      } else if (templateModalType === 'edit' && selectedTemplate) {
        const updatedList = templateList.map(item =>
          item.id === selectedTemplate.id ? { ...item, ...values } : item
        );
        setTemplateList(updatedList);
        message.success('Cập nhật template thành công!');
      }
      setIsTemplateModalVisible(false);
      setSelectedTemplate(null);
      templateForm.resetFields();
    });
  };

  const handleTemplateModalCancel = () => {
    setIsTemplateModalVisible(false);
    setSelectedTemplate(null);
    templateForm.resetFields();
  };

  // Áp dụng template khi tạo thông báo mới
  const handleApplyTemplate = (template) => {
    setModalType('create');
    setIsModalVisible(true);
    form.setFieldsValue({
      ...template,
      schedule: null
    });
  };

  return (
    <div className={styles['notifications-container']}>
      {/* Notification List & Tabs */}
      <Card className={styles['notifications-card']}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Danh sách thông báo</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNotification}
            className={styles['notifications-button']}
          >
            Tạo thông báo
          </Button>
        </div>
        <Tabs
          defaultActiveKey="all"
          className={styles['notifications-tabs']}
          items={[
            {
              key: 'all',
              label: 'Tất cả',
              children: (
                loading ? <Spin /> :
                  <Table
                    columns={columns}
                    dataSource={notificationList}
                    rowKey="id"
                    className={styles['notifications-table']}
                    pagination={{
                      total: notificationList.length,
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thông báo`
                    }}
                  />
              )
            },
            {
              key: 'templates',
              label: 'Template',
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Title level={4} style={{ margin: 0 }}>Danh sách template</Title>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleCreateTemplate}
                      className={styles['notifications-button']}
                    >
                      Tạo template
                    </Button>
                  </div>
                  <Table
                    columns={[
                      {
                        title: 'Tiêu đề',
                        dataIndex: 'title',
                        key: 'title',
                      },
                      {
                        title: 'Nội dung',
                        dataIndex: 'content',
                        key: 'content',
                      },
                      {
                        title: 'Loại',
                        dataIndex: 'type',
                        key: 'type',
                        render: text => <Tag color="blue">{text}</Tag>,
                      },
                      {
                        title: 'Mức độ',
                        dataIndex: 'priority',
                        key: 'priority',
                        render: text => <Tag color={text === 'Khẩn cấp' ? 'red' : text === 'Quan trọng' ? 'orange' : 'green'}>{text}</Tag>,
                      },
                      {
                        title: 'Hành động',
                        key: 'action',
                        render: (_, record) => (
                          <Space size="middle">
                            <Button icon={<EditOutlined />} onClick={() => handleEditTemplate(record)} />
                            <Popconfirm
                              title="Bạn có chắc chắn muốn xóa template này?"
                              onConfirm={() => handleDeleteTemplate(record.id)}
                              okText="Có"
                              cancelText="Không"
                            >
                              <Button icon={<DeleteOutlined />} />
                            </Popconfirm>
                            <Button icon={<SendOutlined />} onClick={() => handleApplyTemplate(record)}>
                              Áp dụng
                            </Button>
                          </Space>
                        )
                      }
                    ]}
                    dataSource={templateList}
                    rowKey="id"
                    pagination={false}
                    locale={{ emptyText: <Empty description="Chưa có template nào" /> }}
                  />
                </div>
              )
            },
            {
              key: 'analytics',
              label: 'Phân tích',
              children: (
                <div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card title="Tỷ lệ mở thông báo" className={styles['notifications-card']}>
                        <Progress
                          percent={
                            notificationList.length > 0
                              ? Math.round((notificationList.reduce((acc, cur) => acc + (cur.opened || 0), 0) / (notificationList.reduce((acc, cur) => acc + (cur.sentTo || 1), 0)) * 100) || 0)
                              : 0
                          }
                          strokeColor="#e50914"
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="Thống kê theo loại" className={styles['notifications-card']}>
                        <List
                          dataSource={['promotion', 'movie', 'maintenance', 'news'].map(type => ({
                            type,
                            count: notificationList.filter(n => n.type === type).length
                          }))}
                          renderItem={(item) => (
                            <List.Item>
                              <Text>{item.type}</Text>
                              <Badge count={item.count} style={{ backgroundColor: '#e50914' }} />
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* Modal for CRUD */}
      <Modal
        title={modalType === 'view' ? 'Chi tiết thông báo' : (modalType === 'edit' ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới')}
        open={isModalVisible}
        onOk={modalType === 'view' ? handleModalCancel : handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        className={styles['notifications-modal']}
        okText={modalType === 'view' ? 'Đóng' : 'Lưu'}
        cancelText="Hủy"
        okButtonProps={modalType === 'view' ? { style: { display: 'inline-block' } } : {}}
      >
        <Form form={form} layout="vertical" className={styles['notifications-form']}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề thông báo" disabled={modalType === 'view'} />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <TextArea rows={4} placeholder="Nhập nội dung thông báo" disabled={modalType === 'view'} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại thông báo"
                rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
              >
                <Select placeholder="Chọn loại thông báo" disabled={modalType === 'view'}>
                  <Option value="promotion">Khuyến mãi</Option>
                  <Option value="movie">Phim mới</Option>
                  <Option value="maintenance">Bảo trì</Option>
                  <Option value="news">Tin tức</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Mức độ ưu tiên"
                rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}
              >
                <Select placeholder="Chọn mức độ ưu tiên" disabled={modalType === 'view'}>
                  <Option value="normal">Bình thường</Option>
                  <Option value="important">Quan trọng</Option>
                  <Option value="urgent">Khẩn cấp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="schedule"
            label="Lịch gửi"
          >
            <DatePicker showTime placeholder="Chọn thời gian gửi" style={{ width: '100%' }} disabled={modalType === 'view'} />
          </Form.Item>
        </Form>
        {modalType === 'view' && selectedNotification && (
          <div style={{ marginTop: 24, color: '#8c8c8c', fontSize: 14 }}>
            <div>Ngày tạo: {selectedNotification.createdAt}</div>
            <div>Đã gửi: {selectedNotification.sentTo}</div>
            <div>Đã mở: {selectedNotification.opened}</div>
            <div>Trạng thái: {selectedNotification.status}</div>
          </div>
        )}
      </Modal>

      {/* Modal for Template CRUD */}
      <Modal
        title={templateModalType === 'edit' ? 'Chỉnh sửa template' : 'Tạo template mới'}
        open={isTemplateModalVisible}
        onOk={handleTemplateModalOk}
        onCancel={handleTemplateModalCancel}
        width={600}
        className={styles['notifications-modal']}
        okText={templateModalType === 'edit' ? 'Cập nhật' : 'Tạo'}
        cancelText="Hủy"
      >
        <Form form={templateForm} layout="vertical" className={styles['notifications-form']}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề template" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <TextArea rows={4} placeholder="Nhập nội dung template" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại"
                rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
              >
                <Select placeholder="Chọn loại">
                  <Option value="promotion">Khuyến mãi</Option>
                  <Option value="movie">Phim mới</Option>
                  <Option value="maintenance">Bảo trì</Option>
                  <Option value="news">Tin tức</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Mức độ"
                rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}
              >
                <Select placeholder="Chọn mức độ">
                  <Option value="normal">Bình thường</Option>
                  <Option value="important">Quan trọng</Option>
                  <Option value="urgent">Khẩn cấp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Notifications;