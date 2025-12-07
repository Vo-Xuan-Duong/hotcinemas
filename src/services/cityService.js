import { apiClient } from '../utils/apiClient';
import { ENDPOINTS } from '../utils/constants';

/**
 * City Service
 * Base URL: /api/v1/cities
 */
class CityService {
    /**
     * GET /api/v1/cities
     * Lấy tất cả cities với phân trang
     * @param {Object} params - Query parameters
     * @param {number} params.page - Số trang (default: 0)
     * @param {number} params.size - Số items per page (default: 20)
     * @param {string} params.sort - Sắp xếp (VD: "name,asc" hoặc "name,desc")
     * @returns {Promise<Object>} Pagination response với danh sách cities
     */
    async getAllCities(params = {}) {
        const { page = 0, size = 20, sort } = params;
        return apiClient.get(ENDPOINTS.CITIES, {
            params: { page, size, sort }
        });
    }

    /**
     * GET /api/v1/cities/active
     * Lấy tất cả cities đang hoạt động (không phân trang)
     * @returns {Promise<Array>} Danh sách cities đang active
     */
    async getCitiesAllNoPage() {
        return apiClient.get(`${ENDPOINTS.CITIES}/all-no-page`);
    }

    /**
     * GET /api/v1/cities/search
     * Tìm kiếm cities theo tên (không phân biệt hoa thường)
     * @param {string} name - Tên city để tìm kiếm
     * @returns {Promise<Array>} Danh sách cities khớp với tên
     */
    async searchCitiesByName(name) {
        return apiClient.get(`${ENDPOINTS.CITIES}/search`, {
            params: { name }
        });
    }

    /**
     * GET /api/v1/cities/{id}
     * Lấy city theo ID
     * @param {number} id - ID của city
     * @returns {Promise<Object>} City object
     */
    async getCityById(id) {
        return apiClient.get(`${ENDPOINTS.CITIES}/${id}`);
    }

    /**
     * GET /api/v1/cities/search/advanced
     * Tìm kiếm cities theo tên hoặc mã (không phân biệt hoa thường)
     * @param {string} searchTerm - Từ khóa tìm kiếm (tên hoặc mã)
     * @returns {Promise<Array>} Danh sách cities khớp với từ khóa
     */
    async advancedSearch(searchTerm) {
        return apiClient.get(`${ENDPOINTS.CITIES}/search/advanced`, {
            params: { searchTerm }
        });
    }

    /**
     * GET /api/v1/cities/country/{country}
     * Lấy tất cả cities trong một quốc gia
     * @param {string} country - Tên quốc gia
     * @returns {Promise<Array>} Danh sách cities trong quốc gia
     */
    async getCitiesByCountry(country) {
        return apiClient.get(`${ENDPOINTS.CITIES}/country/${country}`);
    }

    /**
     * POST /api/v1/cities/{id}/activate
     * Kích hoạt city theo ID
     * @param {number} id - ID của city
     * @returns {Promise<Object>} Response message
     */
    async activateCity(id) {
        return apiClient.post(`${ENDPOINTS.CITIES}/${id}/activate`);
    }

    /**
     * POST /api/v1/cities/{id}/deactivate
     * Vô hiệu hóa city theo ID
     * @param {number} id - ID của city
     * @returns {Promise<Object>} Response message
     */
    async deactivateCity(id) {
        return apiClient.post(`${ENDPOINTS.CITIES}/${id}/deactivate`);
    }

    /**
     * Utility: Lấy cities cho dropdown/select
     * @returns {Promise<Array>} Simplified city list với id và name
     */
    async getCitiesForDropdown() {
        const cities = await this.getActiveCities();
        return cities.map(city => ({
            value: city.id,
            label: city.name
        }));
    }

    /**
     * Utility: Group cities theo quốc gia
     * @returns {Promise<Object>} Cities grouped by country
     */
    async getCitiesGroupedByCountry() {
        const response = await this.getAllCities({ size: 1000 });
        const cities = response.content || [];

        return cities.reduce((acc, city) => {
            const country = city.country || 'Unknown';
            if (!acc[country]) {
                acc[country] = [];
            }
            acc[country].push(city);
            return acc;
        }, {});
    }
}

export default new CityService();
