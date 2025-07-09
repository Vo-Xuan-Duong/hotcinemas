import React from 'react';
import './FeaturedComments.css';

const commentsData = [
  {
    movieImg: 'https://cdn.momocdn.net/img/1234.jpg',
    movieTitle: 'Thám Tử Kiên: Kỳ Án Không Đầu',
    rating: 9.5,
    views: '25.4K',
    comments: [
      {
        user: 'Hồ Gia Vi',
        time: '02/05/2025',
        bought: true,
        content: 'Đó giờ ít không đánh giá cao phim Việt vì bao lần thất vọng rồi nhưng thấy trang Chê phim 1.3 khen lắm nên cũng tò mò đi xem...'
      },
      {
        user: 'Bùi Phạm Đăng Thư',
        time: '29/04/2025',
        bought: true,
        content: 'Huhu phim siêu hay luôn á mn :)) Mê Công Sai Quan Án cựa tui quãaa. Đẹp trai diễn tinh thông mình. Bag Hai Mẫn siu đẹp và ...'
      }
    ]
  },
  {
    movieImg: 'https://cdn.momocdn.net/img/5678.jpg',
    movieTitle: 'Doraemon Movie 44: Nobita và Cuộc Phiêu Lưu',
    rating: 9.3,
    views: '7.2K',
    comments: [
      {
        user: 'Mạng Đức Tân',
        time: '22 giờ trước',
        bought: false,
        content: 'fhgxiiyfhct7hiccuviyvuvyuvyuvyugiyctuxytxcyxtuxbtyxr6xy'
      },
      {
        user: 'Đào Thảo Vy',
        time: 'hôm qua',
        bought: true,
        content: 'Phim hay nhm lồng tiếng quốc vương và vk ko đc hay cho lắm nhưng phim hay lắm nha đáng để đi xem kịch bản vui nhộn hài hước...'
      }
    ]
  },
  {
    movieImg: 'https://cdn.momocdn.net/img/9101.jpg',
    movieTitle: 'Mưa Lửa - Anh Trai Vượt Ngàn Chông Gai Movie',
    rating: 9.8,
    views: '4.3K',
    comments: [
      {
        user: 'Vương Ngọc Khánh Quỳnh',
        time: '6 giờ trước',
        bought: true,
        content: 'Cảm ơn vì đã đến. Một mùa hè rực rỡ 2024. Chắc chắn em sẽ nhớ mãi 🔥'
      },
      {
        user: 'Hà Thị Vân Anh',
        time: 'hôm qua',
        bought: false,
        content: 'Lần xem này mình khóc từ đầu đến cuối, vì mình biết lần này mình phải nói lời tạm biệt thật rồi. "Mưa Lửa" và ATVNCG sẽ mãi luôn...'
      }
    ]
  }
];

const FeaturedComments = () => {
  return (
    <section className="featured-comments-section">
      <h2 className="featured-comments-title">Bình luận nổi bật</h2>
      <div className="featured-comments-list">
        {commentsData.map((item, idx) => (
          <div className="featured-comment-card" key={idx}>
            <div className="featured-movie-thumb">
              <img src={item.movieImg} alt={item.movieTitle} />
              <div className="featured-movie-overlay">
                <button className="featured-movie-play"><span>▶</span></button>
              </div>
              <div className="featured-movie-info">
                <div className="featured-movie-title">{item.movieTitle}</div>
                <div className="featured-movie-meta">
                  <span className="featured-movie-rating">{item.rating}</span>
                  <span className="featured-movie-views">{item.views}</span>
                </div>
              </div>
            </div>
            <div className="featured-comments">
              {item.comments.map((cmt, cidx) => (
                <div className="featured-comment" key={cidx}>
                  <div className="featured-comment-user">
                    <span className={cmt.bought ? 'bought' : ''}>{cmt.user}</span> · <span className="featured-comment-time">{cmt.time}</span>
                  </div>
                  {cmt.bought && <div className="featured-comment-bought">Đã mua qua MoMo</div>}
                  <div className="featured-comment-content">{cmt.content}</div>
                  {cidx === item.comments.length - 1 && <a href="#" className="featured-comment-more">Xem thêm →</a>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="featured-comments-showmore-wrapper">
        <button className="featured-comments-showmore-btn">&lt; Xem tiếp nhé ! &gt;</button>
      </div>
    </section>
  );
};

export default FeaturedComments; 