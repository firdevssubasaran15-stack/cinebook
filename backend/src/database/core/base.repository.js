const { getDb, saveDb } = require('../connection');

/**
 * Base Repository for common database operations using sql.js
 */
class BaseRepository {
  /**
   * Execute a query and return all matching rows
   * @param {string} sql 
   * @param {Array} params 
   * @returns {Array} rows
   */
  static dbQuery(sql, params = []) {
    const db = getDb();
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  }

  /**
   * Execute a query and return the first matching row
   * @param {string} sql 
   * @param {Array} params 
   * @returns {Object|null} row
   */
  static dbGet(sql, params = []) {
    const rows = this.dbQuery(sql, params);
    return rows[0] || null;
  }

  /**
   * Execute an INSERT, UPDATE, or DELETE and trigger a save
   * @param {string} sql 
   * @param {Array} params 
   * @returns {Object} result containing lastInsertRowid
   */
  static dbRun(sql, params = []) {
    const db = getDb();
    db.run(sql, params);
    const lastId = this.dbGet('SELECT last_insert_rowid() as id');
    saveDb();
    return { lastInsertRowid: lastId ? lastId.id : null };
  }
}

module.exports = BaseRepository;
