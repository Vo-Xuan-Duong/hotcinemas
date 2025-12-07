import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import './FeaturesSection.css';

const { Title, Paragraph } = Typography;

const FeaturesSection = () => {
  const features = [
    {
      icon: '🎬',
      title: 'Phim mới nhất',
      description: 'Cập nhật những bộ phim bom tấn mới nhất từ Hollywood'
    },
    {
      icon: '🎵',
      title: 'Âm thanh chất lượng',
      description: 'Hệ thống âm thanh Dolby Atmos cho trải nghiệm tuyệt vời'
    },
    {
      icon: '🪑',
      title: 'Ghế ngồi thoải mái',
      description: 'Ghế ngồi cao cấp với khả năng điều chỉnh và sưởi ấm'
    },
    {
      icon: '📱',
      title: 'Đặt vé dễ dàng',
      description: 'Đặt vé online nhanh chóng và thuận tiện'
    }
  ];

  return (
    <section className="features-section-modern">
      <div className="container">
        <Title
          level={2}
          className="features-title"
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#1f2937',
            fontSize: '2.5rem',
            fontWeight: 700
          }}
        >
          Tại sao chọn HotCinemas?
        </Title>
        <Row gutter={[24, 24]} justify="center">
          {features.map((feature, index) => (
            <Col
              key={index}
              xs={24}
              sm={12}
              md={12}
              lg={6}
              xl={6}
            >
              <Card
                className="feature-card-modern"
                bordered={false}
                hoverable
                style={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="feature-icon-modern" style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  display: 'block'
                }}>
                  {feature.icon}
                </div>
                <Title
                  level={4}
                  style={{
                    color: '#1f2937',
                    marginBottom: '1rem',
                    fontSize: '1.3rem',
                    fontWeight: 600
                  }}
                >
                  {feature.title}
                </Title>
                <Paragraph
                  style={{
                    color: '#6b7280',
                    lineHeight: 1.6,
                    fontSize: '14px',
                    margin: 0
                  }}
                >
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default FeaturesSection; 