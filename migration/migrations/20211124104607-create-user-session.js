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
    CREATE TABLE "${process.env.DB_SCHEMA}"."user_session" (
      "sid" VARCHAR NOT NULL COLLATE "default",
      "sess" JSON NOT NULL,
      "expire" TIMESTAMP(6) NOT NULL
    )
    WITH (OIDS=FALSE);

    ALTER TABLE "${process.env.DB_SCHEMA}"."user_session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

    CREATE INDEX "IDX_session_expire" ON "${process.env.DB_SCHEMA}"."user_session" ("expire");

    GRANT SELECT, INSERT, UPDATE, DELETE
      ON "${process.env.DB_SCHEMA}"."user_session"
      TO ${process.env.BACKEND_DB_USER};
  `);
};

exports.down = function (db) {
  return db.runSql(`
    REVOKE SELECT, INSERT, UPDATE, DELETE
      ON "${process.env.DB_SCHEMA}"."user_session"
      FROM ${process.env.BACKEND_DB_USER};

    DROP TABLE "${process.env.DB_SCHEMA}"."user_session";
  `);
};

exports._meta = {
  version: 1,
};
