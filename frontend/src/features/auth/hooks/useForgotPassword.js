import { useState } from 'react';
import { authApi } from '@/api/endpoints/auth.api';
import Toast from 'react-native-toast-message';

export const useForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email/Username, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  
  // Step 1 state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
  // Step 2 state
  const [otpCode, setOtpCode] = useState('');
  
  // Step 3 state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const requestOtp = async () => {
    if (!username.trim() || !email.trim()) {
      Toast.show({ type: 'error', text1: 'Hata', text2: 'Kullanıcı adı ve e-posta zorunludur.' });
      return;
    }
    
    try {
      setLoading(true);
      const res = await authApi.forgotPassword(username.trim(), email.trim());
      Toast.show({ type: 'success', text1: 'Başarılı', text2: res.data.message });
      setStep(2);
    } catch (error) {
      const msg = error.response?.data?.message || 'Bir hata oluştu.';
      Toast.show({ type: 'error', text1: 'Hata', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpCode.trim()) {
      Toast.show({ type: 'error', text1: 'Hata', text2: 'Doğrulama kodu zorunludur.' });
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.verifyOtp(email.trim(), otpCode.trim());
      Toast.show({ type: 'success', text1: 'Doğrulandı', text2: res.data.message });
      setStep(3);
    } catch (error) {
      const msg = error.response?.data?.message || 'Geçersiz veya süresi dolmuş kod.';
      Toast.show({ type: 'error', text1: 'Hata', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (onSuccess) => {
    if (!newPassword || newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Hata', text2: 'Şifreler eşleşmiyor.' });
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.resetPassword(email.trim(), otpCode.trim(), newPassword);
      Toast.show({ type: 'success', text1: 'Başarılı', text2: res.data.message });
      if (onSuccess) onSuccess();
    } catch (error) {
      const msg = error.response?.data?.message || 'Şifre güncellenemedi.';
      Toast.show({ type: 'error', text1: 'Hata', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    loading,
    username, setUsername,
    email, setEmail,
    otpCode, setOtpCode,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    requestOtp,
    verifyOtp,
    resetPassword
  };
};
