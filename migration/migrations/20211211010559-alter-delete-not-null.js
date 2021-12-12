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
    ALTER TABLE ${process.env.DB_SCHEMA}.match ALTER COLUMN winner DROP NOT NULL;
    ALTER TABLE ${process.env.DB_SCHEMA}.match ALTER COLUMN loser DROP NOT NULL;
  `);
};

exports.down = function (db) {
  return db.runSql(`
  ALTER TABLE ${process.env.DB_SCHEMA}.match ALTER COLUMN winner SET NOT NULL;
  ALTER TABLE ${process.env.DB_SCHEMA}.match ALTER COLUMN loser SET NOT NULL;
  `);
};

exports._meta = {
  version: 1,
};
