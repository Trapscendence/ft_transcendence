import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // httpsOptions: {
    //   key: readFileSync(`/certs/live/${process.env.BACKEND_HOST}/privkey.pem`),
    //   cert: readFileSync(
    //     `/certs/live/${process.env.BACKEND_HOST}/fullchain.pem`,
    //   ),
    // },
    cors: {
      origin: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    },
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        path: '/',
        secure: false,
      },
      name: 'TRAP_SESSIONID',
    }),
  );
  await app.listen(3000);
}

bootstrap();
