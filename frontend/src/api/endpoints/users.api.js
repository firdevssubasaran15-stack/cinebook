import apiClient from '@/api/apiClient';
import { ENDPOINTS, API_BASE_URL } from '@/constants/api';

import { storageService } from '@/services/storage.service';

export const usersApi = {
  getProfile: (userId) => apiClient.get(ENDPOINTS.USER_PROFILE(userId)),
  searchUsers: (query) => apiClient.get('/api/users/search', { params: { q: query } }),
  getUserComments: (userId) => apiClient.get(`/api/users/${userId}/comments`),
  toggleFollow: (userId) => apiClient.post(ENDPOINTS.USER_FOLLOW(userId)),
  getFollowers: (userId) => apiClient.get(ENDPOINTS.USER_FOLLOWERS(userId)),
  getFollowing: (userId) => apiClient.get(ENDPOINTS.USER_FOLLOWING(userId)),
  updateProfileImage: async (formData) => {
    const token = await storageService.getItem('cinebook_token');
    const response = await fetch(`${API_BASE_URL}/api/users/profile-image`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // Do NOT set Content-Type, fetch will set it with the correct boundary automatically
      },
      body: formData
    });
    
    if (!response.ok) {
      let errorData;
      let textContent = '';
      try {
        textContent = await response.text();
        errorData = JSON.parse(textContent);
      } catch (e) {
        throw new Error(`Sunucu Hatası (${response.status}): ${textContent.substring(0, 50)}`);
      }
      throw new Error(errorData?.message || 'Resim yüklenemedi');
    }
    
    return await response.json();
  },
  updateUsername: (username) => apiClient.put('/api/users/username', { username }),
  updateNotificationSettings: (enabled, interval) => apiClient.put('/api/users/settings/notifications', { enabled, interval }),
  
  // En çok hissedilen 5 duygu
  getTopEmotions: () => apiClient.get('/api/users/me/top-emotions'),
};
