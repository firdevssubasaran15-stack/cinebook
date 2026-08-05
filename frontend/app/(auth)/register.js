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
import { useLanguage } from '@/hooks/useLanguage';

export default function RegisterScreen() {
  const { t } = useLanguage();
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
        subtitle={t('register.headerSubtitle')} 
      />

      <View className={styles.container}>
        <Text className={styles.title}>
          {t('register.title')}
        </Text>

        <AuthInput
          label={t('register.usernameLabel')}
          value={username}
          onChangeText={setUsername}
          placeholder={t('register.usernamePlaceholder')}
        />

        <AuthInput
          label={t('register.emailLabel')}
          value={email}
          onChangeText={setEmail}
          placeholder={t('register.emailPlaceholder')}
          keyboardType="email-address"
        />

        <View className={styles.passwordContainer}>
          <AuthInput
            label={t('register.passwordLabel')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('register.passwordPlaceholder')}
            secure={true}
          />
          <PasswordValidator password={password} />
        </View>

        <AuthInput
          label={t('register.passwordConfirmLabel')}
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          placeholder={t('register.passwordConfirmPlaceholder')}
          secure={true}
        />

        <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />

        <AuthButton
          title={t('register.button.title')}
          onPress={handleRegister}
          gradientColors={GRADIENTS.secondary}
          loading={loading}
          disabled={!isPasswordValid(password)}
        />

        <TouchableOpacity className={styles.loginLinkContainer} onPress={() => router.back()}>
          <Text className={styles.loginLinkText}>
            {t('register.haveAccount')} <Text className={styles.loginLinkBold}>{t('register.loginLink')}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
