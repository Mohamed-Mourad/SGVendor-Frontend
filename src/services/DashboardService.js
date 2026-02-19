import api from '@/services/api';

export default {
    async getDashboardStats(fromDate, toDate) {
        const params = new URLSearchParams();
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);

        const response = await api.get(`/api/vendor/dashboard/stats?${params.toString()}`);
        return response.data;
    }
};
