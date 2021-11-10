'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.runSql(`
ALTER TABLE ${process.env.DB_SCHEMA}.dm
  ADD CONSTRAINT dm_pk
    UNIQUE ( sender_id, receiver_id );
ALTER TABLE ${process.env.DB_SCHEMA}.dm
  DROP COLUMN IF EXISTS id CASCADE;
  `);
};

exports.down = function(db) {
  return db.runSql(`
ALTER TABLE ${process.env.DB_SCHEMA}.dm
  ADD COLUMN id SERIAL;
ALTER TABLE ${process.env.DB_SCHEMA}.dm
  DROP CONTRAINT dm_pk;`);
};

exports._meta = {
  "version": 1
};
