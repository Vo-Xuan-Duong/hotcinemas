import { apiClient } from '../utils/apiClient';

const cinemaService = {
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