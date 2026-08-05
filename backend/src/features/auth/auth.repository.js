const { dbGet, dbRun } = require('@/database/db');

class AuthRepository {
  findUserByUsernameOrEmail(username, email) {
    return dbGet('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
  }

  findUserForLogin(username) {
    return dbGet('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
  }

  insertUser(username, email, passwordHash) {
    return dbRun(
      'INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, 0)',
      [username, email, passwordHash]
    );
  }

  insertUserPrivileges(userId) {
    return dbRun(
      `INSERT INTO user_privileges (user_id, can_comment, can_post_feelings, can_view_movies, can_view_series, can_view_books, can_view_admin_panel, can_moderate_content)
       VALUES (?, 1, 1, 1, 1, 1, 0, 0)`,
      [userId]
    );
  }

  getUserAuthProfile(userId) {
    return dbGet('SELECT id, username, email, is_admin, theme_preference, profile_image, notifications_enabled, notification_interval FROM users WHERE id = ?', [userId]);
  }

  getUserPrivileges(userId) {
    return dbGet('SELECT * FROM user_privileges WHERE user_id = ?', [userId]);
  }

  updateTheme(userId, theme) {
    return dbRun('UPDATE users SET theme_preference = ? WHERE id = ?', [theme, userId]);
  }
}

module.exports = new AuthRepository();
