import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/features/icon/components/Icon';
import UserWeeklyEmotionBadge from '@/features/user/components/UserWeeklyEmotionBadge';
import UserSimilarityBadge from '@/features/user/components/UserSimilarityBadge';
import { GRADIENTS } from '@/constants/colors';
import { API_BASE_URL } from '@/constants/api';
import { userProfileStyles as styles } from '@/features/user/styles/userProfile.styles';
import { useLocalizedDate } from '@/hooks/useLocalizedDate';

export default function UserProfileInfo({
  profile, isMe, user, COLORS, isDark, t, currentLanguage,
  openShareSheet, openUserList, handleToggleFollow, followLoading,
  setNewUsername, setEditProfileModal
}) {
  const { formatDate } = useLocalizedDate();

  return (
    <LinearGradient colors={isDark ? GRADIENTS.hero : [COLORS.surfaceElevated, COLORS.background]} style={styles.headerGradient}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="ArrowLeft" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.calendarButton} onPress={() => router.push('/calendar')}>
        <Icon name="CalendarBlank" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>

      <View style={styles.profileInfoContainer}>
        {profile?.profile_image ? (
          <Image source={{ uri: `${API_BASE_URL}${profile.profile_image}` }} style={styles.profileImage} contentFit="cover" />
        ) : (
          <View style={[styles.profileImageFallback, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.profileImageFallbackText}>{profile?.username?.[0]?.toUpperCase()}</Text>
          </View>
        )}
        <Text style={[styles.username, { color: COLORS.textPrimary }]}>@{profile?.username}</Text>
        <Text style={[styles.joinDate, { color: COLORS.textMuted }]}>
          {t('userProfile.joinDate')} {formatDate(profile?.created_at)}
        </Text>
        <UserWeeklyEmotionBadge emotionId={profile?.weeklyEmotion} profile={profile} onPress={openShareSheet} />
        <UserSimilarityBadge profile={profile} currentUser={user} onPress={openShareSheet} />
      </View>

      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statItem} onPress={() => openUserList('followers')}>
          <Text style={[styles.statValue, { color: COLORS.textPrimary }]}>{profile?.followersCount || 0}</Text>
          <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>{t('userProfile.follower')}</Text>
        </TouchableOpacity>
        <View style={[styles.statDivider, { backgroundColor: COLORS.border }]} />
        <TouchableOpacity style={styles.statItem} onPress={() => openUserList('following')}>
          <Text style={[styles.statValue, { color: COLORS.textPrimary }]}>{profile?.followingCount || 0}</Text>
          <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>{t('userProfile.following')}</Text>
        </TouchableOpacity>
      </View>

      {!isMe ? (
        <TouchableOpacity 
          style={[styles.actionButtonBase, { backgroundColor: profile?.isFollowing ? 'transparent' : COLORS.primary, borderColor: COLORS.primary }]}
          onPress={handleToggleFollow} disabled={followLoading}
        >
          <Text style={[styles.actionButtonText, { color: profile?.isFollowing ? COLORS.primary : '#fff' }]}>
            {profile?.isFollowing ? t('userProfile.isFollowing') : t('userProfile.follow')}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[styles.actionButtonBase, { backgroundColor: 'transparent', borderColor: COLORS.border }]}
          onPress={() => { setNewUsername(user?.username || ''); setEditProfileModal(true); }}
        >
          <Text style={[styles.actionButtonText, { color: COLORS.textPrimary }]}>{t('userProfile.editProfile')}</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}
