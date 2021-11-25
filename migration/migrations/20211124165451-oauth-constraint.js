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
      ${process.env.DB_SCHEMA}.user
    ADD CONSTRAINT
      unique_user_oauth
    UNIQUE (
      oauth_type,
      oauth_id
    );
  `);
};

exports.down = function (db) {
  return db.runSql(`
    ALTER TABLE
      ${process.env.DB_SCHEMA}.user
    DROP CONSTRAINT
      unique_user_oauth;
  `);
};

exports._meta = {
  version: 1,
};
