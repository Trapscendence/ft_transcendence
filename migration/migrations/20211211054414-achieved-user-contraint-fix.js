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
    DROP CONSTRAINT
      achieved_achievement_id_fkey,
    ADD CONSTRAINT
      achieved_achievement_id_fkey
        FOREIGN KEY
          ( achievement_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.achievement( id )
        ON DELETE SET NULL;
  `);
};

exports.down = function (db) {
  return db.runSql(`
    ALTER TABLE
      ${process.env.DB_SCHEMA}.achieved
    DROP CONSTRAINT
      achieved_achievement_id_fkey,
    ADD CONSTRAINT
      achieved_achievement_id_fkey
        FOREIGN KEY
          ( achievement_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE SET NULL;
  `);
};

exports._meta = {
  version: 1,
};
