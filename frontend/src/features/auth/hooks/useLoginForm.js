import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { secureStorage } from '@/services/secureStorage.service';

export function useLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const loadSavedCredentials = async () => {
      const credentials = await secureStorage.loadCredentials();
      if (credentials) {
        setUsername(credentials.username);
        setPassword(credentials.password);
        setRememberMe(true);
      }
    };
    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı ve şifre gereklidir.');
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
      if (rememberMe) {
        await secureStorage.saveCredentials(username.trim(), password);
      } else {
        await secureStorage.clearCredentials();
      }
      router.replace('/(tabs)/home');
    } catch (err) {
      const msg = err.response?.data?.message || 'Giriş yapılamadı. Lütfen tekrar deneyin.';
      Alert.alert('Giriş Hatası', msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    rememberMe,
    setRememberMe,
    handleLogin,
  };
}
