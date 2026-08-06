import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { sharedListDetailStyles as styles } from '@/features/shared-lists/styles/sharedListDetail.styles';

export default function SharedListHeader({ list, isOwner, visibilityLoading, handleToggleVisibility }) {
  const { colors: COLORS } = useTheme();

  return (
    <View className={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} className={styles.backButton}>
        <Icon name="CaretLeft" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text className={styles.headerTitle} numberOfLines={1}>
        {list.name}
      </Text>
      {isOwner ? (
        <TouchableOpacity onPress={handleToggleVisibility} className={styles.visibilityButton} disabled={visibilityLoading}>
          {visibilityLoading ? (
             <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
             <Icon name={list.is_public ? "Eye" : "LockKey"} size={22} color={COLORS.textPrimary} />
          )}
        </TouchableOpacity>
      ) : (
        <View className={styles.visibilityIcon}>
          <Icon name={list.is_public ? "Eye" : "LockKey"} size={22} color={COLORS.textMuted} />
        </View>
      )}
    </View>
  );
}
