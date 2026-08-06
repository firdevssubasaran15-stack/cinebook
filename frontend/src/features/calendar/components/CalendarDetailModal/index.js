import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import Icon from '@/features/icon/components/Icon';
import ContentCard from '@/features/content/components/ContentCard';
import { useTheme } from '@/context/ThemeContext';
import { calendarStyles as styles } from '@/features/calendar/styles/calendar.styles';

export default function CalendarDetailModal({ visible, onClose, selectedDate, historyData }) {
  const { t } = useTranslation();
  const { colors: COLORS } = useTheme();

  if (!visible || !selectedDate || !historyData) return null;

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className={styles.modalOverlay}>
        <View className={styles.modalContainer}>
          <View className={styles.modalHeader}>
            <Text className={styles.modalTitle}>
              {selectedDate} {t('calendar.consumptions')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="X" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View className={styles.modalGrid}>
              {historyData.map(item => (
                <View key={item.library_id} className={styles.modalGridItem}>
                  <ContentCard
                    item={item}
                    onPress={() => { onClose(); router.push(`/detail/${item.id}`); }}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

