import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import ContentCard from '@/features/content/components/ContentCard';
import { API_BASE_URL } from '@/constants/api';
import { useCalendar } from '@/features/calendar/hooks/useCalendar';
import { calendarStyles as styles } from '@/features/calendar/styles/calendar.styles';

LocaleConfig.locales['tr'] = {
  monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
  monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
  dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
  dayNamesShort: ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'],
  today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

export default function CalendarScreen() {
  const { colors: COLORS } = useTheme();
  
  const {
    history,
    loading,
    selectedDate,
    showModal,
    setShowModal,
    onDayPress
  } = useCalendar();

  const renderDay = ({ date, state }) => {
    const isToday = state === 'today';
    const dayData = history[date.dateString];
    const hasData = dayData && dayData.length > 0;
    
    // Yalnızca o ayın günleri tıklanabilir/görülebilir
    if (state === 'disabled') {
      return (
        <View className={styles.dayContainerBase}>
          <Text className={styles.dayDisabledText}>{date.day}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity 
        className={`${styles.dayContainerBase} ${isToday ? styles.dayActiveContainer : ''}`}
        onPress={() => onDayPress(date)}
        activeOpacity={hasData ? 0.7 : 1}
      >
        {hasData && dayData[0].cover_image && (
          <Image 
            source={{ uri: `${API_BASE_URL}${dayData[0].cover_image}` }} 
            className={styles.dayImage}
            contentFit="cover"
          />
        )}
        <View className={styles.dayTextContainer}>
          <Text className={`${styles.dayTextBase} ${hasData ? styles.dayTextHasData : styles.dayTextNoData} ${isToday ? (hasData ? styles.dayTextTodayHasData : styles.dayTextTodayNoData) : ''}`}>
            {date.day}
          </Text>
        </View>
        
        {/* +N Rozeti */}
        {hasData && dayData.length > 1 && (
          <View className={styles.badgeContainer}>
            <Text className={styles.badgeText}>+{dayData.length - 1}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
        <Text className={styles.headerTitle}>Tüketim Geçmişi</Text>
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
          dayComponent={renderDay}
          hideExtraDays={true}
        />
      </ScrollView>

      {/* Detay Modalı */}
      {showModal && selectedDate && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View className={styles.modalOverlay}>
            <View className={styles.modalContainer}>
              <View className={styles.modalHeader}>
                <Text className={styles.modalTitle}>{selectedDate} Tüketimleri</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Icon name="X" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View className={styles.modalGrid}>
                  {history[selectedDate].map(item => (
                    <View key={item.library_id} className={styles.modalGridItem}>
                      <ContentCard item={item} onPress={() => { setShowModal(false); router.push(`/detail/${item.id}`); }} />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
