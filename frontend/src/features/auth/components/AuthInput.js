import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  secure = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
}) {
  const { colors: COLORS } = useTheme();
  const [showPassword, setShowPassword] = useState(!secure);

  return (
    <View className="mb-4">
      <Text className="text-[13px] font-semibold mb-2 uppercase tracking-wider text-text-lightSecondary dark:text-text-darkSecondary">
        {label}
      </Text>
      {secure ? (
        <View className="flex-row items-center rounded-xl border pr-3 bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border">
          <TextInput
            className="flex-1 rounded-xl px-4 py-3.5 text-[15px] text-text-lightPrimary dark:text-text-darkPrimary"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry={!showPassword}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-2"
          >
            <Text className="text-lg">{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          className="rounded-xl px-4 py-3.5 text-[15px] border bg-light-surfaceElevated border-light-border text-text-lightPrimary dark:bg-dark-surfaceElevated dark:border-dark-border dark:text-text-darkPrimary"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          autoCorrect={false}
        />
      )}
    </View>
  );
}
