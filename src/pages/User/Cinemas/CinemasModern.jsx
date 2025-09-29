import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Input,
    Select,
    Button,
    Tag,
    Rate,
    Skeleton,
    Empty,
    Space,
    Typography,
    Breadcrumb,
    Badge,
    Tooltip,
    Divider,
    Avatar,
    BackTop,
    FloatButton
} from 'antd';
import {
    SearchOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
    StarOutlined,
    RightOutlined,
    HomeOutlined,
    ShopOutlined,
    CarOutlined,
    WifiOutlined,
    CoffeeOutlined,
    SafetyOutlined,
    ArrowUpOutlined,
    CustomerServiceOutlined,
    CompassOutlined
} from '@ant-design/icons';
import { 
    MapPin, 
    Phone, 
    Clock, 
    Star, 
    Navigation,
    Car,
    Wifi,
    Coffee,
    Shield,
    Calendar,
    Ticket,
    Users,
    Zap
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import cinemasData from '../../../data/cinemas.json';
import './CinemasModern.css';

const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const CinemasModern = () => {
    const navigate = useNavigate();
    const [cinemas, setCinemas] = useState([]);
    const [filteredCinemas, setFilteredCinemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('all');
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [sortBy, setSortBy] = useState('popularity');

    // Load cinemas data
    useEffect(() => {
        loadCinemas();
    }, []);

    // Filter cinemas
    useEffect(() => {
        filterCinemas();
    }, [cinemas, searchText, selectedDistrict, selectedFeatures, sortBy]);

    const loadCinemas = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const processedCinemas = cinemasData.map((cinema, index) => ({
            ...cinema,
            id: cinema.id || index + 1,
            image: cinema.image || `https://picsum.photos/400/300?random=${index + 100}`,
            rating: cinema.rating || (Math.random() * 2 + 3.5).toFixed(1),
            totalReviews: Math.floor(Math.random() * 500 + 100),
            distance: Math.floor(Math.random() * 20 + 1),
            popularity: Math.floor(Math.random() * 100),
            features: cinema.features || [
                'Máy chiếu 4K',
                'Âm thanh Dolby Atmos',
                'Ghế massage',
                'Bãi đậu xe',
                'Wi-Fi miễn phí',
                'Quán café'
            ].slice(0, Math.floor(Math.random() * 4 + 2)),
            openHours: cinema.openHours || '08:00 - 23:00',
            district: cinema.district || ['Quận 1', 'Quận 3', 'Quận 7', 'Quận Bình Thạnh', 'Quận Tân Bình'][Math.floor(Math.random() * 5)],
            totalScreens: Math.floor(Math.random() * 8 + 4),
            capacity: Math.floor(Math.random() * 1000 + 500),
        }));
        
        setCinemas(processedCinemas);
        setLoading(false);
    };

    const filterCinemas = () => {
        let filtered = cinemas.filter(cinema => {
            const matchesSearch = cinema.name.toLowerCase().includes(searchText.toLowerCase()) ||
                                cinema.address?.toLowerCase().includes(searchText.toLowerCase());
            const matchesDistrict = selectedDistrict === 'all' || cinema.district === selectedDistrict;
            const matchesFeatures = selectedFeatures.length === 0 || 
                                  selectedFeatures.every(feature => cinema.features?.includes(feature));
            
            return matchesSearch && matchesDistrict && matchesFeatures;
        });

        // Sort cinemas
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'rating':
                    return parseFloat(b.rating) - parseFloat(a.rating);
                case 'distance':
                    return a.distance - b.distance;
                case 'popularity':
                    return b.popularity - a.popularity;
                default:
                    return b.popularity - a.popularity;
            }
        });

        setFilteredCinemas(filtered);
    };

    const getFeatureIcon = (feature) => {
        const iconMap = {
            'Máy chiếu 4K': <Zap size={14} />,
            'Âm thanh Dolby Atmos': <StarOutlined style={{ fontSize: 14 }} />,
            'Ghế massage': <SafetyOutlined style={{ fontSize: 14 }} />,
            'Bãi đậu xe': <Car size={14} />,
            'Wi-Fi miễn phí': <Wifi size={14} />,
            'Quán café': <Coffee size={14} />,
        };
        return iconMap[feature] || <StarOutlined style={{ fontSize: 14 }} />;
    };

    const getDistanceColor = (distance) => {
        if (distance <= 5) return '#52c41a';
        if (distance <= 10) return '#faad14';
        return '#ff4d4f';
    };

    const districts = ['Quận 1', 'Quận 3', 'Quận 7', 'Quận Bình Thạnh', 'Quận Tân Bình'];
    const allFeatures = ['Máy chiếu 4K', 'Âm thanh Dolby Atmos', 'Ghế massage', 'Bãi đậu xe', 'Wi-Fi miễn phí', 'Quán café'];

    const FilterSection = () => (
        <Card className="filter-section-cinemas" bodyStyle={{ padding: '20px' }}>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={6}>
                    <Search
                        placeholder="Tìm kiếm rạp chiếu..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size="large"
                        allowClear
                        prefix={<SearchOutlined />}
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        value={selectedDistrict}
                        onChange={setSelectedDistrict}
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="Chọn quận"
                    >
                        <Option value="all">Tất cả quận</Option>
                        {districts.map(district => (
                            <Option key={district} value={district}>{district}</Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Select
                        mode="multiple"
                        value={selectedFeatures}
                        onChange={setSelectedFeatures}
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="Chọn tiện ích"
                        maxTagCount={2}
                    >
                        {allFeatures.map(feature => (
                            <Option key={feature} value={feature}>
                                <Space>
                                    {getFeatureIcon(feature)}
                                    {feature}
                                </Space>
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        value={sortBy}
                        onChange={setSortBy}
                        size="large"
                        style={{ width: '100%' }}
                    >
                        <Option value="popularity">Phổ biến nhất</Option>
                        <Option value="rating">Đánh giá cao</Option>
                        <Option value="distance">Gần nhất</Option>
                        <Option value="name">Tên A-Z</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Button 
                        onClick={() => {
                            setSearchText('');
                            setSelectedDistrict('all');
                            setSelectedFeatures([]);
                            setSortBy('popularity');
                        }}
                        size="large"
                        block
                    >
                        Đặt lại
                    </Button>
                </Col>
            </Row>
        </Card>
    );

    const CinemaCard = ({ cinema }) => (
        <Card
            hoverable
            className="cinema-card-modern"
            cover={
                <div className="cinema-cover-modern">
                    <img 
                        src={cinema.image} 
                        alt={cinema.name}
                        className="cinema-image-modern"
                    />
                    <div className="cinema-overlay-modern">
                        <div className="overlay-content">
                            <Button 
                                type="primary"
                                size="large"
                                icon={<Calendar size={18} />}
                                className="schedule-btn-modern"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/cinemas/${cinema.id}`);
                                }}
                            >
                                Xem lịch chiếu
                            </Button>
                        </div>
                    </div>
                    <div className="cinema-badges">
                        <Badge 
                            count={`${cinema.distance}km`} 
                            style={{ 
                                backgroundColor: getDistanceColor(cinema.distance),
                                fontSize: '11px',
                                fontWeight: 600
                            }}
                        />
                    </div>
                </div>
            }
            bodyStyle={{ padding: '20px' }}
            onClick={() => navigate(`/cinemas/${cinema.id}`)}
        >
            <Meta
                avatar={
                    <Avatar 
                        size={48} 
                        icon={<ShopOutlined />} 
                        style={{ backgroundColor: '#ff6b35' }}
                    />
                }
                title={
                    <div className="cinema-title-section">
                        <Text strong className="cinema-name">{cinema.name}</Text>
                        <div className="cinema-rating">
                            <Rate 
                                disabled 
                                defaultValue={Math.floor(parseFloat(cinema.rating))} 
                                style={{ fontSize: '14px' }}
                            />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                {cinema.rating} ({cinema.totalReviews} đánh giá)
                            </Text>
                        </div>
                    </div>
                }
                description={
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                        <Space size={4}>
                            <MapPin size={14} color="#6b7280" />
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                {cinema.address}
                            </Text>
                        </Space>
                        
                        <Space size={4}>
                            <Clock size={14} color="#6b7280" />
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                Mở cửa: {cinema.openHours}
                            </Text>
                        </Space>

                        <Space size={4}>
                            <Phone size={14} color="#6b7280" />
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                {cinema.phone}
                            </Text>
                        </Space>

                        <Divider style={{ margin: '8px 0' }} />

                        <div className="cinema-stats">
                            <Row gutter={8}>
                                <Col span={8}>
                                    <div className="stat-item">
                                        <Text strong style={{ fontSize: '16px', color: '#ff6b35' }}>
                                            {cinema.totalScreens}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>
                                            Phòng chiếu
                                        </Text>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="stat-item">
                                        <Text strong style={{ fontSize: '16px', color: '#3b82f6' }}>
                                            {cinema.capacity}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>
                                            Chỗ ngồi
                                        </Text>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="stat-item">
                                        <Text strong style={{ fontSize: '16px', color: '#10b981' }}>
                                            {cinema.distance}km
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>
                                            Khoảng cách
                                        </Text>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <Divider style={{ margin: '8px 0' }} />

                        <div className="cinema-features">
                            <Text type="secondary" style={{ fontSize: '12px', marginBottom: '6px', display: 'block' }}>
                                Tiện ích:
                            </Text>
                            <Space wrap size={4}>
                                {cinema.features?.slice(0, 4).map((feature, index) => (
                                    <Tooltip key={index} title={feature}>
                                        <Tag 
                                            size="small" 
                                            icon={getFeatureIcon(feature)}
                                            color="processing"
                                            style={{ fontSize: '10px', padding: '2px 6px' }}
                                        >
                                            {feature.length > 10 ? feature.substring(0, 10) + '...' : feature}
                                        </Tag>
                                    </Tooltip>
                                ))}
                                {cinema.features?.length > 4 && (
                                    <Tag size="small" color="default" style={{ fontSize: '10px' }}>
                                        +{cinema.features.length - 4} khác
                                    </Tag>
                                )}
                            </Space>
                        </div>
                    </Space>
                }
            />
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Row gutter={8}>
                <Col span={12}>
                    <Button 
                        type="primary" 
                        icon={<Ticket size={14} />}
                        block
                        size="small"
                    >
                        Đặt vé ngay
                    </Button>
                </Col>
                <Col span={6}>
                    <Tooltip title="Chỉ đường">
                        <Button 
                            icon={<Navigation size={14} />}
                            block
                            size="small"
                        />
                    </Tooltip>
                </Col>
                <Col span={6}>
                    <Tooltip title="Gọi điện">
                        <Button 
                            icon={<Phone size={14} />}
                            block
                            size="small"
                        />
                    </Tooltip>
                </Col>
            </Row>
        </Card>
    );

    if (loading) {
        return (
            <div className="cinemas-modern loading">
                <div className="container">
                    <Skeleton active paragraph={{ rows: 2 }} />
                    <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                        {[...Array(6)].map((_, index) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                <Card loading />
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        );
    }

    return (
        <div className="cinemas-modern">
            {/* Breadcrumb */}
            <div className="breadcrumb-section">
                <div className="container">
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/">
                                <HomeOutlined /> Trang chủ
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <ShopOutlined /> Rạp chiếu
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <div className="container">
                {/* Page Header */}
                <div className="page-header-cinemas">
                    <Title level={1} className="page-title">
                        <Space>
                            🏢 Hệ thống rạp chiếu
                            <Badge count={filteredCinemas.length} color="#ff6b35" />
                        </Space>
                    </Title>
                    <Paragraph className="page-subtitle">
                        Khám phá hệ thống rạp chiếu hiện đại với công nghệ tiên tiến và dịch vụ tuyệt vời
                    </Paragraph>
                </div>

                {/* Filters */}
                <FilterSection />

                {/* Cinemas Grid */}
                <div className="cinemas-content">
                    {filteredCinemas.length > 0 ? (
                        <Row gutter={[20, 24]} className="cinemas-grid-modern">
                            {filteredCinemas.map((cinema) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={cinema.id}>
                                    <CinemaCard cinema={cinema} />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Space direction="vertical" align="center">
                                    <Text>Không tìm thấy rạp chiếu nào phù hợp</Text>
                                    <Button 
                                        type="primary" 
                                        onClick={() => {
                                            setSearchText('');
                                            setSelectedDistrict('all');
                                            setSelectedFeatures([]);
                                        }}
                                    >
                                        Đặt lại bộ lọc
                                    </Button>
                                </Space>
                            }
                            className="empty-state-cinemas"
                        />
                    )}
                </div>
            </div>

            {/* Floating Help Button */}
            <FloatButton
                icon={<CustomerServiceOutlined />}
                type="primary"
                style={{ right: 24, bottom: 80 }}
                tooltip="Hỗ trợ khách hàng"
            />

            {/* Back to Top */}
            <BackTop 
                style={{
                    height: 50,
                    width: 50,
                    backgroundColor: '#ff6b35',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                }}
            >
                <ArrowUpOutlined style={{ color: 'white', fontSize: '20px' }} />
            </BackTop>
        </div>
    );
};

export default CinemasModern;
