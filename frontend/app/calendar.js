import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { calendarApi } from '@/api/endpoints/calendar.api';
import ContentCard from '@/features/content/components/ContentCard';
import { API_BASE_URL } from '@/constants/api';

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
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await calendarApi.getHistory();
      setHistory(res.data.data);
    } catch (err) {
      console.log('Calendar fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDayPress = (day) => {
    if (history[day.dateString] && history[day.dateString].length > 0) {
      setSelectedDate(day.dateString);
      setShowModal(true);
    }
  };

  const renderDay = ({ date, state }) => {
    const isToday = state === 'today';
    const dayData = history[date.dateString];
    const hasData = dayData && dayData.length > 0;
    
    // Yalnızca o ayın günleri tıklanabilir/görülebilir
    if (state === 'disabled') {
      return <View className="w-11 h-11 rounded-full justify-center items-center overflow-hidden relative m-0.5"><Text className="text-text-lightMuted dark:text-text-darkMuted">{date.day}</Text></View>;
    }

    return (
      <TouchableOpacity 
        className={`w-11 h-11 rounded-full justify-center items-center overflow-hidden relative m-0.5 ${isToday ? 'border border-brand-primary' : ''}`}
        onPress={() => onDayPress(date)}
        activeOpacity={hasData ? 0.7 : 1}
      >
        {hasData && dayData[0].cover_image && (
          <Image 
            source={{ uri: `${API_BASE_URL}${dayData[0].cover_image}` }} 
            className="absolute w-full h-full opacity-50 bg-black"
            contentFit="cover"
          />
        )}
        <View className="z-10">
          <Text className={`text-base shadow-sm shadow-black/75 ${hasData ? 'text-white' : 'text-text-lightPrimary dark:text-text-darkPrimary'} ${isToday ? (hasData ? 'font-bold text-white' : 'font-bold text-brand-primary') : ''}`}>
            {date.day}
          </Text>
        </View>
        
        {/* +N Rozeti */}
        {hasData && dayData.length > 1 && (
          <View className="absolute top-0.5 right-0.5 bg-status-error rounded-lg px-1 py-0.5 z-20">
            <Text className="text-white text-[8px] font-bold">+{dayData.length - 1}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <View className="flex-1 justify-center items-center bg-light-bg dark:bg-dark-bg"><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <View className="flex-1 bg-light-bg dark:bg-dark-bg">
      <View className="flex-row items-center px-2 pt-12 pb-4 border-b bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Icon name="CaretLeft" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text className="text-lg font-bold flex-1 text-center text-text-lightPrimary dark:text-text-darkPrimary">Tüketim Geçmişi</Text>
        <View className="w-10" />
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
          <View className="flex-1 justify-end bg-black/50">
            <View className="h-[70%] rounded-t-3xl overflow-hidden bg-light-bg dark:bg-dark-bg">
              <View className="flex-row justify-between items-center p-5 border-b border-light-border dark:border-dark-border">
                <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary">{selectedDate} Tüketimleri</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Icon name="X" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View className="flex-row flex-wrap justify-between">
                  {history[selectedDate].map(item => (
                    <View key={item.library_id} className="w-[48%] mb-4">
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
