import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { EMOTION_TAGS } from '@/constants/emotions';
import Icon from '@/features/icon/components/Icon';

export default function SearchTagFilter({ selectedTag, onTagSelect }) {
  const { colors: COLORS } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 -mx-4"
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {EMOTION_TAGS.map((tag) => (
        <TouchableOpacity
          key={tag.id}
          className={`flex-row items-center py-1.5 px-3 rounded-full border border-light-border/50 dark:border-dark-border/50 bg-light-surfaceElevated dark:bg-dark-surfaceElevated shadow-sm`}
          style={selectedTag === tag.id ? { backgroundColor: COLORS[tag.id] || COLORS.textPrimary } : undefined}
          onPress={() => onTagSelect(selectedTag === tag.id ? null : tag.id)}
        >
          <View className="mr-1.5">
            <Icon 
              name={tag.iconName} 
              size={16} 
              color={selectedTag === tag.id ? '#fff' : COLORS.textSecondary} 
              weight={selectedTag === tag.id ? 'fill' : 'regular'}
            />
          </View>
          <Text
            className={`text-[13px] ${selectedTag === tag.id ? 'text-white font-bold' : 'text-text-lightPrimary dark:text-text-darkPrimary font-medium'}`}
          >
            {tag.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
