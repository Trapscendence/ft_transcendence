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
DROP SCHEMA IF EXISTS ${process.env.DB_NAME} CASCADE;
CREATE SCHEMA ${process.env.DB_NAME};

CREATE TYPE auth AS ENUM (
  'FORTYTWO',
  'GOOGLE'
);

CREATE TYPE use AS ENUM (
  'NOTICE',
  'PATCH'
);

CREATE TYPE role AS ENUM (
  'USER',
  'ADMIN',
  'OWNER'
);

CREATE TABLE ${process.env.DB_NAME}.channel (
  id SERIAL,
  title VARCHAR ( 128 ) NOT NULL,
  password VARCHAR ( 64 ),

  PRIMARY KEY ( id )
);

CREATE TABLE ${process.env.DB_NAME}.user (
  id SERIAL,
  channel_id INT,
  oauth_id VARCHAR ( 80 ) NOT NULL,
  oauth_type AUTH NOT NULL,
  nickname VARCHAR ( 20 ) UNIQUE NOT NULL,
  tfa_secret CHAR ( 16 ),
  status_message VARCHAR ( 128 ),
  rank_score INT NOT NULL DEFAULT 100,
  site_role ROLE NOT NULL DEFAULT 'USER',
  avatar VARCHAR ( 128 ),

  PRIMARY KEY ( id ),
  FOREIGN KEY ( channel_id ) REFERENCES ${process.env.DB_NAME}.channel ( id )
);

CREATE TABLE ${process.env.DB_NAME}.channel_user (
  user_id INT NOT NULL,
  channel_id INT NOT NULL,
  channel_role ROLE NOT NULL,

  PRIMARY KEY ( user_id ),
  FOREIGN KEY ( user_id ) REFERENCES ${process.env.DB_NAME}.user ( id ),
  FOREIGN KEY ( channel_id ) REFERENCES ${process.env.DB_NAME}.channel ( id )
);

CREATE TABLE ${process.env.DB_NAME}.article (
  id SERIAL,
  user_id INT UNIQUE NOT NULL,
  title VARCHAR ( 256 ) NOT NULL,
  contents VARCHAR ( 16384 ),
  time_stamp INT NOT NULL,
  use_for USE DEFAULT 'NOTICE',

  PRIMARY KEY ( id ),
  FOREIGN KEY ( user_id ) REFERENCES ${process.env.DB_NAME}.user ( id )
);

CREATE TABLE ${process.env.DB_NAME}.dm (
  id SERIAL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  check_date INT NOT NULL,

  PRIMARY KEY ( id ),
  FOREIGN KEY ( sender_id ) REFERENCES ${process.env.DB_NAME}.user ( id ),
  FOREIGN KEY ( receiver_id ) REFERENCES ${process.env.DB_NAME}.user ( id )
);

CREATE TABLE ${process.env.DB_NAME}.message (
  id SERIAL,
  dm_id INT NOT NULL,
  dm_text VARCHAR ( 1024 ) NOT NULL,
  time_stamp INT NOT NULL,

  PRIMARY KEY ( id ),
  FOREIGN KEY ( dm_id ) REFERENCES ${process.env.DB_NAME}.dm ( id )
);

CREATE TABLE ${process.env.DB_NAME}.friend (
  id SERIAL,
  my_id INT NOT NULL,
  friend_id INT NOT NULL,
  memo VARCHAR ( 64 ),

  PRIMARY KEY ( id ),
  FOREIGN KEY ( my_id ) REFERENCES ${process.env.DB_NAME}.user ( id ),
  FOREIGN KEY ( friend_id ) REFERENCES ${process.env.DB_NAME}.user ( id )
);

CREATE TABLE ${process.env.DB_NAME}.block (
  id SERIAL,
  blocker_id INT NOT NULL,
  blocked_id INT NOT NULL,

  PRIMARY KEY ( id ),
  FOREIGN KEY ( blocker_id ) REFERENCES ${process.env.DB_NAME}.user ( id ),
  FOREIGN KEY ( blocked_id ) REFERENCES ${process.env.DB_NAME}.user ( id )
);

CREATE TABLE ${process.env.DB_NAME}.match (
  id SERIAL,
  winner INT NOT NULL,
  loser INT NOT NULL,
  win_points INT,
  lose_points INT,
  date INT NOT NULL,
  ladder BOOLEAN NOT NULL DEFAULT false,

  PRIMARY KEY ( id ),
  FOREIGN KEY ( winner ) REFERENCES ${process.env.DB_NAME}.user ( id ),
  FOREIGN KEY ( loser ) REFERENCES ${process.env.DB_NAME}.user ( id )
);


CREATE TABLE ${process.env.DB_NAME}.achievement (
  id SERIAL,
  name VARCHAR ( 128 ) NOT NULL,
  icon VARCHAR ( 128 ),

  PRIMARY KEY ( id )
);

CREATE TABLE ${process.env.DB_NAME}.achieved (
  id SERIAL,
  user_id SERIAL NOT NULL,
  achievement_id SERIAL NOT NULL,
  date INT NOT NULL,

  PRIMARY KEY ( id ),
  FOREIGN KEY ( user_id ) REFERENCES ${process.env.DB_NAME}.user ( id ),
  FOREIGN KEY ( achievement_id ) REFERENCES ${process.env.DB_NAME}.achievement ( id )
);
  `);
};

exports.down = function(db) {
  return runSql(`
DROP SCHEMA IF EXISTS ${process.env.DB_NAME} CASCADE;
  `);
};

exports._meta = {
  "version": 1
};