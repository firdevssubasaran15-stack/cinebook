import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '@/constants/colors';
import { useBroadcast } from '@/features/admin/hooks/useBroadcast';
import { styles } from './styles';
import { useLanguage } from '@/hooks/useLanguage';

export default function BroadcastManager() {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();
  const { message, setMessage, sending, handleBroadcast } = useBroadcast();

  return (
    <View className={styles.container}>
      <Text className={styles.title}>{t('admin.broadcastTitle')}</Text>
      <Text className={styles.subtitle}>
        {t('admin.broadcastSubtitle')}
      </Text>
      
      <View className={styles.inputLabelContainer}>
        <Text className={styles.inputLabel}>{t('admin.broadcastLabel')}</Text>
        <TextInput
          className={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder={t('admin.broadcastPlaceholder')}
          placeholderTextColor={COLORS.textMuted}
          multiline
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        className={`${styles.buttonContainer} ${sending ? 'opacity-60' : ''}`}
        onPress={handleBroadcast}
        disabled={sending}
      >
        <LinearGradient 
          colors={GRADIENTS.primary} 
          className={styles.buttonGradient} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 0 }}
        >
          {sending ? <ActivityIndicator color="#fff" /> : <Text className={styles.buttonText}>{t('admin.broadcastBtn')}</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
