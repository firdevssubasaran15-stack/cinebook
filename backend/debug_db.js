const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'cinebook.db');
const db = new Database(dbPath, { verbose: console.log });

console.log("Feelings:");
console.log(db.prepare('SELECT * FROM feelings').all());

console.log("Feeling tags:");
console.log(db.prepare('SELECT * FROM feeling_tags').all());

console.log("Content:");
console.log(db.prepare('SELECT id, title FROM content').all());
