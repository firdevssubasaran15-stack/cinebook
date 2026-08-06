import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { EMOTION_TAGS } from '@/constants/emotions';
import Icon from '@/features/icon/components/Icon';

export default function ContentCardTags({ topEmotions }) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  if (!topEmotions || topEmotions.length === 0) {
    return null;
  }

  return (
    <View className="flex-row flex-wrap gap-1.5 mt-3">
      {topEmotions.map(tagId => {
        const tagData = EMOTION_TAGS.find(t => t.id === tagId);
        if (!tagData) return null;
        
        const tagColor = COLORS[tagId] || COLORS.textPrimary;
        
        return (
          <View 
            key={tagId} 
            style={{ backgroundColor: `${tagColor}20`, borderColor: `${tagColor}50` }}
            className="flex-row items-center px-1.5 py-1 rounded-md border"
          >
            <Icon name={tagData.iconName} size={10} color={tagColor} weight="fill" />
            <Text style={{ color: tagColor }} className="text-[10px] font-bold ml-1">
              {t(`emotionDiscovery.${tagId}`, { defaultValue: tagData.label })}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
