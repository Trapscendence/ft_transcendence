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
    GRANT USAGE
      ON SCHEMA ${process.env.DB_SCHEMA}
      TO ${process.env.BACKEND_DB_USER};

    GRANT SELECT, INSERT, UPDATE, DELETE
      ON ALL TABLES IN SCHEMA ${process.env.DB_SCHEMA}
      TO ${process.env.BACKEND_DB_USER};

    GRANT USAGE, SELECT, UPDATE
      ON ALL SEQUENCES IN SCHEMA ${process.env.DB_SCHEMA}
      TO ${process.env.BACKEND_DB_USER};
  `);
};

exports.down = function (db) {
  return db.runSql(`
    REVOKE SELECT, INSERT, UPDATE, DELETE
      ON ALL TABLES IN SCHEMA ${process.env.DB_SCHEMA}
      FROM ${process.env.BACKEND_DB_USER};

    REVOKE USAGE, SELECT, UPDATE
      ON ALL SEQUENCES IN SCHEMA ${process.env.DB_SCHEMA}
      FROM ${process.env.BACKEND_DB_USER};

    REVOKE USAGE
      ON SCHEMA ${process.env.DB_SCHEMA}
      FROM ${process.env.BACKEND_DB_USER};
  `);
};

exports._meta = {
  version: 1,
};
