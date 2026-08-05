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

export const SHARE_STRATEGIES = [
  {
    id: 'instagram_story',
    label: 'Story\'de Paylaş',
    icon: 'InstagramLogo', 
    color: '#E1306C',
    action: async (shareData, hooks, viewShotRef) => {
      const uri = await captureImage(viewShotRef);
      if (!uri) return hooks.showToast('Görsel oluşturulamadı.');
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        return hooks.showToast('Paylaşım bu cihazda desteklenmiyor.');
      }
      
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Story\'de Paylaş'
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
      if (!uri) return hooks.showToast('Görsel oluşturulamadı.');
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, { dialogTitle: 'WhatsApp ile Paylaş' });
      } else {
        hooks.showToast('Paylaşım bu cihazda desteklenmiyor.');
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
      if (!uri) return hooks.showToast('Görsel oluşturulamadı.');
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { dialogTitle: 'Telegram ile Paylaş' });
      }
    }
  },
  {
    id: 'copy',
    label: 'Kopyala',
    icon: 'Copy',
    color: '#6B7280',
    action: async (shareData, hooks, viewShotRef) => {
      const textToCopy = `"${shareData.content}" - @${shareData.user_username || 'kullanıcı'}\nCINEBOOK'ta keşfet!`;
      await Clipboard.setStringAsync(textToCopy);
      hooks.showToast('Alıntı panoya kopyalandı.');
    }
  },
  {
    id: 'save',
    label: 'Kaydet',
    icon: 'DownloadSimple',
    color: '#374151',
    action: async (shareData, hooks, viewShotRef) => {
      const uri = await captureImage(viewShotRef);
      if (!uri) return hooks.showToast('Görsel oluşturulamadı.');

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        return hooks.showToast('Galeri erişim izni reddedildi.');
      }

      try {
        await MediaLibrary.saveToLibraryAsync(uri);
        hooks.showToast('Görsel galeriye kaydedildi!');
      } catch (e) {
        console.error('Save error:', e);
        hooks.showToast('Kaydetme sırasında hata oluştu.');
      }
    }
  }
];
