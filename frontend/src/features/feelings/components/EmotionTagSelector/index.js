import React from 'react';
import { View, Text } from 'react-native';
import { EMOTION_TAGS } from '@/constants/emotions';
import EmotionTag from './EmotionTag';

export default function EmotionTagSelector({ selected = [], onToggle }) {
  return (
    <View className="mb-4">
      <Text className="text-[13px] font-bold text-text-lightSecondary dark:text-text-darkSecondary uppercase tracking-wider mb-2.5">
        Duygularını Etiketle
      </Text>
      
      <View className="flex-row flex-wrap gap-2">
        {EMOTION_TAGS.map((tag) => (
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
