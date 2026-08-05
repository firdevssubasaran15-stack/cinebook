import { useState, useEffect, useCallback } from 'react';
import { calendarApi } from '@/api/endpoints/calendar.api';

export function useCalendar() {
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await calendarApi.getHistory();
      setHistory(res.data.data);
    } catch (err) {
      console.log('Calendar fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onDayPress = (day) => {
    if (history[day.dateString] && history[day.dateString].length > 0) {
      setSelectedDate(day.dateString);
      setShowModal(true);
    }
  };

  return {
    history,
    loading,
    selectedDate,
    showModal,
    setShowModal,
    onDayPress
  };
}
