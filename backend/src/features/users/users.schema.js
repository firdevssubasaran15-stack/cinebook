function createUsersSchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ALTERS
  try { db.run(`ALTER TABLE users ADD COLUMN theme_preference TEXT DEFAULT 'dark';`); } catch (err) {}
  try { db.run(`ALTER TABLE users ADD COLUMN profile_image TEXT;`); } catch (err) {}
  try { db.run(`ALTER TABLE users ADD COLUMN notifications_enabled INTEGER DEFAULT 1;`); } catch (err) {}
  try { db.run(`ALTER TABLE users ADD COLUMN notification_interval TEXT DEFAULT 'hourly';`); } catch (err) {}

  db.run(`
    CREATE TABLE IF NOT EXISTS user_privileges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      can_comment INTEGER DEFAULT 1,
      can_post_feelings INTEGER DEFAULT 1,
      can_view_movies INTEGER DEFAULT 1,
      can_view_series INTEGER DEFAULT 1,
      can_view_books INTEGER DEFAULT 1,
      can_view_admin_panel INTEGER DEFAULT 0,
      can_moderate_content INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS followers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      follower_id INTEGER NOT NULL,
      following_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(follower_id, following_id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      reset_code TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

module.exports = { createUsersSchema };
