import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Image,
  Tag,
  Typography,
  message,
  Popconfirm,
  Rate,
  DatePicker,
  Upload,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  UploadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './Movies.css';
import movieService from '../../../services/movieService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Movies = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    loadMovies();
  }, [pagination.current, pagination.pageSize]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getAllMovies({
        page: pagination.current - 1, // Backend uses 0-based index
        size: pagination.pageSize,
        sort: 'releaseDate,desc' // Sắp xếp theo ngày phát hành từ mới đến cũ
      });

      // response bây giờ là Page object: { content, totalElements, totalPages, size, number, ... }
      if (response && Array.isArray(response.content)) {
        setMovies(response.content);
        setPagination(prev => ({
          ...prev,
          total: response.totalElements || 0
        }));
      } else if (Array.isArray(response)) {
        // Fallback nếu backend trả về array trực tiếp
        setMovies(response);
        setPagination(prev => ({ ...prev, total: response.length }));
      } else {
        setMovies([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      console.error('Error loading movies:', error);
      message.error('Lỗi khi tải danh sách phim');
      setMovies([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    form.resetFields();
    setShowAddModal(true);
  };

  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
    form.setFieldsValue({
      title: movie.title,
      genre: Array.isArray(movie.genres)
        ? movie.genres.map(g => g.name || g).join(', ')
        : movie.genre,
      releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
      posterPath: movie.posterPath || movie.poster,
      backdropPath: movie.backdropPath || movie.backgroundImage,
      overview: movie.overview || movie.description,
      runtime: movie.runtime || movie.duration,
      voteAverage: movie.voteAverage || movie.rating,
      trailerUrl: movie.trailerUrl || movie.trailer,
      director: movie.director,
      productionCompany: movie.productionCompany || movie.productionStudio,
      isActive: movie.isActive !== undefined ? movie.isActive : true
    });
    setShowEditModal(true);
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await movieService.deleteMovie(movieId);
      message.success('Xóa phim thành công!');
      loadMovies(); // Reload danh sách
    } catch (error) {
      console.error('Error deleting movie:', error);
      message.error(error.response?.data?.message || 'Lỗi khi xóa phim');
    }
  };

  const handleToggleActive = async (movieId, currentStatus) => {
    try {
      // Gọi API activate hoặc deactivate
      if (currentStatus) {
        // Nếu đang active thì deactivate
        await movieService.deactiveMovie(movieId);
        message.success('Vô hiệu hóa phim thành công!');
      } else {
        // Nếu đang inactive thì activate
        await movieService.activeMovie(movieId);
        message.success('Kích hoạt phim thành công!');
      }

      loadMovies(); // Reload danh sách
    } catch (error) {
      console.error('Error toggling movie status:', error);
      message.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái phim');
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Chuẩn bị data theo format API
      const movieData = {
        title: values.title,
        overview: values.overview,
        releaseDate: values.releaseDate ? values.releaseDate.format('YYYY-MM-DD') : null,
        runtime: values.runtime,
        voteAverage: values.voteAverage,
        posterPath: values.posterPath,
        backdropPath: values.backdropPath,
        trailerUrl: values.trailerUrl,
        director: values.director,
        productionCompany: values.productionCompany,
        isActive: values.isActive !== undefined ? values.isActive : true,
        // Genres - chuyển từ string thành array nếu cần
        genres: values.genre
          ? values.genre.split(',').map(g => ({ name: g.trim() }))
          : []
      };

      if (showEditModal && selectedMovie) {
        // Update existing movie
        await movieService.updateMovie(selectedMovie.id, movieData);
        message.success('Cập nhật phim thành công!');
        setShowEditModal(false);
      } else {
        // Create new movie
        await movieService.createMovie(movieData);
        message.success('Thêm phim mới thành công!');
        setShowAddModal(false);
      }

      form.resetFields();
      setSelectedMovie(null);
      loadMovies(); // Reload danh sách
    } catch (error) {
      console.error('Error saving movie:', error);
      message.error(error.response?.data?.message || 'Lỗi khi lưu phim');
    }
  };

  const handleViewDetail = (movie) => {
    navigate(`/admin/movies/${movie.id}`);
  };

  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchText.toLowerCase()) ||
    movie.genre?.toLowerCase().includes(searchText.toLowerCase()) ||
    (Array.isArray(movie.genres) && movie.genres.some(g =>
      (g.name || g).toLowerCase().includes(searchText.toLowerCase())
    ))
  );

  const handleTableChange = (newPagination) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      total: pagination.total
    });
  };

  const columns = [
    {
      title: 'Poster',
      dataIndex: 'posterPath',
      key: 'posterPath',
      width: 100,
      render: (posterPath, record) => (
        <Image
          src={posterPath || record.poster}
          alt={record.title}
          width={60}
          height={80}
          style={{ borderRadius: '4px', objectFit: 'cover' }}
          fallback="data:image/png;base64,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"
        />
      ),
    },
    {
      title: 'Tên Phim',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <Button
          type="link"
          onClick={() => handleViewDetail(record)}
          style={{ padding: 0, height: 'auto', textAlign: 'left' }}
        >
          <Text strong style={{ color: '#1890ff' }}>{title}</Text>
        </Button>
      ),
    },
    {
      title: 'Thể Loại',
      dataIndex: 'genres',
      key: 'genres',
      render: (genres, record) => {
        const genreList = Array.isArray(genres)
          ? genres.map(g => g.name || g)
          : (record.genre || '').split(', ');

        return (
          <div>
            {genreList.slice(0, 3).map((g, index) => (
              <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                {g}
              </Tag>
            ))}
            {genreList.length > 3 && <Text type="secondary">...</Text>}
          </div>
        );
      },
    },
    {
      title: 'Ngày Phát Hành',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-'
    },
    {
      title: 'Thời Lượng',
      dataIndex: 'runtime',
      key: 'runtime',
      render: (runtime, record) => `${runtime || record.duration || 0} phút`,
    },
    {
      title: 'Đánh Giá',
      dataIndex: 'voteAverage',
      key: 'voteAverage',
      render: (voteAverage, record) => {
        const rating = voteAverage || record.rating || 0;
        return (
          <Space>
            <Rate disabled value={rating / 2} allowHalf style={{ fontSize: '14px' }} />
            <Text>{rating.toFixed(1)}/10</Text>
          </Space>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        // Map status values to display
        const statusMap = {
          'NOW_SHOWING': { text: 'Đang chiếu', color: 'green' },
          'COMING_SOON': { text: 'Sắp chiếu', color: 'orange' },
          'ENDED': { text: 'Đã kết thúc', color: 'default' }
        };
        const statusInfo = statusMap[status] || { text: status || 'N/A', color: 'default' };
        return (
          <Tag color={statusInfo.color}>
            {statusInfo.text}
          </Tag>
        );
      },
    },
    {
      title: 'Kích hoạt',
      dataIndex: 'isActive',
      key: 'active',
      width: 120,
      align: 'center',
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleActive(record.id, isActive)}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
        />
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditMovie(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa phim"
            description="Bạn có chắc chắn muốn xóa phim này?"
            onConfirm={() => handleDeleteMovie(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="movies-container">
      {/* Header */}
      <Card className="movies-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={2} style={{ margin: 0 }}>Quản lý Phim</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleAddMovie}
          >
            Thêm Phim Mới
          </Button>
        </div>

        {/* Search */}
        <Input
          placeholder="Tìm kiếm phim theo tên hoặc thể loại..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </Card>

      {/* Movies Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredMovies}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phim`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add Movie Modal */}
      <Modal
        title="Thêm Phim Mới"
        open={showAddModal}
        onCancel={() => {
          setShowAddModal(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true
          }}
        >
          <Form.Item
            label="Tên Phim"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Thể Loại"
            name="genre"
            rules={[{ required: true, message: 'Vui lòng nhập thể loại' }]}
          >
            <Input placeholder="Ví dụ: Hành động, Phiêu lưu, Khoa học viễn tưởng (phân cách bằng dấu phẩy)" />
          </Form.Item>

          <Space.Compact style={{ display: 'flex', width: '100%' }}>
            <Form.Item
              label="Ngày Phát Hành"
              name="releaseDate"
              rules={[{ required: true, message: 'Vui lòng nhập ngày phát hành' }]}
              style={{ flex: 1, marginRight: '8px' }}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              label="Thời Lượng (phút)"
              name="runtime"
              rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
              style={{ flex: 1, marginLeft: '8px' }}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Space.Compact>

          <Space.Compact style={{ display: 'flex', width: '100%' }}>
            <Form.Item
              label="Đánh Giá"
              name="voteAverage"
              rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
              style={{ flex: 1, marginRight: '8px' }}
            >
              <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="isActive"
              style={{ flex: 1, marginLeft: '8px' }}
            >
              <Select>
                <Option value={true}>Đang chiếu</Option>
                <Option value={false}>Sắp chiếu</Option>
              </Select>
            </Form.Item>
          </Space.Compact>

          <Form.Item
            label="Poster URL"
            name="posterPath"
          >
            <Input placeholder="Nhập URL hình ảnh poster" />
          </Form.Item>

          <Form.Item
            label="Background Image URL"
            name="backdropPath"
          >
            <Input placeholder="Nhập URL hình nền" />
          </Form.Item>

          <Form.Item
            label="Trailer URL"
            name="trailerUrl"
          >
            <Input placeholder="Nhập URL trailer" />
          </Form.Item>

          <Form.Item
            label="Đạo Diễn"
            name="director"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Hãng Sản Xuất"
            name="productionCompany"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô Tả"
            name="overview"
          >
            <TextArea rows={4} placeholder="Nhập mô tả phim" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setShowAddModal(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Thêm Phim
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Movie Modal */}
      <Modal
        title="Chỉnh Sửa Phim"
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          form.resetFields();
          setSelectedMovie(null);
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Tên Phim"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Thể Loại"
            name="genre"
            rules={[{ required: true, message: 'Vui lòng nhập thể loại' }]}
          >
            <Input placeholder="Ví dụ: Hành động, Phiêu lưu, Khoa học viễn tưởng" />
          </Form.Item>

          <Space.Compact style={{ display: 'flex', width: '100%' }}>
            <Form.Item
              label="Ngày Phát Hành"
              name="releaseDate"
              rules={[{ required: true, message: 'Vui lòng nhập ngày phát hành' }]}
              style={{ flex: 1, marginRight: '8px' }}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              label="Thời Lượng (phút)"
              name="runtime"
              rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
              style={{ flex: 1, marginLeft: '8px' }}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Space.Compact>

          <Space.Compact style={{ display: 'flex', width: '100%' }}>
            <Form.Item
              label="Đánh Giá"
              name="voteAverage"
              rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
              style={{ flex: 1, marginRight: '8px' }}
            >
              <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="isActive"
              style={{ flex: 1, marginLeft: '8px' }}
            >
              <Select>
                <Option value={true}>Đang chiếu</Option>
                <Option value={false}>Sắp chiếu</Option>
              </Select>
            </Form.Item>
          </Space.Compact>

          <Form.Item
            label="Poster URL"
            name="posterPath"
          >
            <Input placeholder="Nhập URL hình ảnh poster" />
          </Form.Item>

          <Form.Item
            label="Background Image URL"
            name="backdropPath"
          >
            <Input placeholder="Nhập URL hình nền" />
          </Form.Item>

          <Form.Item
            label="Trailer URL"
            name="trailerUrl"
          >
            <Input placeholder="Nhập URL trailer" />
          </Form.Item>

          <Form.Item
            label="Đạo Diễn"
            name="director"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Hãng Sản Xuất"
            name="productionCompany"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô Tả"
            name="overview"
          >
            <TextArea rows={4} placeholder="Nhập mô tả phim" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setShowEditModal(false);
                form.resetFields();
                setSelectedMovie(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Cập Nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Movies;
