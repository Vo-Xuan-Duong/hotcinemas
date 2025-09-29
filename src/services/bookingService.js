import { apiClient } from '../utils/apiClient';
import bookingsData from '../data/bookings.json';

const bookingService = {
  async getAllBookings() {
    try {
      // Try API first
      const response = await apiClient.get('/bookings');
      return response.data;
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      // Fallback to local data
      return bookingsData;
    }
  },
  getBookings: async (params) => {
    return apiClient.get('/bookings', { params });
  },
  getBookingById: async (bookingId) => {
    return apiClient.get(`/bookings/${bookingId}`);
  },
  createBooking: async (data) => {
    return apiClient.post('/bookings', data);
  },
  updateBooking: async (bookingId, data) => {
    return apiClient.put(`/bookings/${bookingId}`, data);
  },
  cancelBooking: async (bookingId) => {
    return apiClient.delete(`/bookings/${bookingId}`);
  },
};

export default bookingService; 