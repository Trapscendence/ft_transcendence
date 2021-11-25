import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './public',
        filename: (req, file, callback) =>
          callback(null, `${randomUUID()}${extname(file.originalname)}`),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/storage',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
