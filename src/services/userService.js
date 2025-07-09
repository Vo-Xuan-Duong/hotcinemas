import { apiClient } from '../utils/apiClient';

const userService = {
  getUsers: async (params) => {
    return apiClient.get('/users', { params });
  },
  getUserById: async (userId) => {
    return apiClient.get(`/users/${userId}`);
  },
  updateUser: async (userId, data) => {
    return apiClient.put(`/users/${userId}`, data);
  },
  deleteUser: async (userId) => {
    return apiClient.delete(`/users/${userId}`);
  },
};

export default userService; 