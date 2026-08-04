import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { contentApi } from '@/api/endpoints/content.api';

const SHORT_TITLE_WHITELIST = [
  { type: 'book', title: 'K', author: 'Franz Kafka' },
  { type: 'book', title: 'V.', author: 'Thomas Pynchon' },
  { type: 'book', title: 'O', author: 'Stephen King' },
  { type: 'movie', title: 'Z', author: 'Costa-Gavras' },
  { type: 'movie', title: '9', author: 'Shane Acker' },
  { type: 'movie', title: 'O', author: 'Tim Blake Nelson' },
  { type: 'series', title: 'V', author: 'Kenneth Johnson' },
  { type: 'series', title: 'V', author: 'Scott Peters' },
  { type: 'series', title: 'K', author: 'GoHands' },
  { type: 'series', title: 'K', author: 'Shingo Suzuki' },
  { type: 'series', title: 'ER', author: 'Michael Crichton' },
];

export const useAddContent = (onSuccess) => {
  const [type, setType] = useState('movie');
  const [title, setTitle] = useState('');
  const [directorAuthor, setDirectorAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setCoverImage(asset);
    }
  };

  const handleSubmit = async () => {
    const t = title.trim();
    const d = directorAuthor.trim();
    
    if (!t || !d) {
      Alert.alert('Uyarı', 'Başlık ve yönetmen/yazar zorunludur.');
      return;
    }

    if (t.length === 1 || t === 'V.' || t.toUpperCase() === 'ER') {
      const isWhitelisted = SHORT_TITLE_WHITELIST.some(w => {
        if (w.type !== type || w.title.toLowerCase() !== t.toLowerCase()) return false;
        
        const whiteWords = w.author.toLowerCase().split(/\s+/);
        const inputWords = d.toLowerCase().split(/\s+/);
        
        return inputWords.some(word => word.length > 2 && whiteWords.includes(word)) || 
               w.author.toLowerCase().includes(d.toLowerCase());
      });

      if (!isWhitelisted) {
        Alert.alert('Hata', 'Tek harfli/rakamlı veya kısıtlanmış kısa isimler yalnızca özel istisna listesine uyan yönetmen/yazarlarla girilebilir.');
        return;
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', t);
      formData.append('director_author', d);
      formData.append('summary', summary.trim());

      if (coverImage) {
        const filename = coverImage.uri.split('/').pop();
        const ext = filename.split('.').pop();
        formData.append('cover_image', {
          uri: coverImage.uri,
          name: filename,
          type: `image/${ext}`,
        });
      }

      await contentApi.create(formData);
      Alert.alert('Başarılı', 'İçerik başarıyla eklendi!');
      setTitle('');
      setDirectorAuthor('');
      setSummary('');
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
    summary, setSummary,
    coverImage,
    loading,
    pickImage,
    handleSubmit
  };
};
