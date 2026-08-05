import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '@/constants/colors';
import { usePrivilegeManager } from '@/features/admin/hooks/usePrivilegeManager';
import { styles } from './styles';
import { useLanguage } from '@/hooks/useLanguage';

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

      {/* Arama Sonuçları */}
      {searchResults.map((u) => (
        <TouchableOpacity
          key={u.id}
          className={`${styles.userRow} ${selectedUser?.id === u.id ? styles.userRowSelected : styles.userRowUnselected}`}
          onPress={() => selectUser(u)}
        >
          <View className={styles.avatarContainer}>
            <Text className={styles.avatarText}>{u.username[0].toUpperCase()}</Text>
          </View>
          <View className={styles.userInfoContainer}>
            <Text className={styles.usernameText}>{u.username}</Text>
            <Text className={styles.emailText}>{u.email}</Text>
          </View>
          {u.is_admin ? <Text className={styles.adminBadge}>ADMIN</Text> : null}
        </TouchableOpacity>
      ))}

      {/* Privilege Checkbox'ları */}
      {selectedUser && !selectedUser.is_admin && (
        <View className={styles.privilegesBox}>
          <Text className={styles.privilegesHeader}>
            {t('admin.privilegesFor', { username: selectedUser.username })}
          </Text>
          {Object.entries(PRIVILEGE_LABELS).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              className={styles.privilegeRow}
              onPress={() => togglePrivilege(key)}
            >
              <View className={`${styles.checkboxContainer} ${privileges[key] ? styles.checkboxChecked : styles.checkboxUnchecked}`}>
                {privileges[key] && <Text className={styles.checkmark}>✓</Text>}
              </View>
              <Text className={styles.privilegeLabel}>{label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            className={`${styles.saveButtonContainer} ${saving ? 'opacity-60' : ''}`}
            onPress={handleSave}
            disabled={saving}
          >
            <LinearGradient 
              colors={GRADIENTS.primary} 
              className={styles.saveButtonGradient} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }}
            >
              {saving ? <ActivityIndicator color="#fff" /> : <Text className={styles.saveButtonText}>{t('admin.savePrivileges')}</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
