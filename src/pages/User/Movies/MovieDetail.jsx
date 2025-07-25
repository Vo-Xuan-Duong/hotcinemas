import React from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetail.css';
import MovieInfo from '../../../components/Info/MovieInfo';
import ShowtimesSection from '../../../components/Showtimes/ShowtimesSection';
import CommentsSection from '../../../components/Comments/CommentsSection';
import NowShowingSidebar from '../../../components/Showtimes/NowShowingSidebar';
import movies from '../../../data/movies.json';

const showtimes = [
  {
    date: '13/06/2025',
    dayName: 'Thứ Sáu',
    cinemas: [
      {
        name: 'HotCinemas Vincom',
        rooms: [
          {
            type: 'normal',
            name: 'Phòng thường',
            times: ['09:00', '13:30', '16:00', '19:00', '21:30']
          },
          {
            type: 'imax',
            name: 'Phòng IMAX',
            times: ['10:30', '15:00', '17:30', '20:30', '22:30']
          }
        ]
      },
      {
        name: 'HotCinemas Landmark',
        rooms: [
          {
            type: 'normal',
            name: 'Phòng thường',
            times: ['10:00', '14:00', '18:00', '20:30']
          },
          {
            type: 'imax',
            name: 'Phòng IMAX',
            times: ['11:00', '15:30', '19:30', '21:00']
          }
        ]
      }
    ]
  },
  {
    date: '14/06/2025',
    dayName: 'Thứ Bảy',
    cinemas: [
      {
        name: 'HotCinemas Vincom',
        rooms: [
          {
            type: 'normal',
            name: 'Phòng thường',
            times: ['09:30', '12:00', '15:30', '18:30', '21:00']
          },
          {
            type: 'imax',
            name: 'Phòng IMAX',
            times: ['10:00', '13:00', '16:30', '19:00', '22:00']
          }
        ]
      },
      {
        name: 'HotCinemas Landmark',
        rooms: [
          {
            type: 'normal',
            name: 'Phòng thường',
            times: ['10:30', '13:00', '16:30', '19:30', '22:00']
          },
          {
            type: 'imax',
            name: 'Phòng IMAX',
            times: ['11:30', '14:30', '17:00', '20:00', '22:30']
          }
        ]
      },
      {
        name: 'HotCinemas Crescent Mall',
        rooms: [
          {
            type: 'normal',
            name: 'Phòng thường',
            times: ['11:00', '14:30', '17:00', '20:00']
          },
          {
            type: 'imax',
            name: 'Phòng IMAX',
            times: ['12:00', '15:00', '18:00', '21:00']
          }
        ]
      }
    ]
  },
  {
    date: '15/06/2025',
    dayName: 'Chủ Nhật',
    cinemas: [
      {
        name: 'HotCinemas Vincom',
        rooms: [
          {
            type: 'normal',
            name: 'Phòng thường',
            times: ['09:00', '12:30', '16:00', '19:00', '21:30']
          },
          {
            type: 'imax',
            name: 'Phòng IMAX',
            times: ['10:30', '13:30', '17:00', '20:00', '22:00']
          }
        ]
      },
      {
        name: 'HotCinemas Landmark',
        rooms: [
          {
            type: 'normal',
            name: 'Phòng thường',
            times: ['10:00', '13:30', '17:00', '20:00', '22:30']
          },
          {
            type: 'imax',
            name: 'Phòng IMAX',
            times: ['11:00', '14:00', '18:00', '21:00', '23:00']
          }
        ]
      }
    ]
  }
];

const movieComments = [
  {
    user: 'Đỗ Minh Châu',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    time: '45 phút trước',
    rating: 10,
    title: 'Cực phẩm!',
    content: 'Là 1 người không am hiểu về f1 mà ny rủ đi xem, đánh giá cao phim nhé. Mạch phim hay giữ vững lập trường của nv9, phim gần như không có gì để chê',
    images: [
      'https://i.imgur.com/1.jpg',
      'https://i.imgur.com/2.jpg',
      'https://i.imgur.com/3.jpg'
    ]
  },
  {
    user: 'Nguyễn Văn A',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    time: '2 giờ trước',
    rating: 9,
    title: 'Phim hay!',
    content: 'Cốt truyện hấp dẫn, diễn xuất tốt, hiệu ứng đẹp. Đáng xem!',
    images: []
  },
  {
    user: 'Nguyễn Văn A',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    time: '2 giờ trước',
    rating: 9,
    title: 'Phim hay!',
    content: 'Cốt truyện hấp dẫn, diễn xuất tốt, hiệu ứng đẹp. Đáng xem!',
    images: []
  }
];

const movieRating = 9.3;
const movieRatingCount = 409;

const MovieDetail = () => {
  const { id } = useParams();
  console.log(id);
  const movie = movies.find(m => m.id === Number(id));
  console.log(movie);

  console.log(movie);

  if (!movie) {
    return (
      <div className="movie-detail-custom-bg">
        <div className="movie-detail-custom container">
          <div style={{ textAlign: 'center', marginTop: '3rem', color: '#fff' }}>
            <h2>Không tìm thấy phim</h2>
            <p>Phim với ID {id} không tồn tại.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail-custom-bg">
      <div className="movie-detail-custom container">
        <div className="movie-detail-layout">
          <div className="movie-detail-maincol">
            {/* Thông tin phim */}
            <MovieInfo movie={movie} />
            
            {/* Layout 2 cột: lịch chiếu + bình luận (trái), phim đang chiếu (phải) */}
            <div className="movie-detail-row-below-desc-2col">
              <div className="movie-detail-left-column">
                {/* Lịch chiếu */}
                <ShowtimesSection showtimes={showtimes} />
                
                {/* Bình luận */}
                <CommentsSection 
                  comments={movieComments}
                  rating={movieRating}
                  ratingCount={movieRatingCount}
                />
              </div>
              
              {/* Sidebar phim đang chiếu */}
              <NowShowingSidebar currentMovieId={movie.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail; 