require('module-alias/register');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { initDb, dbGet, dbRun, dbQuery } = require('@/database/db');

async function seed() {
  await initDb();
  console.log('🌱 Seed başlatılıyor...');

  // Admin kullanıcısını kontrol et
  const existingAdmin = dbGet('SELECT id FROM users WHERE username = ?', ['admin']);

  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync('catlover', 12);
    const result = dbRun(
      'INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@cinebook.com', passwordHash, 1]
    );

    dbRun(
      `INSERT INTO user_privileges (user_id, can_comment, can_post_feelings, can_view_movies, can_view_series, can_view_books, can_view_admin_panel, can_moderate_content)
       VALUES (?, 1, 1, 1, 1, 1, 1, 1)`,
      [result.lastInsertRowid]
    );
    console.log('✅ Admin kullanıcısı oluşturuldu: admin / catlover');
  } else {
    console.log('ℹ️  Admin kullanıcısı zaten mevcut, atlanıyor.');
  }

  // Demo içerikler
  const movieRow = dbGet("SELECT COUNT(*) as count FROM content WHERE type = 'movie'");
  if (!movieRow || movieRow.count === 0) {
    const contents = [
      { type: 'movie', title: 'Inception', director_author: 'Christopher Nolan', summary: 'Rüyalar içinde rüyalar arasında gerçeği arayan bir hırsızın hikayesi.' },
      { type: 'movie', title: 'The Shawshank Redemption', director_author: 'Frank Darabont', summary: 'Haksız yere mahkum edilen bir bankacının tutunma ve özgürlük hikayesi.' },
      { type: 'series', title: 'Breaking Bad', director_author: 'Vince Gilligan', summary: 'Lise kimya öğretmeninin suç dünyasına adım atışının hikayesi.' },
      { type: 'series', title: 'Dark', director_author: 'Baran bo Odar', summary: 'Dört aile arasındaki karmaşık zaman yolculuğu hikayesi.' },
      { type: 'book', title: '1984', director_author: 'George Orwell', summary: 'Distopik bir toplumda bireyin devlete karşı direnişinin hikayesi.' },
      { type: 'book', title: 'Dune', director_author: 'Frank Herbert', summary: "Uzak bir gelecekte çöl gezegeni Arrakis'teki güç mücadelesi." },
    ];

    for (const c of contents) {
      dbRun(
        'INSERT INTO content (type, title, director_author, summary) VALUES (?, ?, ?, ?)',
        [c.type, c.title, c.director_author, c.summary]
      );
    }
    console.log('✅ Demo içerikler oluşturuldu.');
  }

  console.log('✅ Seed tamamlandı!');
  const { saveDbSync, closeDb } = require('@/database/db');
  saveDbSync();
  closeDb();
  // process.exit(0); Kaldırıldı: libuv hatasını önlemek için Node'un kendi kendine kapanmasını bekliyoruz.
}

seed().catch((err) => {
  console.error('❌ Seed hatası:', err);
  process.exit(1);
});
