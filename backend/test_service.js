require('module-alias/register');
const { initDb } = require('./src/database/db');
const contentService = require('./src/features/content/content.service');

async function test() {
  await initDb();
  const latest = contentService.getLatestByType();
  console.log(JSON.stringify(latest, null, 2));
}

test();
