import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';

export default function EmotionTag({ tag, isSelected, onToggle }) {
  const { colors: COLORS } = useTheme();
  
  // Etiketin kendine ait rengi varsa kullan, yoksa fallback
  const tagColor = tag.color || COLORS[tag.id] || COLORS.textPrimary;

  return (
    <TouchableOpacity
      className={`flex-row items-center py-1.5 px-3 rounded-full border ${
        isSelected ? '' : 'bg-light-surfaceElevated dark:bg-dark-surfaceElevated'
      }`}
      style={{
        backgroundColor: isSelected ? `${tagColor}25` : undefined,
        borderColor: isSelected ? tagColor : `${tagColor}60`
      }}
      onPress={() => onToggle(tag.id)}
      activeOpacity={0.7}
    >
      <View className="mr-1.5">
        <Icon 
          name={tag.iconName} 
          size={16} 
          color={tagColor} 
          weight={isSelected ? 'fill' : 'regular'} 
        />
      </View>
      
      <Text 
        className={`text-[13px] ${isSelected ? 'font-bold' : 'font-semibold'}`} 
        style={{ color: tagColor }}
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
