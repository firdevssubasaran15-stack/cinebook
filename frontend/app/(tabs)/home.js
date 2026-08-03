import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { contentApi } from '@/api/endpoints/content.api';
import { commentsApi } from '@/api/endpoints/comments.api';
import { feelingsApi } from '@/api/endpoints/feelings.api';
import { usersApi } from '@/api/endpoints/users.api';
import { notificationsApi } from '@/api/endpoints/notifications.api';
import FeedCommentItem from '@/features/comments/components/FeedCommentItem';
import ContentCard from '@/features/content/components/ContentCard';
import { GRADIENTS } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { EMOTION_TAGS } from '@/constants/emotions';
import Icon from '@/features/icon/components/Icon';
import { API_BASE_URL } from '@/constants/api';
import HomeHeader from '@/features/home/components/HomeHeader';

export default function HomeScreen() {
  const { colors: COLORS, isDark } = useTheme();

  const { user, logout } = useAuth();
  const [feedComments, setFeedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagResults, setTagResults] = useState([]);
  const [tagLoading, setTagLoading] = useState(false);

  // Mood Modal State
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [moodRecommendations, setMoodRecommendations] = useState(null);
  const [moodLoading, setMoodLoading] = useState(false);
  const [doNotShowToday, setDoNotShowToday] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchFeed = async () => {
    try {
      const res = await commentsApi.getFeed();
      setFeedComments(res.data.data);
    } catch (err) {
      console.log('Feed fetch error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    checkMoodModal();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchUnreadCount = async () => {
        try {
          const res = await notificationsApi.getUnreadCount();
          setUnreadCount(res.data.data.count);
        } catch (err) {
          console.log('Unread count fetch error:', err.message);
        }
      };
      
      if (user) {
        fetchUnreadCount();
      }
    }, [user])
  );

  const checkMoodModal = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const hideKey = `hideMoodModal_${today}`;
      const hidden = await AsyncStorage.getItem(hideKey);
      if (hidden !== 'true') {
        setShowMoodModal(true);
      }
    } catch (err) {}
  };

  const handleCloseMoodModal = async () => {
    if (doNotShowToday) {
      const today = new Date().toISOString().split('T')[0];
      const hideKey = `hideMoodModal_${today}`;
      await AsyncStorage.setItem(hideKey, 'true');
    }
    setShowMoodModal(false);
  };

  const handleMoodSelect = async (moodId) => {
    setMoodLoading(true);
    try {
      const res = await contentApi.getRecommendations(moodId);
      setMoodRecommendations(res.data.data);
    } catch (err) {
      console.log('Mood recommendations error:', err.message);
    } finally {
      setMoodLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-light-bg dark:bg-dark-bg">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-light-bg dark:bg-dark-bg"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchFeed(); }} tintColor={COLORS.primary} />}
    >
      {/* Mood Modal */}
      <Modal
        visible={showMoodModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseMoodModal}
      >
        <View className="flex-1 bg-black/60 justify-center p-5">
          <View className="bg-light-surfaceElevated dark:bg-dark-surfaceElevated rounded-2xl p-5 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary">Bugün nasıl hissetmek istersiniz?</Text>
              <TouchableOpacity onPress={handleCloseMoodModal} className="p-1">
                <Icon name="X" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {!moodRecommendations ? (
              <View className="flex-row flex-wrap gap-2 justify-center">
                {EMOTION_TAGS.map(tag => {
                  const tagColor = COLORS[tag.id] || COLORS.textPrimary;
                  return (
                    <TouchableOpacity
                      key={tag.id}
                      onPress={() => handleMoodSelect(tag.id)}
                      style={{ borderColor: `${tagColor}50`, backgroundColor: `${tagColor}15` }}
                      className="flex-row items-center px-3 py-2.5 rounded-full border gap-1.5"
                    >
                      <Icon name={tag.iconName} size={18} color={tagColor} />
                      <Text style={{ color: tagColor }} className="font-semibold">{tag.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <ScrollView>
                {moodLoading ? (
                  <ActivityIndicator size="large" color={COLORS.primary} className="my-5" />
                ) : (
                  <View>
                    <Text className="text-text-lightSecondary dark:text-text-darkSecondary mb-3">Sizin için seçtiklerimiz:</Text>
                    {['movie', 'series', 'book'].map(type => {
                      const item = moodRecommendations[type];
                      if (!item) return null;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          className="flex-row bg-light-bg dark:bg-dark-bg rounded-xl p-2.5 mb-2.5 border border-light-border dark:border-dark-border"
                          onPress={() => {
                            handleCloseMoodModal();
                            router.push(`/detail/${item.id}`);
                          }}
                        >
                          <View className="w-15 h-20 bg-light-surfaceElevated dark:bg-dark-surfaceElevated rounded-lg justify-center items-center mr-3">
                            <Icon name={type === 'movie' ? 'FilmStrip' : type === 'series' ? 'Television' : 'Books'} size={24} color={COLORS.textMuted} weight="light" />
                          </View>
                          <View className="flex-1 justify-center">
                            <Text className="text-base font-bold text-text-lightPrimary dark:text-text-darkPrimary" numberOfLines={1}>{item.title}</Text>
                            <Text className="text-[13px] text-text-lightMuted dark:text-text-darkMuted mt-1" numberOfLines={1}>{item.director_author}</Text>
                            <View className="self-start mt-2 px-2 py-1 rounded-lg" style={{ backgroundColor: `${COLORS.primary}20` }}>
                              <Text className="text-[10px] font-semibold text-brand-primary">{type === 'movie' ? 'Film' : type === 'series' ? 'Dizi' : 'Kitap'}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                    {!moodRecommendations.movie && !moodRecommendations.series && !moodRecommendations.book && (
                      <Text className="text-text-lightMuted dark:text-text-darkMuted text-center my-5">Bu duyguya ait henüz bir öneri bulunamadı.</Text>
                    )}
                    <TouchableOpacity
                      onPress={() => setMoodRecommendations(null)}
                      className="mt-3 p-3 items-center border border-light-border dark:border-dark-border rounded-lg"
                    >
                      <Text className="text-text-lightSecondary dark:text-text-darkSecondary">Geri Dön</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            )}

            <TouchableOpacity 
              className="flex-row items-center mt-5" 
              onPress={() => setDoNotShowToday(!doNotShowToday)}
            >
              <Icon name={doNotShowToday ? 'CheckSquare' : 'Square'} size={20} color={doNotShowToday ? COLORS.primary : COLORS.textMuted} />
              <Text className="ml-2 text-text-lightSecondary dark:text-text-darkSecondary">Bugün tekrar gösterme</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <HomeHeader unreadCount={unreadCount} />

      {/* Comments Feed */}
      <View className="px-4 pt-6">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-1.5">
            <Icon name="ChatCircle" size={20} color={COLORS.primary} weight="fill" />
            <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary">Son Yorumlar</Text>
          </View>
        </View>

        {feedComments.length === 0 ? (
          <Text className="text-sm italic py-4 text-text-lightMuted dark:text-text-darkMuted">Henüz yorum yapılmamış.</Text>
        ) : (
          <View>
            {feedComments.map((comment) => (
              <FeedCommentItem 
                key={comment.id} 
                comment={comment}
                onToggleLike={async (id) => {
                  try {
                    const res = await commentsApi.toggleLike(id);
                    const isLiked = res.data.data.liked;
                    setFeedComments(prev => prev.map(c => {
                      if (c.id === id) {
                        return {
                          ...c,
                          is_liked_by_user: isLiked ? 1 : 0,
                          is_disliked_by_user: 0,
                          like_count: c.like_count + (isLiked ? 1 : -1),
                          dislike_count: c.is_disliked_by_user ? c.dislike_count - 1 : c.dislike_count
                        };
                      }
                      return c;
                    }));
                  } catch (e) {
                    console.log('Like error:', e.message);
                  }
                }}
                onToggleDislike={async (id) => {
                  try {
                    const res = await commentsApi.toggleDislike(id);
                    const isDisliked = res.data.data.disliked;
                    setFeedComments(prev => prev.map(c => {
                      if (c.id === id) {
                        return {
                          ...c,
                          is_disliked_by_user: isDisliked ? 1 : 0,
                          is_liked_by_user: 0,
                          dislike_count: c.dislike_count + (isDisliked ? 1 : -1),
                          like_count: c.is_liked_by_user ? c.like_count - 1 : c.like_count
                        };
                      }
                      return c;
                    }));
                  } catch (e) {
                    console.log('Dislike error:', e.message);
                  }
                }}
              />
            ))}
          </View>
        )}
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
