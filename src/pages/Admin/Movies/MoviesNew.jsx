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
    Rate
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined
} from '@ant-design/icons';
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

    useEffect(() => {
        loadMovies();
    }, []);

    const loadMovies = async () => {
        try {
            setLoading(true);
            const data = await movieService.getAllMovies();
            setMovies(data);
        } catch (error) {
            console.error('Error loading movies:', error);
            message.error('Lỗi khi tải danh sách phim');
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
            genre: movie.genre,
            releaseDate: movie.releaseDate,
            poster: movie.poster,
            backgroundImage: movie.backgroundImage,
            description: movie.description,
            duration: movie.duration,
            rating: movie.rating,
            ageLabel: movie.ageLabel,
            format: movie.format,
            trailer: movie.trailer,
            director: movie.director,
            productionStudio: movie.productionStudio
        });
        setShowEditModal(true);
    };

    const handleDeleteMovie = async (movieId) => {
        try {
            await movieService.deleteMovie(movieId);
            setMovies(movies.filter(movie => movie.id !== movieId));
            message.success('Xóa phim thành công!');
        } catch (error) {
            console.error('Error deleting movie:', error);
            message.error('Lỗi khi xóa phim');
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (showEditModal) {
                const updatedMovie = { ...selectedMovie, ...values };
                await movieService.updateMovie(selectedMovie.id, updatedMovie);
                setMovies(movies.map(movie => movie.id === selectedMovie.id ? updatedMovie : movie));
                message.success('Cập nhật phim thành công!');
                setShowEditModal(false);
            } else {
                const newMovie = {
                    id: Date.now(),
                    ...values,
                    cast: []
                };
                await movieService.createMovie(newMovie);
                setMovies([...movies, newMovie]);
                message.success('Thêm phim mới thành công!');
                setShowAddModal(false);
            }
            form.resetFields();
            setSelectedMovie(null);
        } catch (error) {
            console.error('Error saving movie:', error);
            message.error('Lỗi khi lưu phim');
        }
    };

    const handleViewDetail = (movie) => {
        navigate(`/admin/movies/${movie.id}`);
    };

    const filteredMovies = movies.filter(movie =>
        movie.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Poster',
            dataIndex: 'poster',
            key: 'poster',
            width: 100,
            render: (poster, record) => (
                <Image
                    src={poster}
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
            dataIndex: 'genre',
            key: 'genre',
            render: (genre) => (
                <div>
                    {genre?.split(', ').slice(0, 3).map((g, index) => (
                        <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                            {g}
                        </Tag>
                    ))}
                    {genre?.split(', ').length > 3 && <Text type="secondary">...</Text>}
                </div>
            ),
        },
        {
            title: 'Ngày Phát Hành',
            dataIndex: 'releaseDate',
            key: 'releaseDate',
        },
        {
            title: 'Thời Lượng',
            dataIndex: 'duration',
            key: 'duration',
            render: (duration) => `${duration} phút`,
        },
        {
            title: 'Đánh Giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => (
                <Space>
                    <Rate disabled value={rating / 2} allowHalf style={{ fontSize: '14px' }} />
                    <Text>{rating}/10</Text>
                </Space>
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
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phim`,
                    }}
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
                        format: '2D',
                        ageLabel: 'P'
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
                        <Input placeholder="Ví dụ: Hành động, Phiêu lưu, Khoa học viễn tưởng" />
                    </Form.Item>

                    <Space.Compact style={{ display: 'flex', width: '100%' }}>
                        <Form.Item
                            label="Ngày Phát Hành"
                            name="releaseDate"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày phát hành' }]}
                            style={{ flex: 1, marginRight: '8px' }}
                        >
                            <Input placeholder="dd.mm.yyyy" />
                        </Form.Item>

                        <Form.Item
                            label="Thời Lượng (phút)"
                            name="duration"
                            rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
                            style={{ flex: 1, marginLeft: '8px' }}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Space.Compact>

                    <Space.Compact style={{ display: 'flex', width: '100%' }}>
                        <Form.Item
                            label="Đánh Giá"
                            name="rating"
                            rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
                            style={{ flex: 1, marginRight: '8px' }}
                        >
                            <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Độ Tuổi"
                            name="ageLabel"
                            style={{ flex: 1, marginLeft: '8px' }}
                        >
                            <Select>
                                <Option value="P">P - Phim dành cho mọi lứa tuổi</Option>
                                <Option value="K">K - Phim dành cho trẻ em dưới 13 tuổi</Option>
                                <Option value="T13">T13 - Phim cấm trẻ em dưới 13 tuổi</Option>
                                <Option value="T16">T16 - Phim cấm trẻ em dưới 16 tuổi</Option>
                                <Option value="T18">T18 - Phim cấm trẻ em dưới 18 tuổi</Option>
                                <Option value="C">C - Phim cấm chiếu</Option>
                            </Select>
                        </Form.Item>
                    </Space.Compact>

                    <Form.Item
                        label="Định Dạng"
                        name="format"
                    >
                        <Select>
                            <Option value="2D">2D</Option>
                            <Option value="3D">3D</Option>
                            <Option value="IMAX">IMAX</Option>
                            <Option value="4DX">4DX</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Poster URL"
                        name="poster"
                    >
                        <Input placeholder="Nhập URL hình ảnh poster" />
                    </Form.Item>

                    <Form.Item
                        label="Background Image URL"
                        name="backgroundImage"
                    >
                        <Input placeholder="Nhập URL hình nền" />
                    </Form.Item>

                    <Form.Item
                        label="Trailer URL"
                        name="trailer"
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
                        name="productionStudio"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô Tả"
                        name="description"
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
                            <Input placeholder="dd.mm.yyyy" />
                        </Form.Item>

                        <Form.Item
                            label="Thời Lượng (phút)"
                            name="duration"
                            rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
                            style={{ flex: 1, marginLeft: '8px' }}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Space.Compact>

                    <Space.Compact style={{ display: 'flex', width: '100%' }}>
                        <Form.Item
                            label="Đánh Giá"
                            name="rating"
                            rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
                            style={{ flex: 1, marginRight: '8px' }}
                        >
                            <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Độ Tuổi"
                            name="ageLabel"
                            style={{ flex: 1, marginLeft: '8px' }}
                        >
                            <Select>
                                <Option value="P">P - Phim dành cho mọi lứa tuổi</Option>
                                <Option value="K">K - Phim dành cho trẻ em dưới 13 tuổi</Option>
                                <Option value="T13">T13 - Phim cấm trẻ em dưới 13 tuổi</Option>
                                <Option value="T16">T16 - Phim cấm trẻ em dưới 16 tuổi</Option>
                                <Option value="T18">T18 - Phim cấm trẻ em dưới 18 tuổi</Option>
                                <Option value="C">C - Phim cấm chiếu</Option>
                            </Select>
                        </Form.Item>
                    </Space.Compact>

                    <Form.Item
                        label="Định Dạng"
                        name="format"
                    >
                        <Select>
                            <Option value="2D">2D</Option>
                            <Option value="3D">3D</Option>
                            <Option value="IMAX">IMAX</Option>
                            <Option value="4DX">4DX</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Poster URL"
                        name="poster"
                    >
                        <Input placeholder="Nhập URL hình ảnh poster" />
                    </Form.Item>

                    <Form.Item
                        label="Background Image URL"
                        name="backgroundImage"
                    >
                        <Input placeholder="Nhập URL hình nền" />
                    </Form.Item>

                    <Form.Item
                        label="Trailer URL"
                        name="trailer"
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
                        name="productionStudio"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô Tả"
                        name="description"
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
