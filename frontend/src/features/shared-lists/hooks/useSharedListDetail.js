import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { sharedListsApi } from '@/api/endpoints/shared-lists.api';
import { usersApi } from '@/api/endpoints/users.api';
import { contentApi } from '@/api/endpoints/content.api';

export function useSharedListDetail(id) {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  // Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [inviteLoading, setInviteLoading] = useState(false);

  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Content Add Modal
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentSearchQuery, setContentSearchQuery] = useState('');
  const [contentSearchResults, setContentSearchResults] = useState([]);
  const [contentSearchLoading, setContentSearchLoading] = useState(false);

  const fetchListDetails = useCallback(async () => {
    try {
      const res = await sharedListsApi.getListDetails(id);
      setList(res.data.data);
    } catch (err) {
      console.log('List detail error:', err.message);
      Alert.alert('Hata', 'Liste yüklenemedi. Yetkiniz olmayabilir.');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchListDetails();
  }, [fetchListDetails]);

  const handleSearchUsers = async (text) => {
    setSearchQuery(text);
    if (!text || text.length < 2) {
      setSearchResults([]);
      return;
    }
    setInviteLoading(true);
    try {
      const res = await usersApi.searchUsers(text);
      setSearchResults(res.data.data);
    } catch(err) {
      console.log('Search user error:', err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleInviteUser = async (targetUserId) => {
    try {
      await sharedListsApi.inviteUser(id, targetUserId);
      Alert.alert('Başarılı', 'Kullanıcıya davet gönderildi!');
      setShowInviteModal(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      Alert.alert('Hata', err.message);
    }
  };

  const handleSearchContents = async (text) => {
    setContentSearchQuery(text);
    if (!text || text.length < 2) {
      setContentSearchResults([]);
      return;
    }
    setContentSearchLoading(true);
    try {
      if (list.type === 'watching') {
        const [movies, series] = await Promise.all([
          contentApi.getByType('movie', text),
          contentApi.getByType('series', text)
        ]);
        setContentSearchResults([...movies.data.data, ...series.data.data]);
      } else {
        const res = await contentApi.getByType('book', text);
        setContentSearchResults(res.data.data);
      }
    } catch (err) {
      console.log('Search content error:', err.message);
    } finally {
      setContentSearchLoading(false);
    }
  };

  const handleAddContent = async (contentId) => {
    try {
      await sharedListsApi.addContent(id, contentId);
      Alert.alert('Başarılı', 'İçerik listeye eklendi!');
      setShowContentModal(false);
      setContentSearchQuery('');
      setContentSearchResults([]);
      fetchListDetails();
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || err.message);
    }
  };

  const handleToggleVisibility = async () => {
    setVisibilityLoading(true);
    try {
      const res = await sharedListsApi.toggleVisibility(id);
      setList(prev => ({ ...prev, is_public: res.data.data.is_public }));
      Alert.alert('Başarılı', res.data.message);
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Görünürlük değiştirilemedi.');
    } finally {
      setVisibilityLoading(false);
    }
  };

  const handleToggleSave = async () => {
    setSaveLoading(true);
    try {
      if (list.is_saved_by_user) {
        await sharedListsApi.unsaveList(id);
        setList(prev => ({ ...prev, is_saved_by_user: false }));
        Alert.alert('Başarılı', 'Liste kaydedilenlerden çıkarıldı.');
      } else {
        await sharedListsApi.saveList(id);
        setList(prev => ({ ...prev, is_saved_by_user: true }));
        Alert.alert('Başarılı', 'Liste başarıyla kaydedildi.');
      }
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'İşlem başarısız.');
    } finally {
      setSaveLoading(false);
    }
  };

  return {
    list,
    loading,
    showInviteModal,
    setShowInviteModal,
    searchQuery,
    searchResults,
    inviteLoading,
    visibilityLoading,
    saveLoading,
    showContentModal,
    setShowContentModal,
    contentSearchQuery,
    contentSearchResults,
    contentSearchLoading,
    handleSearchUsers,
    handleInviteUser,
    handleSearchContents,
    handleAddContent,
    handleToggleVisibility,
    handleToggleSave
  };
}
