import { apiClient } from '../utils/apiClient';

// Helpers to unwrap backend ResponseData envelope
const unwrap = (res) => res?.data ?? res;

const base = '/comments';

const commentService = {
    /**
     * Create a new comment or reply
     * @param {Object} commentData - { movieId, comment, rating, parentId? }
     * @returns {Promise<Object>} Created comment
     */
    async createComment(commentData) {
        const res = await apiClient.post(base, commentData);
        return unwrap(res);
    },

    /**
     * Update an existing comment
     * @param {number} commentId - Comment ID
     * @param {Object} commentData - { movieId, comment, rating, parentId? }
     * @returns {Promise<Object>} Updated comment
     */
    async updateComment(commentId, commentData) {
        const res = await apiClient.put(`${base}/${commentId}`, commentData);
        return unwrap(res);
    },

    /**
     * Delete a comment
     * @param {number} commentId - Comment ID
     * @returns {Promise<void>}
     */
    async deleteComment(commentId) {
        const res = await apiClient.delete(`${base}/${commentId}`);
        return unwrap(res);
    },

    /**
     * Get a comment by ID
     * @param {number} commentId - Comment ID
     * @returns {Promise<Object>} Comment details with replies
     */
    async getCommentById(commentId) {
        const res = await apiClient.get(`${base}/${commentId}`);
        return unwrap(res);
    },

    /**
     * Get all comments for a movie (paginated)
     * @param {number} movieId - Movie ID
     * @param {Object} params - { page: 0, size: 5, sort: 'createdAt,desc' }
     * @returns {Promise<Object>} Paginated comments { content, totalElements, totalPages, ... }
     */
    async getCommentsByMovie(movieId, params = { page: 0, size: 10 }) {
        const res = await apiClient.get(`${base}/movie/${movieId}`, { params });
        return unwrap(res);
    },

    /**
     * Get comments array only (no pagination info)
     * @param {number} movieId - Movie ID
     * @param {Object} params - Query params
     * @returns {Promise<Array>} Array of comments
     */
    async getCommentsByMovieArray(movieId, params = { page: 0, size: 10 }) {
        const res = await this.getCommentsByMovie(movieId, params);
        return Array.isArray(res?.content) ? res.content : (Array.isArray(res) ? res : []);
    },

    /**
     * Add a comment (alias for createComment)
     * @param {Object} commentData - Comment data
     * @returns {Promise<Object>} Created comment
     */
    async addComment(commentData) {
        return this.createComment(commentData);
    },

    /**
     * Add a reply to a comment
     * @param {number} parentId - Parent comment ID
     * @param {Object} replyData - { movieId, comment, rating }
     * @returns {Promise<Object>} Created reply
     */
    async addReply(parentId, replyData) {
        return this.createComment({ ...replyData, parentId });
    },

    /**
     * Get movie comments with default pagination
     * @param {number} movieId - Movie ID
     * @returns {Promise<Object>} Paginated comments
     */
    async getMovieComments(movieId) {
        return this.getCommentsByMovie(movieId, { page: 0, size: 10 });
    },

    /**
     * Load more comments (next page)
     * @param {number} movieId - Movie ID
     * @param {number} page - Page number
     * @param {number} size - Page size
     * @returns {Promise<Object>} Paginated comments
     */
    async loadMoreComments(movieId, page = 1, size = 10) {
        return this.getCommentsByMovie(movieId, { page, size });
    },

    /**
     * Get average rating for a movie
     * @param {number} movieId - Movie ID
     * @returns {Promise<Object>} { averageRating: number, countRating: number }
     */
    async getAverageRating(movieId) {
        const res = await apiClient.get(`${base}/average-rating/${movieId}`);
        return unwrap(res);
    }
};

export default commentService;
