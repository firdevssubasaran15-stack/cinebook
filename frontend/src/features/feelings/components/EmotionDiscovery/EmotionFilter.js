import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';

export default function EmotionFilter({ displayedEmotions, selectedTag, onSelectTag }) {
  const { colors: COLORS } = useTheme();

  return (
    <View className="pl-4 mb-4">
      <Text className="text-sm font-bold text-text-lightSecondary dark:text-text-darkSecondary uppercase tracking-wider mb-2.5">
        Duyguyla Keşfet
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {displayedEmotions.map((tag) => {
            const isSelected = selectedTag === tag.id;
            const tagColor = COLORS[tag.id] || COLORS.textPrimary;
            
            return (
              <TouchableOpacity
                key={tag.id}
                className="flex-row items-center py-1.5 px-3 rounded-full border border-light-border/50 dark:border-dark-border/50 bg-light-surfaceElevated dark:bg-dark-surfaceElevated shadow-sm"
                style={isSelected ? { backgroundColor: `${tagColor}30`, borderColor: tagColor } : undefined}
                onPress={() => onSelectTag(tag.id)}
              >
                <View className="mr-1.5">
                  <Icon 
                    name={tag.iconName} 
                    size={16} 
                    color={isSelected ? tagColor : COLORS.textSecondary} 
                    weight={isSelected ? "fill" : "regular"} 
                  />
                </View>
                <Text 
                  className={`text-[13px] ${isSelected ? 'font-bold' : 'font-medium text-text-lightPrimary dark:text-text-darkPrimary'}`} 
                  style={isSelected ? { color: tagColor } : undefined}
                >
                  {tag.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
