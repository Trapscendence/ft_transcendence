import { env } from 'src/utils/envs';
import { Pool } from 'pg';

export function databasePoolFactory() {
  const { user, host, database, password, port } = env.database;
  return new Pool({ user, host, database, password, port });
}
