import React from 'react';
import Icon from '@/features/icon/components/Icon';

export default function TabIcon({ name, focused, colors }) {
  return (
    <Icon 
      name={name} 
      size={24} 
      color={focused ? colors.primary : colors.textMuted} 
      weight={focused ? 'fill' : 'regular'} 
    />
  );
}
