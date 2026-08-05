import { useState } from 'react';
import { Alert } from 'react-native';

/**
 * Custom hook to manage the business logic of sharing.
 * Isolates state (bottom sheet visibility) and execution logic.
 */
export function useShareManager() {
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shareData, setShareData] = useState(null);

  const openShareSheet = (data) => {
    setShareData(data);
    setIsShareModalVisible(true);
  };

  const closeShareSheet = () => {
    setIsShareModalVisible(false);
    // Optional: wait for animation to finish before clearing data
    setTimeout(() => setShareData(null), 300);
  };

  // Utility passed to strategies
  const hooks = {
    showToast: (msg) => Alert.alert('Bildirim', msg), // Using Alert as a simple Toast for now
    closeShareSheet
  };

  const handleShareAction = async (strategy, viewShotRef) => {
    try {
      if (strategy.action) {
        await strategy.action(shareData, hooks, viewShotRef);
      }
      closeShareSheet();
    } catch (error) {
      console.error('Share action failed:', error);
      Alert.alert('Hata', 'Paylaşım sırasında bir sorun oluştu.');
    }
  };

  return {
    isShareModalVisible,
    shareData,
    openShareSheet,
    closeShareSheet,
    handleShareAction
  };
}
