import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, TextInput, Switch } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { API_BASE_URL } from '@/constants/api';
import { usersApi } from '@/api/endpoints/users.api';

export default function SettingsScreen() {
  const { user, logout, updateUser } = useAuth();
  const { colors: COLORS, toggleTheme, isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleToggleNotifications = async (value) => {
    try {
      const interval = user?.notification_interval || 'hourly';
      const res = await usersApi.updateNotificationSettings(value, interval);
      updateUser(res.data.data);
    } catch (error) {
      Alert.alert('Hata', 'Bildirim ayarı güncellenemedi.');
    }
  };

  const handleChangeInterval = async (interval) => {
    try {
      const isEnabled = user?.notifications_enabled !== 0;
      const res = await usersApi.updateNotificationSettings(isEnabled, interval);
      updateUser(res.data.data);
    } catch (error) {
      Alert.alert('Hata', 'Bildirim aralığı güncellenemedi.');
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

  return (
    <View className="flex-1 bg-light-bg dark:bg-dark-bg">
      <View className="flex-row items-center justify-between pt-[60px] pb-5 px-5 border-b bg-light-surfaceElevated dark:bg-dark-surfaceElevated border-light-border dark:border-dark-border">
        <TouchableOpacity className="p-1.5" onPress={() => router.back()}>
          <Icon name="ArrowLeft" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary">Ayarlar</Text>
        <View className="w-6" />
      </View>

      <View className="px-5">
        <View className={`flex-row items-center justify-between py-4.5 ${user?.notifications_enabled !== 0 ? '' : 'border-b border-light-border dark:border-dark-border'}`}>
          <View className="flex-row items-center">
            <Icon name="Bell" size={22} color={COLORS.textSecondary} />
            <Text className="text-base font-medium ml-4 text-text-lightPrimary dark:text-text-darkPrimary">
              Bildirimler
            </Text>
          </View>
          <Switch
            value={user?.notifications_enabled !== 0}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={'#fff'}
          />
        </View>

        {user?.notifications_enabled !== 0 && (
          <View className="px-4 pb-6 border-b border-light-border dark:border-dark-border">
            <Text className="text-sm font-semibold mb-3 text-text-lightSecondary dark:text-text-darkSecondary">Bildirim Alma Aralığı</Text>
            <View className="flex-row justify-between gap-2">
              {[
                { label: 'Saat', value: 'hourly' },
                { label: 'Gün', value: 'daily' },
                { label: 'Hafta', value: 'weekly' },
                { label: 'Ay', value: 'monthly' }
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  className={`flex-1 py-2 rounded-lg items-center border ${
                    (user?.notification_interval || 'hourly') === opt.value
                      ? 'bg-brand-primary border-brand-primary'
                      : 'bg-light-surfaceElevated dark:bg-dark-surfaceElevated border-light-border dark:border-dark-border'
                  }`}
                  onPress={() => handleChangeInterval(opt.value)}
                >
                  <Text className={`text-[13px] font-semibold ${
                    (user?.notification_interval || 'hourly') === opt.value
                      ? 'text-white'
                      : 'text-text-lightPrimary dark:text-text-darkPrimary'
                  }`}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity className="flex-row items-center justify-between py-4.5 border-b border-light-border dark:border-dark-border" onPress={toggleTheme}>
          <View className="flex-row items-center">
            <Icon name={isDark ? "Sun" : "Moon"} size={22} color={COLORS.textSecondary} />
            <Text className="text-base font-medium ml-4 text-text-lightPrimary dark:text-text-darkPrimary">
              {isDark ? "Açık Temaya Geç" : "Koyu Temaya Geç"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-4.5 border-b border-light-border dark:border-dark-border" onPress={handleLogout}>
          <View className="flex-row items-center">
            <Icon name="SignOut" size={22} color={COLORS.error} />
            <Text className="text-base font-medium ml-4 text-status-error">Çıkış Yap</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
