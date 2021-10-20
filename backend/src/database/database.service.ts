import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  onApplicationBootstrap(): any {
    const schema = process.env.DB_SCHEMA;
    this.pool.query(`
CREATE SCHEMA IF NOT EXISTS ${schema};

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auth') THEN
    CREATE TYPE auth AS ENUM (
      'FORTYTWO',
      'GOOGLE'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'use') THEN
    CREATE TYPE use AS ENUM (
      'NOTICE',
      'PATCH'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
    CREATE TYPE role AS ENUM (
      'USER',
      'ADMIN',
      'OWNER'
    );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS ${schema}.channel (
  id SERIAL,
  title VARCHAR ( 128 ) NOT NULL,
  password VARCHAR ( 64 ),

  PRIMARY KEY ( id )
);

CREATE TABLE IF NOT EXISTS ${schema}.user (
  id SERIAL,
  channel_id INT NOT NULL,
  oauth_id VARCHAR ( 80 ) NOT NULL,
  oauth_type AUTH NOT NULL,
  nickname VARCHAR ( 20 ) UNIQUE NOT NULL,
  tfa_secret CHAR ( 16 ),
  status_message VARCHAR ( 128 ),
  rank_score INT NOT NULL DEFAULT 100,
  site_role ROLE NOT NULL DEFAULT 'USER',

  PRIMARY KEY ( id ),
  FOREIGN KEY ( channel_id ) REFERENCES ${schema}.channel ( id )
);

CREATE TABLE IF NOT EXISTS ${schema}.channel_user (
  user_id INT NOT NULL,
  channel_id INT NOT NULL,
  channel_role ROLE NOT NULL,

  PRIMARY KEY ( user_id ),
  FOREIGN KEY ( user_id ) REFERENCES ${schema}.user ( id ),
  FOREIGN KEY ( channel_id ) REFERENCES ${schema}.channel ( id )
);

CREATE TABLE IF NOT EXISTS ${schema}.article (
  id SERIAL,
  user_id INT UNIQUE NOT NULL,
  title VARCHAR ( 256 ) NOT NULL,
  contents VARCHAR ( 16384 ),
  time_stamp INT NOT NULL,
  use_for USE DEFAULT 'NOTICE',

  PRIMARY KEY ( id ),
  FOREIGN KEY ( user_id ) REFERENCES ${schema}.user ( id )
);

CREATE TABLE IF NOT EXISTS ${schema}.dm (
  id SERIAL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  check_date INT NOT NULL,

  PRIMARY KEY ( id ),
  FOREIGN KEY ( sender_id ) REFERENCES ${schema}.user ( id ),
  FOREIGN KEY ( receiver_id ) REFERENCES ${schema}.user ( id )
);

CREATE TABLE IF NOT EXISTS ${schema}.message (
  id SERIAL,
  dm_id INT NOT NULL,
  dm_text VARCHAR ( 1024 ) NOT NULL,
  time_stamp INT NOT NULL,

  PRIMARY KEY ( id ),
  FOREIGN KEY ( dm_id ) REFERENCES ${schema}.dm ( id )
);

CREATE TABLE IF NOT EXISTS ${schema}.friend (
  id SERIAL,
  my_id INT NOT NULL,
  friend_id INT NOT NULL,
  memo VARCHAR ( 64 ),

  PRIMARY KEY ( id ),
  FOREIGN KEY ( my_id ) REFERENCES ${schema}.user ( id ),
  FOREIGN KEY ( friend_id ) REFERENCES ${schema}.user ( id )
);

CREATE TABLE IF NOT EXISTS ${schema}.block (
  id SERIAL,
  blocker_id INT NOT NULL,
  blocked_id INT NOT NULL,

  PRIMARY KEY ( id ),
  FOREIGN KEY ( blocker_id ) REFERENCES ${schema}.user ( id ),
  FOREIGN KEY ( blocked_id ) REFERENCES ${schema}.user ( id )
);

CREATE TABLE IF NOT EXISTS ${schema}.match (
  id SERIAL,
  winner INT NOT NULL,
  loser INT NOT NULL,
  win_points INT,
  lose_points INT,
  date INT NOT NULL,
  ladder BOOLEAN NOT NULL DEFAULT false,

  PRIMARY KEY ( id ),
  FOREIGN KEY ( winner ) REFERENCES ${schema}.user ( id ),
  FOREIGN KEY ( loser ) REFERENCES ${schema}.user ( id )
);


CREATE TABLE IF NOT EXISTS ${schema}.achievement (
  id SERIAL,
  name VARCHAR ( 128 ) NOT NULL,
  icon VARCHAR ( 128 ),

  PRIMARY KEY ( id )
);

CREATE TABLE IF NOT EXISTS ${schema}.achieved (
  id SERIAL,
  user_id SERIAL NOT NULL,
  achievement_id SERIAL NOT NULL,
  date INT NOT NULL,

  PRIMARY KEY ( id ),
  FOREIGN KEY ( user_id ) REFERENCES ${schema}.user ( id ),
  FOREIGN KEY ( achievement_id ) REFERENCES ${schema}.achievement ( id )
);`
    );
  }

  executeQuery(queryText: string, values: any[] = []): Promise<any[]> {
    this.logger.debug(`Executing query: ${queryText} (${values})`);
    return this.pool.query(queryText, values).then((result: QueryResult) => {
      this.logger.debug(`Executed query, result size ${result.rows.length}`);
      return result.rows;
    });
  }
}
