import { apiClient } from '../utils/apiClient';
import usersData from '../data/users.json';

const userService = {
  async getAllUsers() {
    try {
      // Try API first
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      // Fallback to local data
      return usersData;
    }
  },
  getUsers: async (params) => {
    return apiClient.get('/users', { params });
  },
  getUserById: async (userId) => {
    return apiClient.get(`/users/${userId}`);
  },
  createUser: async (data) => {
    return apiClient.post('/users', data);
  },
  updateUser: async (userId, data) => {
    return apiClient.put(`/users/${userId}`, data);
  },
  deleteUser: async (userId) => {
    return apiClient.delete(`/users/${userId}`);
  },
};

export default userService; 