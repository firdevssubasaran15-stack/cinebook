import apiClient from '@/api/apiClient';
import { ENDPOINTS, API_BASE_URL } from '@/constants/api';
import { storageService } from '@/services/storage.service';

export const contentApi = {
  getLatest: () => apiClient.get(ENDPOINTS.CONTENT_LATEST),
  
  getRecommendations: (mood) => apiClient.get(`${ENDPOINTS.CONTENT_RECOMMENDATION}?mood=${mood}`),
  
  getUndiscoveredByMood: (mood, type) => apiClient.get(ENDPOINTS.CONTENT_UNDISCOVERED(mood, type)),

  getByType: (type, search) => apiClient.get(`${ENDPOINTS.CONTENT_BY_TYPE(type)}${search ? `?search=${search}` : ''}`),

  getById: (id) => apiClient.get(ENDPOINTS.CONTENT_BY_ID(id)),

  create: async (formData) => {
    const token = await storageService.getItem('cinebook_token');
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONTENT_CREATE}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw { response: { data } };
    }
    return { data };
  },

  update: async (id, formData) => {
    const token = await storageService.getItem('cinebook_token');
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONTENT_BY_ID(id)}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw { response: { data } };
    }
    return { data };
  },

  delete: (id) => apiClient.delete(ENDPOINTS.CONTENT_BY_ID(id)),
};
