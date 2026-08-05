const { createUsersSchema } = require('../features/users/users.schema');
const { createContentSchema } = require('../features/content/content.schema');
const { createCommentsSchema } = require('../features/comments/comments.schema');
const { createFeelingsSchema } = require('../features/feelings/feelings.schema');
const { createLibrarySchema } = require('../features/library/library.schema');
const { createSharedListsSchema } = require('../features/shared-lists/shared-lists.schema');
const { createNotificationsSchema } = require('../features/notifications/notifications.schema');

function createSchema(db) {
  // Execute feature-based schemas
  createUsersSchema(db);
  createContentSchema(db);
  createCommentsSchema(db);
  createFeelingsSchema(db);
  createLibrarySchema(db);
  createSharedListsSchema(db);
  createNotificationsSchema(db);
}

module.exports = { createSchema };
