import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import * as session from 'express-session';
import { sessionStore } from './utils/sessionStore';
import { env } from './utils/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // httpsOptions: {
    //   key: readFileSync(`/certs/live/${process.env.SERVER_HOST}/privkey.pem`),
    //   cert: readFileSync(
    //     `/certs/live/${process.env.SERVER_HOST}/fullchain.pem`,
    //   ),
    // },
  });
  app.setGlobalPrefix('api');
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
