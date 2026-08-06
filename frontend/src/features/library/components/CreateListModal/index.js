import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { libraryStyles as styles } from '@/features/library/styles/library.styles';

export default function CreateListModal({ 
  visible, 
  onClose, 
  listType, 
  listName, 
  setListName, 
  onCreate 
}) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  if (!visible) return null;

  return (
    <View className={styles.modalOverlay}>
      <View className={styles.modalContainer}>
        <Text className={styles.modalTitle}>
          {listType === 'watching' ? t('library.newWatchList') : t('library.newReadList')}
        </Text>
        <View className={styles.modalInputContainer}>
          <TextInput
            className={styles.modalInput}
            placeholder={t('library.listNamePlaceholder')}
            placeholderTextColor={COLORS.textMuted}
            value={listName}
            onChangeText={setListName}
            autoFocus
          />
        </View>
        <View className={styles.modalButtonsContainer}>
          <TouchableOpacity onPress={onClose} className={styles.modalCancelButton}>
            <Text className={styles.modalCancelText}>{t('contentEdit.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCreate} className={styles.modalCreateButton}>
            <Text className={styles.modalCreateText}>{t('library.createBtn')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
