const { dbGet, dbRun } = require('@/database/db');

class SavedSharedListsRepository {
  findSavedList(listId, userId) {
    return dbGet('SELECT id FROM saved_shared_lists WHERE list_id = ? AND user_id = ?', [listId, userId]);
  }

  insertSavedList(listId, userId) {
    return dbRun('INSERT INTO saved_shared_lists (user_id, list_id) VALUES (?, ?)', [userId, listId]);
  }

  deleteSavedList(listId, userId) {
    return dbRun('DELETE FROM saved_shared_lists WHERE user_id = ? AND list_id = ?', [userId, listId]);
  }
}

module.exports = new SavedSharedListsRepository();
