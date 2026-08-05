import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { libraryApi } from '@/api/endpoints/library.api';
import { sharedListsApi } from '@/api/endpoints/shared-lists.api';

export function useLibrary(user) {
  const [items, setItems] = useState([]);
  const [sharedLists, setSharedLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('will_watch');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListType, setNewListType] = useState('watching');

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setLoading(false);
        return;
      }
      fetchLibrary();
    }, [user])
  );

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const res = await libraryApi.getUserLibrary();
      setItems(res.data.data);
      const listsRes = await sharedListsApi.getMyLists();
      setSharedLists(listsRes.data.data);
    } catch(err) {
      console.log('Library error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    try {
      await sharedListsApi.createList(newListName, newListType);
      setShowCreateModal(false);
      setNewListName('');
      fetchLibrary();
    } catch (err) {
      console.log('Create list error:', err.response?.data || err.message);
      Alert.alert('Hata', err.response?.data?.message || 'Liste oluşturulurken bir hata oluştu.');
    }
  };

  const filteredItems = items.filter(item => {
    if (activeTab === 'watching_reading') {
      return item.status === 'watching' || item.status === 'reading';
    }
    return item.status === activeTab;
  });

  return {
    loading,
    activeTab,
    setActiveTab,
    sharedLists,
    filteredItems,
    showCreateModal,
    setShowCreateModal,
    newListName,
    setNewListName,
    newListType,
    setNewListType,
    handleCreateList
  };
}
