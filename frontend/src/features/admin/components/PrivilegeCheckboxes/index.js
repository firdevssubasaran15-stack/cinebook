import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';
import { styles } from '../PrivilegeManager/styles';

export default function PrivilegeCheckboxes({
  selectedUser,
  privilegeLabels,
  privileges,
  togglePrivilege,
  saving,
  handleSave
}) {
  const { t } = useLanguage();

  if (!selectedUser || selectedUser.is_admin) return null;

  return (
    <View className={styles.privilegesBox}>
      <Text className={styles.privilegesHeader}>
        {t('admin.privilegesFor', { username: selectedUser.username })}
      </Text>
      {Object.entries(privilegeLabels).map(([key, label]) => (
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
  );
}
