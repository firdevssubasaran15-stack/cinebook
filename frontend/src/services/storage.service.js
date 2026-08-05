import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_TIMEOUT = 3000;

export const storageService = {
  /**
   * Safe getter for AsyncStorage that implements timeout protection.
   * Prevents indefinite hanging on iOS when SQLite is locked.
   */
  async getItem(key, timeoutMs = DEFAULT_TIMEOUT) {
    try {
      const fetchPromise = AsyncStorage.getItem(key);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Storage read timeout for key: ${key}`)), timeoutMs)
      );

      const result = await Promise.race([fetchPromise, timeoutPromise]);
      return result;
    } catch (error) {
      console.warn(`[StorageService] Failed to read ${key}:`, error.message);
      return null;
    }
  },

  /**
   * Safe getter for JSON parsed data.
   * Auto-heals by deleting the corrupted key if JSON.parse fails.
   */
  async getJSON(key, timeoutMs = DEFAULT_TIMEOUT) {
    const data = await this.getItem(key, timeoutMs);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn(`[StorageService] Data corruption detected for key ${key}. Auto-healing (deleting)...`);
      await this.removeItem(key);
      return null;
    }
  },

  /**
   * Standard setter for AsyncStorage
   */
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`[StorageService] Failed to write ${key}:`, error);
      return false;
    }
  },

  /**
   * Standard setter for JSON data
   */
  async setJSON(key, value) {
    try {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error(`[StorageService] Failed to JSON serialize/write ${key}:`, error);
      return false;
    }
  },

  /**
   * Remove item
   */
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[StorageService] Failed to remove ${key}:`, error);
      return false;
    }
  },

  /**
   * Clear all (use with extreme caution)
   */
  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error(`[StorageService] Failed to clear storage:`, error);
      return false;
    }
  }
};
