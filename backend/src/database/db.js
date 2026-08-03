const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../cinebook.db');

let db = null;
let saveTimeout = null;
let isSaving = false;

async function initDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON;');

  createSchema();
  saveDb();

  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Veritabanı henüz başlatılmadı. initDb() çağrılmalı.');
  }
  return db;
}

function saveDb() {
  if (!db) return;
  
  if (saveTimeout) clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(async () => {
    if (isSaving) {
      saveDb(); // Try again later if currently saving
      return;
    }
    isSaving = true;
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      // Use async write to avoid blocking the event loop
      await fs.promises.writeFile(DB_PATH, buffer);
    } catch (err) {
      console.error('Veritabanı kaydetme hatası:', err);
    } finally {
      isSaving = false;
    }
  }, 2000); // 2-second debounce
}

function saveDbSync() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function clearSaveTimeout() {
  if (saveTimeout) clearTimeout(saveTimeout);
}

function closeDb() {
  clearSaveTimeout();
  if (db) {
    db.close();
  }
}

function createSchema() {
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

  try {
    // Schema güncellemesi: var olan tabloya sütun ekleme
    db.run(`ALTER TABLE users ADD COLUMN theme_preference TEXT DEFAULT 'dark';`);
  } catch (err) {
    // Eğer sütun zaten varsa hata verecektir, yoksayabiliriz.
  }

  try {
    // Schema güncellemesi: Kullanıcı profil resmi
    db.run(`ALTER TABLE users ADD COLUMN profile_image TEXT;`);
  } catch (err) {}

  try {
    // Schema güncellemesi: Yorumlara alıntı ekleme
    db.run(`ALTER TABLE comments ADD COLUMN quote TEXT;`);
  } catch (err) {
    // Sütun zaten varsa hata verir, geçebiliriz.
  }

  try {
    // Schema güncellemesi: Yoruma yorum (nested comments) için parent_id
    db.run(`ALTER TABLE comments ADD COLUMN parent_id INTEGER DEFAULT NULL;`);
  } catch (err) {}

  try {
    // Schema güncellemesi: Kullanıcılara bildirim ayarı ekleme
    db.run(`ALTER TABLE users ADD COLUMN notifications_enabled INTEGER DEFAULT 1;`);
  } catch (err) {
    // Sütun zaten varsa hata verir, geçebiliriz.
  }

  try {
    // Schema güncellemesi: Bildirim aralığı
    db.run(`ALTER TABLE users ADD COLUMN notification_interval TEXT DEFAULT 'hourly';`);
  } catch (err) {
    // Sütun zaten varsa hata verir, geçebiliriz.
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      related_entity_id INTEGER,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

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
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      director_author TEXT NOT NULL,
      summary TEXT,
      cover_image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
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
    CREATE TABLE IF NOT EXISTS comment_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comment_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(comment_id, user_id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS comment_dislikes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comment_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(comment_id, user_id)
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
    // Schema güncellemesi: library tablosuna updated_at ekleme (SQLite non-constant default kısıtlaması nedeniyle defaultsuz eklenip güncellenir)
    db.run(`ALTER TABLE library ADD COLUMN updated_at DATETIME;`);
    db.run(`UPDATE library SET updated_at = created_at WHERE updated_at IS NULL;`);
  } catch (err) {
    if (!err.message.includes('duplicate column name')) {
      console.error('ALTER TABLE error:', err.message);
    }
  }

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

  try {
    db.run(`ALTER TABLE shared_lists ADD COLUMN is_public INTEGER DEFAULT 1;`);
  } catch (err) {}

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

/**
 * sql.js için yardımcı fonksiyonlar (better-sqlite3 API'sine benzer)
 */
function dbQuery(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function dbGet(sql, params = []) {
  const rows = dbQuery(sql, params);
  return rows[0] || null;
}

function dbRun(sql, params = []) {
  db.run(sql, params);
  const lastId = dbGet('SELECT last_insert_rowid() as id');
  saveDb();
  return { lastInsertRowid: lastId ? lastId.id : null };
}

module.exports = { initDb, getDb, dbQuery, dbGet, dbRun, saveDb, saveDbSync, clearSaveTimeout, closeDb };
