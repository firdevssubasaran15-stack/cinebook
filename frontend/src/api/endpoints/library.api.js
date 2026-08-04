import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/constants/api';

export const libraryApi = {
  getUserLibrary: () => apiClient.get('/api/library'),
  getCounts: (contentId) => apiClient.get(`/api/library/counts/${contentId}`),
  getStatus: (contentId) => apiClient.get(`/api/library/status/${contentId}`),
  upsert: (contentId, status) => apiClient.post(`/api/library/${contentId}`, { status }),
  remove: (contentId) => apiClient.delete(`/api/library/${contentId}`),
};
