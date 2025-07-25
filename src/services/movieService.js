import { apiClient } from '../utils/apiClient';
import { ENDPOINTS } from '../utils/constants';

// Import local data as fallback
import moviesData from '../data/movies.json';

const movieService = {
  async getAllMovies() {
    try {
      // Try to fetch from API first
      const response = await apiClient.get(ENDPOINTS.MOVIES);
      return response.data;
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      // Fallback to local data
      return moviesData;
    }
  },

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