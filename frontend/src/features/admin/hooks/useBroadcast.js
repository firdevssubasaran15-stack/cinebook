import { useState } from 'react';
import { Alert } from 'react-native';
import { adminApi } from '@/api/endpoints/admin.api';

export const useBroadcast = () => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleBroadcast = async () => {
    if (!message.trim()) {
      Alert.alert('Uyarı', 'Lütfen gönderilecek duyuru metnini girin.');
      return;
    }
    
    setSending(true);
    try {
      const res = await adminApi.broadcastNotification(message.trim());
      Alert.alert('Başarılı', res.data.message || 'Duyuru gönderildi.');
      setMessage('');
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Duyuru gönderilemedi.');
    } finally {
      setSending(false);
    }
  };

  return {
    message,
    setMessage,
    sending,
    handleBroadcast
  };
};
