import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';

export default function SearchInput({ value, onChangeText, placeholder }) {
  const { colors: COLORS } = useTheme();

  return (
    <View className="flex-row items-center bg-light-surfaceElevated dark:bg-dark-surfaceElevated border border-light-border dark:border-dark-border rounded-2xl h-12 px-4 shadow-sm">
      <View className="mr-2">
        <Icon name="MagnifyingGlass" size={20} color={COLORS.textMuted} />
      </View>
      <TextInput
        className="flex-1 text-sm text-text-lightPrimary dark:text-text-darkPrimary h-full"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} className="ml-2 p-1">
          <Icon name="X" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}
