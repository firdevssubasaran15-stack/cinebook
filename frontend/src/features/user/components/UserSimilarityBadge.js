import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { userProfileStyles as styles } from '@/features/user/styles/userProfile.styles';

export default function UserSimilarityBadge({ profile, currentUser, onPress }) {
  const { colors: COLORS } = useTheme();

  if (profile?.similarityPercentage == null || !currentUser) return null;

  return (
    <TouchableOpacity 
      style={[styles.similarityContainer, { borderColor: `${COLORS.primary}40`, backgroundColor: `${COLORS.primary}10` }]}
      onPress={() => onPress({
        type: 'similarity',
        user_username: profile?.username,
        user_profile_image: profile?.profile_image,
        current_username: currentUser?.username,
        current_profile_image: currentUser?.profile_image,
        percentage: profile.similarityPercentage
      })}
      activeOpacity={0.7}
    >
      <Icon name="Sparkle" size={16} color={COLORS.primary} weight="fill" />
      <Text style={[styles.similarityText, { color: COLORS.primary }]}>
        Seninle %{profile.similarityPercentage} benzer zevke sahip
      </Text>
    </TouchableOpacity>
  );
}
