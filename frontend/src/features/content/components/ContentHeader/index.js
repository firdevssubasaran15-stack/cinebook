import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { detailStyles as styles } from '@/features/content/styles/detail.styles';

export default function ContentHeader({ typeIcon, typeLabel, isAdmin, isEditing, onEdit, onDelete }) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  return (
    <View className={styles.headerRow}>
      <View className={styles.typeBadge}>
        <View className={styles.typeBadgeRow}>
          <Icon name={typeIcon} size={14} color={COLORS.primary} weight="bold" />
          <Text className={styles.typeBadgeText}>{typeLabel}</Text>
        </View>
      </View>
      
      {isAdmin && !isEditing && (
        <View className={styles.adminButtonsRow}>
          <TouchableOpacity onPress={onEdit} className={styles.editButton}>
            <Icon name="Pencil" size={14} color={COLORS.primary} weight="bold" />
            <Text className={styles.editButtonText}>{t('detail.edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} className={styles.deleteButton}>
            <Icon name="Trash" size={14} color="#ef4444" weight="bold" />
            <Text className={styles.deleteButtonText}>{t('detail.delete')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
