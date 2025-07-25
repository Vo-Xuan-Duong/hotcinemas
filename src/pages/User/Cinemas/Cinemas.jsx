import React, { useState } from 'react';
import './Cinemas.css';

const mockCinemas = [
  {
    id: 1,
    name: 'CGV Vincom Đồng Khởi',
    city: 'Hồ Chí Minh',
    address: '72 Lê Thánh Tôn, Quận 1',
    image: 'https://via.placeholder.com/350x200/667eea/ffffff?text=CGV+Vincom',
    description: 'Rạp CGV hiện đại, trung tâm thành phố, nhiều phòng chiếu chất lượng cao.'
  },
  {
    id: 2,
    name: 'Lotte Cinema Gò Vấp',
    city: 'Hồ Chí Minh',
    address: '242 Nguyễn Văn Lượng, Gò Vấp',
    image: 'https://via.placeholder.com/350x200/ff6b6b/ffffff?text=Lotte+Gò+Vấp',
    description: 'Rạp Lotte với hệ thống âm thanh Dolby Atmos, ghế ngồi thoải mái.'
  },
  {
    id: 3,
    name: 'BHD Star Bitexco',
    city: 'Hồ Chí Minh',
    address: '2 Hải Triều, Quận 1',
    image: 'https://via.placeholder.com/350x200/764ba2/ffffff?text=BHD+Bitexco',
    description: 'Rạp BHD Star nằm trong tòa nhà Bitexco, view đẹp, nhiều suất chiếu.'
  },
  {
    id: 4,
    name: 'CGV Aeon Hà Đông',
    city: 'Hà Nội',
    address: 'Số 10, Đường Tố Hữu, Hà Đông',
    image: 'https://via.placeholder.com/350x200/feca57/333333?text=CGV+Aeon+Hà+Đông',
    description: 'Rạp CGV lớn nhất khu vực Hà Đông, nhiều phòng chiếu, dịch vụ tốt.'
  }
];

const uniqueCities = [...new Set(mockCinemas.map(c => c.city))];

const Cinemas = () => {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  const filteredCinemas = mockCinemas.filter(cinema => {
    const matchName = cinema.name.toLowerCase().includes(search.toLowerCase());
    const matchCity = city ? cinema.city === city : true;
    return matchName && matchCity;
  });

  return (
    <div className="cinemas-page container">
      <h2 className="cinemas-title">Danh sách rạp chiếu</h2>
      <div className="cinemas-filter">
        <input
          type="text"
          placeholder="Tìm kiếm tên rạp..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={city} onChange={e => setCity(e.target.value)}>
          <option value="">Tất cả thành phố</option>
          {uniqueCities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="cinemas-grid">
        {filteredCinemas.length === 0 ? (
          <div style={{ textAlign: 'center', width: '100%' }}>Không tìm thấy rạp phù hợp.</div>
        ) : (
          filteredCinemas.map(cinema => (
            <div className="cinema-card" key={cinema.id}>
              <img src={cinema.image} alt={cinema.name} className="cinema-card-img" />
              <div className="cinema-card-body">
                <h3>{cinema.name}</h3>
                <div className="cinema-card-meta">{cinema.city} - {cinema.address}</div>
                <p>{cinema.description}</p>
                <a href={`/cinemas/${cinema.id}`} className="cinema-card-link">Xem chi tiết</a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cinemas; 