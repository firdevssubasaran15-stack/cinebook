import React from 'react';
import { View, Text } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';

export default function FeedCommentBody({ comment }) {
  const { colors: COLORS } = useTheme();

  return (
    <>
      {comment.quote && comment.quote.trim().length > 0 && (
        <View className="flex-row p-3 rounded-lg mb-3 border-l-4 border-l-brand-primary bg-black/5 dark:bg-white/5">
          <Icon name="Quotes" size={16} color={COLORS.primary} style={{ marginRight: 8, alignSelf: 'flex-start' }} />
          <Text className="flex-1 text-sm italic leading-5 text-text-lightSecondary dark:text-text-darkSecondary">
            "{comment.quote}"
          </Text>
        </View>
      )}

      <Text className="text-[15px] leading-6 mb-4 text-text-lightPrimary dark:text-text-darkPrimary">
        {comment.text}
      </Text>
    </>
  );
}
