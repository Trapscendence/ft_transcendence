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
    ALTER TYPE auth ADD VALUE 'DUMMY' AFTER 'GOOGLE';
  `);
};

exports.down = function (db) {
  // https://stackoverflow.com/questions/25811017/how-to-delete-an-enum-type-value-in-postgres
  return db.runSql(`
    ALTER TYPE auth RENAME TO auth_old;
    CREATE TYPE auth AS ENUM('FORTYTWO', 'GOOGLE');
    ALTER TABLE ${process.env.DB_SCHEMA}.user ALTER COLUMN oauth_type TYPE auth USING oauth_type::text::auth;
    DROP TYPE auth_old;
  `);
};

exports._meta = {
  version: 1,
};
