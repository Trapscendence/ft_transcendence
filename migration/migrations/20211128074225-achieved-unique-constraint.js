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
    ALTER TABLE
      ${process.env.DB_SCHEMA}.achieved
    ADD CONSTRAINT
      user_id_achievement_id_unique
      UNIQUE ( user_id, achievement_id );
  `);
};

exports.down = function (db) {
  return db.runSql(`
    ALTER TABLE
      ${process.env.DB_SCHEMA}.achieved
    DROP CONSTRAINT
      user_id_achievement_id_unique;
  `);
};

exports._meta = {
  version: 1,
};
