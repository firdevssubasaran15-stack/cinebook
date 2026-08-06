import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { getLibraryTabs } from '@/constants/library';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';

export default function LibraryTabs({ activeTab, setActiveTab }) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
      {getLibraryTabs(t).map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 9999,
              borderWidth: 1,
              backgroundColor: isActive ? COLORS.primary : COLORS.surfaceElevated,
              borderColor: isActive ? COLORS.primary : COLORS.border,
            }}
          >
            <Icon name={tab.icon} size={16} color={isActive ? '#fff' : COLORS.textPrimary} weight={isActive ? 'fill' : 'regular'} />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: isActive ? '#fff' : COLORS.textPrimary,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
