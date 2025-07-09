export const mockMovies = [
  {
    id: 1,
    title: "Avengers: Endgame",
    poster: "https://image-worker.momocdn.net/img/80099757410724750-doemon.png?size=M&referer=cinema.momocdn.net",
    rating: 9.2,
    duration: "181 phút",
    genre: "Hành động",
    releaseDate: "27.06.2025",
    ageLabel: "18+",
    description: "Biệt đội siêu anh hùng tập hợp lần cuối để đối đầu với Thanos và cứu vũ trụ.",
    format: '2D',
    ageDesc: '18+: Phim dành cho khán giả từ 18 tuổi trở lên',
    language: 'Lồng Tiếng',
    director: 'Anthony Russo, Joe Russo',
    actors: 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth',
    trailer: 'https://www.youtube.com/embed/TcMBFSGVi1c'
  },
  {
    id: 2,
    title: "Ma Không Đầu",
    poster: "https://image-worker.momocdn.net/img/80099757410724750-doemon.png?size=M&referer=cinema.momocdn.net",
    rating: 8.4,
    duration: "148 phút",
    genre: "Kinh Dị, Hài",
    releaseDate: "27.06.2025",
    ageLabel: "18+",
    description: "Peter Parker phải đối mặt với những hậu quả khi danh tính bị lộ.",
    // Additional details for MovieDetail
    format: '2D',
    ageDesc: '18+: Phim dành cho khán giả từ 18 tuổi trở lên',
    language: 'Lồng Tiếng',
    director: 'Jon Watts',
    actors: 'Tom Holland, Zendaya, Benedict Cumberbatch',
    trailer: 'https://www.youtube.com/embed/TcMBFSGVi1c'
  },
  {
    id: 3,
    title: "Bí Kíp Luyện Rồng",
    poster: "https://image-worker.momocdn.net/img/80099757410724750-doemon.png?size=M&referer=cinema.momocdn.net",
    rating: 9.6,
    duration: "176 phút",
    genre: "Phiêu Lưu, Hành Động",
    releaseDate: "13.06.2025",
    ageLabel: "K",
    description: "Batman điều tra một loạt các vụ giết người bí ẩn ở Gotham City.",
    // Additional details for MovieDetail
    format: '2D',
    ageDesc: 'K: Phim dành cho khán giả từ dưới 13 tuổi với điều kiện xem cùng cha, mẹ hoặc người giám hộ',
    language: 'Lồng Tiếng',
    director: 'Dean DeBlois',
    actors: 'Mason Thames, Nico Parker, Gerard Butler',
    trailer: 'https://www.youtube.com/embed/TcMBFSGVi1c'
  },
  {
    id: 4,
    title: "DAN DA DAN: Tà Nhân",
    poster: "https://image-worker.momocdn.net/img/80099757410724750-doemon.png?size=M&referer=cinema.momocdn.net",
    rating: 9.1,
    duration: "161 phút",
    genre: "Hoạt Hình, Phiêu Lưu",
    releaseDate: "13.06.2025",
    ageLabel: "16+",
    description: "Wakanda phải đối mặt với những thách thức mới sau cái chết của T'Challa.",
    // Additional details for MovieDetail
    format: '2D',
    ageDesc: '16+: Phim dành cho khán giả từ 16 tuổi trở lên',
    language: 'Lồng Tiếng',
    director: 'Ryan Coogler',
    actors: 'Letitia Wright, Angela Bassett, Tenoch Huerta',
    trailer: 'https://www.youtube.com/embed/TcMBFSGVi1c'
  },
  {
    id: 5,
    title: "Ultraman Arc: Ánh Sáng Và ...",
    poster: "https://image-worker.momocdn.net/img/80099757410724750-doemon.png?size=M&referer=cinema.momocdn.net",
    rating: 9.2,
    duration: "120 phút",
    genre: "Khoa Học Viễn Tưởng, Chính Kịch",
    releaseDate: "21.02.2025",
    ageLabel: "13+",
    description: "Phim khoa học viễn tưởng hấp dẫn với nhiều pha hành động mãn nhãn.",
    // Additional details for MovieDetail
    format: '2D',
    ageDesc: '13+: Phim dành cho khán giả từ 13 tuổi trở lên',
    language: 'Lồng Tiếng',
    director: 'Shinji Higuchi',
    actors: 'Masami Nagasawa, Hidetoshi Nishijima, Daigo',
    trailer: 'https://www.youtube.com/embed/TcMBFSGVi1c'
  }
];

// Helper function to find movie by ID
export const findMovieById = (id) => {
  return mockMovies.find(movie => movie.id === parseInt(id));
}; 