import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '@/constants/colors';
import { usePrivilegeManager } from '@/features/admin/hooks/usePrivilegeManager';
import { styles } from './styles';

const PRIVILEGE_LABELS = {
  can_comment: '💬 Yorum Yapabilir',
  can_post_feelings: '💫 Hissettirdikleri Paylaşabilir',
  can_view_movies: '🎬 Filmleri Görebilir',
  can_view_series: '📺 Dizileri Görebilir',
  can_view_books: '📚 Kitapları Görebilir',
  can_view_admin_panel: '⚙️ Admin Panelini Görebilir',
  can_moderate_content: '🗑️ İçerikleri Silebilir (Moderatör)',
};

export default function PrivilegeManager() {
  const { colors: COLORS } = useTheme();
  
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
      <Text className={styles.title}>👤 Kullanıcı Yetki Yönetimi</Text>

      <View className={styles.searchContainer}>
        <TextInput
          className={styles.searchInput}
          value={searchUsername}
          onChangeText={setSearchUsername}
          placeholder="Kullanıcı adı ara..."
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
            {selectedUser.username} için Yetkiler
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
              {saving ? <ActivityIndicator color="#fff" /> : <Text className={styles.saveButtonText}>Yetkileri Kaydet</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
