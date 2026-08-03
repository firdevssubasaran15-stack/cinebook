import { useState, useEffect, useCallback } from 'react';
import { contentApi } from '@/api/endpoints/content.api';
import { usersApi } from '@/api/endpoints/users.api';

export function useEmotionDiscovery({ type }) {
  const [topEmotions, setTopEmotions] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [undiscoveredContent, setUndiscoveredContent] = useState([]);
  const [tagLoading, setTagLoading] = useState(false);

  const fetchTopEmotions = async () => {
    try {
      const res = await usersApi.getTopEmotions();
      setTopEmotions(res.data.data);
    } catch (err) {
      console.log('Top emotions error:', err.message);
    }
  };

  const fetchUndiscoveredByMood = useCallback(async (mood) => {
    if (!mood) {
      setUndiscoveredContent([]);
      return;
    }
    setTagLoading(true);
    try {
      const res = await contentApi.getUndiscoveredByMood(mood, type);
      setUndiscoveredContent(res.data.data);
    } catch (err) {
      console.log('Undiscovered fetch error:', err.message);
    } finally {
      setTagLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchTopEmotions();
  }, []);

  useEffect(() => {
    if (selectedTag) fetchUndiscoveredByMood(selectedTag);
    else setUndiscoveredContent([]);
  }, [selectedTag, fetchUndiscoveredByMood]);

  const handleSelectTag = (tagId) => {
    setSelectedTag(selectedTag === tagId ? null : tagId);
  };

  return {
    state: {
      topEmotions,
      selectedTag,
      undiscoveredContent,
      tagLoading,
    },
    actions: {
      handleSelectTag,
    }
  };
}
