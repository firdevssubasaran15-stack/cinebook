import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { GRADIENTS } from '@/constants/colors';
import AuthLayout from '@/features/auth/components/AuthLayout';
import AuthHeader from '@/features/auth/components/AuthHeader';
import AuthInput from '@/features/auth/components/AuthInput';
import AuthButton from '@/features/auth/components/AuthButton';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';

export default function ForgotPasswordScreen() {
  const {
    step,
    loading,
    username, setUsername,
    email, setEmail,
    otpCode, setOtpCode,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    requestOtp,
    verifyOtp,
    resetPassword
  } = useForgotPassword();

  const handleBack = () => {
    router.back();
  };

  return (
    <AuthLayout>
      <AuthHeader 
        emoji="🔒" 
        title="Şifremi Unuttum" 
        subtitle="Hesabınızı kurtarmak için adımları takip edin." 
      />

      <View className="rounded-3xl p-7 border bg-light-surface border-light-border dark:bg-dark-surface dark:border-dark-border">
        
        {step === 1 && (
          <>
            <Text className="text-xl font-bold mb-4 text-text-lightPrimary dark:text-text-darkPrimary">
              Hesap Bilgileriniz
            </Text>
            <Text className="text-sm mb-6 text-text-lightSecondary dark:text-text-darkSecondary">
              Kullanıcı adı ve e-posta adresinizi giriniz. Eşleşme sağlanırsa kod gönderilecektir.
            </Text>

            <AuthInput
              label="Kullanıcı Adı"
              value={username}
              onChangeText={setUsername}
              placeholder="kullanici_adiniz"
            />
            <AuthInput
              label="E-posta"
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <AuthButton
              title="Kodu Gönder"
              onPress={requestOtp}
              gradientColors={GRADIENTS.primary}
              loading={loading}
            />
          </>
        )}

        {step === 2 && (
          <>
            <Text className="text-xl font-bold mb-4 text-text-lightPrimary dark:text-text-darkPrimary">
              Kodu Doğrulayın
            </Text>
            <Text className="text-sm mb-6 text-text-lightSecondary dark:text-text-darkSecondary">
              E-postanıza gönderilen 6 haneli doğrulama kodunu giriniz. (15 dakika geçerlidir)
            </Text>

            <AuthInput
              label="Doğrulama Kodu"
              value={otpCode}
              onChangeText={setOtpCode}
              placeholder="123456"
              keyboardType="numeric"
              maxLength={6}
            />

            <AuthButton
              title="Doğrula"
              onPress={verifyOtp}
              gradientColors={GRADIENTS.primary}
              loading={loading}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Text className="text-xl font-bold mb-4 text-text-lightPrimary dark:text-text-darkPrimary">
              Yeni Şifre Belirleyin
            </Text>
            <Text className="text-sm mb-6 text-text-lightSecondary dark:text-text-darkSecondary">
              Lütfen yeni şifrenizi (eski şifrenizden farklı) belirleyiniz.
            </Text>

            <AuthInput
              label="Yeni Şifre"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="••••••••"
              secure={true}
            />
            
            <AuthInput
              label="Şifre Tekrar"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secure={true}
            />

            <AuthButton
              title="Şifreyi Güncelle"
              onPress={() => resetPassword(() => router.replace('/(auth)/login'))}
              gradientColors={GRADIENTS.primary}
              loading={loading}
            />
          </>
        )}

        <TouchableOpacity
          className="mt-5 items-center"
          onPress={handleBack}
          disabled={loading}
        >
          <Text className="text-sm font-bold text-text-lightSecondary dark:text-text-darkSecondary">
            Giriş Sayfasına Dön
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
