import { Alert } from 'react-native';
import { commentsApi } from '@/api/endpoints/comments.api';

export function useCommentActions({ contentId, user, setComments, fetchComments }) {
  
  const handleCreate = async (text, quote) => {
    try {
      await commentsApi.create(contentId, text, quote || null);
      fetchComments();
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Yorum eklenemedi.');
      throw err;
    }
  };

  const handleDelete = async (commentId) => {
    return new Promise((resolve) => {
      Alert.alert('Sil', 'Bu yorumu silmek istediğinize emin misiniz?', [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await commentsApi.delete(commentId);
              fetchComments();
              Alert.alert('Başarılı', 'Yorum silindi.');
              resolve();
            } catch (err) {
              Alert.alert('Hata', err.response?.data?.message || 'Silinemedi.');
            }
          },
        },
      ]);
    });
  };

  const handleEdit = async (commentId, text, quote) => {
    try {
      await commentsApi.update(commentId, text, quote);
      fetchComments();
      Alert.alert('Başarılı', 'Yorum güncellendi.');
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Güncellenemedi.');
      throw err;
    }
  };

  const handleReply = async (parentId, text) => {
    try {
      await commentsApi.create(contentId, text, null, parentId);
      fetchComments();
      Alert.alert('Başarılı', 'Yanıtınız eklendi.');
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Yanıt eklenemedi.');
      throw err;
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
          like_count: isLiked ? (c.like_count || 1) - 1 : (c.like_count || 0) + 1,
          is_disliked_by_user: false,
          dislike_count: isDisliked ? (c.dislike_count || 1) - 1 : (c.dislike_count || 0)
        };
      }
      return c;
    }));

    try {
      await commentsApi.toggleLike(commentId);
    } catch (err) {
      fetchComments();
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
          dislike_count: isDisliked ? (c.dislike_count || 1) - 1 : (c.dislike_count || 0) + 1,
          is_liked_by_user: false,
          like_count: isLiked ? (c.like_count || 1) - 1 : (c.like_count || 0)
        };
      }
      return c;
    }));

    try {
      await commentsApi.toggleDislike(commentId);
    } catch (err) {
      fetchComments();
    }
  };

  return {
    handleCreate,
    handleDelete,
    handleEdit,
    handleReply,
    handleToggleLike,
    handleToggleDislike,
  };
}
