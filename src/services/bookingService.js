import { apiClient } from '../utils/apiClient';

const bookingService = {
  getBookings: async (params) => {
    return apiClient.get('/bookings', { params });
  },
  getBookingById: async (bookingId) => {
    return apiClient.get(`/bookings/${bookingId}`);
  },
  createBooking: async (data) => {
    return apiClient.post('/bookings', data);
  },
  cancelBooking: async (bookingId) => {
    return apiClient.delete(`/bookings/${bookingId}`);
  },
};

export default bookingService; 