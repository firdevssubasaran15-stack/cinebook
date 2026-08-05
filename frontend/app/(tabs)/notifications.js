import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { notificationsStyles as styles } from '@/features/notifications/styles/notifications.styles';

export default function NotificationsScreen() {
  const { colors: COLORS } = useTheme();
  
  const {
    notifications,
    loading,
    handleMarkAsRead,
    handleMarkAllAsRead
  } = useNotifications();

  const renderItem = ({ item }) => {
    const isUnread = item.is_read === 0;
    
    const containerStyle = `${styles.itemContainerBase} ${isUnread ? styles.itemContainerUnread : styles.itemContainerRead}`;
    const messageStyle = `${styles.itemMessageBase} ${isUnread ? styles.itemMessageUnread : styles.itemMessageRead}`;
    
    return (
      <TouchableOpacity 
        className={containerStyle}
        onPress={() => isUnread && handleMarkAsRead(item.id)}
      >
        <View className={styles.itemIconContainer}>
          <Icon name="Bell" size={24} color={isUnread ? COLORS.primary : COLORS.textMuted} weight={isUnread ? 'fill' : 'regular'} />
        </View>
        <View className={styles.itemTextContainer}>
          <Text className={messageStyle}>
            {item.message}
          </Text>
          <Text className={styles.itemDate}>
            {new Date(item.created_at).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {isUnread && <View className={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View className={styles.mainContainer}>
      <View className={styles.headerContainer}>
        <Text className={styles.headerTitle}>Bildirimler</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Icon name="CheckCircle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View className={styles.centerContainer}>
          <Icon name="BellSlash" size={48} color={COLORS.textMuted} />
          <Text className={styles.emptyText}>Hiç bildiriminiz yok.</Text>
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
