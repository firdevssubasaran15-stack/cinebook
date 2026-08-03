import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from '@/features/icon/components/Icon';

export default function RememberMeCheckbox({ checked, onChange }) {
  return (
    <TouchableOpacity
      className="flex-row items-center mb-4 self-start"
      onPress={() => onChange(!checked)}
      activeOpacity={0.7}
    >
      <View
        className={`w-5 h-5 rounded-md border-2 border-brand-primary mr-2 items-center justify-center ${
          checked ? 'bg-brand-primary' : 'bg-transparent'
        }`}
      >
        {checked && <Icon name="Check" size={14} color="#fff" weight="bold" />}
      </View>
      <Text className="text-sm text-text-lightMuted dark:text-text-darkMuted">
        Beni Hatırla
      </Text>
    </TouchableOpacity>
  );
}
