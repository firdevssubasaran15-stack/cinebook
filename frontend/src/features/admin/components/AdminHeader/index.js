import React from 'react';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '@/constants/colors';
import { styles } from './styles';

export default function AdminHeader() {
  return (
    <LinearGradient colors={GRADIENTS.hero} className={styles.headerGradient}>
      <Text className={styles.titleText}>⚙️ Admin Paneli</Text>
      <Text className={styles.subtitleText}>İçerik ve kullanıcı yönetimi</Text>
    </LinearGradient>
  );
}
