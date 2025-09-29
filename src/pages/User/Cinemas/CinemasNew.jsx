import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    Spin
} from 'antd';
import {
    SearchOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
    StarOutlined,
    HomeOutlined,
    ShopOutlined,
    RightOutlined
} from '@ant-design/icons';
import './CinemasNew.css';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const CinemasNew = () => {
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedCity, setSelectedCity] = useState('Tp. Hồ Chí Minh');

    // Mock data dựa trên hình tham khảo
    const cinemaChains = [
        {
            id: 1,
            name: 'DDC Đồng Da',
            type: 'bán vé',
            address: '890 Trần Hưng Đạo, Quận 5, Tp. Hồ Chí Minh',
            logoText: 'DDC',
            color: '#ff6b35',
            bgColor: '#fff5f2'
        },
        {
            id: 2,
            name: 'Beta Quang Trung',
            type: 'bán vé',
            address: '645 Quang Trung, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh',
            logoText: 'BT',
            color: '#1890ff',
            bgColor: '#f0f8ff'
        },
        {
            id: 3,
            name: 'Beta Trần Quang Khải',
            type: 'bán vé',
            address: 'Tầng 2 & 3, tòa nhà IMC, 62 Đường Trần Quang Khải, Phường Tân Định, Quận 1, TP. Hồ Chí Minh',
            logoText: 'BT',
            color: '#1890ff',
            bgColor: '#f0f8ff'
        },
        {
            id: 4,
            name: 'Beta Ung Văn Khiêm',
            type: 'bán vé',
            address: 'Tầng 1, tòa nhà PAX SKY, 26 Ung Văn Khiêm, phường 25, Quận Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam',
            logoText: 'BT',
            color: '#1890ff',
            bgColor: '#f0f8ff'
        },
        {
            id: 5,
            name: 'Cinestar Hai Bà Trưng',
            type: 'bán vé',
            address: '135 Hai Bà Trưng, P. Bến Nghé, Q.1, Tp. Hồ Chí Minh',
            logoText: 'CS',
            color: '#722ed1',
            bgColor: '#f9f0ff'
        },
        {
            id: 6,
            name: 'Cinestar Quốc Thanh',
            type: 'bán vé',
            address: '271 Nguyên Trãi, P. Nguyễn Cư Trinh, Q.1, Tp. Hồ Chí Minh',
            logoText: 'CS',
            color: '#722ed1',
            bgColor: '#f9f0ff'
        },
        {
            id: 7,
            name: 'Cinestar Satra Quận 6',
            type: 'bán vé',
            address: '1466 D. Võ Văn Kiệt, Phường 1, Quận 6, Hồ Chí Minh',
            logoText: 'CS',
            color: '#722ed1',
            bgColor: '#f9f0ff'
        },
        {
            id: 8,
            name: 'DCINE Bến Thành',
            type: 'bán vé',
            address: 'Số 6, Mạc Đình Chi, Q.1, Tp. Hồ Chí Minh',
            logoText: 'DC',
            color: '#f5222d',
            bgColor: '#fff2f0'
        },
        {
            id: 9,
            name: 'Mega GS Cao Thắng',
            type: 'bán vé',
            address: 'Lầu 6 - 7, 19 Cao Thắng, P.2, Q.3, Tp. Hồ Chí Minh',
            logoText: 'MG',
            color: '#faad14',
            bgColor: '#fffbe6'
        },
        {
            id: 10,
            name: 'Mega GS Lý Chính Thắng',
            type: 'bán vé',
            address: '212 Lý Chính Thắng, phường 9, quận 3',
            logoText: 'MG',
            color: '#faad14',
            bgColor: '#fffbe6'
        },
        {
            id: 11,
            name: 'BHD Star 3/2',
            type: '',
            address: 'Lầu 4, Siêu Thị Vincom 3/2, 3C Đường 3/2, Q. 10, Tp. Hồ Chí Minh',
            logoText: 'BHD',
            color: '#52c41a',
            bgColor: '#f6ffed'
        },
        {
            id: 12,
            name: 'BHD Star Lê Văn Việt',
            type: '',
            address: '52 Lê Văn Việt, Quận 9, Tp. Hồ Chí Minh',
            logoText: 'BHD',
            color: '#52c41a',
            bgColor: '#f6ffed'
        }
    ];

    const cities = [
        'Tp. Hồ Chí Minh',
        'Hà Nội',
        'Đà Nẵng',
        'Cần Thơ',
        'Bình Dương',
        'Đồng Nai',
        'Quảng Ninh'
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const filteredCinemas = cinemaChains.filter(cinema => {
        const matchesSearch = cinema.name.toLowerCase().includes(searchText.toLowerCase()) ||
            cinema.address.toLowerCase().includes(searchText.toLowerCase());
        return matchesSearch;
    });

    const handleCinemaClick = (cinema) => {
        // Navigate to cinema detail page
        console.log('Selected cinema:', cinema);
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

    return (
        <div className="cinemas-new">
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
                {/* Search Section */}
                <div className="search-section">
                    <Row gutter={16} align="middle">
                        <Col xs={24} md={16}>
                            <Search
                                placeholder="Tìm rạp tại..."
                                allowClear
                                size="large"
                                prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="cinema-search"
                            />
                        </Col>
                        <Col xs={24} md={8}>
                            <Select
                                value={selectedCity}
                                onChange={setSelectedCity}
                                size="large"
                                style={{ width: '100%' }}
                                className="city-select"
                            >
                                {cities.map(city => (
                                    <Option key={city} value={city}>{city}</Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </div>

                {/* Cinema List */}
                <div className="cinema-list">
                    {filteredCinemas.length > 0 ? (
                        <Row gutter={[0, 12]}>
                            {filteredCinemas.map(cinema => (
                                <Col span={24} key={cinema.id}>
                                    <Card
                                        className="cinema-card"
                                        hoverable
                                        onClick={() => handleCinemaClick(cinema)}
                                    >
                                        <div className="cinema-content">
                                            <div className="cinema-logo">
                                                <Avatar
                                                    size={56}
                                                    style={{
                                                        backgroundColor: cinema.color,
                                                        color: 'white',
                                                        fontSize: '16px',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {cinema.logoText}
                                                </Avatar>
                                            </div>

                                            <div className="cinema-info">
                                                <div className="cinema-header">
                                                    <Title level={4} className="cinema-name">
                                                        {cinema.name}
                                                    </Title>
                                                    {cinema.type && (
                                                        <Tag
                                                            color={cinema.color}
                                                            className="cinema-type-tag"
                                                        >
                                                            {cinema.type}
                                                        </Tag>
                                                    )}
                                                </div>

                                                <div className="cinema-address">
                                                    <EnvironmentOutlined style={{ color: '#666', marginRight: 8 }} />
                                                    <Text type="secondary">{cinema.address}</Text>
                                                </div>
                                            </div>                                            <div className="cinema-action">
                                                <Link to={`/cinemas/${cinema.id}/schedule`}>
                                                    <Button
                                                        type="primary"
                                                        icon={<RightOutlined />}
                                                        style={{ backgroundColor: cinema.color, borderColor: cinema.color }}
                                                    >
                                                        Xem lịch chiếu
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
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

export default CinemasNew;
