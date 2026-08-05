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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset.width !== 1000 || asset.height !== 1500) {
        Alert.alert('Hata', `Resim boyutları 1000x1500 piksel ve 2:3 oranında olmalıdır.\n(Seçilen: ${asset.width}x${asset.height})`);
        return;
      }
      setEditCover(asset);
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
        const ext = filename.split('.').pop();
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
    handleSaveEdit
  };
}
