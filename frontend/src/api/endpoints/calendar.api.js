import apiClient from '@/api/apiClient';

export const calendarApi = {
  getHistory: () => apiClient.get('/api/calendar'),
};
