import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import ContentCardTags from './ContentCardTags';

export default function ContentCardInfo({ item, showLatestComment }) {
  const { colors: COLORS } = useTheme();

  return (
    <View className="w-full p-3 justify-center">
      <Text className="text-[15px] font-bold text-text-lightPrimary dark:text-text-darkPrimary mb-1" numberOfLines={2}>
        {item.title}
      </Text>
      
      <Text className="text-xs text-text-lightMuted dark:text-text-darkMuted mb-2" numberOfLines={1}>
        {item.director_author}
      </Text>

      {showLatestComment && item.latest_comment && (
        <View className="flex-row mt-2.5 pt-2.5 border-t border-t-light-border dark:border-t-dark-border">
          <View className="mr-2 mt-0.5">
            <Icon name="ChatCircle" size={14} color={COLORS.textSecondary} weight="fill" />
          </View>
          <Text className="flex-1 text-[13px] leading-5 text-text-lightSecondary dark:text-text-darkSecondary" numberOfLines={2}>
            {item.latest_comment}
          </Text>
        </View>
      )}

      {/* En Çok Hissedilen Duygular */}
      <ContentCardTags topEmotions={item.top_emotions} />
    </View>
  );
}
