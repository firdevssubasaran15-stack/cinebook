function createLibrarySchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS library (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
      UNIQUE(user_id, content_id)
    );
  `);

  try {
    db.run(`ALTER TABLE library ADD COLUMN updated_at DATETIME;`);
    db.run(`UPDATE library SET updated_at = created_at WHERE updated_at IS NULL;`);
  } catch (err) {
    if (!err.message.includes('duplicate column name')) {
      console.error('ALTER TABLE library updated_at error:', err.message);
    }
  }
}

module.exports = { createLibrarySchema };
