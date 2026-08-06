import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { sharedListDetailStyles as styles } from '@/features/shared-lists/styles/sharedListDetail.styles';

export default function InviteUserModal({ 
  visible, 
  onClose, 
  searchQuery, 
  setSearchQuery, 
  searchResults, 
  inviteLoading, 
  handleInviteUser 
}) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  if (!visible) return null;

  return (
    <View className={styles.modalOverlay}>
      <View className={styles.modalContainer}>
        <View className={styles.modalHeaderRow}>
          <Text className={styles.modalTitle}>{t('sharedList.inviteUserTitle')}</Text>
          <TouchableOpacity onPress={onClose}><Icon name="X" size={24} color={COLORS.textSecondary} /></TouchableOpacity>
        </View>
        <View className={styles.modalInputContainer}>
          <TextInput
            className={styles.modalInput}
            placeholder={t('sharedList.searchUserPlaceholder')}
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {inviteLoading && <ActivityIndicator size="small" color={COLORS.primary} className={styles.modalLoader} />}
        <ScrollView className={styles.modalScroll}>
          {searchResults.map(u => (
            <TouchableOpacity 
              key={u.id} 
              className={styles.searchResultItem}
            >
              <Text className={styles.searchResultText}>@{u.username}</Text>
              <TouchableOpacity onPress={() => handleInviteUser(u.id)} className={styles.searchResultActionBtn}>
                <Text className={styles.searchResultActionText}>{t('sharedList.invite')}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          {searchResults.length === 0 && searchQuery.length >= 2 && !inviteLoading && (
            <Text className={styles.emptySearchText}>{t('sharedList.userNotFound')}</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
