import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usersApi } from '@/api/endpoints/users.api';

export function useProfileEdit(user, updateUser, setProfile) {
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Hata', 'Kamera rulonuza erişim izni gereklidir.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      handleUpload(result.assets[0]);
    }
  };

  const handleUpload = async (imageAsset) => {
    setIsUploadingImage(true);
    const formData = new FormData();
    const uri = imageAsset.uri;
    const fileType = imageAsset.mimeType || 'image/jpeg';
    const fileName = imageAsset.fileName || `profile_${Date.now()}.jpg`;
    formData.append('image', { uri, name: fileName, type: fileType });
    try {
      const res = await usersApi.updateProfileImage(formData);
      updateUser(res.data);
      setProfile(prev => ({ ...prev, profile_image: res.data.profile_image }));
      Alert.alert('Başarılı', 'Profil resminiz güncellendi.');
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Resim yüklenemedi.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!newUsername || newUsername.trim() === user?.username) {
      setEditProfileModal(false);
      return;
    }
    setIsSavingProfile(true);
    try {
      const res = await usersApi.updateUsername(newUsername);
      updateUser(res.data.data);
      setProfile(prev => ({ ...prev, username: res.data.data.username }));
      Alert.alert('Başarılı', 'Kullanıcı adınız güncellendi.');
      setEditProfileModal(false);
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Kullanıcı adı güncellenemedi.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return {
    editProfileModal,
    setEditProfileModal,
    newUsername,
    setNewUsername,
    isSavingProfile,
    isUploadingImage,
    pickImage,
    handleSaveUsername
  };
}
