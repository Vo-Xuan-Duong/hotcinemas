import React, { useState, useEffect } from 'react';
import useAuth from '../../context/useAuth';
import './CommentsSection.css';

const CommentsSection = ({ comments: propComments, rating: propRating, ratingCount: propRatingCount }) => {
  const [comments, setComments] = useState(propComments || []);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [sortBy, setSortBy] = useState('newest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  
  // Safely get auth context
  let user = null;
  let isAuthenticated = false;
  
  try {
    const auth = useAuth();
    user = auth.user;
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    console.warn('Auth context not available:', error);
  }

  useEffect(() => {
    // Update comments when props change
    setComments(propComments || []);
    setVisibleCount(2);
  }, [propComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated || !user) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCommentObj = {
        id: Date.now(),
        user: user.name || user.email || 'Người dùng',
        avatar: user.avatar || 'https://via.placeholder.com/40',
        time: 'Vừa xong',
        rating,
        title: 'Bình luận mới',
        content: newComment.trim(),
        images: []
      };

      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
      setRating(5);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setIsSubmitting(false);
    }
  };



  const renderStars = (starRating, interactive = false, onStarClick = null) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (interactive ? hoveredStar : starRating) ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onStarClick && onStarClick(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return 0;
      case 'oldest':
        return 0;
      case 'rating':
        return b.rating - a.rating;
      case 'likes':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const visibleComments = sortedComments.slice(0, visibleCount);

  return (
    <div className="comments-section">
      <div className="comments-header">
        <div className="header-left">
          <h3>Bình luận ({comments.length})</h3>
          {propRating && (
            <div className="overall-rating">
              <span className="rating-score">{propRating}</span>
              <div className="rating-stars">
                {renderStars(Math.round(propRating))}
              </div>
              <span className="rating-count">({propRatingCount} đánh giá)</span>
            </div>
          )}
        </div>
        <div className="comments-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="rating">Đánh giá cao</option>
            <option value="likes">Nhiều lượt thích</option>
          </select>
        </div>
      </div>

      {isAuthenticated && user ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="form-header">
            <div className="user-info">
              <img 
                src={user.avatar || 'https://via.placeholder.com/40'} 
                alt={user.name || user.email || 'Người dùng'}
                className="user-avatar"
              />
              <span className="username">{user.name || user.email || 'Người dùng'}</span>
            </div>
            <div className="rating-input">
              <span>Đánh giá:</span>
              {renderStars(rating, true, setRating)}
            </div>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về phim này..."
            className="comment-textarea"
            rows="4"
            maxLength="500"
          />
          <div className="form-footer">
            <span className="char-count">{newComment.length}/500</span>
            <button 
              type="submit" 
              disabled={!newComment.trim() || isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </div>
        </form>
      ) : (
        <div className="login-prompt">
          <p>Vui lòng <a href="/login">đăng nhập</a> để bình luận</p>
        </div>
      )}

      <div className="comments-list">
        {visibleComments.map((comment) => (
          <div key={comment.id || Math.random()} className="comment-item">
            <div className="comment-header">
              <div className="comment-user">
                <img 
                  src={comment.avatar} 
                  alt={comment.user}
                  className="user-avatar"
                />
                <div className="user-details">
                  <span className="username">{comment.user}</span>
                  <span className="comment-date">{comment.time}</span>
                </div>
              </div>
              <div className="comment-rating">
                {renderStars(comment.rating)}
              </div>
            </div>
            <div className="comment-content">
              {comment.title && <h4 className="comment-title">{comment.title}</h4>}
              <p>{comment.content}</p>
              {comment.images && comment.images.length > 0 && (
                <div className="comment-images">
                  {comment.images.map((image, index) => (
                    <img 
                      key={index} 
                      src={image} 
                      alt={`Hình ảnh ${index + 1}`}
                      className="comment-image"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="comment-actions">
              <button className="like-btn">
                👍 Thích
              </button>
              <button className="reply-btn">
                💬 Trả lời
              </button>
            </div>
          </div>
        ))}
        {visibleCount < sortedComments.length && (
          <button className="see-more-btn" onClick={() => setVisibleCount(c => c + 2)}>
            Xem thêm bình luận
          </button>
        )}
      </div>

      {visibleComments.length === 0 && (
        <div className="no-comments">
          <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection; 