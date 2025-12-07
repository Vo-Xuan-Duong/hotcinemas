import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Image,
  Tooltip,
  Pagination
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';

// Import services
import cinemaService from '../../../services/cinemaService';
import cityService from '../../../services/cityService';
import './CinemasAntd.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Cinemas = () => {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Load data when component mounts or when filters/pagination change
  useEffect(() => {
    loadCinemas();
  }, [pagination.current, pagination.pageSize, statusFilter, cityFilter]);

  const loadCinemas = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.current - 1, // Backend uses 0-based indexing
        size: pagination.pageSize
      };

      // Apply filters
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (cityFilter) {
        params.cityId = cityFilter;
      }

      const response = await cinemaService.getAllCinemas(params);
      console.log('Cinemas response:', response);

      // Handle paginated response
      const cinemasData = response?.data?.content || response?.data || [];
      const total = response?.data?.totalElements || cinemasData.length;

      setCinemas(cinemasData);
      setPagination(prev => ({
        ...prev,
        total
      }));
    } catch (error) {
      console.error('Error loading cinemas:', error);
      message.error('Lỗi khi tải danh sách rạp');
      setCinemas([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async () => {
    try {
      const citiesResponse = await cityService.getActiveCities();
      console.log('Cities response:', citiesResponse);

      let citiesData = [];
      if (Array.isArray(citiesResponse?.data)) {
        citiesData = citiesResponse.data;
      } else if (Array.isArray(citiesResponse?.data?.data)) {
        citiesData = citiesResponse.data.data;
      } else if (citiesResponse?.data) {
        citiesData = citiesResponse.data.content || citiesResponse.data.cities || [];
      }

      setCities(citiesData);
    } catch (error) {
      console.error('Error loading cities:', error);
      message.error('Lỗi khi tải danh sách thành phố');
    }
  };

  // Filter cinemas by search text
  const getFilteredCinemas = () => {
    if (!searchText) return cinemas;
    return cinemas.filter(cinema => {
      const matchesSearch = cinema.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        cinema.address?.toLowerCase().includes(searchText.toLowerCase());
      return matchesSearch;
    });
  };

  // Calculate statistics
  const cinemaStats = {
    total: pagination.total,
    active: cinemas.filter(c => c.status === 'active' || c.isActive).length,
    totalRooms: cinemas.reduce((sum, c) => sum + (c.numberOfRooms || 0), 0),
  };

  // Handle add cinema
  const handleAddCinema = async (values) => {
    try {
      await cinemaService.createCinema(values);
      message.success('Thêm rạp chiếu phim thành công!');
      setIsAddModalVisible(false);
      form.resetFields();
      await loadCinemas(); // Reload current page
    } catch (error) {
      console.error('Error adding cinema:', error);
      message.error(error.response?.data?.message || 'Lỗi khi thêm rạp');
    }
  };

  // Handle edit cinema
  const handleEditCinema = async (values) => {
    try {
      await cinemaService.updateCinema(selectedCinema.id, values);
      message.success('Cập nhật rạp chiếu phim thành công!');
      setIsEditModalVisible(false);
      setSelectedCinema(null);
      form.resetFields();
      await loadCinemas(); // Reload current page
    } catch (error) {
      console.error('Error updating cinema:', error);
      message.error(error.response?.data?.message || 'Lỗi khi cập nhật rạp');
    }
  };

  // Handle delete cinema
  const handleDeleteCinema = async (cinemaId) => {
    try {
      await cinemaService.deleteCinema(cinemaId);
      message.success('Xóa rạp chiếu phim thành công!');
      await loadCinemas(); // Reload current page
    } catch (error) {
      console.error('Error deleting cinema:', error);
      message.error(error.response?.data?.message || 'Lỗi khi xóa rạp');
    }
  };

  // Show add modal
  const showAddModal = async () => {
    if (cities.length === 0) {
      await loadCities();
    }
    setIsAddModalVisible(true);
    form.resetFields();
  };

  // Show edit modal
  const showEditModal = async (cinema) => {
    if (cities.length === 0) {
      await loadCities();
    }
    setSelectedCinema(cinema);
    setIsEditModalVisible(true);

    console.log('Cinema data for edit:', cinema);

    form.setFieldsValue({
      name: cinema.name,
      status: cinema.status,
      cityId: cinema.cityId || cinema.city?.id,
      address: cinema.address,
      phone: cinema.phone,
      email: cinema.email,
      description: cinema.description || '',
      image: cinema.image || ''
    });
  };

  // Handle pagination change
  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }));
  };

  // Handle filter change
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page
  };

  const handleCityFilterChange = (value) => {
    setCityFilter(value);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page
  };

  // Render trạng thái
  const renderStatus = (status) => {
    const statusConfig = {
      active: { color: 'green', text: 'Hoạt động' },
      inactive: { color: 'red', text: 'Không hoạt động' },
      maintenance: { color: 'orange', text: 'Bảo trì' }
    };
    const config = statusConfig[status] || statusConfig.active;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Cấu hình cột bảng
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image, record) => (
        <Image
          src={image}
          alt={record.name}
          width={60}
          height={40}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />
      ),
    },
    {
      title: 'Tên rạp',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span
          onClick={() => navigate(`/admin/cinemas/detail/${record.id}`)}
          style={{
            color: '#1890ff',
            cursor: 'pointer',
            fontWeight: 500,
            textDecoration: 'underline'
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'Phòng chiếu',
      dataIndex: 'numberOfRooms',
      key: 'numberOfRooms',
      width: 100,
      align: 'center',
      // render: (rooms) => rooms?.length || 0,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: renderStatus,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/cinemas/detail/${record.id}`)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa rạp chiếu phim"
              description="Bạn có chắc chắn muốn xóa rạp này?"
              onConfirm={() => handleDeleteCinema(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="cinemas-container">
      {/* Header */}
      <div className="cinemas-header">
        <div>
          <Title level={2} className="cinemas-title">
            Quản lý Rạp Chiếu Phim
          </Title>
          <Text className="cinemas-subtitle">
            Quản lý thông tin các rạp chiếu phim trong hệ thống
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
          size="large"
        >
          Thêm rạp mới
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="search-filter-section">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Input.Search
              placeholder="Tìm kiếm theo tên rạp, địa chỉ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
              <Option value="maintenance">Bảo trì</Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Lọc theo thành phố"
              value={cityFilter}
              onChange={handleCityFilterChange}
              style={{ width: '100%' }}
              size="large"
              allowClear
              onDropdownVisibleChange={(open) => {
                if (open && cities.length === 0) {
                  loadCities();
                }
              }}
            >
              {cities.map(city => (
                <Option key={city.id} value={city.id}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Cinemas Table */}
      <Card title="Danh sách rạp chiếu phim">
        <Table
          columns={columns}
          dataSource={getFilteredCinemas()}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1200 }}
          locale={{ emptyText: 'Không có rạp nào' }}
        />
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger
            showTotal={(total) => `Tổng ${total} rạp`}
            pageSizeOptions={['5', '10', '20', '50']}
          />
        </div>
      </Card>

      {/* Add Cinema Modal */}
      <Modal
        title="Thêm rạp chiếu phim mới"
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
        className="cinema-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddCinema}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên rạp"
                rules={[{ required: true, message: 'Vui lòng nhập tên rạp!' }]}
              >
                <Input placeholder="Nhập tên rạp" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                initialValue="active"
              >
                <Select getPopupContainer={(trigger) => trigger.parentElement}>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                  <Option value="maintenance">Bảo trì</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="cityId"
            label="Thành phố"
            rules={[{ required: true, message: 'Vui lòng chọn thành phố!' }]}
          >
            <Select
              placeholder="Chọn thành phố"
              showSearch
              optionFilterProp="children"
              getPopupContainer={(trigger) => trigger.parentElement}
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
              loading={cities.length === 0}
              notFoundContent={cities.length === 0 ? 'Đang tải...' : 'Không có dữ liệu'}
            >
              {cities && cities.length > 0 ? (
                cities.map(city => (
                  <Option key={city.id} value={city.id}>
                    {city.name}
                  </Option>
                ))
              ) : null}
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập địa chỉ chi tiết" />
          </Form.Item>

          <Row gutter={16}>
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

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả về rạp" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh URL"
          >
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Thêm rạp
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

      {/* Edit Cinema Modal */}
      <Modal
        title="Chỉnh sửa rạp chiếu phim"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedCinema(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
        className="cinema-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditCinema}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên rạp"
                rules={[{ required: true, message: 'Vui lòng nhập tên rạp!' }]}
              >
                <Input placeholder="Nhập tên rạp" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select getPopupContainer={(trigger) => trigger.parentElement}>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                  <Option value="maintenance">Bảo trì</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="cityId"
            label="Thành phố"
            rules={[{ required: true, message: 'Vui lòng chọn thành phố!' }]}
          >
            <Select
              placeholder="Chọn thành phố"
              showSearch
              optionFilterProp="children"
              getPopupContainer={(trigger) => trigger.parentElement}
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
              loading={cities.length === 0}
              notFoundContent={cities.length === 0 ? 'Đang tải...' : 'Không có dữ liệu'}
            >
              {cities && cities.length > 0 ? (
                cities.map(city => (
                  <Option key={city.id} value={city.id}>
                    {city.name}
                  </Option>
                ))
              ) : null}
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập địa chỉ chi tiết" />
          </Form.Item>

          <Row gutter={16}>
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

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả về rạp" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh URL"
          >
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
              <Button onClick={() => {
                setIsEditModalVisible(false);
                setSelectedCinema(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Cinemas;
