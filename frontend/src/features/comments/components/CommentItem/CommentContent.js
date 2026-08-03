import React from 'react';
import { View, Text } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';

export default function CommentContent({ comment, isFeeling }) {
  const { colors: COLORS } = useTheme();

  return (
    <>
      {comment.quote && (
        <View className="border-l-4 border-brand-primary pl-2.5 mb-2 bg-brand-primary/10 p-2 rounded-r-md">
          <Icon name="Quotes" size={14} color={COLORS.primary} weight="fill" style={{ marginBottom: 4 }} />
          <Text className="text-[13px] italic leading-[18px] text-text-lightSecondary dark:text-text-darkSecondary">
            "{comment.quote}"
          </Text>
        </View>
      )}
      
      {comment.text ? (
        <Text className="text-[15px] leading-6 text-text-lightPrimary dark:text-text-darkPrimary">
          {comment.text}
        </Text>
      ) : null}

      {isFeeling && comment.tags && comment.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-3">
          {comment.tags.map((tag, index) => (
            <View
              key={`${tag}-${index}`}
              className="px-2.5 py-1 rounded-full border border-light-border/50 dark:border-dark-border/50"
              style={{ backgroundColor: `${COLORS[tag] || COLORS.textPrimary}30` }}
            >
              <Text className="text-[11px] font-bold tracking-wide uppercase" style={{ color: COLORS[tag] || COLORS.textPrimary }}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}
