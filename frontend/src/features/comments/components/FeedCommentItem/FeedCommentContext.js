import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Icon from '@/features/icon/components/Icon';
import { API_BASE_URL } from '@/constants/api';
import { useTheme } from '@/context/ThemeContext';
import { useContentTypeLabel } from '@/features/content/hooks/useContentTypeLabel';

export default function FeedCommentContext({ comment, onPressContent, themeColor }) {
  const { colors: COLORS } = useTheme();
  const { getContentTypeLabel } = useContentTypeLabel();

  return (
    <TouchableOpacity 
      className="flex-row items-center mb-4 p-2 rounded-xl bg-black/5 dark:bg-white/5" 
      onPress={onPressContent}
    >
      {comment.content_cover_image ? (
        <Image 
          source={{ uri: `${API_BASE_URL}${comment.content_cover_image}` }} 
          className="w-8 h-12 rounded-md mr-2.5"
          contentFit="cover" 
        />
      ) : (
        <View 
          className="w-8 h-12 rounded-md mr-2.5 justify-center items-center"
          style={{ backgroundColor: themeColor || COLORS.primary }}
        >
           <Icon name={comment.content_type === 'movie' ? 'FilmStrip' : comment.content_type === 'series' ? 'Television' : 'Books'} size={24} color="#FFF" />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-sm font-bold mb-0.5 text-text-lightPrimary dark:text-text-darkPrimary" numberOfLines={1}>
          {comment.content_title}
        </Text>
        <Text className="text-[11px] text-text-lightSecondary dark:text-text-darkSecondary">
          {getContentTypeLabel(comment.content_type)}
        </Text>
      </View>
      <Icon name="ArrowRight" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
}
