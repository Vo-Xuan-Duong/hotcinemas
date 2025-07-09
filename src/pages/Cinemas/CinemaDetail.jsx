import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './CinemaDetail.css';

const mockCinemas = [
  {
    id: 1,
    name: 'CGV Vincom Đồng Khởi',
    city: 'Hồ Chí Minh',
    address: '72 Lê Thánh Tôn, Quận 1',
    image: 'https://via.placeholder.com/350x200/667eea/ffffff?text=CGV+Vincom',
    description: 'Rạp CGV hiện đại, trung tâm thành phố, nhiều phòng chiếu chất lượng cao.',
    movies: [
      { id: 1, title: 'Avengers: Endgame' },
      { id: 2, title: 'Spider-Man: No Way Home' }
    ]
  },
  {
    id: 2,
    name: 'Lotte Cinema Gò Vấp',
    city: 'Hồ Chí Minh',
    address: '242 Nguyễn Văn Lượng, Gò Vấp',
    image: 'https://via.placeholder.com/350x200/ff6b6b/ffffff?text=Lotte+Gò+Vấp',
    description: 'Rạp Lotte với hệ thống âm thanh Dolby Atmos, ghế ngồi thoải mái.',
    movies: [
      { id: 3, title: 'The Batman' },
      { id: 4, title: 'Black Panther: Wakanda Forever' }
    ]
  },
  {
    id: 3,
    name: 'BHD Star Bitexco',
    city: 'Hồ Chí Minh',
    address: '2 Hải Triều, Quận 1',
    image: 'https://via.placeholder.com/350x200/764ba2/ffffff?text=BHD+Bitexco',
    description: 'Rạp BHD Star nằm trong tòa nhà Bitexco, view đẹp, nhiều suất chiếu.',
    movies: [
      { id: 1, title: 'Avengers: Endgame' },
      { id: 3, title: 'The Batman' }
    ]
  },
  {
    id: 4,
    name: 'CGV Aeon Hà Đông',
    city: 'Hà Nội',
    address: 'Số 10, Đường Tố Hữu, Hà Đông',
    image: 'https://via.placeholder.com/350x200/feca57/333333?text=CGV+Aeon+Hà+Đông',
    description: 'Rạp CGV lớn nhất khu vực Hà Đông, nhiều phòng chiếu, dịch vụ tốt.',
    movies: [
      { id: 2, title: 'Spider-Man: No Way Home' },
      { id: 4, title: 'Black Panther: Wakanda Forever' }
    ]
  }
];

const CinemaDetail = () => {
  const { id } = useParams();
  const cinema = mockCinemas.find(c => c.id === Number(id));

  if (!cinema) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Không tìm thấy rạp.</div>;

  return (
    <div className="cinema-detail container">
      <div className="cinema-detail-main">
        <img className="cinema-detail-img" src={cinema.image} alt={cinema.name} />
        <div className="cinema-detail-info">
          <h2>{cinema.name}</h2>
          <div className="cinema-detail-meta">
            <span><b>Thành phố:</b> {cinema.city}</span>
            <span><b>Địa chỉ:</b> {cinema.address}</span>
          </div>
          <p className="cinema-detail-desc">{cinema.description}</p>
        </div>
      </div>
      <div className="cinema-detail-movies">
        <h3>Phim đang chiếu tại rạp</h3>
        <ul>
          {cinema.movies.map(m => (
            <li key={m.id}>
              <Link to={`/movies/${m.id}`}>{m.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CinemaDetail; 