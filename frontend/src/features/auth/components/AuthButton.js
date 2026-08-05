import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuthButton({ onPress, title, gradientColors, loading = false, disabled = false }) {
  return (
    <TouchableOpacity
      className={`mt-2 rounded-2xl overflow-hidden ${loading || disabled ? 'opacity-60' : ''}`}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={gradientColors}
        style={{ paddingVertical: 16, alignItems: 'center', borderRadius: 16 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-bold tracking-wide">{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
