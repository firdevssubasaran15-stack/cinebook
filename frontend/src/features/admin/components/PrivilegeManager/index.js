import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { usePrivilegeManager } from '@/features/admin/hooks/usePrivilegeManager';
import { styles } from './styles';
import { useLanguage } from '@/hooks/useLanguage';

import UserSearchResults from '@/features/admin/components/UserSearchResults';
import PrivilegeCheckboxes from '@/features/admin/components/PrivilegeCheckboxes';

export default function PrivilegeManager() {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();
  
  const PRIVILEGE_LABELS = {
    can_comment: t('admin.privileges.can_comment'),
    can_post_feelings: t('admin.privileges.can_post_feelings'),
    can_view_movies: t('admin.privileges.can_view_movies'),
    can_view_series: t('admin.privileges.can_view_series'),
    can_view_books: t('admin.privileges.can_view_books'),
    can_view_admin_panel: t('admin.privileges.can_view_admin_panel'),
    can_moderate_content: t('admin.privileges.can_moderate_content'),
  };

  const {
    searchUsername, setSearchUsername,
    searchResults,
    selectedUser,
    privileges, togglePrivilege,
    searching,
    saving,
    handleSearch,
    selectUser,
    handleSave
  } = usePrivilegeManager();

  return (
    <View className={styles.container}>
      <Text className={styles.title}>{t('admin.privilegeTitle')}</Text>

      <View className={styles.searchContainer}>
        <TextInput
          className={styles.searchInput}
          value={searchUsername}
          onChangeText={setSearchUsername}
          placeholder={t('admin.searchUserPlaceholder')}
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity 
          className={styles.searchButton} 
          onPress={handleSearch} 
          disabled={searching}
        >
          {searching ? <ActivityIndicator color={COLORS.primary} size="small" /> : <Text className={styles.searchButtonText}>🔍</Text>}
        </TouchableOpacity>
      </View>

      <UserSearchResults 
        searchResults={searchResults}
        selectedUser={selectedUser}
        selectUser={selectUser}
      />

      <PrivilegeCheckboxes 
        selectedUser={selectedUser}
        privilegeLabels={PRIVILEGE_LABELS}
        privileges={privileges}
        togglePrivilege={togglePrivilege}
        saving={saving}
        handleSave={handleSave}
      />
    </View>
  );
}
