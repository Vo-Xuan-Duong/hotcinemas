import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/vouchers';

const voucherService = {
    // 1. GET /api/v1/vouchers - Lấy tất cả vouchers với phân trang
    getAllVouchers: async (page = 0, size = 10, sort = '') => {
        const params = { page, size };
        if (sort) params.sort = sort;
        return axios.get(API_URL, { params });
    },

    // 2. GET /api/v1/vouchers/{id} - Lấy voucher theo ID
    getVoucherById: async (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    // 3. POST /api/v1/vouchers - Tạo voucher mới (Admin only)
    createVoucher: async (voucherData) => {
        return axios.post(API_URL, voucherData);
    },

    // 4. PUT /api/v1/vouchers/{id} - Cập nhật voucher (Admin only)
    updateVoucher: async (id, voucherData) => {
        return axios.put(`${API_URL}/${id}`, voucherData);
    },

    // 5. DELETE /api/v1/vouchers/{id} - Xóa voucher (Admin only)
    deleteVoucher: async (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },

    // 6. POST /api/v1/vouchers/{id}/activate - Kích hoạt voucher (Admin only)
    activateVoucher: async (id) => {
        return axios.post(`${API_URL}/${id}/activate`);
    },

    // 7. POST /api/v1/vouchers/{id}/deactivate - Vô hiệu hóa voucher (Admin only)
    deactivateVoucher: async (id) => {
        return axios.post(`${API_URL}/${id}/deactivate`);
    },

    // 8. GET /api/v1/vouchers/code/{code} - Lấy voucher theo code
    getVoucherByCode: async (code) => {
        return axios.get(`${API_URL}/code/${code}`);
    },

    // 9. GET /api/v1/vouchers/active-vouchers - Lấy tất cả vouchers đang active
    getActiveVouchers: async (page = 0, size = 10, sort = '') => {
        const params = { page, size };
        if (sort) params.sort = sort;
        return axios.get(`${API_URL}/active-vouchers`, { params });
    },

    // Helper: Toggle voucher status (activate/deactivate)
    toggleVoucherStatus: async (id, currentStatus) => {
        if (currentStatus === true || currentStatus === 'active') {
            return voucherService.deactivateVoucher(id);
        } else {
            return voucherService.activateVoucher(id);
        }
    }
};

export default voucherService;
