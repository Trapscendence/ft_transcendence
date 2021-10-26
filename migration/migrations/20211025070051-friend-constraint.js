'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.runSql(`
ALTER TABLE ${process.env.DB_NAME}.friend
ADD CONSTRAINT friend_pk
UNIQUE (my_id, friend_id);
ALTER TABLE ${process.env.DB_NAME}.friend
DROP COLUMN id;
  `);
};

exports.down = function(db) {
  return db.runSql(`
ALTER TABLE ${process.env.DB_NAME}.friend
DROP CONSTRAINT friend_pk;
ALTER TABLE ${process.env.DB_NAME}.friend
ADD COLUMN id;
  `);
};

exports._meta = {
  "version": 1
};
