import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Rate, Tag, Button, Space } from 'antd';
import { PlayCircleOutlined, EyeOutlined } from '@ant-design/icons';
import './MovieCard.css';

const { Meta } = Card;

const MovieCard = ({ movie, onTrailerClick, viewMode = 'grid' }) => {
  const {
    id,
    title,
    poster,
    rating,
    genre,
    releaseDate,
    ageLabel,
    duration,
    description
  } = movie;

  if (viewMode === 'list') {
    return (
      <Card
        className="movie-card-list"
        hoverable
        bordered={false}
        bodyStyle={{ padding: 0 }}
      >
        <div className="movie-card-list-content">
          <div className="movie-card-list-poster">
            <Link to={`/movies/${id}`}>
              <img src={poster} alt={title} />
            </Link>
            {ageLabel && (
              <Tag className="movie-age-label" color="orange">
                {ageLabel}
              </Tag>
            )}
          </div>
          <div className="movie-card-list-info">
            <div className="movie-card-list-header">
              <Link to={`/movies/${id}`} className="movie-title-link">
                <h3 className="movie-title">{title}</h3>
              </Link>
              <Space>
                <Rate disabled value={rating / 2} allowHalf size="small" />
                <span className="movie-rating">{rating}/10</span>
              </Space>
            </div>
            <div className="movie-card-list-meta">
              <Space wrap>
                {genre && (
                  <Tag color="blue">{genre.split(', ')[0]}</Tag>
                )}
                {duration && (
                  <span className="movie-duration">{duration}</span>
                )}
                {releaseDate && (
                  <span className="movie-release-date">{releaseDate}</span>
                )}
              </Space>
            </div>
            {description && (
              <p className="movie-description">
                {description.length > 120
                  ? `${description.substring(0, 120)}...`
                  : description
                }
              </p>
            )}
            <div className="movie-card-list-actions">
              <Space>
                <Link to={`/movies/${id}`}>
                  <Button type="primary" icon={<EyeOutlined />}>
                    Chi tiết
                  </Button>
                </Link>
                <Button
                  icon={<PlayCircleOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrailerClick?.(movie);
                  }}
                >
                  Trailer
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid mode (default)
  return (
    <Card
      className="movie-card-grid"
      hoverable
      bordered={false}
      cover={
        <div className="movie-card-cover">
          <Link to={`/movies/${id}`}>
            <img alt={title} src={poster} />
          </Link>
          {ageLabel && (
            <Tag className="movie-age-label" color="orange">
              {ageLabel}
            </Tag>
          )}
          <div className="movie-card-overlay">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<PlayCircleOutlined />}
              className="movie-play-btn"
              onClick={(e) => {
                e.stopPropagation();
                onTrailerClick?.(movie);
              }}
            />
          </div>
        </div>
      }
      bodyStyle={{ padding: '16px' }}
    >
      <Meta
        title={
          <Link to={`/movies/${id}`} className="movie-title-link">
            {title}
          </Link>
        }
        description={
          <div className="movie-card-grid-meta">
            <div className="movie-rating-row">
              <Rate disabled value={rating / 2} allowHalf size="small" />
              <span className="movie-rating">{rating}/10</span>
            </div>
            <Space wrap size={[4, 4]}>
              {genre && genre.split(', ').slice(0, 2).map((g, index) => (
                <Tag key={index} color="blue" size="small">
                  {g}
                </Tag>
              ))}
            </Space>
            {releaseDate && (
              <div className="movie-release-date">{releaseDate}</div>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default MovieCard; 