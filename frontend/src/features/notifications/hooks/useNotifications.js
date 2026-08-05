import { useState, useEffect } from 'react';
import { notificationsApi } from '@/api/endpoints/notifications.api';

export function useNotifications() {
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

  return {
    notifications,
    loading,
    handleMarkAsRead,
    handleMarkAllAsRead
  };
}
