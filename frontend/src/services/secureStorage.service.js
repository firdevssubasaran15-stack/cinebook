import * as SecureStore from 'expo-secure-store';

const SECURE_CREDENTIALS_KEY = 'cinebook_secure_credentials';

export const secureStorage = {
  async saveCredentials(username, password) {
    try {
      const data = JSON.stringify({ username, password });
      await SecureStore.setItemAsync(SECURE_CREDENTIALS_KEY, data);
    } catch (error) {
      console.error('Beni hatırla kaydetme hatası:', error);
    }
  },

  async loadCredentials() {
    try {
      const data = await SecureStore.getItemAsync(SECURE_CREDENTIALS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Beni hatırla yükleme hatası:', error);
      return null;
    }
  },

  async clearCredentials() {
    try {
      await SecureStore.deleteItemAsync(SECURE_CREDENTIALS_KEY);
    } catch (error) {
      console.error('Beni hatırla silme hatası:', error);
    }
  },
};
