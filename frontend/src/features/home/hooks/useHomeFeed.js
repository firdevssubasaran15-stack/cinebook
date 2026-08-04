import { useState, useEffect } from 'react';
import { commentsApi } from '@/api/endpoints/comments.api';

export const useHomeFeed = () => {
  const [feedComments, setFeedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFeed();
  };

  const handleToggleLike = async (id) => {
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
  };

  const handleToggleDislike = async (id) => {
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
  };

  return {
    feedComments,
    loading,
    refreshing,
    handleRefresh,
    handleToggleLike,
    handleToggleDislike
  };
};
