"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.runSql(`
ALTER TABLE ${process.env.DB_SCHEMA}.block
  ADD CONSTRAINT block_pk
    UNIQUE (blocker_id, blocked_id);
ALTER TABLE ${process.env.DB_SCHEMA}.block
  DROP COLUMN id;
  `);
};

exports.down = function (db) {
  return db.runSql(`
ALTER TABLE ${process.env.DB_SCHEMA}.block
  ADD COLUMN id;
ALTER TABLE ${process.env.DB_SCHEMA}.block
  DROP COLUMN block_pk;
  `);
};

exports._meta = {
  version: 1,
};
