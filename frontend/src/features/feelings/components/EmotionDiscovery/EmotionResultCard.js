import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { EMOTION_TAGS } from '@/constants/emotions';

export default function EmotionResultCard({ item }) {
  const { colors: COLORS } = useTheme();

  return (
    <TouchableOpacity
      className="w-36 bg-light-surfaceElevated dark:bg-dark-bg rounded-2xl overflow-hidden border border-light-border dark:border-dark-border shadow-sm"
      onPress={() => router.push(`/detail/${item.id}`)}
    >
      <View className="w-full aspect-[2/3] bg-light-border dark:bg-dark-border items-center justify-center">
        <Icon 
          name={item.type === 'movie' ? 'FilmStrip' : item.type === 'series' ? 'Television' : 'Books'} 
          size={48} 
          color={COLORS.textMuted} 
          weight="light" 
        />
      </View>
      
      <Text 
        className="text-[15px] font-bold text-text-lightPrimary dark:text-text-darkPrimary px-2.5 pt-2 mb-0.5" 
        numberOfLines={2}
      >
        {item.title}
      </Text>
      
      <Text 
        className="text-xs text-text-lightSecondary dark:text-text-darkSecondary px-2.5 pb-2" 
        numberOfLines={1}
      >
        {item.director_author}
      </Text>
      
      {item.top_emotions && item.top_emotions.length > 0 && (
        <View className="flex-row flex-wrap gap-1 px-2.5 pb-2.5 pt-1">
          {item.top_emotions.map(tagId => {
            const tagData = EMOTION_TAGS.find(t => t.id === tagId);
            if (!tagData) return null;
            
            const tagColor = COLORS[tagId] || COLORS.textPrimary;
            
            return (
              <View 
                key={tagId} 
                className="flex-row items-center px-1.5 py-0.5 rounded-lg border gap-[3px]" 
                style={{ backgroundColor: `${tagColor}20`, borderColor: `${tagColor}50` }}
              >
                <Icon name={tagData.iconName} size={10} color={tagColor} weight="fill" />
                <Text style={{ fontSize: 10, fontWeight: '600', color: tagColor }}>
                  {tagData.label}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </TouchableOpacity>
  );
}
