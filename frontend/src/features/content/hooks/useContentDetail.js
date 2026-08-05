import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { contentApi } from '@/api/endpoints/content.api';
import { router } from 'expo-router';

export function useContentDetail(id, navigation) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editCover, setEditCover] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isPickingImage, setIsPickingImage] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await contentApi.getById(id);
      setContent(res.data.data);
      if (navigation) {
        navigation.setOptions({ title: res.data.data.title });
      }
    } catch (err) {
      Alert.alert('Hata', 'İçerik yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [id, navigation]);

  
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleDeleteContent = () => {
    Alert.alert(
      'İçeriği Sil',
      'Bu içeriği (film/dizi/kitap) tamamen silmek istediğinize emin misiniz? Bütün yorumlar ve hisler de silinecektir. Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await contentApi.delete(id);
              Alert.alert('Başarılı', 'İçerik başarıyla silindi.');
              router.back();
            } catch (err) {
              Alert.alert('Hata', err.response?.data?.message || 'İçerik silinemedi.');
            }
          },
        },
      ]
    );
  };

  const startEditing = () => {
    if (!content) return;
    setEditTitle(content.title);
    setEditAuthor(content.director_author);
    setEditSummary(content.summary || '');
    setEditCover(null);
    setIsEditing(true);
  };

  const pickImage = async () => {
    try {
      setIsPickingImage(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.8,
      });
      if (result.canceled) {
        Alert.alert('Bilgi', 'Resim seçimi iptal edildi.');
        return;
      }
      setEditCover(result.assets[0]);
    } catch (error) {
      Alert.alert('Hata', 'Resim seçilirken bir hata oluştu.');
    } finally {
      setIsPickingImage(false);
    }
  };

  const handleSaveEdit = async () => {
    const t = editTitle.trim();
    const d = editAuthor.trim();
    if (!t || !d) {
      Alert.alert('Uyarı', 'Başlık ve yazar/yönetmen zorunludur.');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', t);
      formData.append('director_author', d);
      formData.append('summary', editSummary.trim());
      if (editCover) {
        const filename = editCover.uri.split('/').pop();
        let ext = filename.split('.').pop().toLowerCase();
        if (ext === 'jpg') ext = 'jpeg';
        
        formData.append('cover_image', {
          uri: editCover.uri,
          name: filename,
          type: `image/${ext}`,
        });
      }
      await contentApi.update(id, formData);
      Alert.alert('Başarılı', 'İçerik başarıyla güncellendi.');
      setIsEditing(false);
      fetchContent();
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Güncellenemedi.');
    } finally {
      setSaving(false);
    }
  };

  return {
    content,
    loading,
    isEditing,
    setIsEditing,
    editTitle,
    setEditTitle,
    editAuthor,
    setEditAuthor,
    editSummary,
    setEditSummary,
    editCover,
    saving,
    fetchContent,
    handleDeleteContent,
    startEditing,
    pickImage,
    handleSaveEdit,
    isPickingImage
  };
}
