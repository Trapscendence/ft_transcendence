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
<<<<<<< HEAD
DROP SCHEMA IF EXISTS ${process.env.DB_NAME} CASCADE;
CREATE SCHEMA ${process.env.DB_NAME};
=======
CREATE SCHEMA trap;
>>>>>>> d1b9bec (feat: db-migration 시스템 적용)

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

<<<<<<< HEAD
CREATE TABLE ${process.env.DB_NAME}.channel (
=======
CREATE TABLE trap.channel (
>>>>>>> d1b9bec (feat: db-migration 시스템 적용)
  id SERIAL,
  title VARCHAR ( 128 ) NOT NULL,
  password VARCHAR ( 64 ),

  PRIMARY KEY ( id )
);

<<<<<<< HEAD
CREATE TABLE ${process.env.DB_NAME}.user (
  id SERIAL,
  channel_id INT,
=======
CREATE TABLE trap.user (
  id SERIAL,
  channel_id INT NOT NULL,
>>>>>>> d1b9bec (feat: db-migration 시스템 적용)
  oauth_id VARCHAR ( 80 ) NOT NULL,
  oauth_type AUTH NOT NULL,
  nickname VARCHAR ( 20 ) UNIQUE NOT NULL,
  tfa_secret CHAR ( 16 ),
  status_message VARCHAR ( 128 ),
  rank_score INT NOT NULL DEFAULT 100,
  site_role ROLE NOT NULL DEFAULT 'USER',
  avatar VARCHAR ( 128 ),

  PRIMARY KEY ( id ),
<<<<<<< HEAD
  FOREIGN KEY ( channel_id ) REFERENCES ${process.env.DB_NAME}.channel ( id )
);

CREATE TABLE ${process.env.DB_NAME}.channel_user (
=======
  FOREIGN KEY ( channel_id ) REFERENCES trap.channel ( id )
);

CREATE TABLE trap.channel_user (
>>>>>>> d1b9bec (feat: db-migration 시스템 적용)
  user_id INT NOT NULL,
  channel_id INT NOT NULL,
  channel_role ROLE NOT NULL,

  PRIMARY KEY ( user_id ),
<<<<<<< HEAD
  FOREIGN KEY ( user_id ) REFERENCES ${process.env.DB_NAME}.user ( id ),
  FOREIGN KEY ( channel_id ) REFERENCES ${process.env.DB_NAME}.channel ( id )
);

CREATE TABLE ${process.env.DB_NAME}.article (
=======
  FOREIGN KEY ( user_id ) REFERENCES trap.user ( id ),
  FOREIGN KEY ( channel_id ) REFERENCES trap.channel ( id )
);

CREATE TABLE trap.article (
>>>>>>> d1b9bec (feat: db-migration 시스템 적용)
  id SERIAL,
  user_id INT UNIQUE NOT NULL,
  title VARCHAR ( 256 ) NOT NULL,
  contents VARCHAR ( 16384 ),
  time_stamp INT NOT NULL,
  use_for USE DEFAULT 'NOTICE',

  PRIMARY KEY ( id ),
<<<<<<< HEAD
  FOREIGN KEY ( user_id ) REFERENCES ${process.env.DB_NAME}.user ( id )
);

CREATE TABLE ${process.env.DB_NAME}.dm (
=======
  FOREIGN KEY ( user_id ) REFERENCES trap.user ( id )
);

CREATE TABLE trap.dm (
>>>>>>> d1b9bec (feat: db-migration 시스템 적용)
  id SERIAL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  check_date INT NOT NULL,

  PRIMARY KEY ( id ),
<<<<<<< HEAD
  FOREIGN KEY ( sender_id ) REFERENCES ${process.env.DB_NAME}.user ( id ),
  FOREIGN KEY ( receiver_id ) REFERENCES ${process.env.DB_NAME}.user ( id )
);

CREATE TABLE ${process.env.DB_NAME}.message (
=======
  FOREIGN KEY ( sender_id ) REFERENCES trap.user ( id ),
  FOREIGN KEY ( receiver_id ) REFERENCES trap.user ( id )
);

CREATE TABLE trap.message (
>>>>>>> d1b9bec (feat: db-migration 시스템 적용)
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
