import apiClient from '@/api/apiClient';

export const notificationsApi = {
  getNotifications: () => apiClient.get('/api/notifications'),
  markAsRead: (id) => apiClient.put(`/api/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put('/api/notifications/read-all'),
  getUnreadCount: () => apiClient.get('/api/notifications/unread-count'),
  testPush: () => apiClient.post('/api/notifications/test'),
};
