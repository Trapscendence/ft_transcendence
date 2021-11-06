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
    CREATE TABLE ${process.env.DB_SCHEMA}.channel_ban (
      channel_id INT NOT NULL,
      banned_user INT NOT NULL,

      FOREIGN KEY ( channel_id ) REFERENCES ${process.env.DB_SCHEMA}.channel ( id ),
      FOREIGN KEY ( banned_user ) REFERENCES ${process.env.DB_SCHEMA}.user ( id ),
      CONSTRAINT ban_constraint UNIQUE (channel_id, banned_user)
    );
  `);
};

exports.down = function (db) {
  return db.runSql(`
    DROP TABLE ${process.env.DB_SCHEMA}.channel_ban;
  `);
};

exports._meta = {
  version: 1,
};
