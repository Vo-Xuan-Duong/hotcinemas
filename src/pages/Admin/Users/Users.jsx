import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Popconfirm,
  message,
  Row,
  Col,
  Card,
  Statistic,
  Avatar,
  DatePicker,
  InputNumber,
  Descriptions
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  TeamOutlined,
  CrownOutlined,
  StopOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import usersData from '../../../data/users.json';
import './UsersAntd.css';

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState(usersData);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Thống kê người dùng
  const userStats = useMemo(() => {
    const stats = {
      total: users.length,
      active: users.filter(user => user.status === 'active').length,
      inactive: users.filter(user => user.status === 'inactive').length,
      suspended: users.filter(user => user.status === 'suspended').length,
      admins: users.filter(user => user.role === 'admin').length,
      vips: users.filter(user => user.role === 'vip').length,
      moderators: users.filter(user => user.role === 'moderator').length
    };
    return stats;
  }, [users]);

  // Lọc người dùng
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchText, statusFilter, roleFilter]);

  // Xử lý thêm người dùng
  const handleAddUser = (values) => {
    const newUser = {
      id: Date.now(),
      ...values,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      totalBookings: 0,
      totalSpent: 0,
      avatar: "https://image.tmdb.org/t/p/w500/kbNyaREVYRZPfGHdQHBxaxU0DVv.jpg"
    };

    setUsers([...users, newUser]);
    setIsAddModalVisible(false);
    form.resetFields();
    message.success('Thêm người dùng thành công!');
  };

  // Xử lý chỉnh sửa người dùng
  const handleEditUser = (values) => {
    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? { ...user, ...values }
        : user
    );

    setUsers(updatedUsers);
    setIsEditModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
    message.success('Cập nhật người dùng thành công!');
  };

  // Xử lý xóa người dùng
  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    message.success('Xóa người dùng thành công!');
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (userId, newStatus) => {
    const updatedUsers = users.map(user =>
      user.id === userId
        ? { ...user, status: newStatus }
        : user
    );

    setUsers(updatedUsers);
    message.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : newStatus === 'suspended' ? 'tạm khóa' : 'vô hiệu hóa'} người dùng!`);
  };

  // Hiển thị modal thêm/sửa
  const showAddModal = () => {
    setIsAddModalVisible(true);
    form.resetFields();
  };

  const showEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalVisible(true);
    form.setFieldsValue(user);
  };

  const showDetailModal = (user) => {
    setSelectedUser(user);
    setIsDetailModalVisible(true);
  };

  // Render trạng thái
  const renderStatus = (status) => {
    const statusConfig = {
      active: { color: 'success', text: 'Hoạt động', icon: <CheckCircleOutlined /> },
      inactive: { color: 'default', text: 'Không hoạt động', icon: <StopOutlined /> },
      suspended: { color: 'error', text: 'Tạm khóa', icon: <StopOutlined /> }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
  };

  // Render vai trò
  const renderRole = (role) => {
    const roleConfig = {
      admin: { color: 'red', text: 'Quản trị viên', icon: <CrownOutlined /> },
      moderator: { color: 'blue', text: 'Kiểm duyệt viên', icon: <UserOutlined /> },
      vip: { color: 'gold', text: 'VIP', icon: <CrownOutlined /> },
      user: { color: 'green', text: 'Người dùng', icon: <UserOutlined /> }
    };

    const config = roleConfig[role] || roleConfig.user;
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
  };

  // Cấu hình cột bảng
  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar, record) => (
        <Avatar
          src={avatar}
          icon={<UserOutlined />}
          size={50}
          alt={record.fullName}
        />
      ),
    },
    {
      title: 'Thông tin',
      key: 'info',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{record.fullName}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>@{record.username}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: renderRole,
      filters: [
        { text: 'Quản trị viên', value: 'admin' },
        { text: 'Kiểm duyệt viên', value: 'moderator' },
        { text: 'VIP', value: 'vip' },
        { text: 'Người dùng', value: 'user' }
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: renderStatus,
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
        { text: 'Tạm khóa', value: 'suspended' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Tổng đặt vé',
      dataIndex: 'totalBookings',
      key: 'totalBookings',
      sorter: (a, b) => a.totalBookings - b.totalBookings,
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (amount) => `${amount?.toLocaleString('vi-VN')} ₫`,
      sorter: (a, b) => a.totalSpent - b.totalSpent,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
            size="small"
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            size="small"
          >
            Sửa
          </Button>
          {record.status === 'active' ? (
            <Popconfirm
              title="Tạm khóa người dùng này?"
              onConfirm={() => handleStatusChange(record.id, 'suspended')}
              okText="Có"
              cancelText="Không"
            >
              <Button type="link" danger size="small">
                Khóa
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Kích hoạt người dùng này?"
              onConfirm={() => handleStatusChange(record.id, 'active')}
              okText="Có"
              cancelText="Không"
            >
              <Button type="link" size="small">
                Kích hoạt
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Quản lý người dùng</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
          size="large"
        >
          Thêm người dùng
        </Button>
      </div>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={userStats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={userStats.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="VIP"
              value={userStats.vips}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Quản trị viên"
              value={userStats.admins}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <Card className="filter-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Input.Search
              placeholder="Tìm kiếm theo tên, email, username..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
              <Option value="suspended">Tạm khóa</Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Lọc theo vai trò"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Tất cả vai trò</Option>
              <Option value="admin">Quản trị viên</Option>
              <Option value="moderator">Kiểm duyệt viên</Option>
              <Option value="vip">VIP</Option>
              <Option value="user">Người dùng</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Bảng người dùng */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            total: filteredUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal thêm người dùng */}
      <Modal
        title="Thêm người dùng mới"
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddUser}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                  { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
                ]}
              >
                <Input placeholder="Nhập tên đăng nhập" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' }
                ]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="user">Người dùng</Option>
                  <Option value="vip">VIP</Option>
                  <Option value="moderator">Kiểm duyệt viên</Option>
                  <Option value="admin">Quản trị viên</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                initialValue="active"
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                  <Option value="suspended">Tạm khóa</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Thêm người dùng
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

      {/* Modal chỉnh sửa người dùng */}
      <Modal
        title="Chỉnh sửa người dùng"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedUser(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditUser}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                  { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
                ]}
              >
                <Input placeholder="Nhập tên đăng nhập" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' }
                ]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="user">Người dùng</Option>
                  <Option value="vip">VIP</Option>
                  <Option value="moderator">Kiểm duyệt viên</Option>
                  <Option value="admin">Quản trị viên</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                  <Option value="suspended">Tạm khóa</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="totalBookings"
                label="Tổng số vé đã đặt"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="totalSpent"
                label="Tổng chi tiêu (VNĐ)"
              >
                <InputNumber min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
              <Button onClick={() => {
                setIsEditModalVisible(false);
                setSelectedUser(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết người dùng */}
      <Modal
        title="Chi tiết người dùng"
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedUser(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsDetailModalVisible(false);
            setSelectedUser(null);
          }}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedUser && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar
                src={selectedUser.avatar}
                size={80}
                icon={<UserOutlined />}
              />
              <h2 style={{ margin: '16px 0 8px 0' }}>{selectedUser.fullName}</h2>
              <Space>
                {renderRole(selectedUser.role)}
                {renderStatus(selectedUser.status)}
              </Space>
            </div>

            <Descriptions bordered column={2}>
              <Descriptions.Item label="Tên đăng nhập">{selectedUser.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedUser.phone}</Descriptions.Item>
              <Descriptions.Item label="Vai trò">{renderRole(selectedUser.role)}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{renderStatus(selectedUser.status)}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(selectedUser.createdAt).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Lần đăng nhập cuối">
                {selectedUser.lastLogin
                  ? new Date(selectedUser.lastLogin).toLocaleDateString('vi-VN') + ' ' +
                  new Date(selectedUser.lastLogin).toLocaleTimeString('vi-VN')
                  : 'Chưa đăng nhập'
                }
              </Descriptions.Item>
              <Descriptions.Item label="Tổng số vé đã đặt">
                <strong>{selectedUser.totalBookings} vé</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng chi tiêu" span={2}>
                <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                  {selectedUser.totalSpent?.toLocaleString('vi-VN')} ₫
                </strong>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
