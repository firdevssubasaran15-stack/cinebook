import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { useLocalizedDate } from '@/hooks/useLocalizedDate';

export default function UserCommentFooter({ comment, onLike, onDislike }) {
  const { colors: COLORS } = useTheme();
  const { formatDate } = useLocalizedDate();

  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-xs text-text-lightMuted dark:text-text-darkMuted">
        {formatDate(comment.created_at)}
      </Text>

      <View className="flex-row gap-3">
        <TouchableOpacity className="flex-row items-center p-1.5" onPress={onLike}>
          <Icon
            name="Heart"
            size={18}
            weight={comment.is_liked_by_user ? 'fill' : 'regular'}
            color={comment.is_liked_by_user ? COLORS.error : COLORS.textSecondary}
          />
          <Text className={`text-[13px] font-semibold ml-1.5 ${comment.is_liked_by_user ? 'text-status-error' : 'text-text-lightSecondary dark:text-text-darkSecondary'}`}>
            {comment.like_count > 0 ? comment.like_count : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-1.5" onPress={onDislike}>
          <Icon
            name="ThumbsDown"
            size={18}
            weight={comment.is_disliked_by_user ? 'fill' : 'regular'}
            color={comment.is_disliked_by_user ? COLORS.primary : COLORS.textSecondary}
          />
          <Text className={`text-[13px] font-semibold ml-1.5 ${comment.is_disliked_by_user ? 'text-brand-primary' : 'text-text-lightSecondary dark:text-text-darkSecondary'}`}>
            {comment.dislike_count > 0 ? comment.dislike_count : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

