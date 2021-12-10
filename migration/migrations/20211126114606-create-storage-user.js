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
  // CREATE USER ${process.env.STORAGE_DB_USER} PASSWORD '${process.env.STORAGE_DB_PASSWORD}';
  return db.runSql(`
    GRANT USAGE
      ON SCHEMA ${process.env.DB_SCHEMA}
      TO ${process.env.STORAGE_DB_USER};


    GRANT SELECT, INSERT, UPDATE, DELETE
      ON ${process.env.DB_SCHEMA}.user_session, ${process.env.DB_SCHEMA}.user
      TO ${process.env.STORAGE_DB_USER};
  `);
};

exports.down = function (db) {
  return db.runSql(`
    REVOKE SELECT, INSERT, UPDATE, DELETE
      ON ${process.env.DB_SCHEMA}.user_session, ${process.env.DB_SCHEMA}.user
      FROM ${process.env.STORAGE_DB_USER};

    REVOKE USAGE
      ON SCHEMA ${process.env.DB_SCHEMA}
      FROM ${process.env.STORAGE_DB_USER};
  `);
  // DELETE USER ${process.env.STORAGE_DB_USER};
};

exports._meta = {
  version: 1,
};
