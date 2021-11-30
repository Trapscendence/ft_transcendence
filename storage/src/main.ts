import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './logger.middleware';
import * as session from 'express-session';
import * as pgSession from 'connect-pg-simple';
import { databasePoolFactory } from './database/pg-pool.factory';
import { env } from './utils/envs';

const sessionStore = new (pgSession(session))({
  pool: databasePoolFactory(),
  tableName: env.session.tableName,
  schemaName: env.database.schema,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  app.use(
    session({
      cookie: {
        secure: false, // TODO: true
      },
      proxy: true,
      name: env.session.cookieName,
      resave: false,
      saveUninitialized: false,
      secret: env.session.secret,
      store: sessionStore,
    }),
  );
  await app.listen(3000);
}
bootstrap();
