import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/constants/api';

export const contentApi = {
  getLatest: () => apiClient.get(ENDPOINTS.CONTENT_LATEST),
  
  getRecommendations: (mood) => apiClient.get(`${ENDPOINTS.CONTENT_RECOMMENDATION}?mood=${mood}`),
  
  getUndiscoveredByMood: (mood, type) => apiClient.get(ENDPOINTS.CONTENT_UNDISCOVERED(mood, type)),

  getByType: (type, search) => apiClient.get(`${ENDPOINTS.CONTENT_BY_TYPE(type)}${search ? `?search=${search}` : ''}`),

  getById: (id) => apiClient.get(ENDPOINTS.CONTENT_BY_ID(id)),

  create: (formData) =>
    apiClient.post(ENDPOINTS.CONTENT_CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, formData) =>
    apiClient.put(ENDPOINTS.CONTENT_BY_ID(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) => apiClient.delete(ENDPOINTS.CONTENT_BY_ID(id)),
};
