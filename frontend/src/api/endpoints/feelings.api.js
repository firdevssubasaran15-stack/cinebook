import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/constants/api';

export const feelingsApi = {
  getByContentId: (contentId) => apiClient.get(ENDPOINTS.FEELINGS(contentId)),
  searchByTag: (tag, type = null) =>
    apiClient.get(ENDPOINTS.FEELINGS_SEARCH, { params: { tag, ...(type && { type }) } }),
  create: (contentId, text, tags) =>
    apiClient.post(ENDPOINTS.FEELINGS(contentId), { text, tags }),
  delete: (feelingId) => apiClient.delete(ENDPOINTS.FEELING_DELETE(feelingId)),
  update: (feelingId, text, tags) =>
    apiClient.put(ENDPOINTS.FEELING_UPDATE(feelingId), { text, tags }),
  toggleLike: (feelingId) => apiClient.post(ENDPOINTS.FEELING_LIKE(feelingId)),
};
