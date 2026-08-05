import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { detailStyles as styles } from '@/features/content/styles/detail.styles';

export default function ContentEditForm({
  editTitle,
  setEditTitle,
  editAuthor,
  setEditAuthor,
  editSummary,
  setEditSummary,
  authorLabel,
  saving,
  onCancel,
  onSave
}) {
  return (
    <View className={styles.editingContainer}>
      <View>
        <Text className={styles.editInputLabel}>Başlık</Text>
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
        <Text className={styles.editInputLabel}>Özet</Text>
        <TextInput 
          className={styles.editSummaryInput} 
          value={editSummary} 
          onChangeText={setEditSummary} 
          multiline 
          textAlignVertical="top" 
        />
      </View>
      <View className={styles.editButtonsRow}>
        <TouchableOpacity className={styles.cancelEditButton} onPress={onCancel}>
          <Text className={styles.cancelEditText}>İptal</Text>
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
              <Text className={styles.saveEditText}>Kaydet</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
