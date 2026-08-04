import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { notificationsApi } from '@/api/endpoints/notifications.api';

export const useUnreadNotifications = (user) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchUnreadCount = async () => {
        try {
          const res = await notificationsApi.getUnreadCount();
          setUnreadCount(res.data.data.count);
        } catch (err) {
          console.log('Unread count fetch error:', err.message);
        }
      };

      if (user) {
        fetchUnreadCount();
      }
    }, [user])
  );

  return { unreadCount, setUnreadCount };
};
