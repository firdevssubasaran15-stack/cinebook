import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { usersApi } from '@/api/endpoints/users.api';

export function useSettings(user, logout, updateUser) {
  const [loading, setLoading] = useState(false);

  const handleToggleNotifications = async (value) => {
    try {
      setLoading(true);
      const interval = user?.notification_interval || 'hourly';
      const res = await usersApi.updateNotificationSettings(value, interval);
      updateUser(res.data.data);
    } catch (error) {
      Alert.alert('Hata', 'Bildirim ayarı güncellenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeInterval = async (interval) => {
    try {
      setLoading(true);
      const isEnabled = user?.notifications_enabled !== 0;
      const res = await usersApi.updateNotificationSettings(isEnabled, interval);
      updateUser(res.data.data);
    } catch (error) {
      Alert.alert('Hata', 'Bildirim aralığı güncellenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Hata', 'Çıkış yapılamadı.');
    }
  };

  return {
    loading,
    handleToggleNotifications,
    handleChangeInterval,
    handleLogout
  };
}
