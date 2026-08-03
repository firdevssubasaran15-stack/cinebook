import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { GRADIENTS } from '@/constants/colors';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';
import AuthLayout from '@/features/auth/components/AuthLayout';
import AuthHeader from '@/features/auth/components/AuthHeader';
import AuthInput from '@/features/auth/components/AuthInput';
import AuthButton from '@/features/auth/components/AuthButton';
import RememberMeCheckbox from '@/features/auth/components/RememberMeCheckbox';
import PasswordValidator, { isPasswordValid } from '@/features/auth/components/PasswordValidator';

export default function RegisterScreen() {
  const {
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
  } = useRegisterForm();

  return (
    <AuthLayout>
      <AuthHeader 
        emoji="📚" 
        title="CineBook" 
        subtitle="Topluluğa Katıl" 
      />

      <View className="rounded-3xl p-7 border bg-light-surface border-light-border dark:bg-dark-surface dark:border-dark-border">
        <Text className="text-2xl font-bold mb-6 text-text-lightPrimary dark:text-text-darkPrimary">
          Kayıt Ol
        </Text>

        <AuthInput
          label="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
          placeholder="kullanici_adi"
        />

        <AuthInput
          label="E-posta"
          value={email}
          onChangeText={setEmail}
          placeholder="ornek@email.com"
          keyboardType="email-address"
        />

        <View className="mb-0">
          <AuthInput
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••"
            secure={true}
          />
          <PasswordValidator password={password} />
        </View>

        <AuthInput
          label="Şifre Tekrar"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          placeholder="••••••"
          secure={true}
        />

        <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />

        <AuthButton
          title="Hesap Oluştur"
          onPress={handleRegister}
          gradientColors={GRADIENTS.secondary}
          loading={loading}
          disabled={!isPasswordValid(password)}
        />

        <TouchableOpacity className="mt-5 items-center" onPress={() => router.back()}>
          <Text className="text-sm text-text-lightSecondary dark:text-text-darkSecondary">
            Zaten hesabın var mı? <Text className="font-bold text-brand-secondary">Giriş Yap</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
