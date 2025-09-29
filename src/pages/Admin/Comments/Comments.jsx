import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Table,
    Modal,
    Form,
    Input,
    Select,
    Space,
    Image,
    Tag,
    Typography,
    message,
    Popconfirm,
    Rate,
    Avatar,
    Tooltip,
    Badge,
    Tabs
} from 'antd';
import {
    EyeOutlined,
    DeleteOutlined,
    CheckOutlined,
    CloseOutlined,
    SearchOutlined,
    MessageOutlined,
    LikeOutlined,
    WarningOutlined,
    FilterOutlined,
    UserOutlined
} from '@ant-design/icons';
import './Comments.css';
import commentsData from '../../../data/comments.json';
import moviesData from '../../../data/movies.json';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const Comments = () => {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [movieFilter, setMovieFilter] = useState('all');
    const [selectedComment, setSelectedComment] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        loadComments();
    }, []);

    useEffect(() => {
        filterComments();
    }, [comments, searchText, statusFilter, movieFilter, activeTab]);

    const loadComments = async () => {
        try {
            setLoading(true);
            // Sử dụng dữ liệu mẫu
            setComments(commentsData);
        } catch (error) {
            console.error('Error loading comments:', error);
            message.error('Lỗi khi tải danh sách bình luận');
        } finally {
            setLoading(false);
        }
    };

    const filterComments = () => {
        let filtered = [...comments];

        // Filter by tab
        if (activeTab !== 'all') {
            filtered = filtered.filter(comment => comment.status === activeTab);
        }

        // Filter by search text
        if (searchText) {
            filtered = filtered.filter(comment =>
                comment.comment.toLowerCase().includes(searchText.toLowerCase()) ||
                comment.userName.toLowerCase().includes(searchText.toLowerCase()) ||
                comment.movieTitle.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(comment => comment.status === statusFilter);
        }

        // Filter by movie
        if (movieFilter !== 'all') {
            filtered = filtered.filter(comment => comment.movieId === parseInt(movieFilter));
        }

        setFilteredComments(filtered);
    };

    const handleApproveComment = async (commentId) => {
        try {
            const updatedComments = comments.map(comment =>
                comment.id === commentId ? { ...comment, status: 'approved' } : comment
            );
            setComments(updatedComments);
            message.success('Đã duyệt bình luận');
        } catch (error) {
            console.error('Error approving comment:', error);
            message.error('Lỗi khi duyệt bình luận');
        }
    };

    const handleRejectComment = async (commentId) => {
        try {
            const updatedComments = comments.map(comment =>
                comment.id === commentId ? { ...comment, status: 'rejected' } : comment
            );
            setComments(updatedComments);
            message.success('Đã từ chối bình luận');
        } catch (error) {
            console.error('Error rejecting comment:', error);
            message.error('Lỗi khi từ chối bình luận');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const updatedComments = comments.filter(comment => comment.id !== commentId);
            setComments(updatedComments);
            message.success('Đã xóa bình luận');
        } catch (error) {
            console.error('Error deleting comment:', error);
            message.error('Lỗi khi xóa bình luận');
        }
    };

    const handleViewDetail = (comment) => {
        setSelectedComment(comment);
        setShowDetailModal(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'green';
            case 'pending': return 'orange';
            case 'rejected': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'approved': return 'Đã duyệt';
            case 'pending': return 'Chờ duyệt';
            case 'rejected': return 'Đã từ chối';
            default: return status;
        }
    };

    const columns = [
        {
            title: 'Người dùng',
            key: 'user',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Avatar src={record.userAvatar} icon={<UserOutlined />} />
                    <div>
                        <Text strong>{record.userName}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            ID: {record.userId}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Phim',
            dataIndex: 'movieTitle',
            key: 'movieTitle',
            width: 150,
            render: (title, record) => (
                <Button
                    type="link"
                    onClick={() => navigate(`/admin/movies/${record.movieId}`)}
                    style={{ padding: 0, height: 'auto' }}
                >
                    {title}
                </Button>
            ),
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            width: 120,
            render: (rating) => (
                <Space>
                    <Rate disabled value={rating} style={{ fontSize: '14px' }} />
                    <Text>{rating}/10</Text>
                </Space>
            ),
        },
        {
            title: 'Bình luận',
            dataIndex: 'comment',
            key: 'comment',
            render: (comment) => (
                <Paragraph
                    ellipsis={{ rows: 2, expandable: false }}
                    style={{ margin: 0, maxWidth: '300px' }}
                >
                    {comment}
                </Paragraph>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 140,
            render: (date) => formatDate(date),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status, record) => (
                <Space direction="vertical" size={4}>
                    <Tag color={getStatusColor(status)}>
                        {getStatusText(status)}
                    </Tag>
                    {record.isReported && (
                        <Badge count={record.reports} size="small">
                            <Tag color="red" icon={<WarningOutlined />}>
                                Bị báo cáo
                            </Tag>
                        </Badge>
                    )}
                </Space>
            ),
        },
        {
            title: 'Tương tác',
            key: 'interactions',
            width: 100,
            render: (_, record) => (
                <Space direction="vertical" size={4}>
                    <Text style={{ fontSize: '12px' }}>
                        <LikeOutlined /> {record.likes}
                    </Text>
                    {record.reports > 0 && (
                        <Text style={{ fontSize: '12px', color: 'red' }}>
                            <WarningOutlined /> {record.reports}
                        </Text>
                    )}
                </Space>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleViewDetail(record)}
                        />
                    </Tooltip>
                    {record.status === 'pending' && (
                        <>
                            <Tooltip title="Duyệt bình luận">
                                <Button
                                    icon={<CheckOutlined />}
                                    size="small"
                                    type="primary"
                                    onClick={() => handleApproveComment(record.id)}
                                />
                            </Tooltip>
                            <Tooltip title="Từ chối">
                                <Button
                                    icon={<CloseOutlined />}
                                    size="small"
                                    danger
                                    onClick={() => handleRejectComment(record.id)}
                                />
                            </Tooltip>
                        </>
                    )}
                    <Popconfirm
                        title="Xóa bình luận"
                        description="Bạn có chắc chắn muốn xóa bình luận này?"
                        onConfirm={() => handleDeleteComment(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Tooltip title="Xóa">
                            <Button
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const tabItems = [
        { key: 'all', label: `Tất cả (${comments.length})`, icon: <MessageOutlined /> },
        { key: 'pending', label: `Chờ duyệt (${comments.filter(c => c.status === 'pending').length})`, icon: <FilterOutlined /> },
        { key: 'approved', label: `Đã duyệt (${comments.filter(c => c.status === 'approved').length})`, icon: <CheckOutlined /> },
        { key: 'rejected', label: `Đã từ chối (${comments.filter(c => c.status === 'rejected').length})`, icon: <CloseOutlined /> }
    ];

    return (
        <div className="comments-container">
            {/* Header */}
            <Card className="comments-header">
                <Title level={2} style={{ margin: 0, marginBottom: '16px' }}>
                    Quản lý Bình luận
                </Title>

                {/* Filters */}
                <Space wrap size="middle">
                    <Input
                        placeholder="Tìm kiếm bình luận..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: '250px' }}
                    />

                    <Select
                        placeholder="Lọc theo phim"
                        value={movieFilter}
                        onChange={setMovieFilter}
                        style={{ width: '200px' }}
                    >
                        <Option value="all">Tất cả phim</Option>
                        {moviesData.map(movie => (
                            <Option key={movie.id} value={movie.id.toString()}>
                                {movie.title}
                            </Option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Lọc theo trạng thái"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: '150px' }}
                    >
                        <Option value="all">Tất cả</Option>
                        <Option value="pending">Chờ duyệt</Option>
                        <Option value="approved">Đã duyệt</Option>
                        <Option value="rejected">Đã từ chối</Option>
                    </Select>
                </Space>
            </Card>

            {/* Comments Table with Tabs */}
            <Card>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                />

                <Table
                    columns={columns}
                    dataSource={filteredComments}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bình luận`,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Comment Detail Modal */}
            <Modal
                title="Chi tiết bình luận"
                open={showDetailModal}
                onCancel={() => {
                    setShowDetailModal(false);
                    setSelectedComment(null);
                }}
                footer={null}
                width={800}
            >
                {selectedComment && (
                    <div>
                        {/* User Info */}
                        <Card title="Thông tin người dùng" size="small" style={{ marginBottom: '16px' }}>
                            <Space>
                                <Avatar src={selectedComment.userAvatar} size={64} icon={<UserOutlined />} />
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>{selectedComment.userName}</Title>
                                    <Text type="secondary">ID: {selectedComment.userId}</Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Movie Info */}
                        <Card title="Thông tin phim" size="small" style={{ marginBottom: '16px' }}>
                            <Space>
                                <Text strong>Phim:</Text>
                                <Button
                                    type="link"
                                    onClick={() => {
                                        setShowDetailModal(false);
                                        navigate(`/admin/movies/${selectedComment.movieId}`);
                                    }}
                                >
                                    {selectedComment.movieTitle}
                                </Button>
                            </Space>
                        </Card>

                        {/* Comment Content */}
                        <Card title="Nội dung bình luận" size="small" style={{ marginBottom: '16px' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div>
                                    <Text strong>Đánh giá: </Text>
                                    <Rate disabled value={selectedComment.rating} />
                                    <Text style={{ marginLeft: '8px' }}>{selectedComment.rating}/10</Text>
                                </div>
                                <div>
                                    <Text strong>Bình luận:</Text>
                                    <Paragraph style={{ marginTop: '8px', padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                                        {selectedComment.comment}
                                    </Paragraph>
                                </div>
                                <div>
                                    <Text strong>Ngày tạo: </Text>
                                    <Text>{formatDate(selectedComment.createdAt)}</Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Status & Stats */}
                        <Card title="Trạng thái & Thống kê" size="small" style={{ marginBottom: '16px' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div>
                                    <Text strong>Trạng thái: </Text>
                                    <Tag color={getStatusColor(selectedComment.status)}>
                                        {getStatusText(selectedComment.status)}
                                    </Tag>
                                </div>
                                <div>
                                    <Text strong>Lượt thích: </Text>
                                    <Text>{selectedComment.likes}</Text>
                                </div>
                                <div>
                                    <Text strong>Lượt báo cáo: </Text>
                                    <Text>{selectedComment.reports}</Text>
                                </div>
                                {selectedComment.reportReasons.length > 0 && (
                                    <div>
                                        <Text strong>Lý do báo cáo: </Text>
                                        <Space wrap>
                                            {selectedComment.reportReasons.map((reason, index) => (
                                                <Tag key={index} color="red">{reason}</Tag>
                                            ))}
                                        </Space>
                                    </div>
                                )}
                            </Space>
                        </Card>

                        {/* Actions */}
                        <div style={{ textAlign: 'right' }}>
                            <Space>
                                {selectedComment.status === 'pending' && (
                                    <>
                                        <Button
                                            type="primary"
                                            icon={<CheckOutlined />}
                                            onClick={() => {
                                                handleApproveComment(selectedComment.id);
                                                setShowDetailModal(false);
                                            }}
                                        >
                                            Duyệt bình luận
                                        </Button>
                                        <Button
                                            danger
                                            icon={<CloseOutlined />}
                                            onClick={() => {
                                                handleRejectComment(selectedComment.id);
                                                setShowDetailModal(false);
                                            }}
                                        >
                                            Từ chối
                                        </Button>
                                    </>
                                )}
                                <Popconfirm
                                    title="Xóa bình luận"
                                    description="Bạn có chắc chắn muốn xóa bình luận này?"
                                    onConfirm={() => {
                                        handleDeleteComment(selectedComment.id);
                                        setShowDetailModal(false);
                                    }}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button danger icon={<DeleteOutlined />}>
                                        Xóa bình luận
                                    </Button>
                                </Popconfirm>
                            </Space>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Comments;
