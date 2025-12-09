import { apiClient } from '@/services/apiClient';
export const sectionService = {
    list: async (params) => {
        const { data } = await apiClient.get('/sections', { params });
        return data;
    },
    getById: async (sectionId) => {
        const { data } = await apiClient.get(`/sections/${sectionId}`);
        return data;
    },
};
