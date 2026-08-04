import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '@/constants/colors';
import { useBroadcast } from '@/features/admin/hooks/useBroadcast';
import { styles } from './styles';

export default function BroadcastManager() {
  const { colors: COLORS } = useTheme();
  const { message, setMessage, sending, handleBroadcast } = useBroadcast();

  return (
    <View className={styles.container}>
      <Text className={styles.title}>📢 Genel Duyuru Gönder</Text>
      <Text className={styles.subtitle}>
        Buraya yazacağınız mesaj sistemde bildirimleri açık olan tüm kullanıcılara gönderilecektir.
      </Text>
      
      <View className={styles.inputLabelContainer}>
        <Text className={styles.inputLabel}>Duyuru Mesajı</Text>
        <TextInput
          className={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Tüm kullanıcılara gidecek mesaj..."
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
          {sending ? <ActivityIndicator color="#fff" /> : <Text className={styles.buttonText}>Duyuruyu Gönder</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
