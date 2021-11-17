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
    ALTER TABLE
      ${process.env.DB_SCHEMA}.channel_user
    DROP CONSTRAINT
      channel_user_channel_id_fkey,
    DROP CONSTRAINT
      channel_user_user_id_fkey,
    ADD CONSTRAINT
      channel_user_channel_id_fkey
        FOREIGN KEY
          ( channel_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.channel( id )
        ON DELETE CASCADE,
    ADD CONSTRAINT
      channel_user_user_id_fkey
        FOREIGN KEY
          ( user_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE CASCADE;

    ALTER TABLE
      ${process.env.DB_SCHEMA}.article
    DROP CONSTRAINT
      article_user_id_fkey,
    ADD CONSTRAINT
      article_user_id_fkey
        FOREIGN KEY
          ( user_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE SET NULL;

    ALTER TABLE
      ${process.env.DB_SCHEMA}.dm
    DROP CONSTRAINT
      dm_sender_id_fkey,
    DROP CONSTRAINT
      dm_receiver_id_fkey,
    ADD CONSTRAINT
      dm_sender_id_fkey
        FOREIGN KEY
          ( sender_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE SET NULL,
    ADD CONSTRAINT
      dm_receiver_id_fkey
        FOREIGN KEY
          ( receiver_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE SET NULL;

    ALTER TABLE
      ${process.env.DB_SCHEMA}.friend
    DROP CONSTRAINT
      friend_my_id_fkey,
    DROP CONSTRAINT
      friend_friend_id_fkey,
    ADD CONSTRAINT
      friend_my_id_fkey
        FOREIGN KEY
          ( my_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE CASCADE,
    ADD CONSTRAINT
      friend_friend_id_fkey
        FOREIGN KEY
          ( friend_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE CASCADE;


    ALTER TABLE
      ${process.env.DB_SCHEMA}.block
    DROP CONSTRAINT
      block_blocker_id_fkey,
    DROP CONSTRAINT
      block_blocked_id_fkey,
    ADD CONSTRAINT
      block_blocker_id_fkey
        FOREIGN KEY
          ( blocker_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE CASCADE,
    ADD CONSTRAINT
      block_blocked_id_fkey
        FOREIGN KEY
          ( blocked_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE CASCADE;

    ALTER TABLE
      ${process.env.DB_SCHEMA}.match
    DROP CONSTRAINT
      match_winner_fkey,
    DROP CONSTRAINT
      match_loser_fkey,
    ADD CONSTRAINT
      match_winner_fkey
        FOREIGN KEY
          ( winner )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE SET NULL,
    ADD CONSTRAINT
      match_loser_fkey
        FOREIGN KEY
          ( loser )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE SET NULL;

    ALTER TABLE
      ${process.env.DB_SCHEMA}.achieved
    DROP CONSTRAINT
      achieved_user_id_fkey,
    DROP CONSTRAINT
      achieved_achievement_id_fkey,
    ADD CONSTRAINT
      achieved_user_id_fkey
        FOREIGN KEY
          ( user_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE CASCADE,
    ADD CONSTRAINT
      achieved_achievement_id_fkey
        FOREIGN KEY
          ( achievement_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id )
        ON DELETE SET NULL;
  `);
};

exports.down = function (db) {
  return db.runSql(`
    ALTER TABLE
      ${process.env.DB_SCHEMA}.channel_user
    DROP CONSTRAINT
      channel_user_channel_id_fkey,
    DROP CONSTRAINT
      channel_user_user_id_fkey,
    ADD CONSTRAINT
      channel_user_channel_id_fkey
        FOREIGN KEY
          ( channel_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.channel( id ),
    ADD CONSTRAINT
      channel_user_user_id_fkey
        FOREIGN KEY
          ( user_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id );

    ALTER TABLE
      ${process.env.DB_SCHEMA}.article
    DROP CONSTRAINT
      article_user_id_fkey,
    ADD CONSTRAINT
      article_user_id_fkey
        FOREIGN KEY
          ( user_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id );

    ALTER TABLE
      ${process.env.DB_SCHEMA}.dm
    DROP CONSTRAINT
      dm_sender_id_fkey,
    DROP CONSTRAINT
      dm_receiver_id_fkey,
    ADD CONSTRAINT
      dm_sender_id_fkey
        FOREIGN KEY
          ( sender_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id ),
    ADD CONSTRAINT
      dm_receiver_id_fkey
        FOREIGN KEY
          ( receiver_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id );

    ALTER TABLE
      ${process.env.DB_SCHEMA}.friend
    DROP CONSTRAINT
      friend_my_id_fkey,
    DROP CONSTRAINT
      friend_friend_id_fkey,
    ADD CONSTRAINT
      friend_my_id_fkey
        FOREIGN KEY
          ( my_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id ),
    ADD CONSTRAINT
      friend_friend_id_fkey
        FOREIGN KEY
          ( friend_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id );

    ALTER TABLE
      ${process.env.DB_SCHEMA}.block
    DROP CONSTRAINT
      block_blocker_id_fkey,
    DROP CONSTRAINT
      block_blocked_id_fkey,
    ADD CONSTRAINT
      block_blocker_id_fkey
        FOREIGN KEY
          ( blocker_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id ),
    ADD CONSTRAINT
      block_blocked_id_fkey
        FOREIGN KEY
          ( blocked_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id );

    ALTER TABLE
      ${process.env.DB_SCHEMA}.match
    DROP CONSTRAINT
      match_winner_fkey,
    DROP CONSTRAINT
      match_loser_fkey,
    ADD CONSTRAINT
      match_winner_fkey
        FOREIGN KEY
          ( winner )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id ),
    ADD CONSTRAINT
      match_loser_fkey
        FOREIGN KEY
          ( loser )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id );

    ALTER TABLE
      ${process.env.DB_SCHEMA}.achieved
    DROP CONSTRAINT
      achieved_user_id_fkey,
    DROP CONSTRAINT
      achieved_achievement_id_fkey,
    ADD CONSTRAINT
      achieved_user_id_fkey
        FOREIGN KEY
          ( user_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id ),
    ADD CONSTRAINT
      achieved_achievement_id_fkey
        FOREIGN KEY
          ( achievement_id )
        REFERENCES
          ${process.env.DB_SCHEMA}.user( id );
  `);
};

exports._meta = {
  version: 1,
};
