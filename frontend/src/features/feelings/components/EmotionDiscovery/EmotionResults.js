import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { EMOTION_TAGS } from '@/constants/emotions';
import EmotionResultCard from './EmotionResultCard';

export default function EmotionResults({ selectedTag, undiscoveredContent, tagLoading }) {
  const { colors: COLORS } = useTheme();

  if (!selectedTag) return null;

  const tagInfo = EMOTION_TAGS.find((t) => t.id === selectedTag);

  return (
    <View className="mt-4 px-4 bg-light-surface dark:bg-dark-surfaceElevated py-4">
      <View className="flex-row items-center gap-1.5 mb-3.5">
        {tagInfo && (
          <Icon name={tagInfo.iconName} size={20} color={COLORS.primary} weight="fill" />
        )}
        <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary">
          "{tagInfo?.label}" ile Keşfet
        </Text>
      </View>
      
      {tagLoading ? (
        <ActivityIndicator color={COLORS.primary} className="my-4" />
      ) : undiscoveredContent.length === 0 ? (
        <Text className="text-[15px] italic text-text-lightSecondary dark:text-text-darkSecondary text-center my-4">
          Bu duyguya ait henüz keşfedilmeyi bekleyen bir içerik yok.
        </Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
          <View className="flex-row gap-4">
            {undiscoveredContent.map((item) => (
              <EmotionResultCard key={item.id} item={item} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
