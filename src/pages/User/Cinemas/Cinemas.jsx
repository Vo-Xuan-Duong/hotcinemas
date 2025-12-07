import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Card,
    Row,
    Col,
    Input,
    Select,
    Button,
    Tag,
    Typography,
    Breadcrumb,
    Space,
    Avatar,
    Divider,
    Empty,
    Spin,
    message,
    Tabs,
    Dropdown,
    Pagination
} from 'antd';
import {
    SearchOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
    StarOutlined,
    HomeOutlined,
    ShopOutlined,
    RightOutlined,
    AppstoreOutlined,
    DownOutlined
} from '@ant-design/icons';
import cinemaService from '../../../services/cinemaService';
import cityService from '../../../services/cityService';
import './Cinemas.css';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const Cinemas = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedCity, setSelectedCity] = useState('all');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Data states
    const [cinemas, setCinemas] = useState([]);
    const [cities, setCities] = useState([]);

    // Load initial data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all data in parallel
                const [cinemasResponse, citiesResponse] = await Promise.all([
                    cinemaService.getAllCinemas({ size: 1000 }),
                    cityService.getAllCities()
                ]);

                // Extract data from responses
                const cinemasData = Array.isArray(cinemasResponse?.data?.content)
                    ? cinemasResponse.data.content
                    : (Array.isArray(cinemasResponse?.data) ? cinemasResponse.data : []);

                const citiesData = Array.isArray(citiesResponse?.data?.content)
                    ? citiesResponse.data.content
                    : (Array.isArray(citiesResponse?.data) ? citiesResponse.data : []);

                setCinemas(cinemasData);

                // Add 'all' option to cities
                const cityOptions = ['all', ...citiesData.map(city => city.name || city)];
                setCities(cityOptions);

                console.log('Loaded cinemas:', cinemasData);
                console.log('Loaded cities:', citiesData);
            } catch (error) {
                console.error('Error loading data:', error);
                message.error('Không thể tải danh sách rạp chiếu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter cinemas based on search and city
    const filteredCinemas = cinemas.filter(cinema => {
        // Search filter
        const matchesSearch = !searchText ||
            cinema.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            cinema.address?.toLowerCase().includes(searchText.toLowerCase());

        // City filter - compare with city name or city object
        const cinemaCity = typeof cinema.city === 'object' ? cinema.city?.name : cinema.cityId;
        const matchesCity = selectedCity === 'all' || cinemaCity === selectedCity;

        return matchesSearch && matchesCity;
    });

    const handleCinemaClick = (cinema) => {
        // Navigate to cinema detail page
        console.log('Selected cinema:', cinema);
    };

    // Get paginated cinemas
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCinemas = filteredCinemas.slice(startIndex, endIndex);

    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="cinemas-new">
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
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Spin size="large" />
                        <Title level={4} style={{ marginTop: 16, color: 'var(--text-primary)' }}>
                            Đang tải danh sách rạp...
                        </Title>
                    </div>
                </div>
            </div>
        );
    }

    const amenitiesOptions = [
        { label: '4DX', value: '4dx' },
        { label: 'IMAX', value: 'imax' },
        { label: 'Dolby Atmos', value: 'dolby' },
        { label: 'Ghế Sweetbox', value: 'sweetbox' },
        { label: 'Ghé VIP', value: 'vip' },
        { label: 'Thu dời', value: 'wheelchair' }
    ];

    return (
        <div className="cinemas-new">
            {/* Header Section */}
            <div className="cinemas-header">
                <Title level={1} className="cinemas-title">
                    Danh Sách Rạp Chiếu
                </Title>
            </div>

            <div className="container">
                {/* Search Section */}
                <div className="search-section">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={18}>
                            <Input
                                size="large"
                                placeholder="Tìm kiếm tên rạp hoặc địa chỉ..."
                                prefix={<SearchOutlined style={{ color: '#e50914' }} />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                                className="cinema-search-input"
                            />
                        </Col>
                        <Col xs={24} md={6}>
                            <Dropdown
                                menu={{
                                    items: [
                                        { key: 'all', label: 'Tất cả thành phố' },
                                        ...cities.map(city => ({ key: city, label: city }))
                                    ],
                                    onClick: ({ key }) => setSelectedCity(key),
                                    selectedKeys: [selectedCity]
                                }}
                                trigger={['click']}
                            >
                                <Button size="large" className="filter-button" block>
                                    <Space>
                                        Thành phố
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </Col>
                    </Row>
                </div>

                {/* Cinema List */}
                <div className="cinema-list">
                    {filteredCinemas.length > 0 ? (
                        <>
                            <Row gutter={[16, 16]}>
                                {paginatedCinemas.map(cinema => (
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12} key={cinema.id}>
                                        <Link to={`/cinemas/${cinema.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Card className="cinema-card-new cinema-card-clickable">
                                                <Row gutter={24}>
                                                    <Col xs={24} lg={16}>
                                                        <div className="cinema-info-section">
                                                            <div className="cinema-brand-logo">
                                                                <Avatar size={48} style={{ backgroundColor: '#e50914' }}>
                                                                    {cinema.name?.substring(0, 2)}
                                                                </Avatar>
                                                            </div>

                                                            <div className="cinema-details">
                                                                <Title level={4} className="cinema-name-new">
                                                                    {cinema.name}
                                                                </Title>

                                                                <div className="cinema-address-new">
                                                                    <Text className="address-text">{cinema.address}</Text>
                                                                </div>

                                                                <Button
                                                                    type="primary"
                                                                    danger
                                                                    size="large"
                                                                    className="view-schedule-btn"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        window.location.href = `/cinemas/${cinema.id}`;
                                                                    }}
                                                                >
                                                                    XEM LỊCH CHIẾU
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    <Col xs={24} lg={8}>
                                                        <div className="cinema-map">
                                                            <iframe
                                                                width="100%"
                                                                height="200"
                                                                frameBorder="0"
                                                                style={{ border: 0, borderRadius: '8px' }}
                                                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(cinema.address)}&zoom=15`}
                                                                allowFullScreen
                                                                title={cinema.name}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>

                            {/* Pagination */}
                            <div className="cinema-pagination">
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={filteredCinemas.length}
                                    onChange={handlePageChange}
                                    showSizeChanger
                                    pageSizeOptions={['5', '10', '15', '20']}
                                    showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} rạp`}
                                    locale={{
                                        items_per_page: '/ trang',
                                        jump_to: 'Đi đến',
                                        jump_to_confirm: 'xác nhận',
                                        page: ''
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <Empty
                            description="Không tìm thấy rạp chiếu phim nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cinemas;
