import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/constants/api';

export const adminApi = {
  getAllUsers: () => apiClient.get(ENDPOINTS.ADMIN_USERS),
  searchUser: (username) => apiClient.get(ENDPOINTS.ADMIN_SEARCH, { params: { username } }),
  updatePrivileges: (userId, privileges) =>
    apiClient.put(ENDPOINTS.ADMIN_PRIVILEGES(userId), privileges),
  broadcastNotification: (message) => 
    apiClient.post('/api/notifications/broadcast', { message }),
};
