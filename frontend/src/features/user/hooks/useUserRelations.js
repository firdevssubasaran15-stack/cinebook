import { useState } from 'react';
import { Alert } from 'react-native';
import { usersApi } from '@/api/endpoints/users.api';

export function useUserRelations(id) {
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);

  const [userListModal, setUserListModal] = useState({ visible: false, type: null });
  const [userList, setUserList] = useState([]);
  const [userListLoading, setUserListLoading] = useState(false);

  const handleUserSearch = async (query) => {
    setUserSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setUserSearchResults([]);
      return;
    }
    setUserSearchLoading(true);
    try {
      const res = await usersApi.searchUsers(query);
      setUserSearchResults(res.data.data);
    } catch (err) {
      console.log('User search error:', err.message);
    } finally {
      setUserSearchLoading(false);
    }
  };

  const openUserList = async (type) => {
    setUserListModal({ visible: true, type });
    setUserListLoading(true);
    try {
      const res = type === 'followers' ? await usersApi.getFollowers(id) : await usersApi.getFollowing(id);
      setUserList(res.data.data);
    } catch (err) {
      Alert.alert('Hata', 'Kullanıcı listesi alınamadı.');
      setUserListModal({ visible: false, type: null });
    } finally {
      setUserListLoading(false);
    }
  };

  return {
    userSearchQuery,
    setUserSearchQuery,
    userSearchResults,
    setUserSearchResults,
    userSearchLoading,
    handleUserSearch,
    userListModal,
    setUserListModal,
    userList,
    userListLoading,
    openUserList
  };
}
