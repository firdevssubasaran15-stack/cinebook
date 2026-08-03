import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import Icon from '@/features/icon/components/Icon';
import { API_BASE_URL } from '@/constants/api';
import { useTheme } from '@/context/ThemeContext';

export default function ContentCardCover({ coverImage }) {
  const { colors: COLORS } = useTheme();

  const coverUri = coverImage ? `${API_BASE_URL}${coverImage}` : null;

  return (
    <View className="w-full aspect-[2/3] bg-light-surfaceElevated dark:bg-dark-surfaceElevated items-center justify-center">
      {coverUri ? (
        <Image
          source={{ uri: coverUri }}
          className="w-full h-full"
          contentFit="cover"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
          transition={300}
        />
      ) : (
        <View className="w-full h-full items-center justify-center bg-black/5 dark:bg-white/5">
          <Icon name="Image" size={48} color={COLORS.textMuted} weight="light" />
        </View>
      )}
    </View>
  );
}
