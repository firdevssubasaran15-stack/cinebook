const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const { createSchema } = require('./schema');

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

  createSchema(db);
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

module.exports = {
  initDb,
  getDb,
  saveDb,
  saveDbSync,
  clearSaveTimeout,
  closeDb
};
