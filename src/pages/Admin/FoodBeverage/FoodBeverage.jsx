import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Rate,
  Image,
  Upload,
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
  Switch,
  message,
  Descriptions
} from 'antd';
import {
  CoffeeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  StarOutlined,
  FireOutlined,
  DollarOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import styles from './FoodBeverage.module.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const FoodBeverage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Bắp rang bơ',
      category: 'food',
      price: 25000,
      originalPrice: 30000,
      stock: 50,
      rating: 4.5,
      sales: 120,
      image: 'https://via.placeholder.com/100x100?text=Popcorn',
      description: 'Bắp rang bơ thơm ngon, giòn tan',
      isPopular: true
    },
    {
      id: 2,
      name: 'Coca Cola',
      category: 'drink',
      price: 15000,
      originalPrice: 15000,
      stock: 100,
      rating: 4.2,
      sales: 200,
      image: 'https://via.placeholder.com/100x100?text=Cola',
      description: 'Nước ngọt Coca Cola mát lạnh',
      isPopular: false
    },
    {
      id: 3,
      name: 'Combo Phim + Bắp + Nước',
      category: 'combo',
      price: 45000,
      originalPrice: 60000,
      stock: 30,
      rating: 4.8,
      sales: 80,
      image: 'https://via.placeholder.com/100x100?text=Combo',
      description: 'Combo tiết kiệm cho 2 người',
      isPopular: true
    }
  ]);

  const stats = [
    { title: 'Tổng sản phẩm', value: products.length, icon: <CoffeeOutlined /> },
    { title: 'Doanh thu tháng', value: '15.2M', icon: <DollarOutlined /> },
    { title: 'Đơn hàng', value: products.reduce((a, b) => a + b.sales, 0), icon: <ShoppingCartOutlined /> },
    { title: 'Tỷ lệ bán', value: products.length > 0 ? Math.round(products.filter(p => p.sales > 0).length / products.length * 100) + '%' : '0%', icon: <FireOutlined /> }
  ];

  const handleCreateProduct = () => {
    setIsEditMode(false);
    setSelectedProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditProduct = (record) => {
    setIsEditMode(true);
    setSelectedProduct(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleViewProduct = (record) => {
    setSelectedProduct(record);
    setIsDetailModalVisible(true);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(item => item.id !== id));
    message.success('Đã xóa sản phẩm!');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      let imageUrl = values.image;
      if (Array.isArray(imageUrl) && imageUrl.length > 0 && imageUrl[0].url) {
        imageUrl = imageUrl[0].url;
      } else if (Array.isArray(imageUrl) && imageUrl.length > 0 && imageUrl[0].thumbUrl) {
        imageUrl = imageUrl[0].thumbUrl;
      } else if (typeof imageUrl !== 'string') {
        imageUrl = 'https://via.placeholder.com/100x100?text=Image';
      }
      const newProduct = {
        ...values,
        image: imageUrl,
        id: isEditMode && selectedProduct ? selectedProduct.id : Date.now(),
        rating: isEditMode && selectedProduct ? selectedProduct.rating : 4.0,
        sales: isEditMode && selectedProduct ? selectedProduct.sales : 0
      };
      if (isEditMode && selectedProduct) {
        setProducts(products.map(item => item.id === selectedProduct.id ? newProduct : item));
        message.success('Cập nhật sản phẩm thành công!');
      } else {
        setProducts([newProduct, ...products]);
        message.success('Thêm sản phẩm thành công!');
      }
      setIsModalVisible(false);
      setSelectedProduct(null);
      setIsEditMode(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    setIsEditMode(false);
    form.resetFields();
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
    setSelectedProduct(null);
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image
            src={record.image}
            alt={text}
            width={60}
            height={60}
            className={styles['food-beverage-image']}
            fallback="https://via.placeholder.com/60x60?text=Image"
          />
          <div>
            <div style={{ fontWeight: 600, color: '#262626' }}>{text}</div>
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{record.description}</div>
            {record.isPopular && (
              <Badge
                count="Phổ biến"
                className={styles['popular-badge']}
                style={{ backgroundColor: '#faad14' }}
              />
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const categoryConfig = {
          food: { color: 'orange', text: 'Đồ ăn', icon: <CoffeeOutlined /> },
          drink: { color: 'blue', text: 'Đồ uống', icon: <CoffeeOutlined /> },
          combo: { color: 'green', text: 'Combo', icon: <FireOutlined /> }
        };
        const config = categoryConfig[category] || { color: 'default', text: category };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: 'Giá',
      key: 'price',
      render: (_, record) => (
        <div>
          <div className={styles['price-display']}>
            {record.price.toLocaleString('vi-VN')}đ
          </div>
          {record.originalPrice > record.price && (
            <div style={{ textDecoration: 'line-through', color: '#8c8c8c', fontSize: '12px' }}>
              {record.originalPrice.toLocaleString('vi-VN')}đ
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <div>
          <div style={{ fontWeight: 600, color: '#262626' }}>{stock}</div>
          <Progress
            percent={Math.min((stock / 100) * 100, 100)}
            size="small"
            className={styles['food-beverage-progress']}
          />
        </div>
      )
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      render: (_, record) => (
        <div>
          <Rate
            disabled
            defaultValue={record.rating}
            allowHalf
            className={styles['food-beverage-rate']}
          />
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.rating}/5 ({record.sales} đã bán)
          </div>
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => handleViewProduct(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => handleEditProduct(record)} />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record.id)}
          >
            <Tooltip title="Xóa">
              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className={styles['food-beverage-container']}>
      <div className={styles['food-beverage-header']}>
        <Title level={2} className={styles['food-beverage-title']}>
          Quản lý đồ ăn & đồ uống
        </Title>
        <Text className={styles['food-beverage-subtitle']}>
          Quản lý menu, inventory và doanh thu F&B
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

      <Card className={styles['food-beverage-card']}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Danh sách sản phẩm</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateProduct}
            className={styles['food-beverage-button']}
          >
            + Thêm sản phẩm
          </Button>
        </div>

        <Tabs
          defaultActiveKey="all"
          className={styles['food-beverage-tabs']}
          items={[
            {
              key: 'all',
              label: 'Tất cả',
              children: (
                <Table
                  columns={columns}
                  dataSource={products}
                  rowKey="id"
                  className={styles['food-beverage-table']}
                  pagination={{
                    total: products.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} sản phẩm`
                  }}
                />
              )
            },
            {
              key: 'food',
              label: 'Đồ ăn',
              children: (
                <Table
                  columns={columns}
                  dataSource={products.filter(p => p.category === 'food')}
                  rowKey="id"
                  className={styles['food-beverage-table']}
                />
              )
            },
            {
              key: 'drink',
              label: 'Đồ uống',
              children: (
                <Table
                  columns={columns}
                  dataSource={products.filter(p => p.category === 'drink')}
                  rowKey="id"
                  className={styles['food-beverage-table']}
                />
              )
            },
            {
              key: 'combo',
              label: 'Combo',
              children: (
                <Table
                  columns={columns}
                  dataSource={products.filter(p => p.category === 'combo')}
                  rowKey="id"
                  className={styles['food-beverage-table']}
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
                      <Card title="Doanh thu theo danh mục" className={styles['food-beverage-card']}>
                        <List
                          dataSource={[
                            { category: 'Đồ ăn', revenue: '8.5M', percentage: 56 },
                            { category: 'Đồ uống', revenue: '4.2M', percentage: 28 },
                            { category: 'Combo', revenue: '2.5M', percentage: 16 }
                          ]}
                          renderItem={(item) => (
                            <List.Item>
                              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Text>{item.category}</Text>
                                <div>
                                  <Text strong>{item.revenue}</Text>
                                  <Progress
                                    percent={item.percentage}
                                    size="small"
                                    className={styles['food-beverage-progress']}
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
                      <Card title="Sản phẩm bán chạy" className={styles['food-beverage-card']}>
                        <List
                          dataSource={products.sort((a, b) => b.sales - a.sales).slice(0, 5)}
                          renderItem={(item, index) => (
                            <List.Item>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Badge count={index + 1} style={{ backgroundColor: '#e50914' }} />
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={40}
                                  height={40}
                                  className={styles['food-beverage-image']}
                                />
                                <div style={{ flex: 1 }}>
                                  <Text strong>{item.name}</Text>
                                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                    {item.sales} đã bán
                                  </div>
                                </div>
                                <Text strong className={styles['price-display']}>
                                  {item.price.toLocaleString('vi-VN')}đ
                                </Text>
                              </div>
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

      <Modal
        title={isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        className={styles['food-beverage-modal']}
        okText={isEditMode ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" className={styles['food-beverage-form']}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn danh mục" className={styles['food-beverage-select']}>
                  <Option value="food">Đồ ăn</Option>
                  <Option value="drink">Đồ uống</Option>
                  <Option value="combo">Combo</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá bán"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber
                  placeholder="Nhập giá"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  className={styles['food-beverage-number']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="originalPrice"
                label="Giá gốc"
              >
                <InputNumber
                  placeholder="Nhập giá gốc"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  className={styles['food-beverage-number']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="Tồn kho"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber
                  placeholder="Nhập số lượng"
                  className={styles['food-beverage-number']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isPopular"
                label="Sản phẩm phổ biến"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={3} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh"
          >
            <Upload
              listType="picture-card"
              className={styles['food-beverage-upload']}
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết sản phẩm"
        open={isDetailModalVisible}
        onCancel={handleDetailModalCancel}
        width={500}
        footer={[
          <Button key="close" onClick={handleDetailModalCancel}>Đóng</Button>,
          <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => { setIsDetailModalVisible(false); handleEditProduct(selectedProduct); }}>Chỉnh sửa</Button>
        ]}
        className={styles['food-beverage-modal']}
      >
        {selectedProduct && (
          <div style={{ textAlign: 'center' }}>
            <Image
              src={selectedProduct.image}
              alt={selectedProduct.name}
              width={100}
              height={100}
              style={{ marginBottom: 16 }}
              fallback="https://via.placeholder.com/100x100?text=Image"
            />
            <Title level={4}>{selectedProduct.name}</Title>
            <Text type="secondary">{selectedProduct.description}</Text>
            <Divider />
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Danh mục">
                {selectedProduct.category === 'food' ? 'Đồ ăn' : selectedProduct.category === 'drink' ? 'Đồ uống' : 'Combo'}
              </Descriptions.Item>
              <Descriptions.Item label="Giá bán">
                {selectedProduct.price.toLocaleString('vi-VN')}đ
              </Descriptions.Item>
              <Descriptions.Item label="Giá gốc">
                {selectedProduct.originalPrice.toLocaleString('vi-VN')}đ
              </Descriptions.Item>
              <Descriptions.Item label="Tồn kho">
                {selectedProduct.stock}
              </Descriptions.Item>
              <Descriptions.Item label="Phổ biến">
                {selectedProduct.isPopular ? 'Có' : 'Không'}
              </Descriptions.Item>
              <Descriptions.Item label="Đánh giá">
                {selectedProduct.rating}/5 ({selectedProduct.sales} đã bán)
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FoodBeverage; 