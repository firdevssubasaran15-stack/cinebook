import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { EMOTION_TAGS } from '@/constants/emotions';
import { userProfileStyles as styles } from '@/features/user/styles/userProfile.styles';
import { useLanguage } from '@/hooks/useLanguage';

export default function UserWeeklyEmotionBadge({ emotionId, profile, onPress }) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  if (!emotionId) return null;

  const emotionData = EMOTION_TAGS.find(e => e.id === emotionId);
  const emotionLabel = emotionData
    ? t(`emotionDiscovery.${emotionData.id}`, { defaultValue: emotionData.label })
    : emotionId;
  const tagColor = emotionData ? (COLORS[emotionData.id] || COLORS.textPrimary) : COLORS.primary;

  return (
    <View style={styles.emotionContainer}>
      <Text style={[styles.emotionLabel, { color: COLORS.textSecondary }]}>{t('userProfile.userWeeklyEmotionTitle')}</Text>
      <TouchableOpacity 
        style={[styles.emotionBadge, { backgroundColor: tagColor + '20' }]} 
        onPress={() => onPress({
          type: 'emotion',
          user_username: profile?.username,
          user_profile_image: profile?.profile_image,
          tagId: emotionId,
          label: emotionLabel,
          color: tagColor,
          icon: emotionData?.iconName || 'Sparkle'
        })}
        activeOpacity={0.7}
      >
        {emotionData && <Icon name={emotionData.iconName} size={14} color={tagColor} style={{ marginRight: 4 }} />}
        <Text style={[styles.emotionBadgeText, { color: tagColor }]}>{emotionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
