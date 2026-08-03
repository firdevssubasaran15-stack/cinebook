const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'cinebook.db'));

const mapping = {
  'özlem': 'dusunceli',
  'huzur': 'huzurlu',
  'heyecan': 'heyecanli',
  'yalnızlık': 'yalniz_degil',
  'nostalji': 'dusunceli',
  'umut': 'motive'
};

for (const [oldTag, newTag] of Object.entries(mapping)) {
  db.prepare('UPDATE feeling_tags SET tag = ? WHERE tag = ?').run(newTag, oldTag);
}

console.log('Tags updated successfully.');
db.close();
