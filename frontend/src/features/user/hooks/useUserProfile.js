import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { usersApi } from '@/api/endpoints/users.api';
import { commentsApi } from '@/api/endpoints/comments.api';
import { sharedListsApi } from '@/api/endpoints/shared-lists.api';

export function useUserProfile(id, user) {
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [publicLists, setPublicLists] = useState([]);
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'lists'
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [profileRes, commentsRes, listsRes] = await Promise.all([
        usersApi.getProfile(id),
        usersApi.getUserComments(id),
        sharedListsApi.getUserPublicLists(id)
      ]);
      setProfile(profileRes.data.data);
      setComments(commentsRes.data.data);
      setPublicLists(listsRes.data.data);
    } catch (err) {
      Alert.alert('Hata', 'Kullanıcı profili yüklenemedi.');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleFollow = async () => {
    if (!user) {
      Alert.alert('Uyarı', 'Takip etmek için giriş yapmalısınız.');
      return;
    }
    
    // Optimsitic UI Update
    setProfile(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
    }));
    
    setFollowLoading(true);
    try {
      await usersApi.toggleFollow(id);
    } catch (err) {
      // Revert optimistic update
      setProfile(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      }));
      Alert.alert('Hata', err.response?.data?.message || 'İşlem başarısız.');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleToggleLike = async (commentId) => {
    if (!user) {
      Alert.alert('Uyarı', 'Beğenmek için giriş yapmalısınız.');
      return;
    }

    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const isLiked = c.is_liked_by_user;
        const isDisliked = c.is_disliked_by_user;
        return {
          ...c,
          is_liked_by_user: !isLiked,
          like_count: isLiked ? c.like_count - 1 : c.like_count + 1,
          is_disliked_by_user: false,
          dislike_count: isDisliked ? c.dislike_count - 1 : c.dislike_count
        };
      }
      return c;
    }));

    try {
      await commentsApi.toggleLike(commentId);
    } catch (err) {
      fetchData(); // Revert on error
    }
  };

  const handleToggleDislike = async (commentId) => {
    if (!user) {
      Alert.alert('Uyarı', 'Beğenmemek için giriş yapmalısınız.');
      return;
    }

    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const isDisliked = c.is_disliked_by_user;
        const isLiked = c.is_liked_by_user;
        return {
          ...c,
          is_disliked_by_user: !isDisliked,
          dislike_count: isDisliked ? c.dislike_count - 1 : c.dislike_count + 1,
          is_liked_by_user: false,
          like_count: isLiked ? c.like_count - 1 : c.like_count
        };
      }
      return c;
    }));

    try {
      await commentsApi.toggleDislike(commentId);
    } catch (err) {
      fetchData(); // Revert on error
    }
  };

  return {
    profile,
    setProfile,
    comments,
    publicLists,
    activeTab,
    setActiveTab,
    loading,
    followLoading,
    handleToggleFollow,
    handleToggleLike,
    handleToggleDislike
  };
}
