import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { API_BASE_URL } from '@/constants/api';
import { calendarStyles as styles } from '@/features/calendar/styles/calendar.styles';

export default function CalendarDay({ date, state, history, onDayPress }) {
  const isToday = state === 'today';
  const dayData = history[date.dateString];
  const hasData = dayData && dayData.length > 0;
  
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
      
      {hasData && dayData.length > 1 && (
        <View className={styles.badgeContainer}>
          <Text className={styles.badgeText}>+{dayData.length - 1}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
