import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';

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
  await app.listen(3000);
}

bootstrap();
