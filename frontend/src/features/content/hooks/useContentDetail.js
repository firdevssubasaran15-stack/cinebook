import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { contentApi } from '@/api/endpoints/content.api';
import { router } from 'expo-router';
import { useMultiLangSummary } from '@/hooks/useMultiLangSummary';

/**
 * useContentDetail
 *
 * Icerik detay ekrani is mantigini yonetir.
 * SOLID SRP: Alert metinleri i18n locale dosyasinda,
 * hook yalnizca is akisi ve state yonetiminden sorumludur.
 */
export function useContentDetail(id, navigation) {
  const { t } = useTranslation();

  const [content, setContent]               = useState(null);
  const [loading, setLoading]               = useState(true);
  const [isEditing, setIsEditing]           = useState(false);
  const [editTitle, setEditTitle]           = useState('');
  const [editAuthor, setEditAuthor]         = useState('');
  
  const multiLang = useMultiLangSummary(content?.summary);
  const [editCover, setEditCover]           = useState(null);
  const [saving, setSaving]                 = useState(false);
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
      Alert.alert(t('contentDetail.errorTitle'), t('contentDetail.loadError'));
    } finally {
      setLoading(false);
    }
  }, [id, navigation, t]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleDeleteContent = () => {
    Alert.alert(
      t('contentDetail.deleteTitle'),
      t('contentDetail.deleteMessage'),
      [
        { text: t('contentDetail.deleteCancel'), style: 'cancel' },
        {
          text: t('contentDetail.deleteConfirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await contentApi.delete(id);
              Alert.alert(t('contentDetail.successTitle'), t('contentDetail.deleteSuccess'));
              router.back();
            } catch (err) {
              Alert.alert(
                t('contentDetail.errorTitle'),
                err.response?.data?.message || t('contentDetail.deleteError')
              );
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
    // useMultiLangSummary automatically picks up content?.summary when content changes,
    // but just to be sure we can re-initialize it here if we added a reset method, 
    // but useEffect in the hook handles [initialValue].
    multiLang.setActiveTab('tr');
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
        Alert.alert(t('contentDetail.infoTitle'), t('contentDetail.imageCancelled'));
        return;
      }
      setEditCover(result.assets[0]);
    } catch (error) {
      Alert.alert(t('contentDetail.errorTitle'), t('contentDetail.imageError'));
    } finally {
      setIsPickingImage(false);
    }
  };

  const handleSaveEdit = async () => {
    const title  = editTitle.trim();
    const author = editAuthor.trim();
    if (!title || !author) {
      Alert.alert(t('contentDetail.warningTitle'), t('contentDetail.validationError'));
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('director_author', author);
      formData.append('summary', multiLang.getSummaryJsonString());
      if (editCover) {
        const filename = editCover.fileName || editCover.uri.split('/').pop();
        let mimeType = editCover.mimeType;
        if (!mimeType) {
          let ext = filename.split('.').pop().toLowerCase();
          if (ext === 'jpg') ext = 'jpeg';
          mimeType = `image/${ext}`;
        }
        formData.append('cover_image', { uri: editCover.uri, name: filename, type: mimeType });
      }
      await contentApi.update(id, formData);
      Alert.alert(t('contentDetail.successTitle'), t('contentDetail.saveSuccess'));
      setIsEditing(false);
      fetchContent();
    } catch (err) {
      Alert.alert(
        t('contentDetail.errorTitle'),
        err.response?.data?.message || t('contentDetail.saveError')
      );
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
    multiLang,
    editCover,
    saving,
    fetchContent,
    handleDeleteContent,
    startEditing,
    pickImage,
    handleSaveEdit,
    isPickingImage,
  };
}
