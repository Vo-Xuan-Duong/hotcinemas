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
  Drawer,
  Descriptions,
  Tree,
  message
} from 'antd';
import {
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import styles from './Staff.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Staff = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRoleEditMode, setIsRoleEditMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Quản trị viên',
      key: 'admin',
      description: 'Quản lý toàn bộ hệ thống',
      permissions: ['system', 'users', 'config'],
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Quản lý',
      key: 'manager',
      description: 'Quản lý rạp và lịch chiếu',
      permissions: ['cinema', 'schedule', 'staff'],
      createdAt: '2024-01-01'
    },
    {
      id: 3,
      name: 'Nhân viên',
      key: 'staff',
      description: 'Nhân viên bán vé và kiểm soát',
      permissions: ['sales', 'control'],
      createdAt: '2024-01-01'
    }
  ]);
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'nguyenvanan@hotcinemas.vn',
      role: 'admin',
      status: 'active',
      department: 'management',
      lastLogin: '2024-01-25 17:30:00',
      avatar: 'NA'
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      email: 'tranthibinh@hotcinemas.vn',
      role: 'manager',
      status: 'active',
      department: 'operations',
      lastLogin: '2024-01-24 22:20:00',
      avatar: 'TB'
    },
    {
      id: 3,
      name: 'Lê Hoàng Cường',
      email: 'lehoangcuong@hotcinemas.vn',
      role: 'staff',
      status: 'inactive',
      department: 'sales',
      lastLogin: '2024-01-20 16:15:00',
      avatar: 'LC'
    }
  ]);
  const [form] = Form.useForm();
  const [roleForm] = Form.useForm();

  // Tính toán thống kê động
  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === 'active').length;
  const roleCount = new Set(staff.map(s => s.role)).size;

  const handleStatusChange = (checked, record) => {
    const updatedStaff = staff.map(s => 
      s.id === record.id 
        ? { ...s, status: checked ? 'active' : 'inactive' }
        : s
    );
    setStaff(updatedStaff);
    message.success(`Đã ${checked ? 'kích hoạt' : 'vô hiệu hóa'} nhân viên ${record.name}`);
  };

  const handleEditStaff = (record) => {
    setSelectedStaff(record);
    setIsEditMode(true);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
      department: record.department,
      status: record.status === 'active'
    });
    setIsModalVisible(true);
  };

  const handleDeleteStaff = (record) => {
    const updatedStaff = staff.filter(s => s.id !== record.id);
    setStaff(updatedStaff);
    message.success(`Đã xóa nhân viên ${record.name}`);
  };

  const handleCreateRole = () => {
    setIsRoleEditMode(false);
    setSelectedRole(null);
    setIsRoleModalVisible(true);
    roleForm.resetFields();
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setIsRoleEditMode(true);
    roleForm.setFieldsValue({
      name: role.name,
      key: role.key,
      description: role.description,
      permissions: role.permissions
    });
    setIsRoleModalVisible(true);
  };

  const handleDeleteRole = (role) => {
    // Kiểm tra xem có nhân viên nào đang sử dụng vai trò này không
    const staffUsingRole = staff.filter(s => s.role === role.key);
    if (staffUsingRole.length > 0) {
      message.error(`Không thể xóa vai trò "${role.name}" vì có ${staffUsingRole.length} nhân viên đang sử dụng`);
      return;
    }
    
    const updatedRoles = roles.filter(r => r.id !== role.id);
    setRoles(updatedRoles);
    message.success(`Đã xóa vai trò "${role.name}"`);
  };

  const handleRoleModalOk = () => {
    roleForm.validateFields().then((values) => {
      if (isRoleEditMode) {
        // Cập nhật vai trò
        const updatedRoles = roles.map(r => 
          r.id === selectedRole.id 
            ? { 
                ...r, 
                name: values.name,
                key: values.key,
                description: values.description,
                permissions: values.permissions || []
              }
            : r
        );
        setRoles(updatedRoles);
        message.success(`Đã cập nhật vai trò "${values.name}"`);
      } else {
        // Tạo vai trò mới
        const newRole = {
          id: Math.max(...roles.map(r => r.id)) + 1,
          name: values.name,
          key: values.key,
          description: values.description,
          permissions: values.permissions || [],
          createdAt: new Date().toISOString().split('T')[0]
        };
        setRoles([...roles, newRole]);
        message.success(`Đã tạo vai trò "${values.name}"`);
      }
      setIsRoleModalVisible(false);
      setIsRoleEditMode(false);
      setSelectedRole(null);
      roleForm.resetFields();
    });
  };

  const handleRoleModalCancel = () => {
    setIsRoleModalVisible(false);
    setIsRoleEditMode(false);
    setSelectedRole(null);
    roleForm.resetFields();
  };

  const handleCreateStaff = () => {
    setIsEditMode(false);
    setSelectedStaff(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleViewStaffDetail = (record) => {
    setSelectedStaff(record);
    setIsDetailModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (isEditMode) {
        // Cập nhật nhân viên
        const updatedStaff = staff.map(s => 
          s.id === selectedStaff.id 
            ? { 
                ...s, 
                name: values.name,
                email: values.email,
                role: values.role,
                department: values.department,
                status: values.status ? 'active' : 'inactive'
              }
            : s
        );
        setStaff(updatedStaff);
        message.success('Đã cập nhật thông tin nhân viên');
      } else {
        // Thêm nhân viên mới
        const newStaff = {
          id: Math.max(...staff.map(s => s.id)) + 1,
          name: values.name,
          email: values.email,
          role: values.role,
          department: values.department,
          status: values.status ? 'active' : 'inactive',
          lastLogin: 'Chưa đăng nhập',
          avatar: values.name.split(' ').map(n => n[0]).join('').toUpperCase()
        };
        setStaff([...staff, newStaff]);
        message.success('Đã thêm nhân viên mới');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setSelectedStaff(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar className={styles['staff-avatar']} size={40}>
            {record.avatar}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, color: '#262626' }}>{text}</div>
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{record.email}</div>
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
              {record.role === 'admin' ? 'Quản lý hệ thống' :
                record.role === 'manager' ? 'Quản lý rạp' :
                  record.role === 'staff' ? 'Nhân viên bán vé' : 'Nhân viên'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleConfig = {
          admin: { color: 'red', text: 'Quản trị viên' },
          manager: { color: 'orange', text: 'Quản lý' },
          staff: { color: 'blue', text: 'Nhân viên' }
        };
        const config = roleConfig[role] || { color: 'default', text: role };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: status === 'active' ? '#52c41a' : '#ff4d4f' }}>
            {status === 'active' ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
          </span>
          <span style={{ color: status === 'active' ? '#52c41a' : '#ff4d4f' }}>
            {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
          </span>
          <Switch
            checked={status === 'active'}
            className={styles['staff-switch']}
            onChange={(checked) => handleStatusChange(checked, record)}
          />
        </div>
      )
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      render: (department) => {
        const deptConfig = {
          management: { color: 'blue', text: 'Quản lý' },
          operations: { color: 'blue', text: 'Vận hành' },
          sales: { color: 'blue', text: 'Bán hàng' }
        };
        const config = deptConfig[department] || { color: 'default', text: department };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
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
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewStaffDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEditStaff(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa nhân viên này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDeleteStaff(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const roleTreeData = [
    {
      title: 'Quản trị viên',
      key: 'admin',
      children: [
        { title: 'Quản lý hệ thống', key: 'admin-system' },
        { title: 'Quản lý người dùng', key: 'admin-users' },
        { title: 'Quản lý cấu hình', key: 'admin-config' }
      ]
    },
    {
      title: 'Quản lý',
      key: 'manager',
      children: [
        { title: 'Quản lý rạp', key: 'manager-cinema' },
        { title: 'Quản lý lịch chiếu', key: 'manager-schedule' },
        { title: 'Quản lý nhân viên', key: 'manager-staff' }
      ]
    },
    {
      title: 'Nhân viên',
      key: 'staff',
      children: [
        { title: 'Bán vé', key: 'staff-sales' },
        { title: 'Kiểm soát', key: 'staff-control' },
        { title: 'Dọn dẹp', key: 'staff-clean' }
      ]
    }
  ];



  return (
    <div className={styles['staff-container']}>
      <div className={styles['staff-header']}>
        <Title level={2} className={styles['staff-title']}>
          Quản lý nhân viên
        </Title>
        <Text className={styles['staff-subtitle']}>
          Quản lý nhân viên, vai trò và quyền hạn trong hệ thống
        </Text>
      </div>

      <div className={styles['quick-stats']}>
        <div>
          <Card className={styles['stat-card'] + ' ' + styles['blue']}>
            <Statistic
              title="Tổng nhân viên"
              value={totalStaff}
              prefix={<TeamOutlined className={styles['stat-icon']} />}
            />
          </Card>
        </div>
        <div>
          <Card className={styles['stat-card'] + ' ' + styles['green']}>
            <Statistic
              title="Đang hoạt động"
              value={activeStaff}
              prefix={<CheckCircleOutlined className={styles['stat-icon']} />}
            />
          </Card>
        </div>
        <div>
          <Card className={styles['stat-card'] + ' ' + styles['purple']}>
            <Statistic
              title="Vai trò"
              value={roleCount}
              prefix={<CrownOutlined className={styles['stat-icon']} />}
            />
          </Card>
        </div>
        <div>
          <Card className={styles['stat-card'] + ' ' + styles['orange']}>
            <Statistic
              title="Lịch sử hoạt động"
              value={staff.length}
              prefix={<SettingOutlined className={styles['stat-icon']} />}
            />
          </Card>
        </div>
      </div>

      <Card className={styles['staff-card']}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Danh sách nhân viên</Title>
          <Space>
            <Button
              icon={<SafetyCertificateOutlined />}
              onClick={handleCreateRole}
              className={styles['staff-button-secondary']}
            >
              + Tạo Vai trò
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateStaff}
              className={styles['staff-button']}
            >
              + Thêm Nhân viên
            </Button>
          </Space>
        </div>

        <Tabs
          defaultActiveKey="staff"
          className={styles['staff-tabs']}
          items={[
            {
              key: 'staff',
              label: 'Nhân viên',
              children: (
                <Table
                  columns={columns}
                  dataSource={staff}
                  rowKey="id"
                  className={styles['staff-table']}
                  pagination={{
                    total: staff.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} nhân viên`
                  }}
                />
              )
            },
            {
              key: 'roles',
              label: 'Vai trò',
              children: (
                <div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card title="Cây phân quyền" className={styles['staff-card']}>
                        <Tree
                          treeData={roleTreeData}
                          className={styles['staff-tree']}
                          defaultExpandAll
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="Danh sách vai trò" className={styles['staff-card']}>
                        <List
                          dataSource={roles}
                          renderItem={(role) => (
                            <List.Item
                              actions={[
                                <Button 
                                  type="text" 
                                  icon={<EditOutlined />} 
                                  size="small"
                                  onClick={() => handleEditRole(role)}
                                >
                                  Sửa
                                </Button>,
                                <Popconfirm
                                  title={`Bạn có chắc muốn xóa vai trò "${role.name}"?`}
                                  description="Hành động này không thể hoàn tác."
                                  onConfirm={() => handleDeleteRole(role)}
                                  okText="Xóa"
                                  cancelText="Hủy"
                                >
                                  <Button 
                                    type="text" 
                                    icon={<DeleteOutlined />} 
                                    size="small" 
                                    danger
                                  >
                                    Xóa
                                  </Button>
                                </Popconfirm>
                              ]}
                            >
                              <List.Item.Meta
                                avatar={<Avatar style={{ backgroundColor: '#e50914' }}>{role.name[0]}</Avatar>}
                                title={role.name}
                                description={
                                  <div>
                                    <div>{role.description}</div>
                                    <div style={{ marginTop: 4 }}>
                                      <Text type="secondary">Mã: {role.key}</Text>
                                    </div>
                                    <div style={{ marginTop: 4 }}>
                                      <Text type="secondary">Quyền: {role.permissions.join(', ')}</Text>
                                    </div>
                                  </div>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            },
            {
              key: 'activity',
              label: 'Lịch sử hoạt động',
              children: (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Empty description="Chưa có lịch sử hoạt động" />
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal
        title={isEditMode ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        className={styles['staff-modal']}
        okText={isEditMode ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" className={styles['staff-form']}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
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
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="admin">Quản trị viên</Option>
                  <Option value="manager">Quản lý</Option>
                  <Option value="staff">Nhân viên</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Phòng ban"
                rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
              >
                <Select placeholder="Chọn phòng ban">
                  <Option value="management">Quản lý</Option>
                  <Option value="operations">Vận hành</Option>
                  <Option value="sales">Bán hàng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết nhân viên"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => {
              setIsDetailModalVisible(false);
              handleEditStaff(selectedStaff);
            }}
          >
            Chỉnh sửa
          </Button>
        ]}
        width={600}
        className={styles['staff-modal']}
      >
        {selectedStaff && (
          <div className={styles['staff-descriptions']}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar className={styles['staff-avatar']} size={80}>
                {selectedStaff.avatar}
              </Avatar>
              <Title level={3} style={{ marginTop: 16 }}>{selectedStaff.name}</Title>
              <Text type="secondary">{selectedStaff.email}</Text>
            </div>

            <Descriptions column={1} bordered>
              <Descriptions.Item label="Vai trò">
                <Tag color={selectedStaff.role === 'admin' ? 'red' : selectedStaff.role === 'manager' ? 'orange' : 'blue'}>
                  {selectedStaff.role === 'admin' ? 'Quản trị viên' :
                    selectedStaff.role === 'manager' ? 'Quản lý' : 'Nhân viên'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phòng ban">
                <Tag color="blue">
                  {selectedStaff.department === 'management' ? 'Quản lý' :
                    selectedStaff.department === 'operations' ? 'Vận hành' : 'Bán hàng'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={selectedStaff.status === 'active' ? 'green' : 'red'}>
                  {selectedStaff.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Đăng nhập cuối">
                {selectedStaff.lastLogin}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      <Modal
        title={isRoleEditMode ? "Chỉnh sửa vai trò" : "Tạo vai trò mới"}
        open={isRoleModalVisible}
        onOk={handleRoleModalOk}
        onCancel={handleRoleModalCancel}
        width={600}
        className={styles['staff-modal']}
        okText={isRoleEditMode ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
      >
        <Form form={roleForm} layout="vertical" className={styles['staff-form']}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên vai trò"
                rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
              >
                <Input placeholder="Nhập tên vai trò" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="key"
                label="Mã vai trò"
                rules={[{ required: true, message: 'Vui lòng nhập mã vai trò!' }]}
              >
                <Input placeholder="Nhập mã vai trò (VD: admin, manager)" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea 
              placeholder="Mô tả chức năng và quyền hạn của vai trò"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Quyền hạn"
          >
            <Select
              mode="multiple"
              placeholder="Chọn các quyền hạn"
              options={[
                { label: 'Quản lý hệ thống', value: 'system' },
                { label: 'Quản lý người dùng', value: 'users' },
                { label: 'Quản lý cấu hình', value: 'config' },
                { label: 'Quản lý rạp', value: 'cinema' },
                { label: 'Quản lý lịch chiếu', value: 'schedule' },
                { label: 'Quản lý nhân viên', value: 'staff' },
                { label: 'Bán vé', value: 'sales' },
                { label: 'Kiểm soát', value: 'control' },
                { label: 'Xem báo cáo', value: 'reports' },
                { label: 'Quản lý khuyến mãi', value: 'promotions' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Staff;