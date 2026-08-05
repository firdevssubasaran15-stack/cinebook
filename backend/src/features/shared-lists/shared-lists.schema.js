function createSharedListsSchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS shared_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      owner_id INTEGER NOT NULL,
      is_public INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  try { db.run(`ALTER TABLE shared_lists ADD COLUMN is_public INTEGER DEFAULT 1;`); } catch (err) {}

  db.run(`
    CREATE TABLE IF NOT EXISTS shared_list_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (list_id) REFERENCES shared_lists(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(list_id, user_id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS shared_list_contents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      content_id INTEGER NOT NULL,
      added_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (list_id) REFERENCES shared_lists(id) ON DELETE CASCADE,
      FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
      FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(list_id, content_id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS saved_shared_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      list_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (list_id) REFERENCES shared_lists(id) ON DELETE CASCADE,
      UNIQUE(user_id, list_id)
    );
  `);
}

module.exports = { createSharedListsSchema };
