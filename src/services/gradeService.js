import { apiClient } from '@/services/apiClient';
export const gradeService = {
    myGrades: async () => {
        const { data } = await apiClient.get('/grades/my-grades');
        return data;
    },
    transcript: async () => {
        const response = await apiClient.get('/grades/transcript', { responseType: 'json' });
        return response.data;
    },
    downloadTranscriptPdf: async () => {
        const response = await apiClient.get('/grades/transcript/pdf', { responseType: 'blob' });
        return response.data;
    },
    saveGrades: async (sectionId, payload) => {
        const { data } = await apiClient.post('/grades', { sectionId, ...payload });
        return data;
    },
};
