const { dbQuery, dbGet, dbRun } = require('@/database/db');

class UsersRepository {
  findById(userId) {
    return dbGet('SELECT id, username, profile_image, created_at FROM users WHERE id = ?', [userId]);
  }

  getFollowersCount(userId) {
    return dbGet('SELECT COUNT(*) as count FROM followers WHERE following_id = ?', [userId]).count;
  }

  getFollowingCount(userId) {
    return dbGet('SELECT COUNT(*) as count FROM followers WHERE follower_id = ?', [userId]).count;
  }

  findFollow(followerId, followingId) {
    return dbGet('SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
  }

  checkUserExists(userId) {
    return dbGet('SELECT id FROM users WHERE id = ?', [userId]);
  }

  deleteFollow(followerId, followingId) {
    return dbRun('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
  }

  insertFollow(followerId, followingId) {
    return dbRun('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [followerId, followingId]);
  }

  getUsername(userId) {
    return dbGet('SELECT username FROM users WHERE id = ?', [userId]);
  }

  getFollowers(userId) {
    const query = `
      SELECT u.id, u.username, u.profile_image
      FROM followers f
      JOIN users u ON f.follower_id = u.id
      WHERE f.following_id = ?
    `;
    return dbQuery(query, [userId]);
  }

  getFollowing(userId) {
    const query = `
      SELECT u.id, u.username, u.profile_image
      FROM followers f
      JOIN users u ON f.following_id = u.id
      WHERE f.follower_id = ?
    `;
    return dbQuery(query, [userId]);
  }

  updateProfileImage(userId, imagePath) {
    dbRun('UPDATE users SET profile_image = ? WHERE id = ?', [imagePath, userId]);
  }

  getUserProfileBasic(userId) {
    return dbGet('SELECT id, username, profile_image FROM users WHERE id = ?', [userId]);
  }

  findByUsername(username) {
    return dbGet('SELECT id FROM users WHERE username = ? COLLATE NOCASE', [username]);
  }

  updateUsername(userId, username) {
    return dbRun('UPDATE users SET username = ? WHERE id = ?', [username, userId]);
  }

  getUserAuthProfile(userId) {
    return dbGet('SELECT id, username, email, is_admin, theme_preference, profile_image, notifications_enabled, notification_interval FROM users WHERE id = ?', [userId]);
  }

  searchByUsername(searchQuery) {
    return dbQuery('SELECT id, username, profile_image, created_at FROM users WHERE username LIKE ? LIMIT 10', [searchQuery]);
  }

  updateNotificationSettings(userId, isEnabled, interval) {
    if (interval) {
      return dbRun('UPDATE users SET notifications_enabled = ?, notification_interval = ? WHERE id = ?', [isEnabled, interval, userId]);
    } else {
      return dbRun('UPDATE users SET notifications_enabled = ? WHERE id = ?', [isEnabled, userId]);
    }
  }

  getUserPrivileges(userId) {
    return dbGet('SELECT * FROM user_privileges WHERE user_id = ?', [userId]);
  }

  updateLastActive(userId) {
    return dbRun('UPDATE users SET last_active_at = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
  }
}

module.exports = new UsersRepository();
