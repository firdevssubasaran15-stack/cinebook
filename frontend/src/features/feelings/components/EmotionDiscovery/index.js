import React from 'react';
import { View } from 'react-native';
import { EMOTION_TAGS } from '@/constants/emotions';
import { useEmotionDiscovery } from './useEmotionDiscovery';
import EmotionFilter from './EmotionFilter';
import EmotionResults from './EmotionResults';

export default function EmotionDiscovery({ type }) {
  const { state, actions } = useEmotionDiscovery({ type });
  const { topEmotions, selectedTag, undiscoveredContent, tagLoading } = state;
  const { handleSelectTag } = actions;

  const displayedEmotions = [
    ...EMOTION_TAGS.filter(t => topEmotions.includes(t.id)),
    ...EMOTION_TAGS.filter(t => !topEmotions.includes(t.id))
  ];

  return (
    <View className="mb-5 pt-4">
      <EmotionFilter 
        displayedEmotions={displayedEmotions} 
        selectedTag={selectedTag} 
        onSelectTag={handleSelectTag} 
      />

      <EmotionResults 
        selectedTag={selectedTag} 
        undiscoveredContent={undiscoveredContent} 
        tagLoading={tagLoading} 
      />
    </View>
  );
}
