import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';

/**
 * Capture helper function
 */
const captureImage = async (viewShotRef) => {
  if (!viewShotRef || !viewShotRef.current) return null;
  try {
    return await viewShotRef.current.capture();
  } catch (error) {
    console.error('Capture error:', error);
    return null;
  }
};

export const getShareStrategies = (t) => [
  {
    id: 'instagram_story',
    label: t('shareStrategies.story'),
    icon: 'InstagramLogo', 
    color: '#E1306C',
    action: async (shareData, hooks, viewShotRef) => {
      const uri = await captureImage(viewShotRef);
      if (!uri) return hooks.showToast(t('shareStrategies.imageError'));
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        return hooks.showToast(t('shareStrategies.notSupported'));
      }
      
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: t('shareStrategies.story')
      });
    }
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'WhatsappLogo',
    color: '#25D366',
    action: async (shareData, hooks, viewShotRef) => {
      const uri = await captureImage(viewShotRef);
      if (!uri) return hooks.showToast(t('shareStrategies.imageError'));
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, { dialogTitle: t('shareStrategies.whatsappTitle') });
      } else {
        hooks.showToast(t('shareStrategies.notSupported'));
      }
    }
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: 'TelegramLogo',
    color: '#0088cc',
    action: async (shareData, hooks, viewShotRef) => {
      const uri = await captureImage(viewShotRef);
      if (!uri) return hooks.showToast(t('shareStrategies.imageError'));
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { dialogTitle: t('shareStrategies.telegramTitle') });
      }
    }
  },
  {
    id: 'copy',
    label: t('shareStrategies.copy'),
    icon: 'Copy',
    color: '#6B7280',
    action: async (shareData, hooks, viewShotRef) => {
      const textToCopy = t('shareStrategies.copyText', { content: shareData.content, username: shareData.user_username || 'kullanıcı' });
      await Clipboard.setStringAsync(textToCopy);
      hooks.showToast(t('shareStrategies.copySuccess'));
    }
  },
  {
    id: 'save',
    label: t('shareStrategies.save'),
    icon: 'DownloadSimple',
    color: '#374151',
    action: async (shareData, hooks, viewShotRef) => {
      const uri = await captureImage(viewShotRef);
      if (!uri) return hooks.showToast(t('shareStrategies.imageError'));

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        return hooks.showToast(t('shareStrategies.galleryPermissionDenied'));
      }

      try {
        await MediaLibrary.saveToLibraryAsync(uri);
        hooks.showToast(t('shareStrategies.saveSuccess'));
      } catch (e) {
        console.error('Save error:', e);
        hooks.showToast(t('shareStrategies.saveError'));
      }
    }
  }
];
