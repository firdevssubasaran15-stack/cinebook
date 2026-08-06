import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { useCalendar } from '@/features/calendar/hooks/useCalendar';
import { useCalendarLocale } from '@/features/calendar/hooks/useCalendarLocale';
import { calendarStyles as styles } from '@/features/calendar/styles/calendar.styles';
import CalendarDay from '@/features/calendar/components/CalendarDay';
import CalendarDetailModal from '@/features/calendar/components/CalendarDetailModal';

export default function CalendarScreen() {
  const { t } = useTranslation();
  const { colors: COLORS } = useTheme();

  // SRP: Takvim locale yonetimi ayri hook'ta — dil degisince otomatik guncellenir
  useCalendarLocale();

  const {
    history,
    loading,
    selectedDate,
    showModal,
    setShowModal,
    onDayPress,
  } = useCalendar();

  if (loading) {
    return (
      <View className={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View className={styles.mainContainer}>
      <View className={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} className={styles.backButton}>
          <Icon name="CaretLeft" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text className={styles.headerTitle}>{t('calendar.title')}</Text>
        <View className={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Calendar
          theme={{
            calendarBackground: COLORS.background,
            textSectionTitleColor: COLORS.textSecondary,
            monthTextColor: COLORS.textPrimary,
            textMonthFontWeight: 'bold',
            textMonthFontSize: 18,
            dayTextColor: COLORS.textPrimary,
            todayTextColor: COLORS.primary,
            arrowColor: COLORS.primary,
          }}
          dayComponent={({ date, state }) => (
            <CalendarDay date={date} state={state} history={history} onDayPress={onDayPress} />
          )}
          hideExtraDays={true}
        />
      </ScrollView>

      <CalendarDetailModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        selectedDate={selectedDate}
        historyData={selectedDate ? history[selectedDate] : null}
      />
    </View>
  );
}
