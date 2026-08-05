import { useState, useEffect } from 'react';
import { storageService } from '@/services/storage.service';
import { contentApi } from '@/api/endpoints/content.api';

export const useMood = () => {
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [moodRecommendations, setMoodRecommendations] = useState(null);
  const [moodLoading, setMoodLoading] = useState(false);
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  useEffect(() => {
    checkMoodModal();
  }, []);

  const checkMoodModal = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const hideKey = `hideMoodModal_${today}`;
      const hidden = await storageService.getItem(hideKey);
      if (hidden !== 'true') {
        setShowMoodModal(true);
      }
    } catch (err) {}
  };

  const handleCloseMoodModal = async () => {
    if (doNotShowToday) {
      const today = new Date().toISOString().split('T')[0];
      const hideKey = `hideMoodModal_${today}`;
      await storageService.setItem(hideKey, 'true');
    }
    setShowMoodModal(false);
  };

  const handleMoodSelect = async (moodId) => {
    setMoodLoading(true);
    try {
      const res = await contentApi.getRecommendations(moodId);
      setMoodRecommendations(res.data.data);
    } catch (err) {
      console.log('Mood recommendations error:', err.message);
    } finally {
      setMoodLoading(false);
    }
  };

  return {
    showMoodModal,
    moodRecommendations,
    setMoodRecommendations,
    moodLoading,
    doNotShowToday,
    setDoNotShowToday,
    handleCloseMoodModal,
    handleMoodSelect,
  };
};
