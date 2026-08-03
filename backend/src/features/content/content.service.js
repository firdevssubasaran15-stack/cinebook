const { dbQuery, dbGet, dbRun } = require('@/database/db');

const SHORT_TITLE_WHITELIST = [
  { type: 'book', title: 'K', author: 'Franz Kafka' },
  { type: 'book', title: 'V.', author: 'Thomas Pynchon' },
  { type: 'book', title: 'O', author: 'Stephen King' },
  { type: 'movie', title: 'Z', author: 'Costa-Gavras' },
  { type: 'movie', title: '9', author: 'Shane Acker' },
  { type: 'movie', title: 'O', author: 'Tim Blake Nelson' },
  { type: 'series', title: 'V', author: 'Kenneth Johnson' },
  { type: 'series', title: 'V', author: 'Scott Peters' },
  { type: 'series', title: 'K', author: 'GoHands' },
  { type: 'series', title: 'K', author: 'Shingo Suzuki' },
  { type: 'series', title: 'ER', author: 'Michael Crichton' },
];

class ContentService {
  attachTopEmotions(contents) {
    if (!contents || (Array.isArray(contents) && contents.length === 0)) return contents;
    
    const isSingle = !Array.isArray(contents);
    const list = isSingle ? [contents] : contents;
    
    const contentIds = list.map(c => c.id || c.content_id); // Fallback for library join if needed
    if (contentIds.length === 0) return contents;
    
    const rows = dbQuery(`
      SELECT f.content_id, ft.tag, COUNT(ft.tag) as count
      FROM feeling_tags ft
      JOIN feelings f ON ft.feeling_id = f.id
      WHERE f.content_id IN (${contentIds.join(',')})
      GROUP BY f.content_id, ft.tag
    `);

    const tagStats = {};
    for (const row of rows) {
      if (!tagStats[row.content_id]) {
        tagStats[row.content_id] = { maxCount: 0, tags: [] };
      }
      const stat = tagStats[row.content_id];
      if (row.count > stat.maxCount) {
        stat.maxCount = row.count;
        stat.tags = [row.tag];
      } else if (row.count === stat.maxCount) {
        stat.tags.push(row.tag);
      }
    }

    list.forEach(c => {
      const cid = c.id || c.content_id;
      c.top_emotions = tagStats[cid] ? tagStats[cid].tags : [];
    });
    console.log('--- attachTopEmotions result ---', tagStats);
    
    return isSingle ? list[0] : list;
  }

  getRecommendationsByMood(mood) {
    const types = ['movie', 'series', 'book'];
    const result = {};

    for (const type of types) {
      // Fetch latest 50 items to have a good chance of finding the mood
      const items = dbQuery(`
        SELECT c.*,
          (SELECT text FROM comments WHERE content_id = c.id ORDER BY created_at DESC LIMIT 1) as latest_comment,
          (SELECT COUNT(*) FROM comments WHERE content_id = c.id) as comment_count
        FROM content c
        WHERE c.type = ?
        ORDER BY c.created_at DESC
        LIMIT 50
      `, [type]);

      const itemsWithEmotions = this.attachTopEmotions(items) || [];
      const match = itemsWithEmotions.find(c => c.top_emotions && c.top_emotions.includes(mood));
      result[type] = match || null;
    }

    return result;
  }

  getUndiscoveredByMood(userId, mood, type = null) {
    let typeFilter = '';
    const params = [mood, userId];
    if (type) {
      typeFilter = 'AND c.type = ?';
      params.push(type);
    }

    const items = dbQuery(`
      SELECT DISTINCT c.*,
        (SELECT COUNT(*) FROM comments WHERE content_id = c.id) as comment_count
      FROM content c
      JOIN feelings f ON c.id = f.content_id
      JOIN feeling_tags ft ON f.id = ft.feeling_id
      WHERE ft.tag = ?
      AND c.id NOT IN (
        SELECT content_id FROM library 
        WHERE user_id = ? AND status IN ('read', 'watched', 'watching', 'reading')
      )
      ${typeFilter}
      ORDER BY (SELECT COUNT(*) FROM feelings WHERE content_id = c.id) DESC
      LIMIT 20
    `, params);
    
    // We must ensure the mood is actually one of the top emotions, not just attached once by anyone
    const itemsWithEmotions = this.attachTopEmotions(items) || [];
    const validItems = itemsWithEmotions.filter(c => c.top_emotions && c.top_emotions.includes(mood));
    
    return validItems;
  }

  getLatestByType() {
    const types = ['movie', 'series', 'book'];
    const result = {};

    for (const type of types) {
      result[type] = this.attachTopEmotions(dbQuery(`
        SELECT c.*,
          (SELECT text FROM comments WHERE content_id = c.id ORDER BY created_at DESC LIMIT 1) as latest_comment,
          (SELECT COUNT(*) FROM comments WHERE content_id = c.id) as comment_count
        FROM content c
        WHERE c.type = ?
        ORDER BY (SELECT MAX(created_at) FROM comments WHERE content_id = c.id) DESC
        LIMIT 5
      `, [type]));
    }

    return result;
  }

  getByType(type, search = '') {
    if (search) {
      return this.attachTopEmotions(dbQuery(
        `SELECT * FROM content WHERE type = ? AND (title LIKE ? OR director_author LIKE ?) ORDER BY created_at DESC`,
        [type, `%${search}%`, `%${search}%`]
      ));
    }
    return this.attachTopEmotions(dbQuery('SELECT * FROM content WHERE type = ? ORDER BY created_at DESC', [type]));
  }

  getById(id) {
    const item = dbGet('SELECT * FROM content WHERE id = ?', [id]);
    if (!item) throw new Error('İçerik bulunamadı.');
    return this.attachTopEmotions(item);
  }

  create({ type, title, director_author, summary, cover_image }) {
    if (!['movie', 'series', 'book'].includes(type)) {
      throw new Error("Geçersiz içerik türü. 'movie', 'series' veya 'book' olmalı.");
    }
    const t = title.trim();
    const d = director_author.trim();
    
    if (!t || !d) {
      throw new Error('Başlık ve yönetmen/yazar zorunludur.');
    }

    // 1) Tek harfli/rakamlı ve kısa isim kontrolü
    if (t.length === 1 || t === 'V.' || t.toUpperCase() === 'ER') {
      const isWhitelisted = SHORT_TITLE_WHITELIST.some(w => {
        if (w.type !== type || w.title.toLowerCase() !== t.toLowerCase()) return false;
        
        // Yazar/yönetmen eşleştirmesini daha esnek yapalım (Kelime bazlı)
        const whiteWords = w.author.toLowerCase().split(/\s+/);
        const inputWords = d.toLowerCase().split(/\s+/);
        
        // Kullanıcının girdiği kelimelerden en az biri (uzunluğu > 2) whitelist'te varsa kabul et
        return inputWords.some(word => word.length > 2 && whiteWords.includes(word)) || 
               w.author.toLowerCase().includes(d.toLowerCase());
      });

      if (!isWhitelisted) {
        throw new Error('Tek harfli/rakamlı veya kısıtlanmış kısa isimler yalnızca özel istisna listesine uyan yönetmen/yazarlarla girilebilir.');
      }
    }

    // 2) Duplicate Kontrolü
    const existing = dbGet(
      'SELECT id FROM content WHERE type = ? AND LOWER(title) = LOWER(?) AND LOWER(director_author) = LOWER(?)',
      [type, t, d]
    );

    if (existing) {
      throw new Error('Bu yönetmen/yazar\'a ait aynı isimde bir içerik zaten mevcut.');
    }

    const result = dbRun(
      'INSERT INTO content (type, title, director_author, summary, cover_image) VALUES (?, ?, ?, ?, ?)',
      [type, t, d, summary || '', cover_image || null]
    );

    return dbGet('SELECT * FROM content WHERE id = ?', [result.lastInsertRowid]);
  }

  update(id, { title, director_author, summary, cover_image }) {
    const item = dbGet('SELECT * FROM content WHERE id = ?', [id]);
    if (!item) throw new Error('İçerik bulunamadı.');

    const t = title ? title.trim() : item.title;
    const d = director_author ? director_author.trim() : item.director_author;
    const s = summary !== undefined ? summary.trim() : item.summary;
    const c = cover_image !== undefined ? cover_image : item.cover_image;

    if (!t || !d) {
      throw new Error('Başlık ve yönetmen/yazar zorunludur.');
    }

    if (t.length === 1 || t === 'V.' || t.toUpperCase() === 'ER') {
      const isWhitelisted = SHORT_TITLE_WHITELIST.some(w => {
        if (w.type !== item.type || w.title.toLowerCase() !== t.toLowerCase()) return false;
        const whiteWords = w.author.toLowerCase().split(/\s+/);
        const inputWords = d.toLowerCase().split(/\s+/);
        return inputWords.some(word => word.length > 2 && whiteWords.includes(word)) || 
               w.author.toLowerCase().includes(d.toLowerCase());
      });

      if (!isWhitelisted) {
        throw new Error('Tek harfli/rakamlı veya kısıtlanmış kısa isimler yalnızca özel istisna listesine uyan yönetmen/yazarlarla girilebilir.');
      }
    }

    if (t !== item.title || d !== item.director_author) {
      const existing = dbGet(
        'SELECT id FROM content WHERE type = ? AND LOWER(title) = LOWER(?) AND LOWER(director_author) = LOWER(?) AND id != ?',
        [item.type, t, d, id]
      );

      if (existing) {
        throw new Error('Bu yönetmen/yazar\'a ait aynı isimde bir içerik zaten mevcut.');
      }
    }

    dbRun(
      'UPDATE content SET title = ?, director_author = ?, summary = ?, cover_image = ? WHERE id = ?',
      [t, d, s, c, id]
    );

    return this.getById(id);
  }

  delete(id) {
    const item = dbGet('SELECT id FROM content WHERE id = ?', [id]);
    if (!item) throw new Error('İçerik bulunamadı.');

    // İlişkili tüm verileri temizleyelim (Foreign Key CASCADE tanımlı olmadığı için manuel siliyoruz)
    // 1. Önce hislere bağlı etiketleri silelim
    dbRun('DELETE FROM feeling_tags WHERE feeling_id IN (SELECT id FROM feelings WHERE content_id = ?)', [id]);
    
    // 2. Hisleri silelim
    dbRun('DELETE FROM feelings WHERE content_id = ?', [id]);
    
    // 3. Yorumları silelim
    dbRun('DELETE FROM comments WHERE content_id = ?', [id]);
    
    // 4. Son olarak içeriği silelim
    dbRun('DELETE FROM content WHERE id = ?', [id]);
    
    return true;
  }
}

module.exports = new ContentService();
