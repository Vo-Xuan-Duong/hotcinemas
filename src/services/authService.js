import { apiClient, setTokens, clearTokens } from '../utils/apiClient';

export const authService = {

    login: async (data) => {
        const response = await apiClient.post('/auth/login', data);
        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);
        return response;
    },

    register: async (data) => {
        return apiClient.post('/auth/register', data);
    },

    refreshToken: async (refreshToken) => {
        return apiClient.post('/auth/refresh-token', { refreshToken });
    },

    logout: () => {
        clearTokens();
        return apiClient.post('/auth/logout');
    },

    forgotPassword: async (email) => {
        return apiClient.post(`/auth/forgot-password?email=${email}`);
    },

    verifyPasswordOtp: async (email, otp) => {
        return apiClient.post('/auth/verify-password-otp', { email, otp });
    },

    resetPassword: async (email, newPassword) => {
        return apiClient.patch('/auth/set-password', { email, newPassword });
    },

    verifyEmail: async (token) => {
        return apiClient.post('/auth/verify-email', { token });
    },

    verifyOTP: async (otpData) => {
        return apiClient.post('/auth/verify-active-otp', otpData);
    },

    getCurrentUser: async () => {
        return apiClient.get('/users/me');
    },

    validateToken: async () => {
        return apiClient.get('/auth/validate_token');
    },
    
    
};