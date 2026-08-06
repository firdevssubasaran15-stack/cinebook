import React from 'react';
import { View, Text } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { EMOTION_TAGS } from '@/constants/emotions';
import { detailStyles as styles } from '@/features/content/styles/detail.styles';

export default function TopEmotionsList({ topEmotions }) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  if (!topEmotions || topEmotions.length === 0) return null;

  return (
    <View className={styles.topEmotionsContainer}>
      <Text className={styles.topEmotionsTitle}>{t('detail.topEmotionsTitle')}</Text>
      <View className={styles.topEmotionsRow}>
        {topEmotions.map(tagId => {
          const tagData = EMOTION_TAGS.find(t => t.id === tagId);
          if (!tagData) return null;
          const tagColor = COLORS[tagId] || COLORS.textPrimary;
          return (
            <View key={tagId} className={styles.topEmotionTag} style={{ backgroundColor: `${tagColor}15`, borderColor: `${tagColor}40` }}>
              <Icon name={tagData.iconName} size={14} color={tagColor} weight="fill" />
              <Text className={styles.topEmotionText} style={{ color: tagColor }}>{t(`emotionDiscovery.${tagId}`, { defaultValue: tagData.label })}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
