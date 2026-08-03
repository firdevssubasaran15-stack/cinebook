import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';

export default function EmotionTag({ tag, isSelected, onToggle }) {
  const { colors: COLORS } = useTheme();
  
  const tagColor = COLORS[tag.id] || COLORS.textPrimary;

  return (
    <TouchableOpacity
      className={`flex-row items-center py-1.5 px-3 rounded-full border ${isSelected ? '' : 'bg-light-surfaceElevated dark:bg-dark-surfaceElevated border-light-border/50 dark:border-dark-border/50'}`}
      style={isSelected ? { backgroundColor: `${tagColor}25`, borderColor: tagColor } : undefined}
      onPress={() => onToggle(tag.id)}
      activeOpacity={0.7}
    >
      <View className="mr-1.5">
        <Icon 
          name={tag.iconName} 
          size={16} 
          color={isSelected ? tagColor : COLORS.textSecondary} 
          weight={isSelected ? 'fill' : 'regular'} 
        />
      </View>
      
      <Text 
        className={`text-[13px] ${isSelected ? 'font-bold' : 'font-medium text-text-lightPrimary dark:text-text-darkPrimary'}`} 
        style={isSelected ? { color: tagColor } : undefined}
      >
        {tag.label}
      </Text>
      
      {isSelected && (
        <View className="ml-1.5">
          <Icon name="Check" size={14} color={tagColor} weight="bold" />
        </View>
      )}
    </TouchableOpacity>
  );
}
