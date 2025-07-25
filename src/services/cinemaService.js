import { apiClient } from '../utils/apiClient';
import { ENDPOINTS } from '../utils/constants';

// Import local data as fallback
import cinemasData from '../data/cinemas.json';

const cinemaService = {
  async getAllCinemas() {
    try {
      // Try to fetch from API first
      const response = await apiClient.get(ENDPOINTS.CINEMAS);
      return response.data;
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      // Fallback to local data
      return cinemasData;
    }
  },

  getCinemas: async (params) => {
    return apiClient.get('/cinemas', { params });
  },
  getCinemaById: async (cinemaId) => {
    return apiClient.get(`/cinemas/${cinemaId}`);
  },
  createCinema: async (data) => {
    return apiClient.post('/cinemas', data);
  },
  updateCinema: async (cinemaId, data) => {
    return apiClient.put(`/cinemas/${cinemaId}`, data);
  },
  deleteCinema: async (cinemaId) => {
    return apiClient.delete(`/cinemas/${cinemaId}`);
  },
};

export default cinemaService; 