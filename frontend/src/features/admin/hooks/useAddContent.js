import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { contentApi } from '@/api/endpoints/content.api';
import { validateContentInput } from '../utils/addContentValidator';
import { useMultiLangSummary } from '@/hooks/useMultiLangSummary';

export const useAddContent = (onSuccess) => {
  const [type, setType] = useState('movie');
  const [title, setTitle] = useState('');
  const [directorAuthor, setDirectorAuthor] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const multiLang = useMultiLangSummary('');

  const pickImage = async () => {
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
    setCoverImage(result.assets[0]);
  };

  const handleSubmit = async () => {
    const validation = validateContentInput(type, title, directorAuthor);
    
    if (!validation.isValid) {
      Alert.alert(validation.error.includes('zorunludur') ? 'Uyarı' : 'Hata', validation.error);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', validation.t);
      formData.append('director_author', validation.d);
      formData.append('summary', multiLang.getSummaryJsonString());

      if (coverImage) {
        const filename = coverImage.fileName || coverImage.uri.split('/').pop();
        
        let mimeType = coverImage.mimeType;
        if (!mimeType) {
          let ext = filename.split('.').pop().toLowerCase();
          if (ext === 'jpg') ext = 'jpeg';
          mimeType = `image/${ext}`;
        }
        
        formData.append('cover_image', {
          uri: coverImage.uri,
          name: filename,
          type: mimeType,
        });
      }

      await contentApi.create(formData);
      Alert.alert('Başarılı', 'İçerik başarıyla eklendi!');
      setTitle('');
      setDirectorAuthor('');
      multiLang.setSummaries({ tr: '', en: '', es: '', fr: '' });
      setCoverImage(null);
      onSuccess?.();
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'İçerik eklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  return {
    type, setType,
    title, setTitle,
    directorAuthor, setDirectorAuthor,
    multiLang,
    coverImage,
    loading,
    pickImage,
    handleSubmit
  };
};
