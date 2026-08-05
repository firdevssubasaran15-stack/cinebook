import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image as RNImage } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { detailStyles as styles } from '@/features/content/styles/detail.styles';

export default function ContentCover({
  isEditing,
  editCover,
  coverUri,
  typeIcon,
  isPickingImage,
  saving,
  onPickImage
}) {
  const { colors: COLORS, isDark } = useTheme();

  return (
    <View className={styles.coverContainer}>
      {isEditing && editCover ? (
        <RNImage 
          source={{ uri: editCover.uri }} 
          className={styles.coverImage} 
          resizeMode="cover" 
        />
      ) : coverUri ? (
        <Image 
          source={{ uri: coverUri }} 
          className={styles.coverImage} 
          contentFit="cover" 
        />
      ) : (
        <View className={styles.coverPlaceholder}>
          <Icon name={typeIcon} size={80} color={COLORS.textMuted} weight="light" />
        </View>
      )}
      
      {isEditing && (
        <TouchableOpacity 
          onPress={onPickImage} 
          className={styles.changeCoverButton}
          disabled={isPickingImage || saving}
        >
          {isPickingImage ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="Camera" size={16} color="#fff" />
          )}
          <Text className={styles.changeCoverText}>
            {isPickingImage ? 'Seçiliyor...' : 'Kapak Değiştir'}
          </Text>
        </TouchableOpacity>
      )}

      {saving && isEditing && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center z-50">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="text-white mt-2 font-bold">Kapak Yükleniyor...</Text>
        </View>
      )}

      <LinearGradient 
        colors={['transparent', isDark ? '#121212' : '#F9FAFB']} 
        className={styles.gradientOverlay} 
      />
    </View>
  );
}
