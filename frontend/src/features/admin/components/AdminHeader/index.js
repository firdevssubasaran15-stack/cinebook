import React from 'react';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '@/constants/colors';
import { styles } from './styles';
import { useLanguage } from '@/hooks/useLanguage';

export default function AdminHeader() {
  const { t } = useLanguage();
  return (
    <LinearGradient colors={GRADIENTS.hero} className={styles.headerGradient}>
      <Text className={styles.titleText}>{t('admin.headerTitle')}</Text>
      <Text className={styles.subtitleText}>{t('admin.headerSubtitle')}</Text>
    </LinearGradient>
  );
}
