import { Alert } from 'react-native';
import { commentsApi } from '@/api/endpoints/comments.api';
import { optimisticLikeUpdate, optimisticDislikeUpdate } from '../../../utils/commentState.utils';

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
    setComments(prev => optimisticLikeUpdate(prev, commentId));

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
    setComments(prev => optimisticDislikeUpdate(prev, commentId));

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
