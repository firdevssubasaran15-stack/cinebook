import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Icon from '@/features/icon/components/Icon';
import { API_BASE_URL } from '@/constants/api';
import { useTheme } from '@/context/ThemeContext';

export default function UserCommentContext({ comment, onPressContent }) {
  const { colors: COLORS } = useTheme();

  return (
    <TouchableOpacity className="flex-row items-center mb-4 pb-4 border-b border-light-border dark:border-dark-border" onPress={onPressContent}>
      {comment.content_cover_image ? (
        <Image 
          source={{ uri: `${API_BASE_URL}${comment.content_cover_image}` }} 
          className="w-10 h-10 rounded-lg mr-3"
          contentFit="cover" 
        />
      ) : (
        <View className="w-10 h-10 rounded-lg mr-3 bg-brand-primary justify-center items-center">
          <Icon name={comment.content_type === 'movie' ? 'FilmStrip' : comment.content_type === 'series' ? 'Television' : 'Books'} size={24} color="#FFF" />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-base font-bold mb-1 text-text-lightPrimary dark:text-text-darkPrimary" numberOfLines={1}>
          {comment.content_title}
        </Text>
        <Text className="text-xs text-text-lightSecondary dark:text-text-darkSecondary">
          {comment.content_type === 'movie' ? '🎬 Film' : comment.content_type === 'series' ? '📺 Dizi' : '📚 Kitap'}
        </Text>
      </View>
      <Icon name="ArrowRight" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
}
