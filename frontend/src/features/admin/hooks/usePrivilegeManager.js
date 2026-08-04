import { useState } from 'react';
import { Alert } from 'react-native';
import { adminApi } from '@/api/endpoints/admin.api';

export const usePrivilegeManager = () => {
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [privileges, setPrivileges] = useState({});
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSearch = async () => {
    if (!searchUsername.trim()) return;
    setSearching(true);
    try {
      const res = await adminApi.searchUser(searchUsername.trim());
      setSearchResults(res.data.data);
    } catch (err) {
      Alert.alert('Hata', 'Arama başarısız.');
    } finally {
      setSearching(false);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setPrivileges({
      can_comment: !!user.can_comment,
      can_post_feelings: !!user.can_post_feelings,
      can_view_movies: !!user.can_view_movies,
      can_view_series: !!user.can_view_series,
      can_view_books: !!user.can_view_books,
      can_view_admin_panel: !!user.can_view_admin_panel,
      can_moderate_content: !!user.can_moderate_content,
    });
  };

  const togglePrivilege = (key) => {
    setPrivileges((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await adminApi.updatePrivileges(selectedUser.id, privileges);
      Alert.alert('Başarılı', `${selectedUser.username} kullanıcısının yetkileri güncellendi.`);
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Yetkiler güncellenemedi.');
    } finally {
      setSaving(false);
    }
  };

  return {
    searchUsername, setSearchUsername,
    searchResults,
    selectedUser,
    privileges, togglePrivilege,
    searching,
    saving,
    handleSearch,
    selectUser,
    handleSave
  };
};
