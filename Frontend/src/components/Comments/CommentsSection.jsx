import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import commentService from '../../services/commentService';
import './CommentsSection.css';

const CommentsSection = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0
  });
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [expandedReplies, setExpandedReplies] = useState({});

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

  // Load comments and average rating from API
  useEffect(() => {
    if (movieId) {
      loadComments();
      loadAverageRating();
    }
  }, [movieId, sortBy]);

  const loadAverageRating = async () => {
    try {
      const result = await commentService.getAverageRating(movieId);
      setAverageRating(result.averageRating || 0);
      setRatingCount(result.countRating || 0);
    } catch (error) {
      console.error('Error loading average rating:', error);
      setAverageRating(0);
      setRatingCount(0);
    }
  };

  const loadComments = async (page = 0) => {
    try {
      setLoading(true);

      // Map sortBy to API sort parameter
      let sortParam;
      switch (sortBy) {
        case 'newest':
          sortParam = 'createdAt,desc';
          break;
        case 'oldest':
          sortParam = 'createdAt,asc';
          break;
        case 'rating':
          sortParam = 'rating,desc';
          break;
        default:
          sortParam = 'createdAt,desc';
      }

      const response = await commentService.getCommentsByMovie(movieId, {
        page,
        size: pagination.size,
        sort: sortParam
      });

      setComments(response.content || []);
      setPagination({
        page: response.number || 0,
        size: response.size || 10,
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0
      });
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated || !user || !movieId) return;

    setIsSubmitting(true);

    try {
      const commentData = {
        movieId,
        comment: newComment.trim(),
        rating
      };

      await commentService.createComment(commentData);

      // Reload comments and average rating after successful creation
      await loadComments(0);
      await loadAverageRating();

      setNewComment('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Không thể gửi bình luận. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyText.trim() || !isAuthenticated || !user || !movieId) return;

    setIsSubmitting(true);

    try {
      const replyData = {
        movieId,
        comment: replyText.trim(),
        rating: 5,
        parentId
      };

      await commentService.addReply(parentId, replyData);

      // Reload comments after successful reply
      await loadComments(pagination.page);

      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Không thể gửi phản hồi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

    try {
      await commentService.deleteComment(commentId);
      await loadComments(pagination.page);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Không thể xóa bình luận. Vui lòng thử lại.');
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.comment);
    setEditRating(comment.rating);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    setIsSubmitting(true);

    try {
      const updateData = {
        movieId,
        comment: editText.trim(),
        rating: editRating,
        parentId: null
      };

      await commentService.updateComment(commentId, updateData);
      await loadComments(pagination.page);

      setEditingComment(null);
      setEditText('');
      setEditRating(0);
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Không thể cập nhật bình luận. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText('');
    setEditRating(0);
  };

  const renderStars = (starRating, interactive = false, onStarClick = null) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => {
          const displayRating = interactive ? (hoveredStar || starRating) : starRating;
          return (
            <span
              key={star}
              className={`star ${star <= displayRating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
              onClick={() => interactive && onStarClick && onStarClick(star)}
              onMouseEnter={() => interactive && setHoveredStar(star)}
              onMouseLeave={() => interactive && setHoveredStar(0)}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <div className="comments-section loading">Đang tải bình luận...</div>;
  }

  return (
    <div className="comments-section">
      {/* Header with title and rating */}
      <div className="comments-main-header">
        <h2 className="comments-title">Đánh giá và Bình luận</h2>
        <div className="header-right">
          <div className="overall-rating-badge">
            <span className="star-icon">⭐</span>
            <span className="rating-number">{averageRating.toFixed(1)}/5</span>
            <span className="rating-count-text">{ratingCount} Đánh giá</span>
          </div>
          <button
            className="write-review-btn"
            onClick={() => document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Viết đánh giá
          </button>
        </div>
      </div>

      {isAuthenticated && user ? (
        <form onSubmit={handleSubmitComment} className="comment-form-new" id="comment-form">
          <div className="form-with-avatar">
            <img
              src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name || 'User')}&background=random&size=80`}
              alt={user.username || user.name}
              className="form-user-avatar"
            />
            <div className="form-input-wrapper">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="comment-textarea-new"
                rows="3"
                maxLength="500"
              />
              <div className="form-bottom-actions">
                <div className="form-action-icons">
                  <div className="rating-stars-input-inline">
                    {renderStars(rating, true, setRating)}
                  </div>
                </div>
                <button
                  type="submit"
                  className="send-icon-btn"
                  disabled={!newComment.trim() || isSubmitting}
                  title="Gửi đánh giá"
                >
                  {isSubmitting ? '⏳' : '▶'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="login-prompt">
          <p>Vui lòng <a href="/login">đăng nhập</a> để bình luận</p>
        </div>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-user-avatar">
              <img
                src={comment.userAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName || 'User')}&background=random&size=80`}
                alt={comment.userName}
                className="user-avatar"
              />
            </div>
            <div className="comment-content-wrapper">
              <div className="comment-content-inner">
                <div className="comment-header">
                  <div className="comment-header-left">
                    <span className="username">{comment.userName}</span>
                  </div>
                  <div className="comment-rating">
                    {renderStars(comment.rating)}
                  </div>
                </div>
                <div className="comment-text">
                  {editingComment === comment.id ? (
                    <div className="edit-form">
                      <div className="form-rating-section">
                        <span className="rating-label">Xếp hạng:</span>
                        <div className="rating-stars-input">
                          {renderStars(editRating, true, setEditRating)}
                        </div>
                      </div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="comment-textarea"
                        rows="3"
                      />
                      <div className="reply-actions">
                        <button
                          onClick={handleCancelEdit}
                          className="cancel-btn"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={!editText.trim() || isSubmitting}
                          className="submit-reply-btn"
                        >
                          {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>{comment.comment}</p>
                  )}
                </div>
              </div>
              <div className="comment-meta">
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
                <button
                  className="reply-btn-text"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  Trả lời
                </button>
                {user && (String(user.id) === String(comment.userId) || String(user.id) === String(comment.user?.id)) && (
                  <>
                    <button
                      className="edit-btn-text"
                      onClick={() => handleEditComment(comment)}
                    >
                      Sửa
                    </button>
                    <button
                      className="delete-btn-text"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Xóa
                    </button>
                  </>
                )}
              </div>

              {replyingTo === comment.id && isAuthenticated && (
                <div className="reply-form">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Viết phản hồi..."
                    className="reply-textarea"
                    rows="3"
                  />
                  <div className="reply-actions">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="cancel-btn"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyText.trim() || isSubmitting}
                      className="submit-reply-btn"
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                    </button>
                  </div>
                </div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <div className="replies-list">
                  {(expandedReplies[comment.id] ? comment.replies : comment.replies.slice(0, 2)).map((reply) => (
                    <div key={reply.id} className="reply-item">
                      <div className="comment-user-avatar">
                        <img
                          src={reply.userAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.userName || 'User')}&background=random&size=80`}
                          alt={reply.userName}
                          className="user-avatar"
                        />
                      </div>
                      <div className="comment-content-wrapper">
                        <div className="comment-content-inner">
                          <div className="comment-header">
                            <div className="comment-header-left">
                              <span className="username">{reply.userName}</span>
                            </div>
                            {reply.rating && (
                              <div className="comment-rating">
                                {renderStars(reply.rating)}
                              </div>
                            )}
                          </div>
                          <div className="comment-text">
                            <p>{reply.comment}</p>
                          </div>
                        </div>
                        <div className="comment-meta">
                          <span className="comment-date">{formatDate(reply.createdAt)}</span>
                          {user && (String(user.id) === String(reply.userId) || String(user.id) === String(reply.user?.id)) && (
                            <button
                              className="delete-btn-text"
                              onClick={() => handleDeleteComment(reply.id)}
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {comment.replies.length > 2 && !expandedReplies[comment.id] && (
                    <button
                      className="show-more-replies-btn"
                      onClick={() => setExpandedReplies({ ...expandedReplies, [comment.id]: true })}
                    >
                      Xem thêm {comment.replies.length - 2} phản hồi
                    </button>
                  )}
                  {expandedReplies[comment.id] && comment.replies.length > 2 && (
                    <button
                      className="show-more-replies-btn"
                      onClick={() => setExpandedReplies({ ...expandedReplies, [comment.id]: false })}
                    >
                      Ẩn bớt
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {pagination.page < pagination.totalPages - 1 && (
          <button
            className="see-more-btn"
            onClick={() => loadComments(pagination.page + 1)}
            disabled={loading}
          >
            {loading ? 'Đang tải...' : 'Xem thêm bình luận'}
          </button>
        )}
      </div>

      {comments.length === 0 && (
        <div className="no-comments">
          <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection; 