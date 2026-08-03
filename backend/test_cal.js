require('module-alias/register');
const db = require('./src/database/db');
const calendarService = require('./src/features/calendar/calendar.service');

async function test() {
  await db.initDb();
  try {
    const res = calendarService.getHistory(1); // Assuming user 1 exists
    console.log(res);
  } catch(e) {
    console.error('Error:', e.message);
  }
}
test();
