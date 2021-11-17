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
      ${process.env.DB_SCHEMA}.dm
        DROP COLUMN check_date;
    ALTER TABLE
      ${process.env.DB_SCHEMA}.dm
        ADD COLUMN
          check_date
            BIGINT
            NOT NULL
            DEFAULT 0;
  `);
};

exports.down = function (db) {
  return db.runSql(`
    ALTER TABLE
      ${process.env.DB_SCHEMA}.dm
        DROP COLUMN check_date;
    ALTER TABLE
      ${process.env.DB_SCHEMA}.dm
        ADD COLUMN
          check_date
            INT
            NOT NULL
            DEFAULT 0;
  `);
};

exports._meta = {
  version: 1,
};
