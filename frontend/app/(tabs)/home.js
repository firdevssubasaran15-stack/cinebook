import React from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import HomeHeader from '@/features/home/components/HomeHeader';
import MoodModal from '@/features/home/components/MoodModal';
import HomeFeed from '@/features/home/components/HomeFeed';
import { useUnreadNotifications } from '@/features/home/hooks/useUnreadNotifications';
import { useMood } from '@/features/home/hooks/useMood';
import { useHomeFeed } from '@/features/home/hooks/useHomeFeed';

export default function HomeScreen() {
  const { colors: COLORS } = useTheme();
  const { user } = useAuth();
  
  const { unreadCount } = useUnreadNotifications(user);
  
  const {
    showMoodModal,
    moodRecommendations,
    setMoodRecommendations,
    moodLoading,
    doNotShowToday,
    setDoNotShowToday,
    handleCloseMoodModal,
    handleMoodSelect,
  } = useMood();

  const {
    feedComments,
    loading: feedLoading,
    refreshing,
    handleRefresh,
    handleToggleLike,
    handleToggleDislike
  } = useHomeFeed();

  if (feedLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-light-bg dark:bg-dark-bg">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-light-bg dark:bg-dark-bg"
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={handleRefresh} 
          tintColor={COLORS.primary} 
        />
      }
    >
      <MoodModal
        visible={showMoodModal}
        onClose={handleCloseMoodModal}
        moodRecommendations={moodRecommendations}
        moodLoading={moodLoading}
        doNotShowToday={doNotShowToday}
        onToggleDoNotShowToday={() => setDoNotShowToday(!doNotShowToday)}
        onMoodSelect={handleMoodSelect}
        onClearRecommendations={() => setMoodRecommendations(null)}
      />

      <HomeHeader unreadCount={unreadCount} />

      <HomeFeed 
        feedComments={feedComments}
        onToggleLike={handleToggleLike}
        onToggleDislike={handleToggleDislike}
      />

      <View className="h-8" />
    </ScrollView>
  );
}
