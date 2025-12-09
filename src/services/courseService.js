import { apiClient } from '@/services/apiClient';
export const courseService = {
    list: async (params) => {
        const { data } = await apiClient.get('/courses', { params });
        return data;
    },
    getById: async (courseId) => {
        const { data } = await apiClient.get(`/courses/${courseId}`);
        return data;
    },
};
