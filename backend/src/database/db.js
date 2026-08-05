const connection = require('./connection');
const BaseRepository = require('./core/base.repository');

// Facade for backward compatibility
module.exports = {
  initDb: connection.initDb,
  getDb: connection.getDb,
  saveDb: connection.saveDb,
  saveDbSync: connection.saveDbSync,
  clearSaveTimeout: connection.clearSaveTimeout,
  closeDb: connection.closeDb,
  
  // Expose repository methods statically for backward compatibility
  dbQuery: BaseRepository.dbQuery.bind(BaseRepository),
  dbGet: BaseRepository.dbGet.bind(BaseRepository),
  dbRun: BaseRepository.dbRun.bind(BaseRepository)
};
