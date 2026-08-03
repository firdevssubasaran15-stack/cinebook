import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/features/icon/components/Icon';
import { notificationsApi } from '@/api/endpoints/notifications.api';

export default function NotificationsScreen() {
  const { colors: COLORS } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsApi.getNotifications();
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Bildirimler yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, is_read: 1 } : notif))
      );
    } catch (err) {
      console.error('Okundu isaretlenemedi:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: 1 }))
      );
    } catch (err) {
      console.error('Tümü okundu isaretlenemedi:', err);
    }
  };

  const renderItem = ({ item }) => {
    const isUnread = item.is_read === 0;
    return (
      <TouchableOpacity 
        className={`flex-row items-center p-4 border-b ${isUnread ? 'bg-light-surfaceElevated dark:bg-dark-surfaceElevated border-light-border dark:border-dark-border' : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border'}`}
        onPress={() => isUnread && handleMarkAsRead(item.id)}
      >
        <View className="mr-4">
          <Icon name="Bell" size={24} color={isUnread ? COLORS.primary : COLORS.textMuted} weight={isUnread ? 'fill' : 'regular'} />
        </View>
        <View className="flex-1">
          <Text className={`text-[15px] mb-1 ${isUnread ? 'text-text-lightPrimary dark:text-text-darkPrimary font-bold' : 'text-text-lightSecondary dark:text-text-darkSecondary font-normal'}`}>
            {item.message}
          </Text>
          <Text className="text-xs text-text-lightMuted dark:text-text-darkMuted">
            {new Date(item.created_at).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {isUnread && <View className="w-2.5 h-2.5 rounded-full ml-2.5 bg-brand-primary" />}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-light-bg dark:bg-dark-bg">
      <View className="flex-row justify-between items-center px-5 pt-16 pb-4 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
        <Text className="text-2xl font-extrabold text-text-lightPrimary dark:text-text-darkPrimary">Bildirimler</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Icon name="CheckCircle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Icon name="BellSlash" size={48} color={COLORS.textMuted} />
          <Text className="mt-4 text-base text-text-lightMuted dark:text-text-darkMuted">Hiç bildiriminiz yok.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}
