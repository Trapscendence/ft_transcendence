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
    CREATE TABLE "${process.env.DB_SCHEMA}"."storage_url" (
      "filename" VARCHAR NOT NULL,
      "url" VARCHAR NOT NULL,

      PRIMARY KEY ( "filename" )
    );

    GRANT SELECT, INSERT, UPDATE, DELETE
      ON "${process.env.DB_SCHEMA}"."storage_url"
      TO ${process.env.BACKEND_DB_USER};
  `);
};

exports.down = function (db) {
  return db.runSql(`
    REVOKE SELECT, INSERT, UPDATE, DELETE
      ON "${process.env.DB_SCHEMA}"."storage_url"
      FROM ${process.env.BACKEND_DB_USER};

    DROP TABLE "${process.env.DB_SCHEMA}"."storage_url";
  `);
};

exports._meta = {
  version: 1,
};
