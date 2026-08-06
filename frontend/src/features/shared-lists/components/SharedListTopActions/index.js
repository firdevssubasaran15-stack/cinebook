import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { sharedListDetailStyles as styles } from '@/features/shared-lists/styles/sharedListDetail.styles';

export default function SharedListTopActions({ list, isOwner, saveLoading, setShowInviteModal, handleToggleSave }) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  return (
    <View className={styles.topActionsRow}>
      <Text className={styles.listTypeSubtitle}>
        {list.type === 'watching' ? t('sharedList.watchingList') : t('sharedList.readingList')}
      </Text>
      {isOwner && (
        <TouchableOpacity onPress={() => setShowInviteModal(true)} className={styles.inviteButton}>
          <Icon name="UserPlus" size={16} color="#fff" />
          <Text className={styles.inviteButtonText}>{t('sharedList.invite')}</Text>
        </TouchableOpacity>
      )}
      {!isOwner && list.is_public === 1 && (
         <TouchableOpacity onPress={handleToggleSave} disabled={saveLoading} className={`${styles.saveButtonBase} ${list.is_saved_by_user ? styles.saveButtonSaved : styles.saveButtonNotSaved}`}>
            {saveLoading ? (
              <ActivityIndicator size="small" color={list.is_saved_by_user ? COLORS.primary : '#fff'} />
            ) : (
              <>
                <Icon name={list.is_saved_by_user ? "Check" : "BookmarkSimple"} size={16} color={list.is_saved_by_user ? COLORS.primary : '#fff'} />
                <Text className={`${styles.saveButtonTextBase} ${list.is_saved_by_user ? styles.saveButtonTextSaved : styles.saveButtonTextNotSaved}`}>{list.is_saved_by_user ? t('sharedList.saved') : t('sharedList.save')}</Text>
              </>
            )}
         </TouchableOpacity>
      )}
    </View>
  );
}
