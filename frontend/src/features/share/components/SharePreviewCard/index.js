import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { API_BASE_URL } from '@/constants/api';
import { styles } from './styles';

/**
 * Renders the preview card for the share bottom sheet.
 * Follows Strategy Pattern logic by rendering content dynamically based on shareData.type
 */
const SharePreviewCard = forwardRef(({ shareData }, ref) => {
  const { colors: COLORS, isDark } = useTheme();

  if (!shareData) return null;

  const type = shareData.type || 'quote';

  const renderQuoteStrategy = () => (
    <>
      <Text style={[styles.quoteText, { color: COLORS.textPrimary }]} numberOfLines={5}>
        "{shareData.content || '...'}"
      </Text>
      <View style={styles.authorContainer}>
        {shareData.user_profile_image ? (
          <Image source={{ uri: `${API_BASE_URL}${shareData.user_profile_image}` }} style={styles.authorAvatar} />
        ) : (
          <View style={[styles.authorAvatar, { backgroundColor: COLORS.primary }]} />
        )}
        <Text style={[styles.authorName, { color: COLORS.textSecondary }]}>
          @{shareData.user_username || 'kullanıcı'}
        </Text>
      </View>
    </>
  );

  const renderEmotionStrategy = () => (
    <>
      <View style={[styles.emotionIconContainer, { backgroundColor: `${shareData.color}20` }]}>
        <Icon name={shareData.icon || 'Sparkle'} size={32} color={shareData.color} />
      </View>
      <Text style={[styles.emotionTitle, { color: shareData.color }]}>
        {shareData.label}
      </Text>
      <Text style={[styles.emotionSubtitle, { color: COLORS.textSecondary }]}>
        @{shareData.user_username}'in haftanın duygusu
      </Text>
    </>
  );

  const renderSimilarityStrategy = () => (
    <>
      <View style={styles.similarityAvatarsRow}>
        {shareData.user_profile_image ? (
          <Image source={{ uri: `${API_BASE_URL}${shareData.user_profile_image}` }} style={[styles.similarityAvatarMain, { borderColor: COLORS.primary }]} />
        ) : (
          <View style={[styles.similarityAvatarMain, { borderColor: COLORS.primary, backgroundColor: COLORS.surfaceElevated }]} />
        )}
        {shareData.current_profile_image ? (
          <Image source={{ uri: `${API_BASE_URL}${shareData.current_profile_image}` }} style={[styles.similarityAvatarSecondary, { borderColor: COLORS.primary }]} />
        ) : (
          <View style={[styles.similarityAvatarSecondary, { borderColor: COLORS.primary, backgroundColor: COLORS.background }]} />
        )}
      </View>
      <Text style={[styles.similarityPercentage, { color: COLORS.primary }]}>
        %{shareData.percentage} Uyum
      </Text>
      <Text style={[styles.similarityText, { color: COLORS.textSecondary }]}>
        @{shareData.current_username || 'sen'} ile @{shareData.user_username}
      </Text>
    </>
  );

  return (
    <ViewShot ref={ref} options={{ format: 'png', quality: 0.9 }}>
      <View style={[styles.cardContainer, { backgroundColor: isDark ? '#1a1a1a' : '#f9fafb', borderColor: COLORS.border }]}>
        {type === 'emotion' && renderEmotionStrategy()}
        {type === 'similarity' && renderSimilarityStrategy()}
        {type === 'quote' && renderQuoteStrategy()}

        <Text style={[styles.watermark, { color: COLORS.textSecondary }]}>
          CINEBOOK
        </Text>
      </View>
    </ViewShot>
  );
});

export default SharePreviewCard;
