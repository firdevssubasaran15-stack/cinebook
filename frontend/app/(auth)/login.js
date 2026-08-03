import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { GRADIENTS } from '@/constants/colors';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';
import AuthLayout from '@/features/auth/components/AuthLayout';
import AuthHeader from '@/features/auth/components/AuthHeader';
import AuthInput from '@/features/auth/components/AuthInput';
import AuthButton from '@/features/auth/components/AuthButton';
import RememberMeCheckbox from '@/features/auth/components/RememberMeCheckbox';

export default function LoginScreen() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    rememberMe,
    setRememberMe,
    handleLogin,
  } = useLoginForm();

  return (
    <AuthLayout>
      <AuthHeader 
        emoji="🎬" 
        title="CineBook" 
        subtitle="Film, Dizi & Kitap Dünyanda Kaybol" 
      />

      <View className="rounded-3xl p-7 border bg-light-surface border-light-border dark:bg-dark-surface dark:border-dark-border">
        <Text className="text-2xl font-bold mb-6 text-text-lightPrimary dark:text-text-darkPrimary">
          Giriş Yap
        </Text>

        <AuthInput
          label="Kullanıcı Adı veya E-posta"
          value={username}
          onChangeText={setUsername}
          placeholder="Kullanıcı adı veya e-posta girin"
        />

        <AuthInput
          label="Şifre"
          value={password}
          onChangeText={setPassword}
          placeholder="Şifrenizi girin"
          secure={true}
        />

        <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />

        <AuthButton
          title="Giriş Yap"
          onPress={handleLogin}
          gradientColors={GRADIENTS.primary}
          loading={loading}
        />

        <TouchableOpacity
          className="mt-5 items-center"
          onPress={() => router.push('/(auth)/register')}
        >
          <Text className="text-sm text-text-lightSecondary dark:text-text-darkSecondary">
            Hesabın yok mu? <Text className="font-bold text-brand-primary">Kayıt Ol</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
