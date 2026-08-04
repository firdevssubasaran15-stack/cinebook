import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { libraryApi } from '@/api/endpoints/library.api';

export function useLibraryStatus(contentId, user) {
  const [status, setStatus] = useState(null);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchLibraryData = useCallback(async (isMounted = { current: true }) => {
    try {
      const countsRes = await libraryApi.getCounts(contentId);
      if (isMounted.current) {
        setCounts(countsRes.data.data || {});
      }

      if (user) {
        const statusRes = await libraryApi.getStatus(contentId);
        if (isMounted.current) {
          setStatus(statusRes.data.data.status);
        }
      }
    } catch (err) {
      console.log('Library fetch error:', err.message);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [contentId, user]);

  useEffect(() => {
    const isMounted = { current: true };
    fetchLibraryData(isMounted);
    return () => {
      isMounted.current = false;
    };
  }, [fetchLibraryData]);

  const handleSelectStatus = async (optId) => {
    if (!user) {
      Alert.alert('Uyarı', 'Kütüphaneye eklemek için giriş yapmalısınız.');
      return;
    }

    const prevStatus = status;
    const isRemoving = status === optId;
    const newStatus = isRemoving ? null : optId;

    // Optimistic UI Update for Snappy Experience
    setStatus(newStatus);
    setCounts(prev => {
      const newCounts = { ...prev };
      if (prevStatus) {
        newCounts[prevStatus] = Math.max(0, (newCounts[prevStatus] || 1) - 1);
      }
      if (!isRemoving) {
        newCounts[optId] = (newCounts[optId] || 0) + 1;
      }
      return newCounts;
    });

    try {
      if (isRemoving) {
        await libraryApi.remove(contentId);
      } else {
        await libraryApi.upsert(contentId, optId);
      }
    } catch (err) {
      // Revert if API fails
      setStatus(prevStatus);
      fetchLibraryData();
      Alert.alert('Hata', 'Kütüphane durumu güncellenemedi.');
    }
  };

  return {
    state: { status, counts, loading },
    actions: { handleSelectStatus }
  };
}
