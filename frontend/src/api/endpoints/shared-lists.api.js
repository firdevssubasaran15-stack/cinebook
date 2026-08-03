import apiClient from '@/api/apiClient';

export const sharedListsApi = {
  createList: (name, type) => apiClient.post('/api/shared-lists', { name, type }),
  getMyLists: () => apiClient.get('/api/shared-lists'),
  getListDetails: (id) => apiClient.get(`/api/shared-lists/${id}`),
  inviteUser: (id, targetUserId) => apiClient.post(`/api/shared-lists/${id}/invite`, { targetUserId }),
  acceptInvite: (id) => apiClient.post(`/api/shared-lists/${id}/accept`),
  rejectInvite: (id) => apiClient.post(`/api/shared-lists/${id}/reject`),
  addContent: (id, contentId) => apiClient.post(`/api/shared-lists/${id}/content`, { contentId }),
  getPendingInvitations: () => apiClient.get('/api/shared-lists/invitations'),
  toggleVisibility: (id) => apiClient.put(`/api/shared-lists/${id}/visibility`),
  getUserPublicLists: (userId) => apiClient.get(`/api/shared-lists/user/${userId}/public`),
  saveList: (id) => apiClient.post(`/api/shared-lists/${id}/save`),
  unsaveList: (id) => apiClient.delete(`/api/shared-lists/${id}/save`),
};
