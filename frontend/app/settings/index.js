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
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 64,
        paddingBottom: 20,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        backgroundColor: COLORS.surfaceElevated,
        borderBottomColor: COLORS.border,
      }}>
        <TouchableOpacity style={{ padding: 6 }} onPress={() => router.back()}>
          <Icon name="ArrowLeft" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary }}>Ayarlar</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        {/* Bildirimler */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 18,
          borderBottomWidth: user?.notifications_enabled !== 0 ? 0 : 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="Bell" size={22} color={COLORS.textSecondary} />
            <Text style={{ fontSize: 16, fontWeight: '500', marginLeft: 16, color: COLORS.textPrimary }}>
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
          <View style={{ paddingBottom: 18, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 12, color: COLORS.textSecondary }}>Bildirim Alma Aralığı</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              {[
                { label: 'Saat', value: 'hourly' },
                { label: 'Gün', value: 'daily' },
                { label: 'Hafta', value: 'weekly' },
                { label: 'Ay', value: 'monthly' }
              ].map((opt) => {
                const isSelected = (user?.notification_interval || 'hourly') === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 12,
                      alignItems: 'center',
                      borderWidth: 1,
                      backgroundColor: isSelected ? COLORS.primary : 'transparent',
                      borderColor: isSelected ? COLORS.primary : COLORS.border,
                    }}
                    onPress={() => handleChangeInterval(opt.value)}
                  >
                    <Text style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: isSelected ? '#fff' : COLORS.textPrimary,
                    }}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Tema Değiştir */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 18,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          }}
          onPress={toggleTheme}
        >
          <Icon name={isDark ? "Sun" : "Moon"} size={22} color={COLORS.textSecondary} />
          <Text style={{ fontSize: 16, fontWeight: '500', marginLeft: 16, color: COLORS.textPrimary }}>
            {isDark ? "Açık Temaya Geç" : "Koyu Temaya Geç"}
          </Text>
        </TouchableOpacity>

        {/* Çıkış Yap */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 18,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          }}
          onPress={handleLogout}
        >
          <Icon name="SignOut" size={22} color={COLORS.error} />
          <Text style={{ fontSize: 16, fontWeight: '500', marginLeft: 16, color: COLORS.error }}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
