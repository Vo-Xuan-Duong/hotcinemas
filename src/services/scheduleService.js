import { apiClient } from '../utils/apiClient';
import { ENDPOINTS } from '../utils/constants';

// Import local data as fallback
import showtimesData from '../data/showtimes.json';

class ScheduleService {
    async getAllSchedules() {
        try {
            // Try to fetch from API first
            const response = await apiClient.get(ENDPOINTS.SCHEDULES);
            return response.data;
        } catch (error) {
            console.warn('API call failed, using local data:', error);
            // Fallback to local data
            return showtimesData;
        }
    }

    async getSchedulesByDate(date) {
        try {
            const allSchedules = await this.getAllSchedules();
            return allSchedules.filter(schedule => schedule.date === date);
        } catch (error) {
            console.error('Error fetching schedules by date:', error);
            throw error;
        }
    }

    async getSchedulesByCinema(cinemaId) {
        try {
            const allSchedules = await this.getAllSchedules();
            return allSchedules.filter(schedule => schedule.cinemaId === cinemaId);
        } catch (error) {
            console.error('Error fetching schedules by cinema:', error);
            throw error;
        }
    }

    async getSchedulesByMovie(movieId) {
        try {
            const allSchedules = await this.getAllSchedules();
            return allSchedules.filter(schedule => schedule.movieId === movieId);
        } catch (error) {
            console.error('Error fetching schedules by movie:', error);
            throw error;
        }
    }

    async getSchedulesByDateAndCinema(date, cinemaId) {
        try {
            const allSchedules = await this.getAllSchedules();
            return allSchedules.filter(schedule =>
                schedule.date === date &&
                (!cinemaId || schedule.cinemaId === cinemaId)
            );
        } catch (error) {
            console.error('Error fetching schedules by date and cinema:', error);
            throw error;
        }
    }

    async getScheduleById(id) {
        try {
            const allSchedules = await this.getAllSchedules();
            return allSchedules.find(schedule => schedule.id === id);
        } catch (error) {
            console.error('Error fetching schedule by id:', error);
            throw error;
        }
    }

    // Generate upcoming dates for schedule display
    getUpcomingDates(days = 7) {
        const dates = [];
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push({
                value: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit'
                }),
                fullLabel: date.toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                isToday: i === 0
            });
        }
        return dates;
    }

    // Format time for display
    formatTime(timeString) {
        return timeString; // Already in HH:mm format
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Create and export a singleton instance
export const scheduleService = new ScheduleService();