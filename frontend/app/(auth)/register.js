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
import { registerStyles as styles } from '@/features/auth/styles/register.styles';

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

      <View className={styles.container}>
        <Text className={styles.title}>
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

        <View className={styles.passwordContainer}>
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

        <TouchableOpacity className={styles.loginLinkContainer} onPress={() => router.back()}>
          <Text className={styles.loginLinkText}>
            Zaten hesabın var mı? <Text className={styles.loginLinkBold}>Giriş Yap</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
