import React from 'react';
import { View, Text } from 'react-native';

export default function AuthHeader({ emoji, title, subtitle }) {
  return (
    <View className="items-center mb-12">
      <Text className="text-7xl">{emoji}</Text>
      <Text className="text-4xl font-extrabold mt-2 tracking-wide text-text-lightPrimary dark:text-text-darkPrimary">
        {title}
      </Text>
      <Text className="text-sm mt-1 text-center text-text-lightMuted dark:text-text-darkMuted">
        {subtitle}
      </Text>
    </View>
  );
}
