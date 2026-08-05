import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { feelingsApi } from '@/api/endpoints/feelings.api';

export function useFeelings(contentId, user) {
  const [feelings, setFeelings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tagFilter, setTagFilter] = useState(null);

  const [newText, setNewText] = useState('');
  const [newTags, setNewTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchFeelings = useCallback(async () => {
    try {
      let res;
      if (tagFilter) {
        res = await feelingsApi.searchByTag(tagFilter);
        const filtered = res.data.data.filter((f) => f.content_id === parseInt(contentId));
        setFeelings(filtered);
      } else {
        res = await feelingsApi.getByContentId(contentId);
        setFeelings(res.data.data);
      }
    } catch (err) {
      console.log('Feelings error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [contentId, tagFilter]);

  const handleToggleTag = (tagId) => {
    setNewTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (!newText.trim() && newTags.length === 0) {
      Alert.alert('Uyarı', 'Lütfen bir metin girin veya en az bir etiket seçin.');
      return;
    }
    setSubmitting(true);
    try {
      await feelingsApi.create(contentId, newText.trim(), newTags);
      setNewText('');
      setNewTags([]);
      setShowForm(false);
      fetchFeelings();
      Alert.alert('Başarılı', '"Bana Hissettirdikleri" paylaşıldı! 💫');
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Paylaşım yapılamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFeeling = (feelingId) => {
    Alert.alert('Sil', 'Bu hissi silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await feelingsApi.delete(feelingId);
            fetchFeelings();
            Alert.alert('Başarılı', 'His silindi.');
          } catch (err) {
            Alert.alert('Hata', err.response?.data?.message || 'Silinemedi.');
          }
        },
      },
    ]);
  };

  const handleEditFeeling = async (feelingId, text, tags) => {
    try {
      await feelingsApi.update(feelingId, text, tags);
      fetchFeelings();
      Alert.alert('Başarılı', 'His güncellendi.');
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Güncellenemedi.');
      throw err;
    }
  };

  const handleToggleLike = async (feelingId) => {
    if (!user) {
      Alert.alert('Uyarı', 'Beğenmek için giriş yapmalısınız.');
      return;
    }
    setFeelings(prev => prev.map(f => {
      if (f.id === feelingId) {
        const isLiked = f.is_liked_by_user;
        return {
          ...f,
          is_liked_by_user: !isLiked,
          like_count: isLiked ? (f.like_count || 1) - 1 : (f.like_count || 0) + 1
        };
      }
      return f;
    }));

    try {
      await feelingsApi.toggleLike(feelingId);
    } catch (err) {
      fetchFeelings();
      console.log('Beğeni hatası:', err.message);
    }
  };

  return {
    feelings,
    loading,
    tagFilter,
    setTagFilter,
    newText,
    setNewText,
    newTags,
    submitting,
    showForm,
    setShowForm,
    fetchFeelings,
    handleToggleTag,
    handleSubmit,
    handleDeleteFeeling,
    handleEditFeeling,
    handleToggleLike
  };
}
