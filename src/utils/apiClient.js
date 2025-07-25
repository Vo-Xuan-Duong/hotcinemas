import axios from 'axios';
import { ERROR_MESSAGES, STORAGE_KEYS } from './constants';

// API base URL for development - có thể sử dụng mock API hoặc JSON server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let currentToken = null;

const setAuthToken = (token) => {
  currentToken = token;
  if (token) {
    localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

const removeAuthToken = () => {
  currentToken = null;
  localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
  delete apiClient.defaults.headers.common['Authorization'];
};

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = currentToken || localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // For mock API, return the data directly
    if (response.config.baseURL?.includes('3001')) {
      return response.data;
    }
    return response.data;
  },
  async (error) => {
    const status = error.response?.status;
    let message = ERROR_MESSAGES.SERVER_ERROR;

    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      // For development, create mock responses
      if (error.config.url?.includes('/auth/login')) {
        return {
          user: { id: 1, name: 'Demo User', email: 'demo@example.com' },
          token: 'mock-jwt-token-' + Date.now()
        };
      }
      if (error.config.url?.includes('/auth/register')) {
        return {
          user: {
            id: Date.now(),
            name: error.config.data ? JSON.parse(error.config.data).name : 'New User',
            email: error.config.data ? JSON.parse(error.config.data).email : 'new@example.com'
          },
          token: 'mock-jwt-token-' + Date.now()
        };
      }
      if (error.config.url?.includes('/auth/verify')) {
        return { valid: true };
      }

      message = ERROR_MESSAGES.NETWORK_ERROR || 'Lỗi kết nối mạng.';
    } else if (status === 401) {
      message = ERROR_MESSAGES.UNAUTHORIZED || 'Email hoặc mật khẩu không đúng.';
      removeAuthToken();
    } else if (status === 403) {
      message = ERROR_MESSAGES.FORBIDDEN || 'Bạn không có quyền truy cập.';
    } else if (status === 404) {
      message = ERROR_MESSAGES.NOT_FOUND || 'Không tìm thấy thông tin.';
    } else if (status === 422) {
      message = ERROR_MESSAGES.VALIDATION_ERROR || 'Dữ liệu không hợp lệ.';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }

    const customError = new Error(message);
    customError.status = status;
    throw customError;
  }
);

// Enhanced API methods
const api = {
  // Auth endpoints
  post: (url, data) => apiClient.post(url, data),
  get: (url) => apiClient.get(url),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),

  // Token management
  setAuthToken,
  removeAuthToken
};

export { apiClient, setAuthToken, removeAuthToken, api };
export default api; 