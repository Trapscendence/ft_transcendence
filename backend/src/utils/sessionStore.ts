import { databasePoolFactory } from './factories/pool.factory';
import * as session from 'express-session';
import * as pgSession from 'connect-pg-simple';
import { env } from './envs';

export const sessionStore = new (pgSession(session))({
  pool: databasePoolFactory(),
  tableName: env.session.tableName,
  schemaName: env.database.schema,
});
