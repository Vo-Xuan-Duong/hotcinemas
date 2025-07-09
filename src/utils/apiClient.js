import axios from 'axios';
import { ERROR_MESSAGES } from './constants';

// Địa chỉ API backend, có thể thay đổi theo môi trường
const API_BASE_URL = 'http://localhost:8080/api'; // Spring Boot backend URL

// Lấy token từ localStorage
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Lưu token vào localStorage
const setTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

// Xóa token khỏi localStorage
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

let errorHandler = null;

const setApiErrorHandler = (handler) => {
  errorHandler = handler;
};

// Tạo instance axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm accessToken vào mỗi request nếu có
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tự động refresh token khi accessToken hết hạn
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    let message = ERROR_MESSAGES.SERVER_ERROR;
    let status = error.response ? error.response.status : null;

    // Phân loại lỗi
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      message = ERROR_MESSAGES.NETWORK_ERROR || 'Lỗi kết nối mạng.';
    } else if (status === 401) {
      message = ERROR_MESSAGES.UNAUTHORIZED || 'Bạn chưa đăng nhập.';
      // Tự động refresh token nếu có refreshToken
      if (!originalRequest._retry && getRefreshToken()) {
        originalRequest._retry = true;
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken: getRefreshToken(),
          });
          const { accessToken, refreshToken } = res.data;
          setTokens(accessToken, refreshToken);
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          clearTokens();
          if (errorHandler) errorHandler(message, 401);
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        clearTokens();
        if (errorHandler) errorHandler(message, 401);
        window.location.href = '/login';
      }
    } else if (status === 403) {
      message = ERROR_MESSAGES.FORBIDDEN || 'Bạn không có quyền truy cập.';
    } else if (status === 404) {
      message = ERROR_MESSAGES.NOT_FOUND || 'Không tìm thấy thông tin.';
    } else if (status === 422) {
      message = ERROR_MESSAGES.VALIDATION_ERROR || 'Dữ liệu không hợp lệ.';
    } else if (status === 500) {
      message = ERROR_MESSAGES.SERVER_ERROR || 'Lỗi máy chủ.';
    } else if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }

    if (errorHandler) errorHandler(message, status);
    return Promise.reject({ ...error, message, status });
  }
);

export { apiClient, setTokens, clearTokens, getAccessToken, getRefreshToken, setApiErrorHandler }; 