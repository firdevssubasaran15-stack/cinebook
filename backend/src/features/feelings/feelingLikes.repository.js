const { dbGet, dbRun } = require('@/database/db');

class FeelingLikesRepository {
  findLike(feelingId, userId) {
    return dbGet('SELECT * FROM feeling_likes WHERE feeling_id = ? AND user_id = ?', [feelingId, userId]);
  }

  insertLike(feelingId, userId) {
    return dbRun('INSERT INTO feeling_likes (feeling_id, user_id) VALUES (?, ?)', [feelingId, userId]);
  }

  deleteLike(feelingId, userId) {
    return dbRun('DELETE FROM feeling_likes WHERE feeling_id = ? AND user_id = ?', [feelingId, userId]);
  }
}

module.exports = new FeelingLikesRepository();
