const { dbQuery, dbGet, dbRun } = require('@/database/db');

class AdminService {
  getAllUsers() {
    return dbQuery(`
      SELECT u.id, u.username, u.email, u.is_admin, u.created_at,
        p.can_comment, p.can_post_feelings, p.can_view_movies, p.can_view_series, p.can_view_books, p.can_view_admin_panel
      FROM users u
      LEFT JOIN user_privileges p ON p.user_id = u.id
      ORDER BY u.created_at DESC
    `);
  }

  searchUser(username) {
    return dbQuery(`
      SELECT u.id, u.username, u.email, u.is_admin, u.created_at,
        p.can_comment, p.can_post_feelings, p.can_view_movies, p.can_view_series, p.can_view_books, p.can_view_admin_panel
      FROM users u
      LEFT JOIN user_privileges p ON p.user_id = u.id
      WHERE u.username LIKE ?
    `, [`%${username}%`]);
  }

  updatePrivileges(userId, privileges) {
    const user = dbGet('SELECT id, is_admin FROM users WHERE id = ?', [userId]);
    if (!user) throw new Error('Kullanıcı bulunamadı.');
    if (user.is_admin) throw new Error('Admin kullanıcısının yetkileri değiştirilemez.');

    const {
      can_comment = 1,
      can_post_feelings = 1,
      can_view_movies = 1,
      can_view_series = 1,
      can_view_books = 1,
      can_view_admin_panel = 0,
    } = privileges;

    const existing = dbGet('SELECT id FROM user_privileges WHERE user_id = ?', [userId]);

    if (existing) {
      dbRun(
        `UPDATE user_privileges 
         SET can_comment = ?, can_post_feelings = ?, can_view_movies = ?, can_view_series = ?, can_view_books = ?, can_view_admin_panel = ?
         WHERE user_id = ?`,
        [can_comment ? 1 : 0, can_post_feelings ? 1 : 0, can_view_movies ? 1 : 0,
         can_view_series ? 1 : 0, can_view_books ? 1 : 0, can_view_admin_panel ? 1 : 0, userId]
      );
    } else {
      dbRun(
        `INSERT INTO user_privileges (user_id, can_comment, can_post_feelings, can_view_movies, can_view_series, can_view_books, can_view_admin_panel)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, can_comment ? 1 : 0, can_post_feelings ? 1 : 0,
         can_view_movies ? 1 : 0, can_view_series ? 1 : 0, can_view_books ? 1 : 0, can_view_admin_panel ? 1 : 0]
      );
    }

    return dbGet(`
      SELECT u.id, u.username, u.email, u.is_admin,
        p.can_comment, p.can_post_feelings, p.can_view_movies, p.can_view_series, p.can_view_books, p.can_view_admin_panel
      FROM users u
      LEFT JOIN user_privileges p ON p.user_id = u.id
      WHERE u.id = ?
    `, [userId]);
  }
}

module.exports = new AdminService();
