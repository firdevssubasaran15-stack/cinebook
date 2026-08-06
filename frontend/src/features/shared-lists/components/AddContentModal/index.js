import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { sharedListDetailStyles as styles } from '@/features/shared-lists/styles/sharedListDetail.styles';

export default function AddContentModal({
  visible,
  onClose,
  listType,
  searchQuery,
  setSearchQuery,
  searchResults,
  loading,
  handleAddContent
}) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  if (!visible) return null;

  return (
    <View className={styles.modalOverlay}>
      <View className={styles.modalContainer}>
        <View className={styles.modalHeaderRow}>
          <Text className={styles.modalTitle}>{t('sharedList.searchAndAddContent')}</Text>
          <TouchableOpacity onPress={onClose}><Icon name="X" size={24} color={COLORS.textSecondary} /></TouchableOpacity>
        </View>
        <View className={styles.modalInputContainer}>
          <TextInput
            className={styles.modalInput}
            placeholder={listType === 'watching' ? t('sharedList.searchMovieSeriesPlaceholder') : t('sharedList.searchBookPlaceholder')}
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {loading && <ActivityIndicator size="small" color={COLORS.primary} className={styles.modalLoader} />}
        <ScrollView className={styles.modalScroll}>
          {searchResults.map(c => (
            <TouchableOpacity 
              key={c.id} 
              className={styles.searchResultItem}
            >
              <View className="flex-1 pr-2.5">
                <Text className={styles.searchResultText} numberOfLines={1}>{c.title}</Text>
                <Text className={styles.searchResultSubtitle} numberOfLines={1}>{c.director_author}</Text>
              </View>
              <TouchableOpacity onPress={() => handleAddContent(c.id)} className={styles.searchResultActionBtn}>
                <Text className={styles.searchResultActionText}>{t('sharedList.add')}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          {searchResults.length === 0 && searchQuery.length >= 2 && !loading && (
            <Text className={styles.emptySearchText}>{t('sharedList.contentNotFound')}</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
