function createFeelingsSchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS feelings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (content_id) REFERENCES content(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS feeling_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      feeling_id INTEGER NOT NULL,
      tag TEXT NOT NULL,
      FOREIGN KEY (feeling_id) REFERENCES feelings(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS feeling_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      feeling_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (feeling_id) REFERENCES feelings(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(feeling_id, user_id)
    );
  `);
}

module.exports = { createFeelingsSchema };
