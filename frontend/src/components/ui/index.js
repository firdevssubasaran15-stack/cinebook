import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme, colors: COLORS } = useTheme();

  return (
    <TouchableOpacity
      className="w-10 h-10 rounded-full items-center justify-center mr-4 bg-light-surfaceElevated dark:bg-dark-surfaceElevated"
      onPress={toggleTheme}
      activeOpacity={0.8}
    >
      <Icon
        name={isDark ? "Sun" : "Moon"}
        size={20}
        color={isDark ? COLORS.warning : COLORS.primary}
        weight="fill"
      />
    </TouchableOpacity>
  );
}
