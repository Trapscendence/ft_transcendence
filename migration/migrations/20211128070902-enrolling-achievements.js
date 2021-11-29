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
    INSERT INTO
      ${process.env.DB_SCHEMA}.achievement
      ( name )
    VALUES
      ( 'Welcome!' ),
      ( 'Good Game' ),
      ( 'user_custum' ),
      ( 'user_custum' ),
      ( 'user_custum' ),
      ( 'user_custum' ),
      ( 'user_custum' ),
      ( 'user_custum' ),
      ( 'user_custum' ),
      ( 'user_custum' );
  `);
};

exports.down = function (db) {
  return db.runSql(`
    DELETE FROM
      ${process.env.DB_SCHEMA}.achievement
    WHERE
      id >= 1 AND id <=10;
  `);
};

exports._meta = {
  version: 1,
};
