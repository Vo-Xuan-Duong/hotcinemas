import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Row,
    Col,
    Tag,
    Typography,
    Divider,
    Space,
    Image,
    Rate,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    message,
    Spin,
    Alert,
    DatePicker
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    PlayCircleOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    StarOutlined,
    PictureOutlined,
    TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './MovieDetail.css';
import movieService from '../../../services/movieService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTrailerModal, setShowTrailerModal] = useState(false);

    useEffect(() => {
        loadMovieDetail();
    }, [id]);

    const loadMovieDetail = async () => {
        setLoading(true);
        try {
            const movieData = await movieService.getMovieById(id);
            if (movieData) {
                setMovie(movieData);
            } else {
                message.error('Không tìm thấy phim');
                navigate('/admin/movies');
            }
        } catch (error) {
            console.error('Error loading movie detail:', error);
            message.error('Lỗi khi tải thông tin phim');
            navigate('/admin/movies');
        } finally {
            setLoading(false);
        }
    };

    const handleEditMovie = () => {
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

    const handleSubmitEdit = async (values) => {
        try {
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
                genres: values.genre
                    ? values.genre.split(',').map(g => ({ name: g.trim() }))
                    : []
            };

            await movieService.updateMovie(movie.id, movieData);
            message.success('Cập nhật phim thành công!');
            setShowEditModal(false);
            form.resetFields();
            loadMovieDetail(); // Reload movie detail
        } catch (error) {
            console.error('Error updating movie:', error);
            message.error('Lỗi khi cập nhật phim');
        }
    };

    const handleDeleteMovie = () => {
        Modal.confirm({
            title: 'Xác nhận xóa phim',
            content: `Bạn có chắc chắn muốn xóa phim "${movie.title}"?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: async () => {
                try {
                    await movieService.deleteMovie(movie.id);
                    message.success('Xóa phim thành công!');
                    navigate('/admin/movies');
                } catch (error) {
                    console.error('Error deleting movie:', error);
                    message.error(error.response?.data?.message || 'Lỗi khi xóa phim');
                }
            }
        });
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!movie) {
        return (
            <Alert
                message="Không tìm thấy phim"
                description="Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
                type="error"
                showIcon
                action={
                    <Button onClick={() => navigate('/admin/movies')}>
                        Quay lại danh sách
                    </Button>
                }
            />
        );
    }

    return (
        <div className="movie-detail-container">
            {/* Header */}
            <Card className="movie-detail-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/admin/movies')}
                        size="large"
                    >
                        Quay lại
                    </Button>
                    <Space>
                        <Button
                            icon={<EditOutlined />}
                            onClick={handleEditMovie}
                            size="large"
                        >
                            Chỉnh sửa
                        </Button>
                        <Button
                            icon={<DeleteOutlined />}
                            onClick={handleDeleteMovie}
                            danger
                            size="large"
                        >
                            Xóa phim
                        </Button>
                    </Space>
                </div>
                <Title level={2} style={{ margin: 0 }}>
                    Chi tiết phim: {movie.title}
                </Title>
            </Card>

            {/* Movie Info */}
            <Row gutter={24}>
                <Col xs={24}>
                    {/* Thông tin phim */}
                    <Card title="Thông tin phim">
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div>
                                <Text strong>🎬 Tên phim: </Text>
                                <Text>{movie.title}</Text>
                            </div>
                            <div>
                                <Text strong>🎭 Thể loại: </Text>
                                <Space wrap>
                                    {Array.isArray(movie.genres)
                                        ? movie.genres.map((genre, index) => (
                                            <Tag key={index} color="blue">{genre.name || genre}</Tag>
                                        ))
                                        : movie.genre?.split(', ').map((genre, index) => (
                                            <Tag key={index} color="blue">{genre}</Tag>
                                        ))
                                    }
                                </Space>
                            </div>
                            <div>
                                <Text strong><CalendarOutlined /> Ngày phát hành: </Text>
                                <Text>{movie.releaseDate ? dayjs(movie.releaseDate).format('DD/MM/YYYY') : '-'}</Text>
                            </div>
                            <div>
                                <Text strong><ClockCircleOutlined /> Thời lượng: </Text>
                                <Text>{movie.runtime || movie.duration || 0} phút</Text>
                            </div>
                            <div>
                                <Text strong><StarOutlined /> Đánh giá: </Text>
                                <Rate disabled value={(movie.voteAverage || movie.rating || 0) / 2} allowHalf />
                                <Text style={{ marginLeft: '8px' }}>{(movie.voteAverage || movie.rating || 0).toFixed(1)}/10</Text>
                            </div>
                            <div>
                                <Text strong>� Trạng thái: </Text>
                                <Tag color={movie.isActive ? 'green' : 'orange'}>
                                    {movie.isActive ? 'Đang chiếu' : 'Sắp chiếu'}
                                </Tag>
                            </div>
                            <div>
                                <Text strong><TeamOutlined /> Đạo diễn: </Text>
                                <Text>{movie.director || '-'}</Text>
                            </div>
                            <div>
                                <Text strong>🏭 Hãng sản xuất: </Text>
                                <Text>{movie.productionCompany || movie.productionStudio || '-'}</Text>
                            </div>
                            {(movie.trailerUrl || movie.trailer) && (
                                <div>
                                    <Text strong><PlayCircleOutlined /> Trailer: </Text>
                                    <Button
                                        type="link"
                                        icon={<PlayCircleOutlined />}
                                        onClick={() => setShowTrailerModal(true)}
                                    >
                                        Xem trailer
                                    </Button>
                                </div>
                            )}

                            {/* Mô tả phim */}
                            {(movie.overview || movie.description) && (
                                <div style={{ marginTop: '8px' }}>
                                    <Text strong>📝 Mô tả: </Text>
                                    <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                                        {movie.overview || movie.description}
                                    </Paragraph>
                                </div>
                            )}
                        </Space>
                    </Card>

                    {/* Poster and Background Images - Moved to bottom */}
                    <Card title="Hình ảnh" style={{ marginTop: '16px' }}>
                        <Row gutter={[8, 8]}>
                            <Col xs={24} md={8}>
                                <Image
                                    src={movie.posterPath || movie.poster}
                                    alt={movie.title}
                                    style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
                                    fallback="data:image/png;base64,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"
                                />
                            </Col>

                            <Col xs={24} md={16}>
                                {(movie.backdropPath || movie.backgroundImage) ? (
                                    <Image
                                        src={movie.backdropPath || movie.backgroundImage}
                                        alt={`${movie.title} background`}
                                        style={{ width: '100%', borderRadius: '8px' }}
                                        fallback="data:image/png;base64,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"
                                    />
                                ) : (
                                    <div style={{
                                        padding: '60px 40px',
                                        textAlign: 'center',
                                        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                                        borderRadius: '8px',
                                        border: '2px dashed #d9d9d9',
                                        minHeight: '200px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '16px'
                                    }}>
                                        <PictureOutlined style={{ fontSize: '64px', color: '#bfbfbf' }} />
                                        <div>
                                            <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                                                Chưa có ảnh nền
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
                                                Ảnh backdrop/background sẽ hiển thị ở đây
                                            </Text>
                                        </div>
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
                <Card title="Diễn viên" style={{ marginTop: '24px' }}>
                    <Row gutter={[16, 16]}>
                        {movie.cast.map((actor, index) => (
                            <Col key={index} xs={12} sm={8} md={6} lg={4}>
                                <Card
                                    hoverable
                                    cover={
                                        <Image
                                            src={actor.avatar}
                                            alt={actor.name}
                                            height={200}
                                            style={{ objectFit: 'cover' }}
                                            fallback="data:image/png;base64,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"
                                        />
                                    }
                                >
                                    <Card.Meta
                                        title={actor.name}
                                        description={actor.character || 'Diễn viên'}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>
            )}

            {/* Edit Movie Modal */}
            <Modal
                title="Chỉnh sửa phim"
                open={showEditModal}
                onCancel={() => {
                    setShowEditModal(false);
                    form.resetFields();
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmitEdit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên phim"
                                name="title"
                                rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Thể loại"
                                name="genre"
                                rules={[{ required: true, message: 'Vui lòng nhập thể loại' }]}
                            >
                                <Input placeholder="Ví dụ: Hành động, Phiêu lưu, Khoa học viễn tưởng" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày phát hành"
                                name="releaseDate"
                                rules={[{ required: true, message: 'Vui lòng nhập ngày phát hành' }]}
                            >
                                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Thời lượng (phút)"
                                name="runtime"
                                rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Đánh giá"
                                name="voteAverage"
                                rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
                            >
                                <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Trạng thái"
                                name="isActive"
                            >
                                <Select>
                                    <Option value={true}>Đang chiếu</Option>
                                    <Option value={false}>Sắp chiếu</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

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
                        label="Đạo diễn"
                        name="director"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Hãng sản xuất"
                        name="productionCompany"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="overview"
                    >
                        <TextArea rows={4} placeholder="Nhập mô tả phim" />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setShowEditModal(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Trailer Modal */}
            <Modal
                title={<span><PlayCircleOutlined /> Xem Trailer</span>}
                open={showTrailerModal}
                onCancel={() => setShowTrailerModal(false)}
                footer={null}
                width={800}
                centered
            >
                {(movie?.trailerUrl || movie?.trailer) && (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            src={`https://www.youtube.com/embed/${getYouTubeId(movie.trailerUrl || movie.trailer)}`}
                            title="Movie Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

// Helper function to extract YouTube video ID
const getYouTubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
};

export default MovieDetail;
