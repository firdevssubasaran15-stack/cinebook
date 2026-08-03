import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { secureStorage } from '@/services/secureStorage.service';
import { isPasswordValid } from '@/features/auth/components/PasswordValidator';

export function useRegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Hata', 'Tüm alanlar zorunludur.');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }
    if (!isPasswordValid(password)) {
      Alert.alert('Hata', 'Lütfen tüm şifre kurallarını karşıladığınızdan emin olun.');
      return;
    }

    setLoading(true);
    try {
      await register(username.trim(), email.trim(), password);
      if (rememberMe) {
        await secureStorage.saveCredentials(username.trim(), password);
      } else {
        await secureStorage.clearCredentials();
      }
      router.replace('/(tabs)/home');
    } catch (err) {
      const msg = err.response?.data?.message || 'Kayıt yapılamadı.';
      Alert.alert('Kayıt Hatası', msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    loading,
    rememberMe,
    setRememberMe,
    handleRegister,
  };
}
