const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'cinebook.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Veritabanına bağlanılamadı:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  // Check if column exists
  db.all("PRAGMA table_info(user_privileges)", (err, rows) => {
    if (err) throw err;
    const hasColumn = rows.some(r => r.name === 'can_moderate_content');
    
    if (!hasColumn) {
      db.run("ALTER TABLE user_privileges ADD COLUMN can_moderate_content INTEGER DEFAULT 0", (err) => {
        if (err) {
          console.error("Kolon eklenirken hata oluştu:", err.message);
        } else {
          console.log("can_moderate_content kolonu başarıyla eklendi.");
          // Update admin to have this privilege
          db.run("UPDATE user_privileges SET can_moderate_content = 1 WHERE user_id = (SELECT id FROM users WHERE is_admin = 1)", (err) => {
             if(err) console.error("Admin yetkisi güncellenemedi", err.message);
             else console.log("Admin kullanıcısına moderatörlük yetkisi verildi.");
             db.close();
          });
        }
      });
    } else {
      console.log("Kolon zaten mevcut.");
      db.close();
    }
  });
});
