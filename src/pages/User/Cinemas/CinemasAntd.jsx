import React, { useState, useMemo, useCallback } from 'react';
import {
    Row,
    Col,
    Card,
    Input,
    Select,
    Button,
    Typography,
    Space,
    Tag,
    Rate,
    Divider,
    Empty,
    Badge,
    Tooltip,
    Skeleton
} from 'antd';
import {
    SearchOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
    StarFilled,
    EyeOutlined,
    CarOutlined,
    CoffeeOutlined,
    WifiOutlined,
    ThunderboltOutlined,
    AimOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './CinemasAntd.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Meta } = Card;

const mockCinemas = [
    {
        id: 1,
        name: 'CGV Vincom Đồng Khởi',
        city: 'Hồ Chí Minh',
        district: 'Quận 1',
        address: '72 Lê Thánh Tôn, Quận 1, TP.HCM',
        phone: '1900 6017',
        image: 'https://images.unsplash.com/photo-1489599387367-7f72ca2d3085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        description: 'Rạp CGV hiện đại, trung tâm thành phố, nhiều phòng chiếu chất lượng cao với công nghệ IMAX và 4DX.',
        rating: 4.5,
        totalReviews: 1234,
        openTime: '08:00 - 24:00',
        totalScreens: 12,
        features: ['IMAX', '4DX', 'VIP', 'Parking'],
        amenities: ['Parking', 'Restaurant', 'WiFi', 'Air Conditioning'],
        price: 'high',
        status: 'open'
    },
    {
        id: 2,
        name: 'Lotte Cinema Gò Vấp',
        city: 'Hồ Chí Minh',
        district: 'Gò Vấp',
        address: '242 Nguyễn Văn Lượng, Gò Vấp, TP.HCM',
        phone: '1900 5888',
        image: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        description: 'Rạp Lotte với hệ thống âm thanh Dolby Atmos, ghế ngồi thoải mái và dịch vụ tuyệt vời.',
        rating: 4.3,
        totalReviews: 987,
        openTime: '09:00 - 23:30',
        totalScreens: 8,
        features: ['Dolby Atmos', 'VIP', 'Super Plex'],
        amenities: ['Parking', 'Cafe', 'WiFi', 'Air Conditioning'],
        price: 'medium',
        status: 'open'
    },
    {
        id: 3,
        name: 'BHD Star Bitexco',
        city: 'Hồ Chí Minh',
        district: 'Quận 1',
        address: '2 Hải Triều, Quận 1, TP.HCM',
        phone: '1900 2099',
        image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        description: 'Rạp BHD Star nằm trong tòa nhà Bitexco, view đẹp, nhiều suất chiếu và không gian sang trọng.',
        rating: 4.7,
        totalReviews: 1567,
        openTime: '10:00 - 24:00',
        totalScreens: 6,
        features: ['Premium', 'VIP', 'City View'],
        amenities: ['Parking', 'Restaurant', 'WiFi', 'Premium Lounge'],
        price: 'high',
        status: 'open'
    },
    {
        id: 4,
        name: 'CGV Aeon Hà Đông',
        city: 'Hà Nội',
        district: 'Hà Đông',
        address: 'Số 10, Đường Tố Hữu, Hà Đông, Hà Nội',
        phone: '1900 6017',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        description: 'Rạp CGV lớn nhất khu vực Hà Đông, nhiều phòng chiếu, dịch vụ tốt và giá cả phải chăng.',
        rating: 4.2,
        totalReviews: 743,
        openTime: '08:30 - 23:00',
        totalScreens: 10,
        features: ['Standard', '3D', 'VIP'],
        amenities: ['Parking', 'Food Court', 'WiFi', 'Shopping Mall'],
        price: 'medium',
        status: 'open'
    },
    {
        id: 5,
        name: 'Galaxy Cinema Nguyễn Du',
        city: 'Hà Nội',
        district: 'Hai Bà Trưng',
        address: '116 Nguyễn Du, Hai Bà Trưng, Hà Nội',
        phone: '1900 2224',
        image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        description: 'Rạp Galaxy Cinema với thiết kế hiện đại, âm thanh chất lượng cao và dịch vụ chu đáo.',
        rating: 4.4,
        totalReviews: 892,
        openTime: '09:00 - 23:30',
        totalScreens: 7,
        features: ['Dolby Digital', 'VIP', 'Standard'],
        amenities: ['Parking', 'Cafe', 'WiFi', 'Game Zone'],
        price: 'medium',
        status: 'maintenance'
    },
    {
        id: 6,
        name: 'Cinestar Quốc Thanh',
        city: 'Hà Nội',
        district: 'Đống Đa',
        address: '271 Nguyễn Trãi, Đống Đa, Hà Nội',
        phone: '1900 6099',
        image: 'https://images.unsplash.com/photo-1489599387367-7f72ca2d3085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        description: 'Rạp Cinestar với không gian ấm cúng, giá cả hợp lý và phục vụ nhiệt tình.',
        rating: 4.1,
        totalReviews: 456,
        openTime: '10:00 - 22:30',
        totalScreens: 5,
        features: ['Standard', '3D'],
        amenities: ['Cafe', 'WiFi', 'Air Conditioning'],
        price: 'low',
        status: 'open'
    }
];

const uniqueCities = [...new Set(mockCinemas.map(c => c.city))];
const uniqueDistricts = [...new Set(mockCinemas.map(c => c.district))];

const CinemasAntd = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [sortBy, setSortBy] = useState('rating');
    const [loading, setLoading] = useState(false);

    // Memoized unique values for better performance
    const uniqueCities = useMemo(() =>
        [...new Set(mockCinemas.map(cinema => cinema.city))],
        []
    );

    const uniqueDistricts = useMemo(() =>
        [...new Set(mockCinemas.map(cinema => cinema.district))],
        []
    );

    // Memoized filtered cinemas to avoid recalculation
    const filteredCinemas = useMemo(() => {
        return mockCinemas
            .filter(cinema => {
                const matchName = cinema.name.toLowerCase().includes(search.toLowerCase());
                const matchCity = city ? cinema.city === city : true;
                const matchDistrict = district ? cinema.district === district : true;
                return matchName && matchCity && matchDistrict;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'rating':
                        return b.rating - a.rating;
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'reviews':
                        return b.totalReviews - a.totalReviews;
                    default:
                        return 0;
                }
            });
    }, [search, city, district, sortBy]);

    // Callback functions to prevent re-renders
    const handleCinemaClick = useCallback((cinemaId) => {
        navigate(`/cinemas/${cinemaId}`);
    }, [navigate]);

    const handleDirections = useCallback((cinema) => {
        const address = encodeURIComponent(cinema.address);
        window.open(`https://maps.google.com/?q=${address}`, '_blank');
    }, []);

    const getPriceColor = (price) => {
        switch (price) {
            case 'high': return '#ff4d4f';
            case 'medium': return '#faad14';
            case 'low': return '#52c41a';
            default: return '#d9d9d9';
        }
    };

    const getPriceText = (price) => {
        switch (price) {
            case 'high': return 'Cao cấp';
            case 'medium': return 'Trung bình';
            case 'low': return 'Bình dân';
            default: return 'N/A';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'success';
            case 'maintenance': return 'warning';
            case 'closed': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'open': return 'Đang hoạt động';
            case 'maintenance': return 'Bảo trì';
            case 'closed': return 'Đóng cửa';
            default: return 'N/A';
        }
    };

    const getFeatureIcon = (feature) => {
        switch (feature) {
            case 'IMAX': return <ThunderboltOutlined />;
            case '4DX': return <ThunderboltOutlined />;
            case 'Dolby Atmos': return <ThunderboltOutlined />;
            case 'VIP': return <StarFilled />;
            default: return null;
        }
    };

    const handleViewDetail = (cinemaId) => {
        navigate(`/cinemas/${cinemaId}`);
    };

    return (
        <div className="cinemas-antd">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <Title level={2} className="page-title">
                        🎬 Hệ thống rạp chiếu
                    </Title>
                    <Paragraph className="page-description">
                        Khám phá các rạp chiếu phim hiện đại với công nghệ âm thanh, hình ảnh tốt nhất
                    </Paragraph>
                </div>

                {/* Filters */}
                <Card className="filter-card">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} md={6}>
                            <Input
                                prefix={<SearchOutlined />}
                                placeholder="Tìm kiếm tên rạp..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                allowClear
                                size="large"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={5}>
                            <Select
                                placeholder="Chọn thành phố"
                                value={city}
                                onChange={setCity}
                                allowClear
                                size="large"
                                style={{ width: '100%' }}
                            >
                                {uniqueCities.map(c => (
                                    <Option key={c} value={c}>{c}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={5}>
                            <Select
                                placeholder="Chọn quận/huyện"
                                value={district}
                                onChange={setDistrict}
                                allowClear
                                size="large"
                                style={{ width: '100%' }}
                                disabled={!city}
                            >
                                {uniqueDistricts
                                    .filter(d => city ? mockCinemas.find(c => c.city === city && c.district === d) : true)
                                    .map(d => (
                                        <Option key={d} value={d}>{d}</Option>
                                    ))}
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={5}>
                            <Select
                                placeholder="Sắp xếp theo"
                                value={sortBy}
                                onChange={setSortBy}
                                size="large"
                                style={{ width: '100%' }}
                            >
                                <Option value="rating">Đánh giá cao nhất</Option>
                                <Option value="name">Tên rạp (A-Z)</Option>
                                <Option value="reviews">Số lượt đánh giá</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={24} md={3}>
                            <Text strong>
                                {filteredCinemas.length} rạp
                            </Text>
                        </Col>
                    </Row>
                </Card>

                {/* Cinema Grid */}
                <div className="cinemas-section">
                    {filteredCinemas.length === 0 ? (
                        <Empty
                            description="Không tìm thấy rạp chiếu phù hợp"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <Row gutter={[24, 24]}>
                            {filteredCinemas.map(cinema => (
                                <Col key={cinema.id} xs={24} sm={12} lg={8}>
                                    <Card
                                        hoverable
                                        className="cinema-card-antd"
                                        cover={
                                            <div className="cinema-image">
                                                <img
                                                    alt={cinema.name}
                                                    src={cinema.image}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/350x200?text=No+Image';
                                                    }}
                                                />
                                                <div className="cinema-overlay">
                                                    <Button
                                                        type="primary"
                                                        icon={<EyeOutlined />}
                                                        size="large"
                                                        onClick={() => handleViewDetail(cinema.id)}
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                </div>
                                                <div className="cinema-status">
                                                    <Badge
                                                        status={getStatusColor(cinema.status)}
                                                        text={getStatusText(cinema.status)}
                                                    />
                                                </div>
                                            </div>
                                        }
                                        actions={[
                                            <Button type="link" onClick={() => handleViewDetail(cinema.id)}>
                                                <EyeOutlined /> Chi tiết
                                            </Button>,
                                            <Button type="link">
                                                <EnvironmentOutlined /> Chỉ đường
                                            </Button>
                                        ]}
                                    >
                                        <Meta
                                            title={
                                                <div className="cinema-title">
                                                    <Title level={4} className="cinema-name">
                                                        {cinema.name}
                                                    </Title>
                                                    <Tag color={getPriceColor(cinema.price)} className="price-tag">
                                                        {getPriceText(cinema.price)}
                                                    </Tag>
                                                </div>
                                            }
                                            description={
                                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                    {/* Location */}
                                                    <div className="cinema-location">
                                                        <EnvironmentOutlined className="location-icon" />
                                                        <Text className="location-text">
                                                            {cinema.district}, {cinema.city}
                                                        </Text>
                                                    </div>

                                                    {/* Address */}
                                                    <Text type="secondary" className="cinema-address">
                                                        {cinema.address}
                                                    </Text>

                                                    {/* Rating */}
                                                    <div className="cinema-rating">
                                                        <Rate
                                                            disabled
                                                            defaultValue={cinema.rating}
                                                            allowHalf
                                                            style={{ fontSize: '14px' }}
                                                        />
                                                        <Text strong>{cinema.rating}</Text>
                                                        <Text type="secondary">({cinema.totalReviews} đánh giá)</Text>
                                                    </div>

                                                    {/* Features */}
                                                    <div className="cinema-features">
                                                        <Space wrap size={[4, 4]}>
                                                            {cinema.features.slice(0, 3).map(feature => (
                                                                <Tag
                                                                    key={feature}
                                                                    icon={getFeatureIcon(feature)}
                                                                    color="blue"
                                                                    size="small"
                                                                >
                                                                    {feature}
                                                                </Tag>
                                                            ))}
                                                            {cinema.features.length > 3 && (
                                                                <Tag size="small">+{cinema.features.length - 3}</Tag>
                                                            )}
                                                        </Space>
                                                    </div>

                                                    {/* Info */}
                                                    <div className="cinema-info">
                                                        <Space size="large">
                                                            <Tooltip title="Giờ mở cửa">
                                                                <Space size={4}>
                                                                    <ClockCircleOutlined />
                                                                    <Text>{cinema.openTime}</Text>
                                                                </Space>
                                                            </Tooltip>
                                                            <Tooltip title="Số phòng chiếu">
                                                                <Space size={4}>
                                                                    <Text>{cinema.totalScreens} phòng</Text>
                                                                </Space>
                                                            </Tooltip>
                                                        </Space>
                                                    </div>

                                                    {/* Amenities */}
                                                    <div className="cinema-amenities">
                                                        <Space>
                                                            {cinema.amenities.includes('Parking') && (
                                                                <Tooltip title="Bãi đỗ xe">
                                                                    <CarOutlined />
                                                                </Tooltip>
                                                            )}
                                                            {cinema.amenities.includes('Cafe') && (
                                                                <Tooltip title="Quán café">
                                                                    <CoffeeOutlined />
                                                                </Tooltip>
                                                            )}
                                                            {cinema.amenities.includes('WiFi') && (
                                                                <Tooltip title="WiFi miễn phí">
                                                                    <WifiOutlined />
                                                                </Tooltip>
                                                            )}
                                                        </Space>
                                                    </div>
                                                </Space>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CinemasAntd;
