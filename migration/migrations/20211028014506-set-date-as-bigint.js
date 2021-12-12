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
  ${process.env.DB_SCHEMA}.match
    DROP COLUMN
      date;
ALTER TABLE
  ${process.env.DB_SCHEMA}.match
    ADD COLUMN
      time_stamp BIGINT NOT NULL;
ALTER TABLE
  ${process.env.DB_SCHEMA}.achieved
    DROP COLUMN date;
ALTER TABLE
  ${process.env.DB_SCHEMA}.achieved
    ADD COLUMN
      time_stamp BIGINT NOT NULL;
ALTER TABLE
  ${process.env.DB_SCHEMA}.message
    DROP COLUMN time_stamp;
ALTER TABLE
  ${process.env.DB_SCHEMA}.message
    ADD COLUMN
      time_stamp BIGINT NOT NULL;
  `);
};

exports.down = function (db) {
  return db.runSql(`
ALTER TABLE
  ${process.env.DB_SCHEMA}.match
    DROP COLUMN
      time_stamp;
ALTER TABLE
  ${process.env.DB_SCHEMA}.match
    ADD COLUMN
      date INT NOT NULL;
ALTER TABLE
  ${process.env.DB_SCHEMA}.achieved
    DROP COLUMN time_stamp;
ALTER TABLE
  ${process.env.DB_SCHEMA}.achieved
    ADD COLUMN
      date BIGINT NOT NULL;
ALTER TABLE
  ${process.env.DB_SCHEMA}.message
    DROP COLUMN time_stamp;
ALTER TABLE
  ${process.env.DB_SCHEMA}.message
    ADD COLUMN
      time_stamp INT NOT NULL;
  `);
};

exports._meta = {
  version: 1,
};
