import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — token ekle
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('cinebook_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

import { Alert } from 'react-native';

// Response interceptor — hata yönetimi
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('cinebook_token');
      await AsyncStorage.removeItem('cinebook_user');
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamıyor (Zaman Aşımı). Lütfen aynı Wi-Fi ağında olduğunuza emin olun.');
    } else if (error.message === 'Network Error') {
      Alert.alert('Ağ Hatası', 'Sunucuya bağlanılamadı. Lütfen sunucunun çalıştığını kontrol edin.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
