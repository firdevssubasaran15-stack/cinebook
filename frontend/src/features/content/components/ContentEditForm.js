import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { detailStyles as styles } from '@/features/content/styles/detail.styles';
import { useLanguage } from '@/hooks/useLanguage';

export default function ContentEditForm({
  editTitle,
  setEditTitle,
  editAuthor,
  setEditAuthor,
  multiLang,
  authorLabel,
  saving,
  onCancel,
  onSave
}) {
  const { t } = useLanguage();

  return (
    <View className={styles.editingContainer}>
      <View>
        <Text className={styles.editInputLabel}>{t('contentEdit.titleLabel')}</Text>
        <TextInput 
          className={styles.editInput} 
          value={editTitle} 
          onChangeText={setEditTitle} 
        />
      </View>
      <View>
        <Text className={styles.editInputLabel}>{authorLabel}</Text>
        <TextInput 
          className={styles.editInput} 
          value={editAuthor} 
          onChangeText={setEditAuthor} 
        />
      </View>
      <View>
        <Text className={styles.editInputLabel}>{t('contentEdit.summaryLabel')}</Text>
        <View className="flex-row gap-2 mb-2">
          {multiLang.LANGUAGES.map(lang => (
            <TouchableOpacity 
              key={lang}
              onPress={() => multiLang.setActiveTab(lang)}
              className={`px-3 py-1 rounded-full ${multiLang.activeTab === lang ? 'bg-brand-primary' : 'bg-black/10 dark:bg-white/10'}`}
            >
              <Text className={multiLang.activeTab === lang ? 'text-white font-bold text-[10px] uppercase tracking-wider' : 'text-text-lightSecondary dark:text-text-darkSecondary font-bold text-[10px] uppercase tracking-wider'}>
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput 
          className={styles.editSummaryInput} 
          value={multiLang.summaries[multiLang.activeTab]} 
          onChangeText={(text) => multiLang.updateSummary(multiLang.activeTab, text)} 
          multiline 
          textAlignVertical="top" 
        />
      </View>
      <View className={styles.editButtonsRow}>
        <TouchableOpacity className={styles.cancelEditButton} onPress={onCancel}>
          <Text className={styles.cancelEditText}>{t('contentEdit.cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={styles.saveEditButton} 
          onPress={onSave} 
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon name="Check" size={16} color="#fff" weight="bold" />
              <Text className={styles.saveEditText}>{t('contentEdit.save')}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
