import React from 'react';
import { View, Text } from 'react-native';
import { useEmotionTags } from '@/hooks/useEmotionTags';
import { useLanguage } from '@/hooks/useLanguage';
import EmotionTag from './EmotionTag';

export default function EmotionTagSelector({ selected = [], onToggle }) {
  const { tags } = useEmotionTags();
  const { t } = useLanguage();

  return (
    <View className="mb-4">
      <Text className="text-[13px] font-bold text-text-lightSecondary dark:text-text-darkSecondary uppercase tracking-wider mb-2.5">
        {t('feelings.formTitle')}
      </Text>
      
      <View className="flex-row flex-wrap gap-2">
        {tags.map((tag) => (
          <EmotionTag
            key={tag.id}
            tag={tag}
            isSelected={selected.includes(tag.id)}
            onToggle={onToggle}
          />
        ))}
      </View>
    </View>
  );
}
