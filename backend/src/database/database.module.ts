import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Pool } from 'pg';
import { ModuleRef } from '@nestjs/core';
import { env } from 'src/utils/envs';

async function databasePoolFactory() {
  const { user, host, database, password, port } = env.database;
  return new Pool({ user, host, database, password, port });
}

@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: databasePoolFactory,
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationShutdown(signal?: string): any {
    this.logger.log(`Shutting down on signal ${signal}`);
    const pool = this.moduleRef.get('DATABASE_POOL') as Pool;
    return pool.end();
  }
}
