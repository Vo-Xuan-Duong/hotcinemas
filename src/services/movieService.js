import { apiClient } from '../utils/apiClient';

const movieService = {
  getMovies: async (params) => {
    return apiClient.get('/movies', { params });
  },
  getMovieById: async (movieId) => {
    return apiClient.get(`/movies/${movieId}`);
  },
  createMovie: async (data) => {
    return apiClient.post('/movies', data);
  },
  updateMovie: async (movieId, data) => {
    return apiClient.put(`/movies/${movieId}`, data);
  },
  deleteMovie: async (movieId) => {
    return apiClient.delete(`/movies/${movieId}`);
  },
};

export default movieService; 