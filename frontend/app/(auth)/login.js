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
import { useLanguage } from '@/hooks/useLanguage';

export default function LoginScreen() {
  const { t } = useLanguage();
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
        subtitle={t('login.headerSubtitle')} 
      />

      <View className="rounded-3xl p-7 border bg-light-surface border-light-border dark:bg-dark-surface dark:border-dark-border">
        <Text className="text-2xl font-bold mb-6 text-text-lightPrimary dark:text-text-darkPrimary">
          {t('login.title')}
        </Text>

        <AuthInput
          label={t('login.emailLabel')}
          value={username}
          onChangeText={setUsername}
          placeholder={t('login.emailPlaceholder')}
        />

        <AuthInput
          label={t('login.passwordLabel')}
          value={password}
          onChangeText={setPassword}
          placeholder={t('login.passwordPlaceholder')}
          secure={true}
        />

        <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />

        <AuthButton
          title={t('login.button.title')}
          onPress={handleLogin}
          gradientColors={GRADIENTS.primary}
          loading={loading}
        />

        <TouchableOpacity
          className="mt-4 items-center"
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          <Text className="text-sm font-semibold text-brand-primary">
            Şifremi Unuttum
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-5 items-center"
          onPress={() => router.push('/(auth)/register')}
        >
          <Text className="text-sm text-text-lightSecondary dark:text-text-darkSecondary">
            {t('login.noAccount')} <Text className="font-bold text-brand-primary">{t('login.registerLink')}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
